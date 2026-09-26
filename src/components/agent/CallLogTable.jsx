import { PhoneIncoming, PhoneOutgoing } from 'lucide-react'
import Badge from '../ui/Badge.jsx'
import { formatDate, formatDuration } from '../../utils/format.js'

const OUTCOME_META = {
  'report received': { label: 'Report received', tone: 'success' },
  answered: { label: 'Answered', tone: 'info' },
  'not related': { label: 'Not related', tone: 'neutral' },
}

/**
 * Recent calls handled by the site agent.
 */
export default function CallLogTable({ calls }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[720px] text-left text-sm">
        <thead>
          <tr className="border-b border-slate-200 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
            <th className="py-2 pr-4">When</th>
            <th className="py-2 pr-4">Direction</th>
            <th className="py-2 pr-4">Participant</th>
            <th className="py-2 pr-4">Language</th>
            <th className="py-2 pr-4">Topic</th>
            <th className="py-2 pr-4">Duration</th>
            <th className="py-2">Outcome</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {calls.map((call) => {
            const outcome = OUTCOME_META[call.outcome] ?? OUTCOME_META.answered
            const DirectionIcon = call.direction === 'inbound' ? PhoneIncoming : PhoneOutgoing
            return (
              <tr key={call.id}>
                <td className="whitespace-nowrap py-3 pr-4 tabular-nums text-slate-600">
                  {formatDate(call.date)}
                </td>
                <td className="py-3 pr-4">
                  <span className="flex items-center gap-1.5 text-slate-600">
                    <DirectionIcon size={14} strokeWidth={1.75} aria-hidden="true" />
                    {call.direction}
                  </span>
                </td>
                <td className="py-3 pr-4 text-slate-800">{call.participant}</td>
                <td className="py-3 pr-4 text-slate-600">{call.language}</td>
                <td className="py-3 pr-4 text-slate-600">{call.topic}</td>
                <td className="py-3 pr-4 tabular-nums text-slate-600">
                  {formatDuration(call.durationSec)}
                </td>
                <td className="py-3">
                  <Badge tone={outcome.tone}>{outcome.label}</Badge>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
