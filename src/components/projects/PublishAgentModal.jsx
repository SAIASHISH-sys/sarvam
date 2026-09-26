import { useState } from 'react'
import { Rocket } from 'lucide-react'
import Modal from '../ui/Modal.jsx'
import Button from '../ui/Button.jsx'

const PACKAGE_ITEMS = [
  { id: 'brief', label: 'Project brief', detail: 'Parameters, client and site' },
  { id: 'compliance', label: 'Compliance sheet', detail: 'Clause checks with notes' },
  { id: 'design', label: 'Design summary', detail: 'System, foundation, member schedule' },
  { id: 'wbs', label: 'WBS & schedule', detail: 'Tasks with dates and durations' },
]

/**
 * Stage 1 → Stage 2 bridge: packages the project for the site agent's
 * knowledge base. Backend wiring (Sarvam Deployments API) lands with the
 * agent service; today it stamps the project as published.
 */
export default function PublishAgentModal({ project, onClose, onConfirm }) {
  const [pending, setPending] = useState(false)

  async function handlePublish() {
    setPending(true)
    try {
      await onConfirm()
    } finally {
      setPending(false)
    }
  }

  return (
    <Modal
      title={project.agentPublishedAt ? 'Update site agent knowledge' : 'Publish to site agent'}
      description="Stage 2 — Site Saathi on Sarvam Voice Agents"
      onClose={onClose}
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handlePublish} disabled={pending}>
            <Rocket size={14} strokeWidth={1.75} />
            {pending ? 'Publishing…' : project.agentPublishedAt ? 'Update' : 'Publish'}
          </Button>
        </>
      }
    >
      <ul className="space-y-2.5">
        {PACKAGE_ITEMS.map((item) => (
          <li key={item.id} className="flex items-start justify-between gap-3 rounded-md border border-slate-200 px-3 py-2.5">
            <div>
              <p className="text-sm font-medium text-slate-800">{item.label}</p>
              <p className="text-xs text-slate-500">{item.detail}</p>
            </div>
            <span className="mt-0.5 text-xs font-medium text-emerald-700">Ready</span>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-xs leading-5 text-slate-500">
        Once published, site workers can call the agent and ask about this project, and the nightly
        manager check-in will track progress against this schedule.
      </p>
    </Modal>
  )
}
