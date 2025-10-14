import { AxiosError } from 'axios'
export function getErrorMessage(err: unknown, fallback = 'Request failed') {
  if (typeof err === 'string') return err
  const e = err as AxiosError<any>
  return e?.response?.data?.message || e?.message || fallback
}
