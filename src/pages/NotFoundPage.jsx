import { Link } from 'react-router-dom'
import PageHeader from '../components/ui/PageHeader.jsx'
import { buttonClasses } from '../components/ui/Button.jsx'

export default function NotFoundPage() {
  return (
    <div>
      <PageHeader title="Page not found" description="The address you reached does not exist in this workspace." />
      <Link to="/" className={buttonClasses('secondary')}>
        Return to dashboard
      </Link>
    </div>
  )
}
