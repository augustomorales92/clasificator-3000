import { createClient } from '@supabase/supabase-js'

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_URL')
}
if (!process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY) {
  throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY')
}

// Create a Supabase client for realtime subscriptions
export const supabaseClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY,
  {
    db: {
      schema: 'public',
    },
    auth: {
      autoRefreshToken: true,
      persistSession: true,
    },
    realtime: {
      timeout: 60000,
      heartbeatIntervalMs: 30000,
      params: {
        eventsPerSecond: 10,
      },
    },
  }
)
