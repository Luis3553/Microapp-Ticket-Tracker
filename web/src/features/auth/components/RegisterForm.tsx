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

type FormValues = z.infer<typeof AuthSchemas.register>

export default function RegisterForm() {
  const form = useForm<FormValues>({
    resolver: zodResolver(AuthSchemas.register),
    defaultValues: { name: '', email: '', password: '', confirm: '' },
  })

  const { register } = useAuthMutations({})

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((v) => register.mutate(v))}
        className="space-y-4"
      >
        <FormField
          name="name"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Jane Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="email"
          control={form.control}
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
          name="password"
          control={form.control}
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
        <FormField
          name="confirm"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="••••••••" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Link
          to="/auth/login"
          className="text-sm no-underline inline-block mb-3"
        >
          Already have an account? Log in
        </Link>

        <Button type="submit" className="w-full" disabled={register.isPending}>
          {register.isPending ? 'Creating account…' : 'Create account'}
        </Button>
      </form>
    </Form>
  )
}
