import { Clock, Languages, PhoneCall } from 'lucide-react'
import Badge from '../ui/Badge.jsx'
import Card from '../ui/Card.jsx'

/**
 * Live summary of the Stage-2 voice agent deployment.
 */
export default function AgentStatusCard({ agent, publishedCount }) {
  return (
    <Card title="Deployment" description="Sarvam Voice Agents — telephony channel">
      <dl className="space-y-3.5 text-sm">
        <div className="flex items-center justify-between gap-4">
          <dt className="text-slate-500">Agent</dt>
          <dd className="flex items-center gap-2 font-medium text-slate-900">
            {agent.name}
            <Badge tone="success">Live</Badge>
          </dd>
        </div>
        <div className="flex items-center justify-between gap-4">
          <dt className="text-slate-500">Number</dt>
          <dd className="flex items-center gap-1.5 font-medium tabular-nums text-slate-900">
            <PhoneCall size={14} strokeWidth={1.75} className="text-slate-400" aria-hidden="true" />
            {agent.number}
          </dd>
        </div>
        <div className="flex items-center justify-between gap-4">
          <dt className="text-slate-500">Nightly check-in</dt>
          <dd className="flex items-center gap-1.5 font-medium tabular-nums text-slate-900">
            <Clock size={14} strokeWidth={1.75} className="text-slate-400" aria-hidden="true" />
            {agent.nightlyCallTime}
          </dd>
        </div>
        <div className="flex items-center justify-between gap-4">
          <dt className="text-slate-500">Projects on agent</dt>
          <dd className="tabular-nums font-medium text-slate-900">{publishedCount}</dd>
        </div>
        <div className="border-t border-slate-100 pt-3.5">
          <dt className="mb-1.5 flex items-center gap-1.5 text-slate-500">
            <Languages size={14} strokeWidth={1.75} className="text-slate-400" aria-hidden="true" />
            Languages
          </dt>
          <dd className="flex flex-wrap gap-1.5">
            {agent.languages.map((language) => (
              <Badge key={language}>{language}</Badge>
            ))}
          </dd>
        </div>
      </dl>
    </Card>
  )
}
