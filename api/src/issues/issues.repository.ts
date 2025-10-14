import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { and, desc, eq, ilike, or, sql } from 'drizzle-orm';
import type { SQL } from 'drizzle-orm';
import * as schema from 'src/db/schema';
import { DRIZZLE } from 'src/db/db.module';
import type {
  IssueCreateInput,
  IssueRow,
  IssueUpdateInput,
  IssueListQuery,
} from './issues.zod';

type Db = NodePgDatabase<typeof schema>;

@Injectable()
export class IssuesRepository {
  constructor(@Inject(DRIZZLE) private readonly db: Db) {}

  async create(
    values: Omit<IssueCreateInput, 'priority'> & {
      priority?: 'low' | 'medium' | 'high';
      reporterId: number;
    },
  ): Promise<IssueRow> {
    const [row] = await this.db
      .insert(schema.issues)
      .values(values)
      .returning();
    return row!;
  }

  async findById(id: number): Promise<IssueRow | undefined> {
    return this.db.query.issues.findFirst({ where: eq(schema.issues.id, id) });
  }

  async list(q: IssueListQuery): Promise<IssueRow[]> {
    const conds: SQL[] = [];
    if (q.projectId) conds.push(eq(schema.issues.projectId, q.projectId));
    if (q.reporterId) conds.push(eq(schema.issues.reporterId, q.reporterId));
    if (q.assigneeId) conds.push(eq(schema.issues.assigneeId, q.assigneeId));
    if (q.status) conds.push(eq(schema.issues.status, q.status));
    if (q.q)
      conds.push(
        or(
          ilike(schema.issues.title, `%${q.q}%`),
          ilike(schema.issues.description, `%${q.q}%`),
        ) as SQL,
      );

    const where = conds.length ? and(...conds) : sql`true`;

    return this.db
      .select()
      .from(schema.issues)
      .where(where)
      .orderBy(desc(schema.issues.updatedAt))
      .limit(q.limit ?? 20)
      .offset(q.offset ?? 0);
  }

  async update(id: number, patch: IssueUpdateInput): Promise<IssueRow> {
    const [row] = await this.db
      .update(schema.issues)
      .set({ ...patch, updatedAt: new Date() })
      .where(eq(schema.issues.id, id))
      .returning();
    if (!row) throw new NotFoundException('Issue not found');
    return row;
  }

  async remove(id: number): Promise<void> {
    await this.db.delete(schema.issues).where(eq(schema.issues.id, id));
  }
}
