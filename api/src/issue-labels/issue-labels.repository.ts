import { Inject, Injectable } from '@nestjs/common';
import type { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from 'src/db/schema';
import { DRIZZLE } from 'src/db/db.module';
import { and, eq } from 'drizzle-orm';

type Db = NodePgDatabase<typeof schema>;

@Injectable()
export class IssueLabelsRepository {
  constructor(@Inject(DRIZZLE) private readonly db: Db) {}

  async attach(issueId: number, labelId: number) {
    await this.db
      .insert(schema.issueLabels)
      .values({ issueId, labelId })
      .onConflictDoNothing();
    return { success: true };
  }

  async detach(issueId: number, labelId: number) {
    await this.db
      .delete(schema.issueLabels)
      .where(
        and(
          eq(schema.issueLabels.issueId, issueId),
          eq(schema.issueLabels.labelId, labelId),
        ),
      );
    return { success: true };
  }

  async listForIssue(issueId: number) {
    const rows = await this.db
      .select({
        id: schema.labels.id,
        name: schema.labels.name,
        color: schema.labels.color,
      })
      .from(schema.labels)
      .innerJoin(
        schema.issueLabels,
        eq(schema.issueLabels.labelId, schema.labels.id),
      )
      .where(eq(schema.issueLabels.issueId, issueId));
    return rows;
  }
}
