/**
 * Small metric tile used on dashboards.
 */
export default function StatCard({ label, value, sub, icon: Icon }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white px-4 py-3.5">
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</p>
        {Icon && <Icon size={16} strokeWidth={1.75} className="text-slate-400" aria-hidden="true" />}
      </div>
      <p className="mt-1.5 text-xl font-semibold tabular-nums text-slate-900">{value}</p>
      {sub && <p className="mt-0.5 text-xs text-slate-500">{sub}</p>}
    </div>
  )
}
