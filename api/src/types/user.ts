import { users } from 'src/db/schema';

export type DbUser = typeof users.$inferSelect;
export type PublicUser = Pick<DbUser, 'id' | 'email' | 'name' | 'role'>;
