"""Thin async client over the Sarvam AI APIs used by the voice features:

- Speech-to-text:  POST /speech-to-text        (saaras, mode=transcribe)
- Text-to-speech:  POST /text-to-speech       (bulbul, base64 WAV out)
- Chat:            POST /v1/chat/completions   (Sarvam-105B, OpenAI-compatible)
"""

import httpx

from app.config import Settings

# bulbul's supported output languages; anything else falls back to English.
BULBUL_LANGUAGES = {
    "bn-IN", "en-IN", "gu-IN", "hi-IN", "kn-IN",
    "ml-IN", "mr-IN", "od-IN", "pa-IN", "ta-IN", "te-IN",
}


class SarvamUnavailableError(Exception):
    """Sarvam calls cannot be made (missing key) or the upstream API failed."""


class SarvamClient:
    def __init__(self, settings: Settings) -> None:
        self._settings = settings

    def _require_key(self) -> str:
        if not self._settings.has_api_key:
            raise SarvamUnavailableError(
                "SARVAM_API_KEY is not configured. Copy backend/.env.example to "
                "backend/.env, set your key from dashboard.sarvam.ai, and restart."
            )
        return self._settings.sarvam_api_key

    async def transcribe(
        self, audio: bytes, filename: str, language_code: str = "unknown"
    ) -> tuple[str, str]:
        """Return (transcript, detected_language_code)."""
        api_key = self._require_key()
        url = f"{self._settings.sarvam_api_base}/speech-to-text"
        try:
            async with httpx.AsyncClient(timeout=60) as client:
                response = await client.post(
                    url,
                    headers={"api-subscription-key": api_key},
                    files={"file": (filename or "turn.webm", audio, "audio/webm")},
                    data={
                        "model": self._settings.stt_model,
                        "mode": "transcribe",
                        "language_code": language_code,
                    },
                )
        except httpx.HTTPError as error:
            raise SarvamUnavailableError(f"Speech-to-text call failed: {error}") from error
        self._raise_for_status(response, "speech-to-text")
        payload = response.json()
        return payload.get("transcript", ""), payload.get("language_code") or "en-IN"

    async def synthesize(self, text: str, language_code: str) -> str:
        """Return spoken audio for `text` as base64-encoded WAV."""
        api_key = self._require_key()
        language = language_code if language_code in BULBUL_LANGUAGES else "en-IN"
        url = f"{self._settings.sarvam_api_base}/text-to-speech"
        body = {
            "text": text[:1500],
            "language_code": language,
            "speaker": self._settings.tts_speaker,
            "model": self._settings.tts_model,
            "speech_sample_rate": self._settings.speech_sample_rate,
        }
        try:
            async with httpx.AsyncClient(timeout=60) as client:
                response = await client.post(
                    url, headers={"api-subscription-key": api_key}, json=body
                )
        except httpx.HTTPError as error:
            raise SarvamUnavailableError(f"Text-to-speech call failed: {error}") from error
        self._raise_for_status(response, "text-to-speech")
        audios = response.json().get("audios") or []
        if not audios:
            raise SarvamUnavailableError("Text-to-speech returned no audio.")
        return audios[0]

    async def chat(self, messages: list[dict], temperature: float = 0.1) -> str:
        """Return the assistant message content."""
        api_key = self._require_key()
        url = f"{self._settings.sarvam_api_base}/v1/chat/completions"
        try:
            async with httpx.AsyncClient(timeout=90) as client:
                response = await client.post(
                    url,
                    headers={"Authorization": f"Bearer {api_key}"},
                    json={
                        "model": self._settings.chat_model,
                        "messages": messages,
                        "temperature": temperature,
                    },
                )
        except httpx.HTTPError as error:
            raise SarvamUnavailableError(f"Chat call failed: {error}") from error
        self._raise_for_status(response, "chat")
        choices = response.json().get("choices") or []
        if not choices:
            raise SarvamUnavailableError("Chat returned no choices.")
        return choices[0]["message"]["content"]

    @staticmethod
    def _raise_for_status(response: httpx.Response, api_name: str) -> None:
        if response.status_code >= 400:
            detail = response.text[:300]
            raise SarvamUnavailableError(
                f"Sarvam {api_name} API returned {response.status_code}: {detail}"
            )
