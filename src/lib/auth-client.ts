import { customSessionClient } from 'better-auth/client/plugins'
import { createAuthClient } from 'better-auth/react'
import type { auth } from './auth'

const baseURL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

export const { signIn, signUp, useSession, signOut } = createAuthClient({
  baseURL,
  session: {
    maxAge: 30 * 24 * 60 * 60, // 30 días
  },
  plugins: [customSessionClient<typeof auth>()],
})
