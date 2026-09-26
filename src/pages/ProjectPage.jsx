import { useEffect, useState } from 'react'
import { NavLink, Outlet, useOutletContext, useParams } from 'react-router-dom'
import { Rocket } from 'lucide-react'
import PageHeader from '../components/ui/PageHeader.jsx'
import Badge from '../components/ui/Badge.jsx'
import Button from '../components/ui/Button.jsx'
import PublishAgentModal from '../components/projects/PublishAgentModal.jsx'
import { getProject, publishProject } from '../services/projectService.js'
import { daysAgoLabel } from '../utils/format.js'

const STATUS_META = {
  active: { label: 'Active', tone: 'success' },
  draft: { label: 'Draft', tone: 'neutral' },
}

const TABS = [
  { segment: '', label: 'Overview', end: true },
  { segment: 'compliance', label: 'Compliance' },
  { segment: 'design', label: 'Design' },
  { segment: 'schedule', label: 'Schedule' },
  { segment: 'voice', label: 'Voice' },
]

export default function ProjectPage() {
  const { projectId } = useParams()
  const [project, setProject] = useState(undefined) // undefined = loading
  const [loadError, setLoadError] = useState(null)

  useEffect(() => {
    let active = true
    getProject(projectId)
      .then((data) => active && setProject(data))
      .catch((error) => active && setLoadError(error.message))
    return () => {
      active = false
    }
  }, [projectId])

  if (loadError) {
    return <p className="text-sm text-red-600">{loadError}</p>
  }

  if (project === undefined) {
    return <p className="text-sm text-slate-500">Loading…</p>
  }

  if (project === null) {
    return (
      <div>
        <PageHeader title="Project not found" description={`No project with id "${projectId}".`} />
        <Button variant="secondary" onClick={() => window.history.back()}>Go back</Button>
      </div>
    )
  }

  return <ProjectWorkspace project={project} onProjectChange={setProject} />
}

function ProjectWorkspace({ project, onProjectChange }) {
  const [publishOpen, setPublishOpen] = useState(false)
  const status = STATUS_META[project.status] ?? STATUS_META.draft
  const { projectId } = useParams()

  async function handlePublish() {
    const updated = await publishProject(project.id)
    onProjectChange(updated)
    setPublishOpen(false)
  }

  return (
    <div>
      <PageHeader
        title={project.name}
        description={`${project.client} · ${project.location}`}
        actions={
          <>
            {project.agentPublishedAt && (
              <Badge tone="info">Agent updated {daysAgoLabel(project.agentPublishedAt)}</Badge>
            )}
            <Button variant="primary" onClick={() => setPublishOpen(true)}>
              <Rocket size={14} strokeWidth={1.75} />
              {project.agentPublishedAt ? 'Update agent knowledge' : 'Publish to site agent'}
            </Button>
          </>
        }
      />

      <div className="mb-6 border-b border-slate-200">
        <nav className="-mb-px flex gap-5" aria-label="Project sections">
          {TABS.map((tab) => (
            <NavLink
              key={tab.label}
              to={tab.segment ? `/projects/${projectId}/${tab.segment}` : `/projects/${projectId}`}
              end={tab.end}
              className={({ isActive }) =>
                `whitespace-nowrap border-b-2 px-0.5 py-2.5 text-sm font-medium transition
                  ${isActive
                    ? 'border-orange-600 text-slate-900'
                    : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700'}`
              }
            >
              {tab.label}
            </NavLink>
          ))}
        </nav>
      </div>

      <Outlet context={{ project, onProjectChange }} />

      {publishOpen && (
        <PublishAgentModal project={project} onClose={() => setPublishOpen(false)} onConfirm={handlePublish} />
      )}
    </div>
  )
}

/** Convenience re-export so tabs can grab the workspace context. */
export { useOutletContext as useProjectContext }
