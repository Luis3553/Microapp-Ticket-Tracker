import type { Project } from '../types'
import type { AxiosPromise } from 'axios'
import { api } from '@/lib/axios'

export const createProject = (
  data: Pick<Project, 'name' | 'description' | 'key'>,
): AxiosPromise<Project> => {
  return api.post('/projects', data)
}

export const getProjects = (): AxiosPromise<Array<Project>> => {
  return api.get<Array<Project>>('/projects')
}
