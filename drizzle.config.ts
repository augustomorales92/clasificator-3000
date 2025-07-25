import { defineConfig } from 'drizzle-kit'

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not defined')
}

export default defineConfig({
  dialect: 'postgresql',
  schema: './src/lib/schema.ts',
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
})
