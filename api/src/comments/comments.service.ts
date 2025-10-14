import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CommentsRepository } from './comments.repository';
import type { CommentCreateInput, CommentListQuery } from './comments.zod';
import * as schema from 'src/db/schema';
import type { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { Inject } from '@nestjs/common';
import { DRIZZLE } from 'src/db/db.module';

type Db = NodePgDatabase<typeof schema>;

@Injectable()
export class CommentsService {
  constructor(
    private readonly repo: CommentsRepository,
    @Inject(DRIZZLE) private readonly db: Db,
  ) {}

  list(issueId: number, q: CommentListQuery) {
    return this.repo.listForIssue(issueId, q);
  }

  async add(issueId: number, authorId: number, input: CommentCreateInput) {
    const created = await this.repo.create(issueId, authorId, input);
    await this.db.insert(schema.events).values({
      issueId,
      actorId: authorId,
      type: 'comment_added',
      meta: { commentId: created.id },
    });
    return created;
  }

  async remove(
    commentId: number,
    actorId: number,
    actorRole: 'user' | 'admin',
  ) {
    const c = await this.repo.findById(commentId);
    if (!c) throw new NotFoundException('Comment not found');
    if (actorRole !== 'admin' && c.authorId !== actorId) {
      throw new ForbiddenException('Not allowed');
    }
    await this.repo.remove(commentId);
    await this.db.insert(schema.events).values({
      issueId: c.issueId,
      actorId,
      type: 'comment_deleted',
      meta: { commentId },
    });
    return { success: true };
  }
}
