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
import { useProjectMutations } from '@/features/projects/hooks/useProjectsMutations'

const createSchema = z.object({
  key: z
    .string()
    .min(2)
    .max(10)
    .regex(/^[A-Z0-9_-]+$/),
  name: z.string().min(2).max(120),
  description: z.string().optional(),
})
type CreateValues = z.infer<typeof createSchema>

export const CreateProjectCard = () => {
  const { createProject } = useProjectMutations()
  const form = useForm<CreateValues>({
    resolver: zodResolver(createSchema),
    defaultValues: { key: '', name: '', description: '' },
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Project</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((v) => createProject.mutate(v))}
            className="space-y-3"
          >
            <FormField
              name="key"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Key</FormLabel>
                  <FormControl>
                    <Input placeholder="APP" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="name"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="My App" {...field} />
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
                    <Textarea placeholder="Optional" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={createProject.isPending}>
              {createProject.isPending ? 'Creating…' : 'Create'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
