import { Injectable, NotFoundException } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import type { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DRIZZLE } from 'src/db/db.module';
import * as schema from 'src/db/schema';

type UserRow = typeof schema.users.$inferSelect;
type UserInsert = typeof schema.users.$inferInsert;

@Injectable()
export class UsersRepository {
  constructor(
    @Inject(DRIZZLE) private readonly db: NodePgDatabase<typeof schema>,
  ) {}

  async create(values: UserInsert): Promise<UserRow> {
    const [row] = await this.db.insert(schema.users).values(values).returning();
    return row!;
  }

  async findById(id: number): Promise<UserRow | undefined> {
    return this.db.query.users.findFirst({ where: eq(schema.users.id, id) });
  }

  async findByEmail(email: string): Promise<UserRow | undefined> {
    return this.db.query.users.findFirst({
      where: eq(schema.users.email, email),
    });
  }

  async update(id: number, values: Partial<UserInsert>): Promise<UserRow> {
    const [row] = await this.db
      .update(schema.users)
      .set({ ...values })
      .where(eq(schema.users.id, id))
      .returning();
    if (!row) throw new NotFoundException('User not found');
    return row;
  }

  async list(opts: { q?: string; limit?: number; offset?: number } = {}) {
    const { q, limit = 20, offset = 0 } = opts;
    const rows = await this.db
      .select()
      .from(schema.users)
      .limit(limit)
      .offset(offset);
    return rows;
  }

  async remove(id: number): Promise<void> {
    await this.db.delete(schema.users).where(eq(schema.users.id, id));
  }
}
