import { useEffect, useState } from 'react'
import { listProjects } from '../services/projectService.js'

/**
 * Loads the project list through the service layer. Returns
 * { projects: null | array, error } — null while loading.
 */
export function useProjects() {
  const [projects, setProjects] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    let active = true
    listProjects()
      .then((data) => active && setProjects(data))
      .catch((err) => active && setError(err))
    return () => {
      active = false
    }
  }, [])

  return { projects, error }
}
