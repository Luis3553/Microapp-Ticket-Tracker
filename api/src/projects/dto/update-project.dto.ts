import { createZodDto } from 'nestjs-zod';
import { ProjectUpdateSchema } from 'src/projects/projects.zod';

export class UpdateProjectDto extends createZodDto(ProjectUpdateSchema) {}
