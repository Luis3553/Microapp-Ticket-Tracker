import { useMutation, useQueryClient } from '@tanstack/react-query'
import { getErrorMessage } from '@/lib/errors'
import {
  loginApi,
  registerApi,
  refreshApi,
  logoutApi,
  type Session,
} from '../api/auth.api'
import { setAccessToken, clearAccessToken } from '@/lib/authToken'
import { toast } from 'sonner'
import { useNavigate } from '@tanstack/react-router'

const SESSION_KEY = ['auth', 'session']

type UseAuthMutationsProps = {
  loginProps?: {
    redirectTo?: string
  }
}

export function useAuthMutations({ loginProps }: UseAuthMutationsProps) {
  const qc = useQueryClient()
  const navigate = useNavigate()

  const setSession = (s: Session | null) => {
    if (s?.accessToken) setAccessToken(s.accessToken)
    else clearAccessToken()
    qc.setQueryData(SESSION_KEY, s)
  }

  const login = useMutation({
    mutationFn: loginApi,
    onSuccess: (data) => {
      setSession(data)
      if (loginProps?.redirectTo) navigate({ to: loginProps.redirectTo })
      else navigate({ to: '/app' })
      toast(`Welcome back, ${data.user.name}!`)
    },
    onError: (e) => {
      toast.error(`Invalid credentials`)
      setSession(null)
      console.error(getErrorMessage(e))
    },
  })

  const register = useMutation({
    mutationFn: registerApi,
    onSuccess: (data) => {
      setSession(data)
      navigate({ to: '/app' })
      toast(`Welcome, ${data.user.name}!`)
    },
    onError: (e) => {
      toast.error(`Error: ${getErrorMessage(e)}`)
      setSession(null)
      console.error(getErrorMessage(e))
    },
  })

  const refresh = useMutation({
    mutationFn: refreshApi,
    onSuccess: (data) => setSession(data),
    onError: () => setSession(null),
  })

  const logout = useMutation({
    mutationFn: logoutApi,
    onSuccess: () => setSession(null),
    onError: () => setSession(null),
  })

  return { login, register, refresh, logout, setSession, SESSION_KEY }
}
