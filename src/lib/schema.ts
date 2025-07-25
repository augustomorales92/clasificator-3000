import { sql } from 'drizzle-orm'
import {
  boolean,
  jsonb,
  pgEnum,
  pgTable,
  real,
  text,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { z } from 'zod'

export const userRoleEnum = pgEnum('user_role', ['user', 'admin'])
export const processingStageEnum = pgEnum('processing_stage', [
  'queue',
  'pending',
  'completed',
  'failed',
])

export const user = pgTable('users', {
  id: text('id').primaryKey(),
  name: text('name'),
  email: varchar('email', { length: 256 }).notNull().unique(),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'date' })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  emailVerified: boolean('emailVerified').default(false),
  role: userRoleEnum('role').default('user').notNull(),
  permissions: jsonb('permissions').default(sql`'{}'::jsonb`),
})

export const account = pgTable('account', {
  id: text('id').primaryKey(),
  accountId: text('accountId').notNull(),
  providerId: text('providerId').notNull(),
  userId: text('userId')
    .notNull()
    .references(() => user.id),
  accessToken: text('accessToken'),
  refreshToken: text('refreshToken'),
  idToken: text('idToken'),
  accessTokenExpiresAt: timestamp('accessTokenExpiresAt'),
  refreshTokenExpiresAt: timestamp('refreshTokenExpiresAt'),
  scope: text('scope'),
  password: text('password'),
  createdAt: timestamp('createdAt').defaultNow(),
  updatedAt: timestamp('updatedAt')
    .defaultNow()
    .$onUpdate(() => new Date()),
})

export const session = pgTable('session', {
  id: text('id').primaryKey(),
  expiresAt: timestamp('expiresAt').notNull(),
  token: text('token').notNull().unique(),
  createdAt: timestamp('createdAt').defaultNow(),
  updatedAt: timestamp('updatedAt')
    .defaultNow()
    .$onUpdate(() => new Date()),
  ipAddress: text('ipAddress'),
  userAgent: text('userAgent'),
  userId: text('userId')
    .notNull()
    .references(() => user.id),
})

export type UserType = typeof user.$inferSelect

export const signInSchema = z.object({
  username: z.string().min(4, { message: 'Username is required' }),
  password: z
    .string()
    .min(6, { message: 'Password lenght at least 6 characters' }),
})

export type SignInValues = z.infer<typeof signInSchema>

// Tasks Table
export const tasks = pgTable('tasks', {
  id: uuid('id').primaryKey(),
  userId: text('user_id'),
  serviceName: text('service_name'),
  status: processingStageEnum('status').notNull().default('queue'),
  createdAt: timestamp('created_at', { withTimezone: true }),
  startedAt: timestamp('started_at', { withTimezone: true }),
  finishedAt: timestamp('finished_at', { withTimezone: true }),
  errorMessage: text('error_message'),
  inputImage: text('input_image'),
})

// Zod schemas for validation
export const insertTaskSchema = createInsertSchema(tasks, {
  serviceName: z.string().min(1, 'Service name is required'),
  inputImage: z.string().min(1, 'Input image is required'),
})

export const selectTaskSchema = createSelectSchema(tasks)

// Types
export type Task = typeof tasks.$inferSelect
export type NewTask = typeof tasks.$inferInsert

// Gemini Tasks Table
export const geminiTasks = pgTable('gemini_tasks', {
  id: uuid('id').primaryKey(),
  userId: text('user_id'),
  serviceName: text('service_name'),
  inputUrl: text('input_url'),
  prompt: text('prompt'),
  ocrResultText: text('ocr_result_text'),
  ocrResultJson: jsonb('ocr_result_json'),
  confidence: real('confidence'),
  processingTime: real('processing_time'),
  modelUsed: varchar('model_used'),
  rawResponse: jsonb('raw_response'),
})

// Zod schemas for Gemini Tasks
export const insertGeminiTaskSchema = createInsertSchema(geminiTasks, {
  serviceName: z.string().min(1, 'Service name is required'),
  inputUrl: z.string().min(1, 'Input URL is required'),
})

export const selectGeminiTaskSchema = createSelectSchema(geminiTasks)

// Types
export type GeminiTask = typeof geminiTasks.$inferSelect
export type NewGeminiTask = typeof geminiTasks.$inferInsert
