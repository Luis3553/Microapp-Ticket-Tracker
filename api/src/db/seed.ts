import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';
import { hash } from 'bcrypt';

async function main() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const db = drizzle(pool, { schema });

  const adminPassword = await hash('password123', 10);
  const [admin] = await db
    .insert(schema.users)
    .values({
      email: 'admin@example.com',
      passwordHash: adminPassword,
      name: 'Admin User',
      role: 'admin',
    })
    .returning();

  const userPassword = await hash('userpass', 10);
  const [user] = await db
    .insert(schema.users)
    .values({
      email: 'user@example.com',
      passwordHash: userPassword,
      name: 'Normal User',
    })
    .returning();

  const [project] = await db
    .insert(schema.projects)
    .values({
      key: 'MICRO',
      name: 'Microapp',
      description: 'Main issue tracker project',
    })
    .returning();

  const [bugLabel, featureLabel] = await db
    .insert(schema.labels)
    .values([
      { name: 'bug', color: '#e11d48' },
      { name: 'feature', color: '#3b82f6' },
    ])
    .returning();

  const [issue1] = await db
    .insert(schema.issues)
    .values({
      projectId: project.id,
      title: 'Login page not working',
      description: 'Users cannot log in with correct credentials',
      status: 'open',
      priority: 'high',
      reporterId: admin.id,
      assigneeId: user.id,
    })
    .returning();

  const [issue2] = await db
    .insert(schema.issues)
    .values({
      projectId: project.id,
      title: 'Add dark mode',
      description: 'Implement dark mode toggle in settings',
      status: 'in_progress',
      priority: 'medium',
      reporterId: user.id,
      assigneeId: admin.id,
    })
    .returning();

  await db.insert(schema.issueLabels).values([
    { issueId: issue1.id, labelId: bugLabel.id },
    { issueId: issue2.id, labelId: featureLabel.id },
  ]);

  await db.insert(schema.comments).values([
    {
      issueId: issue1.id,
      authorId: user.id,
      body: 'I am still experiencing this bug on Chrome.',
    },
    {
      issueId: issue2.id,
      authorId: admin.id,
      body: 'Dark mode will ship in v1.1 🎉',
    },
  ]);

  await db.insert(schema.events).values([
    {
      issueId: issue2.id,
      actorId: admin.id,
      type: 'status_change',
      fromStatus: 'open',
      toStatus: 'in_progress',
      meta: { note: 'Started work on dark mode' },
    },
  ]);

  console.log('✅ Seed complete');
  await pool.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
