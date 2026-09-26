/**
 * Native select styled once for the whole app.
 * `options` is [{ value, label }].
 */
export default function Select({ options = [], className = '', ...props }) {
  return (
    <select
      className={`block w-full rounded-md border-0 px-3 py-1.5 text-sm text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300
        focus:ring-2 focus:ring-inset focus:ring-orange-600
        ${className}`}
      {...props}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  )
}
