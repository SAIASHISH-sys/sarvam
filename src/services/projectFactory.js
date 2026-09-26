/**
 * Project factory: builds a complete project record from wizard parameters
 * by running the compliance engine, design engine and WBS generator.
 * Pure — the same assembly will run server-side when the API lands.
 */

import { evaluateCompliance, summarizeCompliance } from './complianceEngine.js'
import { generateDesign } from './designEngine.js'
import { WBS_TEMPLATE } from '../data/wbsTemplates.js'
import { SOIL_TYPE_LABELS } from '../data/normsCatalog.js'
import { addDays, dayDiff } from '../utils/schedule.js'
import { ordinal } from '../utils/format.js'

let autoId = 3

/** Expand the WBS template, repeating per-floor items, into flat task specs. */
function expandTemplate(floorsCount) {
  const specs = []
  WBS_TEMPLATE.forEach((item) => {
    if (!item.perFloor) {
      specs.push({ key: item.key, phase: item.phase, task: item.task, duration: item.duration })
      return
    }
    for (let floor = 1; floor <= floorsCount; floor += 1) {
      specs.push({
        key: `${item.key}-${floor}`,
        phase: item.phase,
        task: `Floor cycle — ${ordinal(floor)} floor`,
        duration: item.duration,
      })
    }
  })
  return specs
}

/** Sequential (single-critical-path) schedule: each task starts when the previous ends. */
export function buildWbs({ startDate, floorsCount }) {
  let cursor = new Date(startDate)
  cursor.setHours(0, 0, 0, 0)
  return expandTemplate(floorsCount).map((spec) => {
    const start = new Date(cursor)
    const end = addDays(start, spec.duration - 1)
    cursor = addDays(end, 1)
    return { ...spec, start, end }
  })
}

/** Overlay progress fractions (0–1) on tasks, keyed by task key. */
export function applyProgress(tasks, progressByKey) {
  return tasks.map((task) => ({ ...task, progress: progressByKey[task.key] ?? 0 }))
}

/** Duration-weighted completion fraction for a task list. */
export function overallProgress(tasks) {
  const total = tasks.reduce((sum, t) => sum + t.duration, 0)
  const done = tasks.reduce((sum, t) => sum + t.duration * t.progress, 0)
  return total > 0 ? done / total : 0
}

/** Total scheduled working days, start to finish. */
export function scheduleDurationDays(tasks) {
  if (tasks.length === 0) return 0
  const start = tasks.reduce((min, t) => (t.start < min ? t.start : min), tasks[0].start)
  const end = tasks.reduce((max, t) => (t.end > max ? t.end : max), tasks[0].end)
  return dayDiff(end, start) + 1
}

/**
 * Build a full project record.
 *
 * @param {object} params wizard parameters (plus optional id, startDate, createdAt)
 * @returns {object} project record
 */
export function buildProject(params) {
  const floorsCount = Number(params.floors.replace('G+', '')) || 1
  const wbs = buildWbs({ startDate: params.startDate ?? new Date(), floorsCount })
  const compliance = evaluateCompliance(params)
  const complianceSummary = summarizeCompliance(compliance)
  const design = generateDesign(params)
  const codes = [...new Set(compliance.map((c) => c.code))]

  return {
    id: params.id ?? `prj_${String(autoId++).padStart(3, '0')}`,
    name: params.name,
    client: params.client,
    location: `${params.city}, ${params.state}`,
    status: 'active',
    createdAt: params.createdAt ?? new Date(),
    params,
    soilLabel: SOIL_TYPE_LABELS[params.soilType] ?? params.soilType,
    codes,
    compliance,
    complianceSummary,
    design,
    wbs,
    progress: 0,
    agentPublishedAt: null,
  }
}
