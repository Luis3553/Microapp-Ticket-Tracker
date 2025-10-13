import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ProjectsRepository } from './projects.repository';
import { ProjectRow } from './projects.zod';
import { UpdateProjectDto } from './dto/update-project.dto';
import { CreateProjectDto } from './dto/create-project.dto';

@Injectable()
export class ProjectsService {
  constructor(private readonly repo: ProjectsRepository) {}

  async create(dto: CreateProjectDto): Promise<ProjectRow> {
    const exists = await this.repo.findByKey(dto.key);
    if (exists) throw new ConflictException('Key already in use');
    return this.repo.create(dto);
  }

  async get(id: number): Promise<ProjectRow> {
    const row = await this.repo.findById(id);
    if (!row) throw new NotFoundException();
    return row;
  }

  async getByKey(key: string): Promise<ProjectRow> {
    const row = await this.repo.findByKey(key);
    if (!row) throw new NotFoundException();
    return row;
  }

  async list(q?: string, limit?: number, offset?: number) {
    return this.repo.list({ q, limit, offset });
  }

  async update(id: number, dto: UpdateProjectDto) {
    if (dto.key) {
      const other = await this.repo.findByKey(dto.key);
      if (other && other.id !== id)
        throw new ConflictException('Key already in use');
    }
    return this.repo.update(id, dto);
  }

  async remove(id: number) {
    await this.repo.remove(id);
    return { success: true };
  }
}
