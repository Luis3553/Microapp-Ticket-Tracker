import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { DRIZZLE } from 'src/db/db.module';
import type { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from 'src/db/schema';
import { desc, eq, ilike, or } from 'drizzle-orm';
import { CreateProjectDto } from './dto/create-project.dto';
import { ProjectRow } from './projects.zod';
import { UpdateProjectDto } from './dto/update-project.dto';

type Db = NodePgDatabase<typeof schema>;

@Injectable()
export class ProjectsRepository {
  constructor(@Inject(DRIZZLE) private readonly db: Db) {}

  async create(values: CreateProjectDto): Promise<ProjectRow> {
    const [row] = await this.db
      .insert(schema.projects)
      .values(values)
      .returning();
    return row;
  }

  async findById(id: number): Promise<ProjectRow | undefined> {
    return this.db.query.projects.findFirst({
      where: eq(schema.projects.id, id),
    });
  }

  async findByKey(key: string): Promise<ProjectRow | undefined> {
    return this.db.query.projects.findFirst({
      where: eq(schema.projects.key, key),
    });
  }

  async list(
    params: { q?: string; limit?: number; offset?: number } = {},
  ): Promise<ProjectRow[]> {
    const { q, limit = 20, offset = 0 } = params;
    const where = q
      ? or(
          ilike(schema.projects.name, `%${q}%`),
          ilike(schema.projects.key, `%${q}%`),
        )
      : undefined;

    return this.db
      .select()
      .from(schema.projects)
      .where(where)
      .orderBy(desc(schema.projects.createdAt))
      .limit(limit)
      .offset(offset);
  }

  async update(
    id: number,
    patch: Partial<UpdateProjectDto>,
  ): Promise<ProjectRow> {
    const [row] = await this.db
      .update(schema.projects)
      .set(patch)
      .where(eq(schema.projects.id, id))
      .returning();
    if (!row) throw new NotFoundException('Project not found');
    return row;
  }

  async remove(id: number): Promise<void> {
    await this.db.delete(schema.projects).where(eq(schema.projects.id, id));
  }
}
