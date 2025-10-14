import { createFileRoute, redirect } from '@tanstack/react-router'
import { setAccessToken } from '@/lib/authToken'
import { api } from '@/lib/axios'
import AppLayout from '@/features/layout/AppLayout'

export const SESSION_KEY = ['auth', 'session']

export const Route = createFileRoute('/app')({
  beforeLoad: async function requireAuth({ context, location }) {
    const qc = context.queryClient
    const session = qc.getQueryData(SESSION_KEY) as
      | { accessToken?: string }
      | undefined

    if (!session?.accessToken) {
      try {
        const { data } = await api.post('/auth/refresh')
        setAccessToken(data.accessToken)
        qc.setQueryData(SESSION_KEY, data)
      } catch {
        throw redirect({
          to: '/auth/login',
          search: { redirect: location.href },
        })
      }
    }
  },
  component: AppLayout,
})
