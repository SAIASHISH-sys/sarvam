import { CalendarDays, ListChecks, ShieldCheck, TrendingUp } from 'lucide-react'
import Card from '../../components/ui/Card.jsx'
import StatCard from '../../components/ui/StatCard.jsx'
import Badge from '../../components/ui/Badge.jsx'
import { useProjectContext } from '../ProjectPage.jsx'
import { daysAgoLabel, formatPercent } from '../../utils/format.js'
import { scheduleDurationDays } from '../../services/projectFactory.js'

const PARAMETER_ROWS = [
  ['Building type', (p) => p.params.buildingType],
  ['Plot area', (p) => `${p.params.plotArea.toLocaleString('en-IN')} m²`],
  ['Configuration', (p) => `${p.params.floors} · ${p.params.floorHeight} m floors`],
  ['Seismic zone', (p) => `Zone ${p.params.seismicZone}`],
  ['Basic wind speed', (p) => `${p.params.basicWindSpeed} m/s`],
  ['Soil', (p) => p.soilLabel],
  ['Concrete grade', (p) => p.params.concreteGrade],
  ['Slab', (p) => `${p.params.slabThickness} mm · ${p.params.slabSpan} m span`],
  ['Nominal cover', (p) => `${p.params.nominalCover} mm`],
]

export default function OverviewTab() {
  const { project } = useProjectContext()
  const { complianceSummary } = project

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Progress" value={formatPercent(project.progress)} sub="Duration-weighted" icon={TrendingUp} />
        <StatCard label="Schedule" value={`${scheduleDurationDays(project.wbs)} days`} sub={`${project.wbs.length} tasks`} icon={CalendarDays} />
        <StatCard
          label="Compliance"
          value={`${complianceSummary.compliant} pass`}
          sub={`${complianceSummary.attention} attention · ${complianceSummary.noncompliant} fail`}
          icon={ShieldCheck}
        />
        <StatCard label="Design checks" value={complianceSummary.info} sub="Informational" icon={ListChecks} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card title="Parameters" description="As entered in the project wizard" className="lg:col-span-2">
          <dl className="grid grid-cols-2 gap-x-4 gap-y-3 sm:grid-cols-3">
            {PARAMETER_ROWS.map(([label, render]) => (
              <div key={label}>
                <dt className="text-[11px] font-medium uppercase tracking-wider text-slate-400">{label}</dt>
                <dd className="mt-0.5 text-sm text-slate-800">{render(project)}</dd>
              </div>
            ))}
          </dl>
        </Card>

        <div className="space-y-6">
          <Card title="Applicable codes" description="Clause provenance for this project">
            <ul className="space-y-2">
              {project.codes.map((code) => (
                <li key={code} className="flex items-center gap-2 text-sm text-slate-700">
                  <span className="h-1.5 w-1.5 rounded-full bg-orange-600" aria-hidden="true" />
                  {code}
                </li>
              ))}
            </ul>
          </Card>

          <Card title="Site agent" description="Stage 2 — knowledge base">
            {project.agentPublishedAt ? (
              <div className="space-y-2 text-sm">
                <p className="flex items-center gap-2">
                  <Badge tone="success">Published</Badge>
                  <span className="text-slate-500">Updated {daysAgoLabel(project.agentPublishedAt)}</span>
                </p>
                <p className="text-xs leading-5 text-slate-500">
                  Site callers can ask about this project. Nightly check-ins track progress against its schedule.
                </p>
              </div>
            ) : (
              <p className="text-xs leading-5 text-slate-500">
                Not published yet. Use “Publish to site agent” above to push the project brief, compliance
                sheet, design summary and schedule to the agent.
              </p>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}
