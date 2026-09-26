import Card from '../../components/ui/Card.jsx'
import VoicePanel from '../../components/voice/VoicePanel.jsx'
import { useProjectContext } from '../ProjectPage.jsx'

export default function VoiceTab() {
  const { project, onProjectChange } = useProjectContext()

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <VoicePanel projectId={project.id} onProjectChange={onProjectChange} />
      </div>
      <div>
        <Card title="How this works" description="Sarvam AI stack, end to end">
          <ol className="list-decimal space-y-2 pl-4 text-xs leading-5 text-slate-600">
            <li>Saaras v3 transcribes what you say — 22 Indian languages plus English, auto-detected.</li>
            <li>Sarvam-105B reads the current plan and turns your words into validated edits. Anything outside the plan's schema is rejected, never applied.</li>
            <li>The plan is rebuilt: compliance, design summary and schedule all update.</li>
            <li>Bulbul speaks the confirmation back in your language.</li>
          </ol>
          <p className="mt-3 border-t border-slate-100 pt-3 text-xs leading-5 text-slate-500">
            The session keeps full dialogue history, so “one more floor” then “actually, revert
            that and use M30” works like a conversation with your site engineer.
          </p>
        </Card>
      </div>
    </div>
  )
}
