import { useQuery } from '@tanstack/react-query'
import type { Session } from '../api/auth.api'

export function useAuthSession() {
  const { data: session } = useQuery<Session | null>({
    queryKey: ['auth', 'session'],
    queryFn: () => null,
    initialData: null,
    staleTime: Infinity,
    gcTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchInterval: false as any,
  })

  return {
    session,
    isAuthenticated: !!(session && session.accessToken && session.user),
    user: session ? session.user : null,
    accessToken: session ? session.accessToken : null,
  }
}
