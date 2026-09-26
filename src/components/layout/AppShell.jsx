import { NavLink, Outlet } from 'react-router-dom'
import Sidebar from './Sidebar.jsx'

/**
 * App chrome: fixed sidebar on large screens, scrolling content column.
 */
export default function AppShell() {
  return (
    <div className="min-h-screen">
      <Sidebar />
      <div className="lg:pl-64">
        <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
