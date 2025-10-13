import { createZodDto } from 'nestjs-zod';
import { ProjectCreateSchema } from 'src/projects/projects.zod';

export class CreateProjectDto extends createZodDto(ProjectCreateSchema) {}
