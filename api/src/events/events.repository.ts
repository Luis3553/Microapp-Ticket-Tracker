import { Inject, Injectable } from '@nestjs/common';
import type { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from 'src/db/schema';
import { DRIZZLE } from 'src/db/db.module';
import { desc, eq } from 'drizzle-orm';

type Db = NodePgDatabase<typeof schema>;

@Injectable()
export class EventsRepository {
  constructor(@Inject(DRIZZLE) private readonly db: Db) {}

  async listForIssue(issueId: number) {
    return this.db
      .select({
        id: schema.events.id,
        issueId: schema.events.issueId,
        actorId: schema.events.actorId,
        type: schema.events.type,
        fromStatus: schema.events.fromStatus,
        toStatus: schema.events.toStatus,
        meta: schema.events.meta,
        createdAt: schema.events.createdAt,
      })
      .from(schema.events)
      .where(eq(schema.events.issueId, issueId))
      .orderBy(desc(schema.events.createdAt));
  }
}
