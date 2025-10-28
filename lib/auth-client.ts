import { createAuthClient } from 'better-auth/react'
import { usernameClient, adminClient } from 'better-auth/client/plugins'
import { ac, admin, student, teacher } from './permissions'

export const authClient = createAuthClient({
  plugins: [
    usernameClient(),
    adminClient({
      ac,
      roles: {
        admin,
        student,
        teacher,
      },
    }),
  ],
})

export type Session = typeof authClient.$Infer.Session
