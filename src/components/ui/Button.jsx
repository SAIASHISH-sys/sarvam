const VARIANTS = {
  primary: 'bg-orange-600 text-white hover:bg-orange-700 focus-visible:outline-orange-600',
  secondary:
    'bg-white text-slate-700 ring-1 ring-inset ring-slate-300 hover:bg-slate-50 focus-visible:outline-slate-400',
  ghost: 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-slate-400',
  danger: 'bg-red-600 text-white hover:bg-red-700 focus-visible:outline-red-600',
}

const SIZES = {
  sm: 'px-2.5 py-1.5 text-xs',
  md: 'px-3.5 py-2 text-sm',
}

/**
 * Class builder shared by <Button> and <Link> actions, so link-styled-as-button
 * never drifts from the real button. Single source of truth for both.
 */
export function buttonClasses(variant = 'secondary', size = 'md') {
  return `inline-flex items-center justify-center gap-1.5 rounded-md font-medium transition
        focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2
        disabled:pointer-events-none disabled:opacity-50
        ${VARIANTS[variant] ?? VARIANTS.secondary} ${SIZES[size] ?? SIZES.md}`
}

/**
 * The one button in the app. Variants and sizes are set here and nowhere else.
 */
export default function Button({ variant = 'secondary', size = 'md', type = 'button', className = '', ...props }) {
  return (
    <button
      type={type}
      className={`${buttonClasses(variant, size)} ${className}`}
      {...props}
    />
  )
}
