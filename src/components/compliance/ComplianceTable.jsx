import { useMemo, useState } from 'react'
import Badge from '../ui/Badge.jsx'
import { COMPLIANCE_STATUS_META } from './statusMeta.js'

const FILTERS = [
  { value: 'all', label: 'All' },
  { value: 'compliant', label: 'Compliant' },
  { value: 'attention', label: 'Attention' },
  { value: 'noncompliant', label: 'Not compliant' },
  { value: 'info', label: 'Info' },
]

/**
 * Clause-level compliance ledger with status filtering.
 */
export default function ComplianceTable({ checks }) {
  const [filter, setFilter] = useState('all')

  const rows = useMemo(
    () => (filter === 'all' ? checks : checks.filter((c) => c.status === filter)),
    [checks, filter],
  )

  return (
    <div>
      <div className="mb-3 flex flex-wrap gap-1.5">
        {FILTERS.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => setFilter(option.value)}
            className={`rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset transition
              ${
                filter === option.value
                  ? 'bg-slate-900 text-white ring-slate-900'
                  : 'bg-white text-slate-600 ring-slate-300 hover:bg-slate-50'
              }`}
          >
            {option.label}
          </button>
        ))}
      </div>

      <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
        <table className="w-full min-w-[820px] text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/60 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              <th className="px-4 py-2.5">Code</th>
              <th className="px-4 py-2.5">Clause</th>
              <th className="px-4 py-2.5">Parameter</th>
              <th className="px-4 py-2.5">Requirement</th>
              <th className="px-4 py-2.5">Project</th>
              <th className="px-4 py-2.5">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((check) => {
              const meta = COMPLIANCE_STATUS_META[check.status] ?? COMPLIANCE_STATUS_META.info
              return (
                <tr key={check.id} className="align-top">
                  <td className="whitespace-nowrap px-4 py-3 font-medium text-slate-700">
                    {check.code}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 tabular-nums text-slate-500">
                    {check.clause}
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-slate-800">{check.parameter}</p>
                    <p className="mt-0.5 text-xs text-slate-500">{check.note}</p>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{check.requirement}</td>
                  <td className="px-4 py-3 tabular-nums text-slate-800">{check.projectValue}</td>
                  <td className="px-4 py-3">
                    <Badge tone={meta.tone}>{meta.label}</Badge>
                  </td>
                </tr>
              )
            })}
            {rows.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-xs text-slate-500">
                  No checks in this category.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
