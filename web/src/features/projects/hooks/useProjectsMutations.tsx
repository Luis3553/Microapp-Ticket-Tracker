import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import type { Project } from '../types'
import { createProject as createProjectAPI } from '../api/projects.api'

export function useProjectMutations() {
  const qc = useQueryClient()

  const createProject = useMutation({
    mutationFn: async (data: Pick<Project, 'key' | 'name' | 'description'>) => {
      const response = await createProjectAPI(data)
      if (!response?.data) {
        throw new Error('Failed to create project')
      }
      return response.data
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['projects', 'list'] })
      toast.success('Project created')
    },
    onError: ({ message }) => {
      toast.error(message)
    },
  })

  return { createProject }
}
