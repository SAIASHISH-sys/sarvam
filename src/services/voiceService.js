/**
 * Voice plan-editing service: session lifecycle and audio/text turns
 * against the backend's conversational editor (Saaras STT → Sarvam-105B
 * → Bulbul TTS).
 */

import { apiFetch } from './api.js'

export async function createVoiceSession(projectId) {
  return apiFetch(`/projects/${projectId}/voice/sessions`, { method: 'POST' })
}

export async function sendAudioTurn(sessionId, audioBlob) {
  const form = new FormData()
  form.append('audio', audioBlob, 'turn.webm')
  return apiFetch(`/voice/sessions/${sessionId}/turn/audio`, {
    method: 'POST',
    body: form,
  })
}

export async function sendTextTurn(sessionId, text) {
  return apiFetch(`/voice/sessions/${sessionId}/turn/text`, {
    method: 'POST',
    body: JSON.stringify({ text }),
  })
}
