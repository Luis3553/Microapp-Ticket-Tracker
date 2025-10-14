import { createFileRoute, useParams } from '@tanstack/react-router'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/axios'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/features/shared/components/ui/card'
import { Button } from '@/features/shared/components/ui/button'
import { Input } from '@/features/shared/components/ui/input'
import { Textarea } from '@/features/shared/components/ui/textarea'
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/features/shared/components/ui/form'
import type { Project } from '@/features/projects/types'

type Issue = { id: number; title: string; status: string; priority: string }

export const Route = createFileRoute('/app/projects/$projectId/')({
  component: ProjectDetailPage,
})

const createIssueSchema = z.object({
  title: z.string().min(2).max(255),
  description: z.string().optional(),
  priority: z.enum(['low', 'medium', 'high']),
})
type CreateIssueValues = z.infer<typeof createIssueSchema>

function ProjectDetailPage() {
  const { projectId } = useParams({ from: '/app/projects/$projectId/' }) as {
    projectId: string
  }
  const pid = Number(projectId)
  const qc = useQueryClient()

  const project = useQuery({
    queryKey: ['projects', pid],
    queryFn: async () => (await api.get<Project>(`/projects/${pid}`)).data,
  })

  const issues = useQuery({
    queryKey: ['issues', 'byProject', pid],
    queryFn: async () =>
      (await api.get<Issue[]>(`/issues?projectId=${pid}`)).data,
  })

  const createIssue = useMutation({
    mutationFn: async (v: CreateIssueValues) =>
      (await api.post('/issues', { ...v, projectId: pid })).data,
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: ['issues', 'byProject', pid] }),
  })

  const form = useForm<CreateIssueValues>({
    resolver: zodResolver(createIssueSchema),
    defaultValues: { title: '', description: '', priority: 'medium' },
  })

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>{project.data?.name ?? 'Project'}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground">
            Key: {project.data?.key}
          </div>
          {project.data?.description && (
            <p className="mt-2">{project.data.description}</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>New Issue</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit((v) => createIssue.mutate(v))}
              className="space-y-3"
            >
              <FormField
                name="title"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="description"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="priority"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Priority</FormLabel>
                    <FormControl>
                      <select className="w-full rounded border p-2" {...field}>
                        <option>low</option>
                        <option>medium</option>
                        <option>high</option>
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={createIssue.isPending}>
                {createIssue.isPending ? 'Creating…' : 'Create'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Issues</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
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
        </CardContent>
      </Card>
    </div>
  )
}
