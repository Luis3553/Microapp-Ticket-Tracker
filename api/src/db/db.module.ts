import { Module } from '@nestjs/common';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

export const DRIZZLE = Symbol('DRIZZLE');

@Module({
  providers: [
    {
      provide: DRIZZLE,
      useFactory: async () => {
        const pool = new Pool({ connectionString: process.env.DATABASE_URL });
        return drizzle(pool);
      },
    },
  ],
  exports: [DRIZZLE],
})
export class DbModule {}
