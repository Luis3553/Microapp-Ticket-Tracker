import { Injectable, NotFoundException } from '@nestjs/common';
import { IssuesRepository } from './issues.repository';
import type {
  IssueCreateInput,
  IssueListQuery,
  IssueRow,
  IssueUpdateInput,
} from './issues.zod';
import * as schema from 'src/db/schema';
import type { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DRIZZLE } from 'src/db/db.module';
import { Inject } from '@nestjs/common';

type Db = NodePgDatabase<typeof schema>;

@Injectable()
export class IssuesService {
  constructor(
    private readonly repo: IssuesRepository,
    @Inject(DRIZZLE) private readonly db: Db,
  ) {}

  async create(dto: IssueCreateInput, reporterId: number): Promise<IssueRow> {
    // default status 'open' comes from DB
    const row = await this.repo.create({ ...dto, reporterId });
    // event: created
    await this.db.insert(schema.events).values({
      issueId: row.id,
      actorId: reporterId,
      type: 'created',
      meta: null,
    });
    return row;
  }

  async get(id: number): Promise<IssueRow> {
    const row = await this.repo.findById(id);
    if (!row) throw new NotFoundException();
    return row;
  }

  async list(q: IssueListQuery) {
    return this.repo.list(q);
  }

  async update(id: number, dto: IssueUpdateInput, actorId: number) {
    const before = await this.repo.findById(id);
    if (!before) throw new NotFoundException();

    const updated = await this.repo.update(id, dto);

    // Emit events on notable changes
    const events: Array<Partial<typeof schema.events.$inferInsert>> = [];

    if (dto.status && dto.status !== before.status) {
      events.push({
        issueId: id,
        actorId,
        type: 'status_changed',
        fromStatus: before.status,
        toStatus: dto.status as any,
        meta: null,
      });
    }

    if (
      typeof dto.assigneeId !== 'undefined' &&
      dto.assigneeId !== before.assigneeId
    ) {
      events.push({
        issueId: id,
        actorId,
        type: 'assignee_changed',
        meta: { from: before.assigneeId, to: dto.assigneeId },
      });
    }

    if (events.length) {
      await this.db.insert(schema.events).values(events as any);
    }

    return updated;
  }

  async remove(id: number, actorId: number) {
    await this.repo.remove(id);
    await this.db.insert(schema.events).values({
      issueId: id,
      actorId,
      type: 'deleted',
      meta: null,
    });
    return { success: true };
  }
}
