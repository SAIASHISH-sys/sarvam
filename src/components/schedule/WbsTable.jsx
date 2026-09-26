import { formatDate, formatPercent } from '../../utils/format.js'

/**
 * Work-breakdown ledger: one row per task with dates, duration and progress.
 */
export default function WbsTable({ tasks }) {
  let lastPhase = null

  return (
    <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
      <table className="w-full min-w-[760px] text-left text-sm">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50/60 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
            <th className="px-4 py-2.5">#</th>
            <th className="px-4 py-2.5">Task</th>
            <th className="px-4 py-2.5">Start</th>
            <th className="px-4 py-2.5">Finish</th>
            <th className="px-4 py-2.5">Days</th>
            <th className="px-4 py-2.5">Progress</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {tasks.map((task, index) => {
            const showPhase = task.phase !== lastPhase
            lastPhase = task.phase
            return (
              <tr key={task.key} className={showPhase ? 'bg-slate-50/40' : undefined}>
                <td className="px-4 py-2.5 tabular-nums text-slate-400">{index + 1}</td>
                <td className="px-4 py-2.5">
                  {showPhase && (
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                      {task.phase}
                    </p>
                  )}
                  <p className="font-medium text-slate-800">{task.task}</p>
                </td>
                <td className="whitespace-nowrap px-4 py-2.5 tabular-nums text-slate-600">
                  {formatDate(task.start)}
                </td>
                <td className="whitespace-nowrap px-4 py-2.5 tabular-nums text-slate-600">
                  {formatDate(task.end)}
                </td>
                <td className="px-4 py-2.5 tabular-nums text-slate-600">{task.duration}</td>
                <td className="px-4 py-2.5">
                  <span className="flex items-center gap-2">
                    <span className="h-1.5 w-16 overflow-hidden rounded-full bg-slate-100">
                      <span
                        className="block h-full rounded-full bg-orange-600"
                        style={{ width: `${Math.round(task.progress * 100)}%` }}
                      />
                    </span>
                    <span className="text-xs tabular-nums text-slate-500">
                      {formatPercent(task.progress)}
                    </span>
                  </span>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
