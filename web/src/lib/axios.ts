import axios from 'axios'
import { clearAccessToken, getAccessToken, setAccessToken } from './authToken'
import type { AxiosError, InternalAxiosRequestConfig } from 'axios'

const baseURL = (import.meta.env.VITE_API_URL as string | undefined) ?? 'http://localhost:3000'

export const api = axios.create({
  baseURL,
  withCredentials: true,
})

const raw = axios.create({ baseURL, withCredentials: true })

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = getAccessToken()
  if (token) {
    // headers are always defined on InternalAxiosRequestConfig
    ;(config.headers as any).Authorization = `Bearer ${token}`
  }
  return config
})

let isRefreshing = false
let pendingQueue: Array<(token: string | null) => void> = []

api.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const { response, config } = error
    const original = config
    if (!response || !original) throw error

    const status = response.status
    const isAuthRefresh = (original.url ?? '').includes('/auth/refresh')

    if (status === 401 && !isAuthRefresh && !(original as any)._retry) {
      ;(original as any)._retry = true

      // queue requests while refreshing
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          pendingQueue.push((token) => {
            if (token) {
              ;(original.headers as any).Authorization = `Bearer ${token}`
            }
            api.request(original).then(resolve).catch(reject)
          })
        })
      }

      isRefreshing = true
      try {
        const { data } = await raw.post('/auth/refresh') // { user, accessToken }
        const newToken = (data as { accessToken?: string }).accessToken
        if (!newToken) throw new Error('No accessToken in refresh response')

        setAccessToken(newToken)

        // flush queue
        pendingQueue.forEach((cb) => cb(newToken))
        pendingQueue = []

        // retry original
        ;(original.headers as any).Authorization = `Bearer ${newToken}`
        return api.request(original)
      } catch (e) {
        clearAccessToken()
        // flush queue with null (fail pending requests)
        pendingQueue.forEach((cb) => cb(null))
        pendingQueue = []
        throw e
      } finally {
        isRefreshing = false
      }
    }

    throw error
  },
)
