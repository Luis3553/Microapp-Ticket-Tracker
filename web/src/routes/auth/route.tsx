import { Outlet, createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/auth')({
  beforeLoad: onlyGuests,
  component: () => <Outlet />,
})

function onlyGuests({ context }: any) {
  const session = context.queryClient.getQueryData(['auth', 'session'])
  if (session?.accessToken) throw redirect({ to: '/app' })
}
