import { createFileRoute, useSearch } from '@tanstack/react-router'
import LoginForm from '@/features/auth/components/LoginForm'
import AuthLayout from '@/features/auth/layout/AuthLayout'

export const Route = createFileRoute('/auth/login')({
  component: LoginPage,
})

function LoginPage() {
  const search = useSearch({ from: '/auth/login' })

  return (
    <AuthLayout>
      <LoginForm redirectTo={(search as any).redirect} />
    </AuthLayout>
  )
}
