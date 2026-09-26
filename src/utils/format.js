/**
 * Pure display formatting helpers. No React, no state — safe to reuse on the
 * backend or in tests.
 */

/** Indian digit grouping: 2400 -> "2,400". */
export function formatNumber(value) {
  return Number(value).toLocaleString('en-IN')
}

/** Date or ISO string -> "26 Sep 2026". */
export function formatDate(value) {
  const date = value instanceof Date ? value : new Date(value)
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

/** Date or ISO string -> "3 days ago" / "yesterday" / "today". */
export function daysAgoLabel(value) {
  const date = value instanceof Date ? value : new Date(value)
  const days = Math.max(0, Math.round((Date.now() - date.getTime()) / 86_400_000))
  if (days === 0) return 'today'
  if (days === 1) return 'yesterday'
  return `${days} days ago`
}

/** 0.48 -> "48%". */
export function formatPercent(fraction) {
  return `${Math.round(fraction * 100)}%`
}

/** 272 -> "4m 32s". */
export function formatDuration(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${minutes}m ${String(seconds).padStart(2, '0')}s`
}

/** 1 -> "1st", 2 -> "2nd", 11 -> "11th". */
export function ordinal(n) {
  const suffixes = ['th', 'st', 'nd', 'rd']
  const remainder = n % 100
  return n + (suffixes[(remainder - 20) % 10] ?? suffixes[remainder] ?? suffixes[0])
}
