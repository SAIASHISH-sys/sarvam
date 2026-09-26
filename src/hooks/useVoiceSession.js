import { useCallback, useRef, useState } from 'react'
import {
  createVoiceSession,
  sendAudioTurn,
  sendTextTurn,
} from '../services/voiceService.js'

/**
 * Conversational voice-edit state: one lazy session per mount, an ordered
 * list of turns, and a busy flag while the backend is listening/thinking.
 *
 * Each turn record: { role, text, changedFields?, audioUrl? }
 */
export function useVoiceSession(projectId, { onProjectChange } = {}) {
  const [turns, setTurns] = useState([])
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState(null)
  const sessionRef = useRef(null)

  const runTurn = useCallback(
    async (payload, transcriptPreview) => {
      if (sessionRef.current === null) {
        const session = await createVoiceSession(projectId)
        sessionRef.current = session.sessionId
      }

      setTurns((prev) => [...prev, { role: 'user', text: transcriptPreview }])
      const result = await payload(sessionRef.current)

      const turn = {
        role: 'assistant',
        text: result.reply,
        changedFields: result.changedFields,
        audioUrl: result.audioBase64
          ? `data:audio/wav;base64,${result.audioBase64}`
          : null,
      }
      setTurns((prev) => [...prev, turn])

      if (result.changedFields?.length > 0) onProjectChange?.(result.project)
      return turn
    },
    [projectId, onProjectChange],
  )

  const submitAudio = useCallback(
    async (audioBlob) => {
      setBusy(true)
      setError(null)
      try {
        return await runTurn((sid) => sendAudioTurn(sid, audioBlob), '…')
      } catch (turnError) {
        setError(turnError.message)
        return null
      } finally {
        setBusy(false)
      }
    },
    [runTurn],
  )

  const submitText = useCallback(
    async (text) => {
      setBusy(true)
      setError(null)
      try {
        return await runTurn((sid) => sendTextTurn(sid, text), text)
      } catch (turnError) {
        setError(turnError.message)
        return null
      } finally {
        setBusy(false)
      }
    },
    [runTurn],
  )

  return { turns, busy, error, submitAudio, submitText }
}
