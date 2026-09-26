import PageHeader from '../components/ui/PageHeader.jsx'
import Card from '../components/ui/Card.jsx'
import Badge from '../components/ui/Badge.jsx'
import AgentStatusCard from '../components/agent/AgentStatusCard.jsx'
import CallLogTable from '../components/agent/CallLogTable.jsx'
import { useProjects } from '../hooks/useProjects.js'
import { CALL_LOG, SITE_AGENT } from '../data/agentLogs.js'

const INTEGRATION_ITEMS = [
  { label: 'Voice runtime (ASR → LLM → TTS)', status: 'live' },
  { label: 'Inbound telephony (rented number)', status: 'live' },
  { label: 'Knowledge base publishing', status: 'planned' },
  { label: 'API tools to project backend', status: 'planned' },
  { label: 'Nightly outbound check-in', status: 'planned' },
  { label: 'Webhook progress reports', status: 'planned' },
]

const STATUS_TONES = { live: 'success', planned: 'neutral' }

export default function AgentPage() {
  const { projects } = useProjects()
  const publishedCount = (projects ?? []).filter((p) => p.agentPublishedAt).length

  return (
    <div>
      <PageHeader
        title="Site agent"
        description="Site workers call with questions; the agent calls the manager every night for progress."
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card title="Recent calls" description="Inbound site queries and nightly check-ins">
            <CallLogTable calls={CALL_LOG} />
          </Card>

          <Card title="Integration status" description="Stage 2 wiring, current vs planned">
            <ul className="divide-y divide-slate-100">
              {INTEGRATION_ITEMS.map((item) => (
                <li key={item.label} className="flex items-center justify-between gap-3 py-2.5">
                  <span className="text-sm text-slate-700">{item.label}</span>
                  <Badge tone={STATUS_TONES[item.status]}>{
                    item.status === 'live' ? 'Live' : 'Planned'
                  }</Badge>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-xs leading-5 text-slate-500">
              The agent runs on Sarvam Voice Agents. Publishing from a project pushes its brief,
              compliance sheet, design summary and schedule into the agent's knowledge base.
            </p>
          </Card>
        </div>

        <AgentStatusCard agent={SITE_AGENT} publishedCount={publishedCount} />
      </div>
    </div>
  )
}
