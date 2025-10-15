import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { createProject as createProjectAPI } from '../api/projects.api'
import type { Project } from '../types'

export function useProjectMutations() {
  const qc = useQueryClient()

  const createProject = useMutation({
    mutationFn: async (data: Pick<Project, 'key' | 'name' | 'description'>) => {
      await createProjectAPI(data)
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
