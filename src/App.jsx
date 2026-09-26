import { Routes, Route } from 'react-router-dom'
import AppShell from './components/layout/AppShell.jsx'
import Dashboard from './pages/Dashboard.jsx'
import NewProjectPage from './pages/NewProjectPage.jsx'
import ProjectPage from './pages/ProjectPage.jsx'
import OverviewTab from './pages/project/OverviewTab.jsx'
import ComplianceTab from './pages/project/ComplianceTab.jsx'
import DesignTab from './pages/project/DesignTab.jsx'
import ScheduleTab from './pages/project/ScheduleTab.jsx'
import VoiceTab from './pages/project/VoiceTab.jsx'
import AgentPage from './pages/AgentPage.jsx'
import NotFoundPage from './pages/NotFoundPage.jsx'

export default function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route index element={<Dashboard />} />
        <Route path="projects/new" element={<NewProjectPage />} />
        <Route path="projects/:projectId" element={<ProjectPage />}>
          <Route index element={<OverviewTab />} />
          <Route path="compliance" element={<ComplianceTab />} />
          <Route path="design" element={<DesignTab />} />
          <Route path="schedule" element={<ScheduleTab />} />
          <Route path="voice" element={<VoiceTab />} />
        </Route>
        <Route path="agent" element={<AgentPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}
