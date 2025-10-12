import type { Request } from 'express';
import type * as schema from 'src/db/schema';

type DbUser = typeof schema.users.$inferSelect;

export type RequestUser = Pick<DbUser, 'id' | 'email' | 'name' | 'role'>;

export type RequestWithUser = Request & {
  user: RequestUser;
};
