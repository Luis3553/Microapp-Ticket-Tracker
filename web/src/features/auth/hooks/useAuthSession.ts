import { useQuery } from '@tanstack/react-query'
import type { Session } from '../api/auth.api'

export function useAuthSession() {
  const { data: session } = useQuery<Session | null>({
    queryKey: ['auth', 'session'],
    queryFn: async () => null,
    initialData: null,
    staleTime: Infinity,
    gcTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchInterval: false as any,
  })

  return {
    session,
    isAuthenticated: Boolean(session?.accessToken && session?.user),
    user: session?.user ?? null,
    accessToken: session?.accessToken ?? null,
  }
}
