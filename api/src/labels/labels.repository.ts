import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DRIZZLE } from 'src/db/db.module';
import * as schema from 'src/db/schema';
import { and, desc, eq, ilike, or } from 'drizzle-orm';
import type {
  LabelCreateInput,
  LabelListQuery,
  LabelRow,
  LabelUpdateInput,
} from './labels.zod';

type Db = NodePgDatabase<typeof schema>;

@Injectable()
export class LabelsRepository {
  constructor(@Inject(DRIZZLE) private readonly db: Db) {}

  async create(values: LabelCreateInput): Promise<LabelRow> {
    const [row] = await this.db
      .insert(schema.labels)
      .values(values)
      .returning();
    return row!;
  }

  async findById(id: number): Promise<LabelRow | undefined> {
    return this.db.query.labels.findFirst({ where: eq(schema.labels.id, id) });
  }

  async findByName(name: string): Promise<LabelRow | undefined> {
    return this.db.query.labels.findFirst({
      where: eq(schema.labels.name, name),
    });
  }

  async list(q: LabelListQuery): Promise<LabelRow[]> {
    const where = q.q ? or(ilike(schema.labels.name, `%${q.q}%`)) : undefined;

    return this.db
      .select()
      .from(schema.labels)
      .where(where)
      .orderBy(desc(schema.labels.id))
      .limit(q.limit ?? 20)
      .offset(q.offset ?? 0);
  }

  async update(id: number, patch: LabelUpdateInput): Promise<LabelRow> {
    const [row] = await this.db
      .update(schema.labels)
      .set(patch)
      .where(eq(schema.labels.id, id))
      .returning();
    if (!row) throw new NotFoundException('Label not found');
    return row;
  }

  async remove(id: number): Promise<void> {
    await this.db.delete(schema.labels).where(eq(schema.labels.id, id));
  }
}
