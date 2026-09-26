import Card from '../../components/ui/Card.jsx'
import { useProjectContext } from '../ProjectPage.jsx'

export default function DesignTab() {
  const { project } = useProjectContext()
  const { design } = project

  return (
    <div className="space-y-6">
      <div className="border-l-4 border-amber-400 bg-amber-50 px-4 py-3 text-xs leading-5 text-amber-800">
        {design.disclaimer}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card title="Structural system" className="lg:col-span-1">
          <dl className="space-y-3 text-sm">
            <div>
              <dt className="text-[11px] font-medium uppercase tracking-wider text-slate-400">System</dt>
              <dd className="mt-0.5 font-medium text-slate-800">{design.system}</dd>
            </div>
            <div>
              <dt className="text-[11px] font-medium uppercase tracking-wider text-slate-400">Foundation</dt>
              <dd className="mt-0.5 font-medium text-slate-800">{design.foundation}</dd>
            </div>
          </dl>
          <div className="mt-4 border-t border-slate-100 pt-3.5">
            <p className="mb-2 text-[11px] font-medium uppercase tracking-wider text-slate-400">Rationale</p>
            <ul className="list-disc space-y-1.5 pl-4 text-xs leading-5 text-slate-600">
              {design.rationale.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          </div>
        </Card>

        <Card title="Member schedule" description="Preliminary sizing — subject to detailed design" className="lg:col-span-2">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                  <th className="py-2 pr-4">Element</th>
                  <th className="py-2 pr-4">Size</th>
                  <th className="py-2 pr-4">Concrete</th>
                  <th className="py-2 pr-4">Steel</th>
                  <th className="py-2">Remarks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {design.members.map((member) => (
                  <tr key={member.element} className="align-top">
                    <td className="py-3 pr-4 font-medium text-slate-800">{member.element}</td>
                    <td className="whitespace-nowrap py-3 pr-4 tabular-nums text-slate-600">{member.size}</td>
                    <td className="py-3 pr-4 text-slate-600">{member.concrete}</td>
                    <td className="py-3 pr-4 text-slate-600">{member.steel}</td>
                    <td className="py-3 text-xs leading-5 text-slate-500">{member.remarks}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  )
}
