import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/features/shared/components/ui/form'
import { Input } from '@/features/shared/components/ui/input'
import { Button } from '@/features/shared/components/ui/button'
import { useAuthMutations } from '../hooks/useAuthMutations'
import { AuthSchemas } from '../types'
import { Link } from '@tanstack/react-router'

type FormValues = z.infer<typeof AuthSchemas.login>

export default function LoginForm({ redirectTo }: { redirectTo?: string }) {
  const form = useForm<FormValues>({
    resolver: zodResolver(AuthSchemas.login),
    defaultValues: { email: '', password: '' },
  })

  const { login } = useAuthMutations({ loginProps: { redirectTo } })

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((v) => login.mutate(v))}
        className="space-y-4"
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="you@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="••••••••" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Link
          to="/auth/register"
          className="text-sm no-underline inline-block mb-3"
        >
          Don't have an account? Register
        </Link>
        <Button type="submit" className="w-full" disabled={login.isPending}>
          {login.isPending ? 'Signing in…' : 'Sign in'}
        </Button>
      </form>
    </Form>
  )
}
