/**
 * Pure calendar math for schedule views (Gantt chart, WBS tables).
 * All functions are timezone-naive day arithmetic on local Dates.
 */

const MS_PER_DAY = 86_400_000

export function addDays(date, days) {
  const result = new Date(date)
  result.setDate(result.getDate() + days)
  return result
}

/** Whole days from a to b (b - a, in days). */
export function dayDiff(a, b) {
  return Math.round((b - a) / MS_PER_DAY)
}

/** Two dates -> "01 Jun – 05 Jun". */
export function formatDayRange(start, end) {
  const format = (d) => d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
  return `${format(start)} – ${format(end)}`
}

/**
 * Break a date range into calendar-month buckets for a Gantt header.
 * Returns [{ label, offsetDays, widthDays }] where offsets are relative to
 * the range start and widths are clipped to the range.
 */
export function monthBuckets(rangeStart, rangeEnd) {
  const buckets = []
  const cursor = new Date(rangeStart.getFullYear(), rangeStart.getMonth(), 1)
  const lastMonth = new Date(rangeEnd.getFullYear(), rangeEnd.getMonth(), 1)

  while (cursor <= lastMonth) {
    const next = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1)
    const from = cursor < rangeStart ? rangeStart : cursor
    const to = next > rangeEnd ? addDays(rangeEnd, 1) : next
    buckets.push({
      label: `${cursor.toLocaleString('en-IN', { month: 'short' })} '${String(cursor.getFullYear()).slice(2)}`,
      offsetDays: dayDiff(from, rangeStart),
      widthDays: Math.max(1, dayDiff(to, from)),
    })
    cursor.setMonth(cursor.getMonth() + 1)
  }
  return buckets
}
