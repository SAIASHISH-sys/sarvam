"""Application settings, read from environment once at startup."""

import os
from dataclasses import dataclass

DEFAULT_ORIGINS = "http://localhost:5173,http://127.0.0.1:5173"


@dataclass(frozen=True)
class Settings:
    sarvam_api_key: str
    sarvam_api_base: str
    chat_model: str
    stt_model: str
    tts_model: str
    tts_speaker: str
    speech_sample_rate: int
    cors_origins: tuple[str, ...]

    @property
    def has_api_key(self) -> bool:
        return bool(self.sarvam_api_key) and self.sarvam_api_key != "your-key-here"


def load_settings() -> Settings:
    return Settings(
        sarvam_api_key=os.environ.get("SARVAM_API_KEY", ""),
        sarvam_api_base=os.environ.get("SARVAM_API_BASE", "https://api.sarvam.ai"),
        chat_model=os.environ.get("SARVAM_CHAT_MODEL", "sarvam-105b"),
        stt_model=os.environ.get("SARVAM_STT_MODEL", "saaras:v3"),
        tts_model=os.environ.get("SARVAM_TTS_MODEL", "bulbul:v3"),
        tts_speaker=os.environ.get("SARVAM_TTS_SPEAKER", "shubh"),
        speech_sample_rate=int(os.environ.get("SPEECH_SAMPLE_RATE", "22050")),
        cors_origins=tuple(
            origin.strip()
            for origin in os.environ.get("CORS_ORIGINS", DEFAULT_ORIGINS).split(",")
            if origin.strip()
        ),
    )
