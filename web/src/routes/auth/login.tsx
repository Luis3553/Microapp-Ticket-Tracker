import LoginForm from '@/features/auth/components/LoginForm'
import AuthLayout from '@/features/auth/layout/AuthLayout'
import { createFileRoute, useSearch } from '@tanstack/react-router'

export const Route = createFileRoute('/auth/login')({
  component: LoginPage,
})

function LoginPage() {
  const search = useSearch({ from: '/auth/login' }) as { redirect?: string }

  return (
    <AuthLayout>
      <LoginForm redirectTo={search.redirect} />
    </AuthLayout>
  )
}
