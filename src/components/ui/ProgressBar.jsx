/**
 * Thin horizontal completion bar. Colour is fixed: one accent, no states.
 */
export default function ProgressBar({ value, className = '' }) {
  const pct = Math.min(100, Math.max(0, Math.round(value * 100)))
  return (
    <div className={`h-1.5 w-full overflow-hidden rounded-full bg-slate-100 ${className}`} role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
      <div className="h-full rounded-full bg-orange-600" style={{ width: `${pct}%` }} />
    </div>
  )
}
