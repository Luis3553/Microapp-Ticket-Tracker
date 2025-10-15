import { useQuery } from '@tanstack/react-query'
import type { Project } from '../types'
import { getProjects } from '../api/projects.api'

export const useProjectsQuery = () => {
  return useQuery<Project[], Error>({
    queryKey: ['projects', 'list'],
    queryFn: () => getProjects(),
  })
}
