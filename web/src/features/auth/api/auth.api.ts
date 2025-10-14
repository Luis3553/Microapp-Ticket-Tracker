import type { User } from '@/features/shared/types'
import { api } from '@/lib/axios'
import type z from 'zod'
import type { AuthSchemas } from '../types'

export type Session = { user: User; accessToken: string }
type registerApi = Omit<z.infer<typeof AuthSchemas.register>, 'confirm'>
type loginApi = z.infer<typeof AuthSchemas.login>

export async function loginApi(payload: loginApi): Promise<Session> {
  const { data } = await api.post('/auth/login', payload)
  return data
}

export async function registerApi(payload: registerApi): Promise<Session> {
  const { data } = await api.post('/auth/register', payload)
  return data
}

export async function refreshApi(): Promise<Session> {
  const { data } = await api.post('/auth/refresh') // cookie based
  return data
}

export async function logoutApi(): Promise<{ success: true }> {
  const { data } = await api.post('/auth/logout')
  return data
}

export async function meApi(): Promise<User> {
  const { data } = await api.get('/auth/me')
  return data
}
