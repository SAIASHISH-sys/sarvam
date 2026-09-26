import { dayDiff, formatDayRange, monthBuckets } from '../../utils/schedule.js'

const DAY_PX = 5
const LABEL_W_PX = 208 // must stay in sync with the task label column below

/**
 * Lightweight SVG-free Gantt: month header, phase dividers, duration bars
 * with progress fill. Horizontally scrollable for long schedules.
 */
export default function GanttChart({ tasks: rawTasks }) {
  if (rawTasks.length === 0) return null

  // Dates may arrive as ISO strings from the API — normalise once.
  const tasks = rawTasks.map((task) => ({
    ...task,
    start: new Date(task.start),
    end: new Date(task.end),
  }))

  const rangeStart = tasks.reduce((min, t) => (t.start < min ? t.start : min), tasks[0].start)
  const rangeEnd = tasks.reduce((max, t) => (t.end > max ? t.end : max), tasks[0].end)
  const totalDays = dayDiff(rangeEnd, rangeStart) + 1
  const trackWidth = totalDays * DAY_PX
  const buckets = monthBuckets(rangeStart, rangeEnd)

  let lastPhase = null

  return (
    <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
      <div className="min-w-max">
        <div className="flex border-b border-slate-200 bg-slate-50/60">
          <div
            className="shrink-0 border-r border-slate-200 px-4 py-2 text-[11px] font-semibold uppercase tracking-wider text-slate-500"
            style={{ width: LABEL_W_PX }}
          >
            Task
          </div>
          {buckets.map((bucket) => (
            <div
              key={bucket.label}
              className="shrink-0 border-r border-slate-200 py-2 text-center text-[11px] font-medium text-slate-500"
              style={{ width: bucket.widthDays * DAY_PX }}
            >
              {bucket.label}
            </div>
          ))}
        </div>

        <div className="relative">
          {buckets.slice(1).map((bucket) => (
            <div
              key={`grid-${bucket.label}`}
              className="pointer-events-none absolute inset-y-0 border-l border-slate-100"
              style={{ left: LABEL_W_PX + bucket.offsetDays * DAY_PX }}
              aria-hidden="true"
            />
          ))}

          {tasks.map((task) => {
            const showPhase = task.phase !== lastPhase
            lastPhase = task.phase
            const offset = dayDiff(task.start, rangeStart)
            const width = task.duration * DAY_PX
            return (
              <div key={task.key}>
                {showPhase && (
                  <div className="border-b border-slate-100 bg-slate-50/40 px-4 py-1 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                    {task.phase}
                  </div>
                )}
                <div className="flex items-center border-b border-slate-100">
                  <div
                    className="shrink-0 truncate px-4 py-2 text-xs text-slate-600"
                    style={{ width: LABEL_W_PX }}
                  >
                    {task.task}
                  </div>
                  <div className="relative h-8" style={{ width: trackWidth }}>
                    <div
                      className="absolute top-1/2 h-3 -translate-y-1/2 rounded-sm bg-orange-200"
                      style={{ left: offset * DAY_PX, width }}
                      title={formatDayRange(task.start, task.end)}
                    />
                    <div
                      className="absolute top-1/2 h-3 -translate-y-1/2 rounded-sm bg-orange-600"
                      style={{ left: offset * DAY_PX, width: task.progress > 0 ? width * task.progress : 0 }}
                      title={`${Math.round(task.progress * 100)}% complete`}
                    />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
