import { Outlet, createFileRoute, redirect } from '@tanstack/react-router'
import { useAuthSession } from '@/features/auth/hooks/useAuthSession'
import { setAccessToken } from '@/lib/authToken'
import { api } from '@/lib/axios'

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

function AppLayout() {
  const { user } = useAuthSession()
  return (
    <div className="min-h-screen">
      <header className="border-b p-3 text-sm">Hello {user?.name}</header>
      <main className="p-4">
        <Outlet />
      </main>
    </div>
  )
}
