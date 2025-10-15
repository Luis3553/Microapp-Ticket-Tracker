import { useQuery } from '@tanstack/react-query'
import { getProjects } from '../api/projects.api'
import type { Project } from '../types'

export const useProjectsQuery = () => {
  return useQuery<Array<Project>, Error>({
    queryKey: ['projects', 'list'],
    queryFn: async () => {
      const response = await getProjects()
      return response.data
    },
  })
}
