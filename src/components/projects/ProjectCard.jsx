import { Link } from 'react-router-dom'
import { MapPin } from 'lucide-react'
import Badge from '../ui/Badge.jsx'
import ProgressBar from '../ui/ProgressBar.jsx'
import { formatPercent } from '../../utils/format.js'

const STATUS_META = {
  active: { label: 'Active', tone: 'success' },
  draft: { label: 'Draft', tone: 'neutral' },
}

/**
 * Dashboard tile for one project. Links into the project workspace.
 */
export default function ProjectCard({ project }) {
  const { params, complianceSummary } = project
  const status = STATUS_META[project.status] ?? STATUS_META.draft

  return (
    <Link
      to={`/projects/${project.id}`}
      className="group flex flex-col rounded-lg border border-slate-200 bg-white p-5 transition hover:border-slate-300 hover:shadow-sm"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-slate-900 group-hover:text-orange-700">
            {project.name}
          </h3>
          <p className="mt-0.5 text-xs text-slate-500">{project.client}</p>
        </div>
        <Badge tone={status.tone}>{status.label}</Badge>
      </div>

      <p className="mt-2 flex items-center gap-1 text-xs text-slate-500">
        <MapPin size={12} strokeWidth={1.75} aria-hidden="true" />
        {project.location}
      </p>

      <div className="mt-3 flex flex-wrap gap-1.5">
        <Chip>{params.floors} RCC</Chip>
        <Chip>{params.concreteGrade}</Chip>
        <Chip>Zone {params.seismicZone}</Chip>
        <Chip>Plot {params.plotArea.toLocaleString('en-IN')} m²</Chip>
      </div>

      <div className="mt-4">
        <div className="mb-1 flex items-center justify-between text-xs">
          <span className="text-slate-500">Progress</span>
          <span className="font-medium tabular-nums text-slate-700">
            {formatPercent(project.progress)}
          </span>
        </div>
        <ProgressBar value={project.progress} />
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-xs text-slate-500">
        <span className="tabular-nums">
          {complianceSummary.compliant} pass · {complianceSummary.attention} attention ·{' '}
          {complianceSummary.noncompliant} fail
        </span>
        {project.agentPublishedAt && <Badge tone="info">On site agent</Badge>}
      </div>
    </Link>
  )
}

function Chip({ children }) {
  return (
    <span className="rounded bg-slate-50 px-1.5 py-0.5 text-xs text-slate-600 ring-1 ring-inset ring-slate-200">
      {children}
    </span>
  )
}
