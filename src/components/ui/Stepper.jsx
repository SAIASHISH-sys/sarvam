import { Check } from 'lucide-react'

/**
 * Wizard progress indicator: numbered steps, completed steps ticked.
 */
export default function Stepper({ steps, current }) {
  return (
    <ol className="flex items-center">
      {steps.map((label, index) => {
        const isDone = index < current
        const isCurrent = index === current
        return (
          <li key={label} className="flex items-center">
            <div className="flex items-center gap-2">
              <span
                aria-hidden="true"
                className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold
                  ${isDone ? 'bg-orange-600 text-white' : isCurrent ? 'bg-white text-orange-600 ring-2 ring-orange-600' : 'bg-slate-100 text-slate-400 ring-1 ring-inset ring-slate-200'}`}
              >
                {isDone ? <Check size={13} strokeWidth={3} /> : index + 1}
              </span>
              <span
                className={`text-xs font-medium ${isCurrent ? 'text-slate-900' : 'text-slate-500'}`}
              >
                {label}
              </span>
            </div>
            {index < steps.length - 1 && <span className="mx-3 h-px w-10 bg-slate-200 sm:w-16" aria-hidden="true" />}
          </li>
        )
      })}
    </ol>
  )
}
