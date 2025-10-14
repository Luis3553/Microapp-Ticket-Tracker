import { api } from '@/lib/axios'
import type { Project } from '../types'
import type { AxiosPromise } from 'axios'

export const createProject = (
  data: Pick<Project, 'name' | 'description' | 'key'>,
): AxiosPromise<Project> => {
  return api.post('/projects', data)
}

export const getProjects = async (): Promise<Project[]> => {
  const response = await api.get<Project[]>('/projects')
  return response.data
}
