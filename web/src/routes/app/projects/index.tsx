import { createFileRoute } from '@tanstack/react-router'
import { CreateProjectCard } from '@/features/projects/components/createProjectCard'
import { ProjectListCard } from '@/features/projects/components/ProjectListCard'

export const Route = createFileRoute('/app/projects/')({
  component: ProjectsPage,
})

function ProjectsPage() {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <CreateProjectCard />
      <ProjectListCard />
    </div>
  )
}
