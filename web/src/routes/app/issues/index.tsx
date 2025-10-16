import * as React from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { Input } from '@/features/shared/components/ui/input'
import { api } from '@/lib/axios'

type Issue = {
  id: number
  title: string
  status: string
  priority: string
  projectId: number
}

export const Route = createFileRoute('/app/issues/')({
  component: IssuesPage,
})

function IssuesPage() {
  const [q, setQ] = React.useState('')
  const issues = useQuery({
    queryKey: ['issues', 'all', q],
    queryFn: async () =>
      (
        await api.get<Array<Issue>>(
          `/issues${q ? `?q=${encodeURIComponent(q)}` : ''}`,
        )
      ).data,
  })

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          placeholder="Search issues…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        {issues.isLoading
          ? 'Loading…'
          : issues.data?.map((i) => (
              <a
                key={i.id}
                href={`/app/issues/${i.id}`}
                className="block rounded border p-3 hover:bg-muted"
              >
                <div className="font-medium">{i.title}</div>
                <div className="text-xs text-muted-foreground">
                  status: {i.status} • priority: {i.priority}
                </div>
              </a>
            ))}
      </div>
    </div>
  )
}
