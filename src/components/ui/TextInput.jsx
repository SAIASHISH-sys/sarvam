/**
 * Text input styled once for the whole app.
 */
export default function TextInput({ className = '', ...props }) {
  return (
    <input
      className={`block w-full rounded-md border-0 px-3 py-1.5 text-sm text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300
        placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-orange-600
        ${className}`}
      {...props}
    />
  )
}
