/**
 * Compliance engine: runs a project's parameters against the norms catalogue.
 * Pure — no React, no I/O — so the backend can run the exact same function.
 */

import { NORMS_CATALOG } from '../data/normsCatalog.js'

/**
 * @param {object} params project design parameters
 * @returns {Array<object>} one check per applicable catalogue rule
 */
export function evaluateCompliance(params) {
  return NORMS_CATALOG.map((rule) => rule.evaluate(params)).filter(Boolean)
}

/** Aggregate a check list into status counts. */
export function summarizeCompliance(checks) {
  const counts = { compliant: 0, attention: 0, noncompliant: 0, info: 0 }
  checks.forEach((c) => {
    counts[c.status] += 1
  })
  return counts
}
