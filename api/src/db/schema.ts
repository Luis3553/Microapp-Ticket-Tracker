import {
  pgTable,
  serial,
  varchar,
  text,
  timestamp,
  integer,
  pgEnum,
  jsonb,
} from 'drizzle-orm/pg-core';

export const issueStatus = pgEnum('issue_status', [
  'open',
  'in_progress',
  'blocked',
  'done',
  'closed',
]);
export const userRole = pgEnum('user_role', ['user', 'admin']);

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  name: varchar('name', { length: 120 }).notNull(),
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
  role: userRole('role').notNull().default('user'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const projects = pgTable('projects', {
  id: serial('id').primaryKey(),
  key: varchar('key', { length: 10 }).notNull().unique(),
  name: varchar('name', { length: 120 }).notNull(),
  description: text('description'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const issues = pgTable('issues', {
  id: serial('id').primaryKey(),
  projectId: integer('project_id')
    .references(() => projects.id)
    .notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  status: issueStatus('status').notNull().default('open'),
  reporterId: integer('reporter_id')
    .references(() => users.id)
    .notNull(),
  assigneeId: integer('assignee_id').references(() => users.id),
  priority: varchar('priority', { length: 10 }).notNull().default('medium'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const labels = pgTable('labels', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 40 }).notNull().unique(),
  color: varchar('color', { length: 7 }).notNull(),
});

export const issueLabels = pgTable(
  'issue_labels',
  {
    issueId: integer('issue_id')
      .references(() => issues.id)
      .notNull(),
    labelId: integer('label_id')
      .references(() => labels.id)
      .notNull(),
  },
  (t) => ({ pk: { columns: [t.issueId, t.labelId] } }),
);

export const comments = pgTable('comments', {
  id: serial('id').primaryKey(),
  issueId: integer('issue_id')
    .references(() => issues.id)
    .notNull(),
  authorId: integer('author_id')
    .references(() => users.id)
    .notNull(),
  body: text('body').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const events = pgTable('events', {
  id: serial('id').primaryKey(),
  issueId: integer('issue_id')
    .references(() => issues.id)
    .notNull(),
  actorId: integer('actor_id')
    .references(() => users.id)
    .notNull(),
  type: varchar('type', { length: 40 }).notNull(),
  fromStatus: issueStatus('from_status'),
  toStatus: issueStatus('to_status'),
  meta: jsonb('meta'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
