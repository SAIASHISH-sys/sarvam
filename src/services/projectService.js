/**
 * Project service — the single seam between the UI and the data layer.
 *
 * Today every method runs against an in-memory seeded store. When the
 * backend lands, each body becomes a `fetch()` call with the same signature
 * and every consumer keeps working unchanged. Components must never import
 * data or engines directly.
 */

import { buildProject } from './projectFactory.js'
import { seedProjects } from '../data/sampleProjects.js'

const LATENCY_MS = 150
const delay = () => new Promise((resolve) => setTimeout(resolve, LATENCY_MS))

const store = { projects: seedProjects() }

const clone = (project) => structuredClone(project)
const find = (id) => store.projects.find((p) => p.id === id)

export async function listProjects() {
  await delay()
  return store.projects.map(clone)
}

export async function getProject(id) {
  await delay()
  const project = find(id)
  return project ? clone(project) : null
}

export async function createProject(params) {
  await delay()
  const project = buildProject(params)
  store.projects.unshift(project)
  return clone(project)
}

export async function publishProject(id) {
  await delay()
  const project = find(id)
  if (!project) return null
  project.agentPublishedAt = new Date()
  return clone(project)
}
