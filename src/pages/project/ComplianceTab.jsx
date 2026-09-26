import ComplianceTable from '../../components/compliance/ComplianceTable.jsx'
import { useProjectContext } from '../ProjectPage.jsx'

export default function ComplianceTab() {
  const project = useProjectContext()

  return <ComplianceTable checks={project.compliance} />
}
