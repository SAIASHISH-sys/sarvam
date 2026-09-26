import { Link } from 'react-router-dom'
import { HardHat, ListChecks, Plus, ShieldCheck } from 'lucide-react'
import PageHeader from '../components/ui/PageHeader.jsx'
import StatCard from '../components/ui/StatCard.jsx'
import Card from '../components/ui/Card.jsx'
import Badge from '../components/ui/Badge.jsx'
import { buttonClasses } from '../components/ui/Button.jsx'
import EmptyState from '../components/ui/EmptyState.jsx'
import ProjectCard from '../components/projects/ProjectCard.jsx'
import { useProjects } from '../hooks/useProjects.js'
import { CALL_LOG, SITE_AGENT } from '../data/agentLogs.js'
import { daysAgoLabel } from '../utils/format.js'

export default function Dashboard() {
  const { projects, error } = useProjects()

  if (error) {
    return <p className="text-sm text-red-600">{error.message}</p>
  }

  if (projects === null) {
    return <p className="text-sm text-slate-500">Loading…</p>
  }

  const activeCount = projects.filter((p) => p.status === 'active').length
  const openItems = projects.reduce(
    (sum, p) => sum + p.complianceSummary.attention + p.complianceSummary.noncompliant,
    0,
  )
  const tasksInFlight = projects.reduce(
    (sum, p) => sum + p.wbs.filter((t) => t.progress > 0 && t.progress < 1).length,
    0,
  )
  const lastNightly = CALL_LOG.find((call) => call.direction === 'outbound')

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="Projects under design and site execution."
        actions={
          <Link to="/projects/new" className={buttonClasses('primary')}>
            <Plus size={14} strokeWidth={2} /> New project
          </Link>
        }
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Active projects" value={activeCount} sub={`${projects.length} total`} icon={HardHat} />
        <StatCard label="Open compliance items" value={openItems} sub="Attention + not compliant" icon={ShieldCheck} />
        <StatCard label="Tasks in flight" value={tasksInFlight} sub="Across all schedules" icon={ListChecks} />
        <StatCard
          label="Site agent"
          value="Live"
          sub={`${SITE_AGENT.number} · nightly ${SITE_AGENT.nightlyCallTime}`}
        />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          {projects.length === 0 ? (
            <EmptyState
              icon={HardHat}
              title="No projects yet"
              description="Create your first project to run a compliance check, generate a preliminary design and build a schedule."
            />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {projects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          )}
        </div>

        <div>
          <Card title="Site agent at a glance" description="Stage 2 — Site Saathi">
            <div className="space-y-3 text-sm">
              <p className="flex items-center justify-between gap-2">
                <span className="text-slate-500">Status</span>
                <Badge tone="success">Live</Badge>
              </p>
              <p className="flex items-center justify-between gap-2">
                <span className="text-slate-500">Languages</span>
                <span className="font-medium tabular-nums text-slate-900">
                  {SITE_AGENT.languages.length}
                </span>
              </p>
              <p className="flex items-center justify-between gap-2">
                <span className="text-slate-500">Nightly check-in</span>
                <span className="font-medium tabular-nums text-slate-900">
                  {SITE_AGENT.nightlyCallTime}
                </span>
              </p>
              {lastNightly && (
                <p className="flex items-center justify-between gap-2">
                  <span className="text-slate-500">Last report</span>
                  <span className="font-medium text-slate-900">{daysAgoLabel(lastNightly.date)}</span>
                </p>
              )}
              <div className="border-t border-slate-100 pt-3">
                <Link
                  to="/agent"
                  className="text-sm font-medium text-orange-700 hover:text-orange-800"
                >
                  View agent →
                </Link>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
