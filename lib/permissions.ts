import { createAccessControl } from 'better-auth/plugins/access'
import { defaultStatements, adminAc, userAc } from 'better-auth/plugins/admin/access'

const statement = {
  ...defaultStatements,
} as const

export const ac = createAccessControl(statement)

export const admin = ac.newRole({
  ...adminAc.statements,
})

export const student = ac.newRole({
  ...userAc.statements,
})

export const teacher = ac.newRole({
  ...userAc.statements,
})
