import { createTRPCRouter } from '../init'
import { classRouter } from './class.router'
import { financeRouter } from './finance.router'
import { roleDataRouter } from './role-data.router'
import { studentRouter } from './student.router'
import { subjectRouter } from './subject.router'
import { teacherRouter } from './teacher.router'

export const appRouter = createTRPCRouter({
  student: studentRouter,
  teacher: teacherRouter,
  class: classRouter,
  finance: financeRouter,
  subject: subjectRouter,
  roleData: roleDataRouter,
})

// export type definition of API
export type AppRouter = typeof appRouter
