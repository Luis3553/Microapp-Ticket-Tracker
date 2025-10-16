import type { AxiosPromise } from 'axios'
import type z from 'zod'
import type { AuthSchemas } from '../types'
import type { User } from '@/features/shared/types'
import { api } from '@/lib/axios'

export type Session = { user: User; accessToken: string }
type registerApi = Omit<z.infer<typeof AuthSchemas.register>, 'confirm'>
type loginApi = z.infer<typeof AuthSchemas.login>

export function loginApi(payload: loginApi): AxiosPromise<Session> {
  return api.post('/auth/login', payload)
}

export function registerApi(payload: registerApi): AxiosPromise<Session> {
  return api.post('/auth/register', payload)
}

export function refreshApi(): AxiosPromise<Session> {
  return api.post('/auth/refresh') // cookie based
}

export function logoutApi(): AxiosPromise<{ success: true }> {
  return api.post('/auth/logout')
}
