import GanttChart from '../../components/schedule/GanttChart.jsx'
import WbsTable from '../../components/schedule/WbsTable.jsx'
import Card from '../../components/ui/Card.jsx'
import { useProjectContext } from '../ProjectPage.jsx'
import { formatDate } from '../../utils/format.js'
import { scheduleDurationDays } from '../../services/projectFactory.js'

export default function ScheduleTab() {
  const { project } = useProjectContext()
  // API tasks carry ISO date strings; normalise to Date once, here.
  const tasks = project.wbs.map((task) => ({
    ...task,
    start: new Date(task.start),
    end: new Date(task.end),
  }))
  const starts = tasks.map((t) => t.start.getTime())
  const ends = tasks.map((t) => t.end.getTime())

  return (
    <div className="space-y-6">
      <Card title="Timeline" description={`${formatDate(new Date(Math.min(...starts)))} → ${formatDate(new Date(Math.max(...ends)))} · ${scheduleDurationDays(tasks)} working days`}>
        <GanttChart tasks={tasks} />
      </Card>

      <Card title="Work breakdown structure" description="Sequential single-path schedule generated from the project template">
        <WbsTable tasks={tasks} />
      </Card>

      <p className="text-xs leading-5 text-slate-500">
        Durations are indicative planning values. Once the backend lands, dependencies, resource
        levelling and actual-vs-baseline tracking replace this template output — and the nightly
        agent check-in writes progress directly into these tasks.
      </p>
    </div>
  )
}
