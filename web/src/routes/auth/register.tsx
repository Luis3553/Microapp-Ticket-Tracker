import RegisterForm from '@/features/auth/components/RegisterForm'
import AuthLayout from '@/features/auth/layout/AuthLayout'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/auth/register')({
  component: RegisterPage,
})

function RegisterPage() {
  return (
    <AuthLayout description="Create a new account" title="Register">
      <RegisterForm />
    </AuthLayout>
  )
}
