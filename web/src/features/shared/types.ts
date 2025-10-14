export type Role = 'user' | 'admin'
export type User = {
  id: number
  email: string
  name: string
  role: Role
  createdAt?: string
}
