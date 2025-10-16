import { createFileRoute, useParams } from '@tanstack/react-router'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import * as React from 'react'
import { api } from '@/lib/axios'
import { Card, CardContent, CardHeader, CardTitle } from '@/features/shared/components/ui/card'
import { Button } from '@/features/shared/components/ui/button'
import { Textarea } from '@/features/shared/components/ui/textarea'

type Issue = {
  id: number
  title: string
  description?: string
  status: string
  priority: string
  assigneeId?: number | null
}
type Label = { id: number; name: string; color: string }
type Comment = { id: number; authorId: number; body: string; createdAt: string }
type Event = {
  id: number
  type: string
  fromStatus?: string
  toStatus?: string
  meta?: any
  createdAt: string
}

export const Route = createFileRoute('/app/issues/$id/')({
  component: IssueDetailPage,
})

function IssueDetailPage() {
  const { id } = useParams({ from: '/app/issues/$id/' })
  const issueId = Number(id)
  const qc = useQueryClient()

  const issue = useQuery({
    queryKey: ['issue', issueId],
    queryFn: async () => (await api.get<Issue>(`/issues/${issueId}`)).data,
  })
  const labels = useQuery({
    queryKey: ['issue', issueId, 'labels'],
    queryFn: async () => (await api.get<Array<Label>>(`/issues/${issueId}/labels`)).data,
  })
  const comments = useQuery({
    queryKey: ['issue', issueId, 'comments'],
    queryFn: async () => (await api.get<Array<Comment>>(`/issues/${issueId}/comments`)).data,
  })
  const events = useQuery({
    queryKey: ['issue', issueId, 'events'],
    queryFn: async () => (await api.get<Array<Event>>(`/issues/${issueId}/events`)).data,
  })
  const allLabels = useQuery({
    queryKey: ['labels'],
    queryFn: async () => (await api.get<Array<Label>>('/labels')).data,
  })

  const updateStatus = useMutation({
    mutationFn: async (status: string) =>
      (await api.patch(`/issues/${issueId}`, { status })).data,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['issue', issueId] })
      qc.invalidateQueries({ queryKey: ['issue', issueId, 'events'] })
    },
  })

  const attach = useMutation({
    mutationFn: async (labelId: number) =>
      (await api.post(`/issues/${issueId}/labels`, { labelId })).data,
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: ['issue', issueId, 'labels'] }),
  })

  const detach = useMutation({
    mutationFn: async (labelId: number) =>
      (await api.delete(`/issues/${issueId}/labels/${labelId}`)).data,
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: ['issue', issueId, 'labels'] }),
  })

  const [body, setBody] = React.useState('')
  const addComment = useMutation({
    mutationFn: async () =>
      (await api.post(`/issues/${issueId}/comments`, { body })).data,
    onSuccess: () => {
      setBody('')
      qc.invalidateQueries({ queryKey: ['issue', issueId, 'comments'] })
      qc.invalidateQueries({ queryKey: ['issue', issueId, 'events'] })
    },
  })

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>{issue.data?.title ?? 'Issue'}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="text-sm text-muted-foreground">
            status: {issue.data?.status} • priority: {issue.data?.priority}
          </div>
          {issue.data?.description && <p>{issue.data.description}</p>}
          <div className="flex gap-2">
            {['open', 'in_progress', 'blocked', 'done', 'closed'].map((s) => (
              <Button
                key={s}
                size="sm"
                variant="outline"
                onClick={() => updateStatus.mutate(s)}
                disabled={updateStatus.isPending || issue.data?.status === s}
              >
                {s}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Labels</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex flex-wrap gap-2">
            {labels.data?.map((l) => (
              <button
                key={l.id}
                onClick={() => detach.mutate(l.id)}
                className="rounded px-2 py-1 text-xs"
                style={{ background: l.color, color: '#000' }}
              >
                {l.name} ✕
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            {allLabels.data?.map((l) => (
              <Button
                key={l.id}
                size="sm"
                variant="outline"
                onClick={() => attach.mutate(l.id)}
              >
                + {l.name}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Comments</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex gap-2">
            <Textarea
              placeholder="Add a comment…"
              value={body}
              onChange={(e) => setBody(e.target.value)}
            />
            <Button
              onClick={() => addComment.mutate()}
              disabled={!body.trim() || addComment.isPending}
            >
              Post
            </Button>
          </div>
          <div className="space-y-2">
            {comments.data?.map((c) => (
              <div key={c.id} className="rounded border p-3">
                <div className="text-xs text-muted-foreground">
                  {new Date(c.createdAt).toLocaleString()}
                </div>
                <div>{c.body}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Events</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {events.data?.map((e) => (
            <div key={e.id} className="text-sm">
              <span className="text-muted-foreground">
                {new Date(e.createdAt).toLocaleString()} —{' '}
              </span>
              <span>{e.type}</span>
              {e.fromStatus && e.toStatus && (
                <span>
                  {' '}
                  ({e.fromStatus} → {e.toStatus})
                </span>
              )}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
