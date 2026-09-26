import { NavLink } from 'react-router-dom'
import { Building2, LayoutDashboard, PhoneCall } from 'lucide-react'
import { useProjects } from '../../hooks/useProjects.js'

const MAIN_NAV = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/agent', label: 'Site Agent', icon: PhoneCall },
]

const navClasses = ({ isActive }) =>
  `flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm font-medium transition
    ${isActive ? 'bg-slate-100 text-slate-900' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`

export default function Sidebar() {
  const { projects } = useProjects()

  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r border-slate-200 bg-white lg:block">
      <div className="flex h-full flex-col">
        <div className="flex h-14 items-center gap-2.5 border-b border-slate-200 px-5">
          <span className="flex h-7 w-7 items-center justify-center rounded bg-orange-600 text-sm font-bold text-white">
            N
          </span>
          <span className="text-sm font-semibold tracking-widest text-slate-900">NIRMAAN</span>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4" aria-label="Main">
          <ul className="space-y-0.5">
            {MAIN_NAV.map((item) => (
              <li key={item.to}>
                <NavLink to={item.to} end={item.end} className={navClasses}>
                  <item.icon size={16} strokeWidth={1.75} aria-hidden="true" />
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>

          <p className="mb-1.5 mt-6 px-2.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Projects
          </p>
          <ul className="space-y-0.5">
            {(projects ?? []).map((project) => (
              <li key={project.id}>
                <NavLink to={`/projects/${project.id}`} className={navClasses}>
                  <Building2 size={16} strokeWidth={1.75} aria-hidden="true" />
                  <span className="truncate">{project.name}</span>
                </NavLink>
              </li>
            ))}
            {projects && projects.length === 0 && (
              <li className="px-2.5 py-2 text-xs text-slate-400">No projects yet</li>
            )}
          </ul>
        </nav>

        <div className="border-t border-slate-200 px-4 py-3">
          <p className="flex items-center gap-2.5 text-xs">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-[11px] font-semibold text-slate-600">
              SM
            </span>
            <span className="font-medium text-slate-700">Sai Ashish Mishra</span>
          </p>
        </div>
      </div>
    </aside>
  )
}
