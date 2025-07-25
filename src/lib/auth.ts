import { betterAuth, type BetterAuthOptions } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { customSession } from 'better-auth/plugins'
import { db } from './db'
import * as schema from './schema'
import { Permission, UserWithPermissions } from './types'

type CustomUser = {
  id: string
  email: string
  name?: string
  role: 'user' | 'admin'
  permissions: string | Record<string, Permission[]>
}

const options = {
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema: {
      ...schema,
      users: schema.user,
      accounts: schema.account,
      sessions: schema.session,
    },
  }),
  emailAndPassword: {
    enabled: true,
  },
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // 5 minutos de caché
    },
  },
  user: {
    additionalFields: {
      role: {
        type: 'string',
        input: false,
      },
      permissions: {
        type: 'string',
        input: false,
      },
    },
  },
} satisfies BetterAuthOptions

export const auth = betterAuth({
  ...options,
  plugins: [
    customSession(async ({ user, session }) => {
      const customUser = user as unknown as CustomUser
      console.log('Raw user from DB:', customUser)

      let permissions: Record<string, Permission[]> = {}

      if (typeof customUser.permissions === 'string') {
        try {
          permissions = JSON.parse(customUser.permissions)
        } catch (e) {
          console.error('Error parsing permissions:', e)
        }
      } else {
        permissions = customUser.permissions as Record<string, Permission[]>
      }

      console.log('Parsed permissions:', permissions)

      return {
        ...session,
        user: {
          id: customUser.id,
          email: customUser.email,
          name: customUser.name,
          role: customUser.role,
          permissions,
        } as UserWithPermissions,
      }
    }),
  ],
})
