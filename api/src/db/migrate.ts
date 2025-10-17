import 'dotenv/config';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

async function main() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error('DATABASE_URL is not set');
  }

  const pool = new Pool({ connectionString });
  const db = drizzle(pool, { logger: true });

  // Apply all SQL migrations from the ./drizzle folder
  await migrate(db, { migrationsFolder: 'drizzle' });

  await pool.end();
  console.log('✅ Migrations applied');
}

main().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});
