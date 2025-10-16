import { createFileRoute } from '@tanstack/react-router'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { api } from '@/lib/axios'
import { Card, CardContent, CardHeader, CardTitle } from '@/features/shared/components/ui/card'
import { Button } from '@/features/shared/components/ui/button'
import { Input } from '@/features/shared/components/ui/input'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/features/shared/components/ui/form'

type Label = { id: number; name: string; color: string }

export const Route = createFileRoute('/app/labels/')({
  component: LabelsPage,
})

const createSchema = z.object({
  name: z.string().min(1).max(40),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
})
type CreateValues = z.infer<typeof createSchema>

function LabelsPage() {
  const qc = useQueryClient()
  const labels = useQuery({
    queryKey: ['labels'],
    queryFn: async () => (await api.get<Array<Label>>('/labels')).data,
  })
  const createMut = useMutation({
    mutationFn: async (v: CreateValues) => (await api.post('/labels', v)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['labels'] }),
  })
  const delMut = useMutation({
    mutationFn: async (id: number) => (await api.delete(`/labels/${id}`)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['labels'] }),
  })

  const form = useForm<CreateValues>({
    resolver: zodResolver(createSchema),
    defaultValues: { name: '', color: '#000000' },
  })

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Create Label</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit((v) => createMut.mutate(v))}
              className="space-y-3"
            >
              <FormField
                name="name"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="color"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Color</FormLabel>
                    <FormControl>
                      <Input type="color" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={createMut.isPending}>
                {createMut.isPending ? 'Creating…' : 'Create'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Labels</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {labels.isLoading
            ? 'Loading…'
            : labels.data?.map((l) => (
                <div
                  key={l.id}
                  className="flex items-center justify-between rounded border p-3"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="h-5 w-5 rounded"
                      style={{ background: l.color }}
                    />
                    <div>{l.name}</div>
                  </div>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => delMut.mutate(l.id)}
                    disabled={delMut.isPending}
                  >
                    Delete
                  </Button>
                </div>
              ))}
        </CardContent>
      </Card>
    </div>
  )
}
