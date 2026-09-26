/**
 * Single HTTP seam for the whole app. Every backend call goes through
 * apiFetch; components and services never build URLs or parse errors
 * themselves.
 */

export const API_BASE = import.meta.env.VITE_API_BASE ?? 'http://localhost:8000'

export class ApiError extends Error {
  constructor(message, status) {
    super(message)
    this.status = status
  }
}

function messageFromDetail(payload, statusText) {
  if (typeof payload?.detail === 'string') return payload.detail
  if (Array.isArray(payload?.detail)) {
    return payload.detail
      .map((issue) => `${(issue.loc ?? []).slice(1).join('.')}: ${issue.msg}`)
      .join('; ')
  }
  return payload?.detail ?? statusText ?? 'Request failed'
}

export async function apiFetch(path, options = {}) {
  const headers = {}
  if (typeof options.body === 'string') headers['Content-Type'] = 'application/json'

  let response
  try {
    response = await fetch(`${API_BASE}${path}`, { ...options, headers })
  } catch (networkError) {
    throw new ApiError('Could not reach the Nirmaan API. Start the backend first — see backend/README.md.', 0)
  }

  if (!response.ok) {
    let payload = null
    try {
      payload = await response.json()
    } catch {
      // body was empty or not JSON — status text is enough
    }
    throw new ApiError(messageFromDetail(payload, response.statusText), response.status)
  }

  return response.status === 204 ? null : response.json()
}
