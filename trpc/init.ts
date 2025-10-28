import { auth } from '@/lib/auth'
import { initTRPC, TRPCError } from '@trpc/server'
import { headers } from 'next/headers'
import { cache } from 'react'
import db from '@/lib/db'
import superjson from 'superjson'
import { ZodError } from 'zod'

export const createTRPCContext = cache(async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  return {
    db,
    session,
  }
})

const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError: error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    }
  },
})

// Base router and procedure helpers
export const createTRPCRouter = t.router
export const createCallerFactory = t.createCallerFactory

/**
 * Middleware for timing procedure execution and adding an artificial delay in development.
 *
 * You can remove this if you don't like it, but it can help catch unwanted waterfalls by simulating
 * network latency that would occur in production but not in local development.
 */
const timingMiddleware = t.middleware(async ({ next, path }) => {
  const start = Date.now()

  if (t._config.isDev) {
    // artificial delay in dev
    const waitMs = Math.floor(Math.random() * 400) + 100
    await new Promise(resolve => setTimeout(resolve, waitMs))
  }

  const result = await next()

  const end = Date.now()
  console.log(`[TRPC] ${path} took ${end - start}ms to execute`)

  return result
})

export const publicProcedure = t.procedure.use(timingMiddleware)

export const protectedProcedure = t.procedure.use(timingMiddleware).use(({ ctx, next }) => {
  if (!ctx.session?.user) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'Kamu harus login untuk mengakses sumber daya ini.',
    })
  }

  return next({
    ctx: {
      session: { ...ctx.session, user: ctx.session.user },
    },
  })
})

export const adminProcedure = t.procedure.use(timingMiddleware).use(({ ctx, next }) => {
  if (!ctx.session?.user) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'Kamu harus login untuk mengakses sumber daya ini.',
    })
  }

  if (ctx.session.user.role !== 'admin') {
    throw new TRPCError({
      code: 'FORBIDDEN',
      message: 'Kamu harus admin untuk menggunakan fitur ini.',
    })
  }

  return next({
    ctx: {
      session: { ...ctx.session, user: ctx.session.user },
    },
  })
})

export const teacherProcedure = t.procedure.use(timingMiddleware).use(async ({ ctx, next }) => {
  if (!ctx.session?.user) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'Kamu harus login untuk mengakses sumber daya ini.',
    })
  }

  const teacher = await ctx.db.teacher.findUnique({
    where: {
      userId: ctx.session.user.id,
    },
    select: {
      id: true,
    },
  })

  if (!teacher || ctx.session.user.role !== 'teacher') {
    throw new TRPCError({
      code: 'FORBIDDEN',
      message: 'Kamu harus guru untuk menggunakan fitur ini.',
    })
  }

  return next({
    ctx: {
      session: {
        ...ctx.session,
        user: ctx.session.user,
        teacherId: teacher.id,
      },
    },
  })
})

export const studentProcedure = t.procedure.use(timingMiddleware).use(async ({ ctx, next }) => {
  if (!ctx.session?.user) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'Kamu harus login untuk mengakses sumber daya ini.',
    })
  }

  const student = await ctx.db.student.findUnique({
    where: {
      userId: ctx.session.user.id,
    },
    select: {
      id: true,
    },
  })

  if (!student || ctx.session.user.role !== 'student') {
    throw new TRPCError({
      code: 'FORBIDDEN',
      message: 'Kamu harus siswa untuk menggunakan fitur ini.',
    })
  }

  return next({
    ctx: {
      session: {
        ...ctx.session,
        user: ctx.session.user,
        studentId: student.id,
      },
    },
  })
})
