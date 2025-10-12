CREATE TYPE "public"."issue_status" AS ENUM('open', 'in_progress', 'blocked', 'done', 'closed');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('user', 'admin');--> statement-breakpoint
CREATE TABLE "comments" (
	"id" serial PRIMARY KEY NOT NULL,
	"issue_id" integer NOT NULL,
	"author_id" integer NOT NULL,
	"body" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "events" (
	"id" serial PRIMARY KEY NOT NULL,
	"issue_id" integer NOT NULL,
	"actor_id" integer NOT NULL,
	"type" varchar(40) NOT NULL,
	"from_status" "issue_status",
	"to_status" "issue_status",
	"meta" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "issue_labels" (
	"issue_id" integer NOT NULL,
	"label_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "issues" (
	"id" serial PRIMARY KEY NOT NULL,
	"project_id" integer NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text,
	"status" "issue_status" DEFAULT 'open' NOT NULL,
	"reporter_id" integer NOT NULL,
	"assignee_id" integer,
	"priority" varchar(10) DEFAULT 'medium' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "labels" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(40) NOT NULL,
	"color" varchar(7) NOT NULL,
	CONSTRAINT "labels_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "projects" (
	"id" serial PRIMARY KEY NOT NULL,
	"key" varchar(10) NOT NULL,
	"name" varchar(120) NOT NULL,
	"description" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "projects_key_unique" UNIQUE("key")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" varchar(255) NOT NULL,
	"name" varchar(120) NOT NULL,
	"password_hash" varchar(255) NOT NULL,
	"role" "user_role" DEFAULT 'user' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "comments" ADD CONSTRAINT "comments_issue_id_issues_id_fk" FOREIGN KEY ("issue_id") REFERENCES "public"."issues"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "comments" ADD CONSTRAINT "comments_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "events" ADD CONSTRAINT "events_issue_id_issues_id_fk" FOREIGN KEY ("issue_id") REFERENCES "public"."issues"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "events" ADD CONSTRAINT "events_actor_id_users_id_fk" FOREIGN KEY ("actor_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "issue_labels" ADD CONSTRAINT "issue_labels_issue_id_issues_id_fk" FOREIGN KEY ("issue_id") REFERENCES "public"."issues"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "issue_labels" ADD CONSTRAINT "issue_labels_label_id_labels_id_fk" FOREIGN KEY ("label_id") REFERENCES "public"."labels"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "issues" ADD CONSTRAINT "issues_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "issues" ADD CONSTRAINT "issues_reporter_id_users_id_fk" FOREIGN KEY ("reporter_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "issues" ADD CONSTRAINT "issues_assignee_id_users_id_fk" FOREIGN KEY ("assignee_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;