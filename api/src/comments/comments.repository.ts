import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from 'src/db/schema';
import { DRIZZLE } from 'src/db/db.module';
import { and, desc, eq } from 'drizzle-orm';
import type {
  CommentCreateInput,
  CommentListQuery,
  CommentRow,
} from './comments.zod';

type Db = NodePgDatabase<typeof schema>;

@Injectable()
export class CommentsRepository {
  constructor(@Inject(DRIZZLE) private readonly db: Db) {}

  async listForIssue(
    issueId: number,
    q: CommentListQuery,
  ): Promise<CommentRow[]> {
    return this.db
      .select()
      .from(schema.comments)
      .where(eq(schema.comments.issueId, issueId))
      .orderBy(desc(schema.comments.createdAt))
      .limit(q.limit ?? 20)
      .offset(q.offset ?? 0);
  }

  async create(
    issueId: number,
    authorId: number,
    input: CommentCreateInput,
  ): Promise<CommentRow> {
    const [row] = await this.db
      .insert(schema.comments)
      .values({ issueId, authorId, body: input.body })
      .returning();
    return row!;
  }

  async findById(id: number): Promise<CommentRow | undefined> {
    return this.db.query.comments.findFirst({
      where: eq(schema.comments.id, id),
    });
  }

  async remove(id: number): Promise<void> {
    await this.db.delete(schema.comments).where(eq(schema.comments.id, id));
  }
}
