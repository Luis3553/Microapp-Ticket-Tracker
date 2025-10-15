import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/features/shared/components/ui/card'
import { useProjectsQuery } from '@/features/projects/hooks/useProjectsQuery'

export const ProjectListCard = () => {
  const { data: projects, isLoading: isLoadingProjects } = useProjectsQuery()

  return (
    <Card className="md:col-span-1">
      <CardHeader>
        <CardTitle>Projects</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {isLoadingProjects
          ? 'Loading…'
          : (projects || []).map((p) => (
              <a
                key={p.id}
                href={`/app/projects/${p.id}`}
                className="block rounded border p-3 hover:bg-muted"
              >
                <div className="font-medium">
                  {p.name}{' '}
                  <span className="text-xs text-muted-foreground">
                    ({p.key})
                  </span>
                </div>
                {p.description && (
                  <div className="text-sm text-muted-foreground">
                    {p.description}
                  </div>
                )}
              </a>
            ))}
      </CardContent>
    </Card>
  )
}
