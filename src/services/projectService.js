/**
 * Project service — the single seam between the UI and the data layer.
 *
 * Backed by the FastAPI backend (backend/). Signatures match the original
 * in-memory version, so consumers never changed when the API landed.
 */

import { ApiError, apiFetch } from './api.js'

export async function listProjects() {
  return apiFetch('/projects')
}

export async function getProject(id) {
  try {
    return await apiFetch(`/projects/${id}`)
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) return null
    throw error
  }
}

export async function createProject(params) {
  return apiFetch('/projects', {
    method: 'POST',
    body: JSON.stringify({ params }),
  })
}

export async function publishProject(id) {
  return apiFetch(`/projects/${id}/publish`, { method: 'POST' })
}
