import * as React from 'react'
import { Outlet } from '@tanstack/react-router'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/features/shared/components/ui/card'
import { Separator } from '@/features/shared/components/ui/separator'

type Props = {
  children?: React.ReactNode
  title?: string
  description?: string
  brand?: React.ReactNode
}

export default function AuthLayout({
  children,
  title = 'Welcome',
  description = 'Sign in or create an account to continue.',
  brand = <span className="font-semibold">Microapp</span>,
}: Props) {
  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
      {/* Left side / brand panel (hidden on mobile) */}
      <div className="relative hidden md:flex items-center justify-center bg-muted">
        <div className="text-3xl">{brand}</div>
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-primary/10 via-transparent to-primary/20" />
      </div>

      {/* Right side / auth card */}
      <div className="flex items-center justify-center p-6">
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl">{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </CardHeader>
          <Separator />
          <CardContent>{children ?? <Outlet />}</CardContent>
        </Card>
      </div>
    </div>
  )
}
