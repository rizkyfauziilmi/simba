import { generateKodeMatpel } from '@/lib/string'
import { adminProcedure, createTRPCRouter, teacherProcedure } from '../init'
import {
  createSubjectSchema,
  deleteSubjectSchema,
  updateSubjectSchema,
} from '../schemas/subject.schema'
import { TRPCError } from '@trpc/server'
import { timeStringToSeconds } from '@/lib/time'

export const subjectRouter = createTRPCRouter({
  getAllSubjects: adminProcedure.query(async ({ ctx }) => {
    const subjects = await ctx.db.subject.findMany({
      include: {
        _count: {
          select: {
            schedules: true,
          },
        },
      },
    })
    return subjects
  }),
  getTeacherSchedules: teacherProcedure.query(async ({ ctx }) => {
    const jadwalMengajar = await ctx.db.classSchedule.findMany({
      where: {
        guruPengampuId: ctx.session.teacherId,
        kelas: {
          status: 'AKTIF',
        },
      },
      select: {
        hari: true,
        jamMulai: true,
        jamSelesai: true,
        kelas: {
          select: {
            namaKelas: true,
            tingkat: true,
            ruang: true,
          },
        },
        subject: {
          select: {
            nama: true,
            kode: true,
          },
        },
      },
    })

    return jadwalMengajar
  }),
  getSubjectById: adminProcedure.input(deleteSubjectSchema).query(async ({ ctx, input }) => {
    const { subjectId: id } = input

    const subject = await ctx.db.subject.findUnique({
      where: { id },
      include: {
        schedules: {
          include: {
            kelas: {
              select: {
                namaKelas: true,
                ruang: true,
              },
            },
            guruPengampu: {
              select: {
                nama: true,
              },
            },
          },
          orderBy: [{ hari: 'asc' }, { jamMulai: 'asc' }],
        },
      },
    })

    return subject
  }),
  createSubject: adminProcedure.input(createSubjectSchema).mutation(async ({ ctx, input }) => {
    const { nama, deskripsi, schedules } = input

    // validasi bentrok di database
    for (const schedule of schedules) {
      const { hari, jamMulai, jamSelesai, kelasId, guruPengampuId } = schedule

      const start = timeStringToSeconds(jamMulai)
      const end = timeStringToSeconds(jamSelesai)

      if (start >= end) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: `Jam mulai (${jamMulai}) harus lebih awal dari jam selesai (${jamSelesai})`,
        })
      }

      // === Cek bentrok di kelas ===
      const existingClassSchedules = await ctx.db.classSchedule.findMany({
        where: {
          kelasId,
          hari,
        },
      })

      for (const existing of existingClassSchedules) {
        const existingStart = timeStringToSeconds(existing.jamMulai)
        const existingEnd = timeStringToSeconds(existing.jamSelesai)

        const isOverlap = start < existingEnd && end > existingStart

        if (isOverlap) {
          throw new TRPCError({
            code: 'CONFLICT',
            message:
              `Jadwal bentrok di kelas pada hari ${hari}: ` +
              `${jamMulai}-${jamSelesai} bertabrakan dengan ${existing.jamMulai}-${existing.jamSelesai}`,
          })
        }
      }

      // === Cek bentrok guru (jika ada) ===
      if (guruPengampuId) {
        const existingGuruSchedules = await ctx.db.classSchedule.findMany({
          where: {
            guruPengampuId,
            hari,
          },
        })

        for (const existing of existingGuruSchedules) {
          const existingStart = timeStringToSeconds(existing.jamMulai)
          const existingEnd = timeStringToSeconds(existing.jamSelesai)

          const isOverlap = start < existingEnd && end > existingStart

          if (isOverlap) {
            throw new TRPCError({
              code: 'CONFLICT',
              message:
                `Jadwal bentrok guru pada hari ${hari}: ` +
                `${jamMulai}-${jamSelesai} bertabrakan dengan ` +
                `${existing.jamMulai}-${existing.jamSelesai}`,
            })
          }
        }
      }
    }

    await ctx.db.subject.create({
      data: {
        nama,
        kode: generateKodeMatpel(nama),
        deskripsi,
        schedules: {
          create: schedules.map(schedule => ({
            id: schedule.id,
            hari: schedule.hari,
            jamMulai: schedule.jamMulai,
            jamSelesai: schedule.jamSelesai,
            guruPengampuId: schedule.guruPengampuId,
            kelasId: schedule.kelasId,
          })),
        },
      },
    })

    return {
      message: 'Berhasil membuat mata pelajaran',
    }
  }),
  updateSubject: adminProcedure.input(updateSubjectSchema).mutation(async ({ ctx, input }) => {
    const { id, nama, deskripsi, schedules } = input

    const subject = await ctx.db.subject.findUnique({
      where: { id },
      select: {
        id: true,
      },
    })

    if (!subject) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Mata pelajaran tidak ditemukan',
      })
    }

    // If schedules are provided, validate and replace
    if (schedules) {
      for (const schedule of schedules) {
        const { hari, jamMulai, jamSelesai, kelasId, guruPengampuId } = schedule
        const start = timeStringToSeconds(jamMulai)
        const end = timeStringToSeconds(jamSelesai)

        if (start >= end) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: `Jam mulai (${jamMulai}) harus lebih awal dari jam selesai (${jamSelesai})`,
          })
        }

        // === Cek bentrok di kelas ===
        const existingClassSchedules = await ctx.db.classSchedule.findMany({
          where: {
            kelasId,
            hari,
            NOT: { id: schedule.id },
          },
        })

        for (const existing of existingClassSchedules) {
          const existingStart = timeStringToSeconds(existing.jamMulai)
          const existingEnd = timeStringToSeconds(existing.jamSelesai)

          const isOverlap = start < existingEnd && end > existingStart

          if (isOverlap) {
            throw new TRPCError({
              code: 'CONFLICT',
              message:
                `Jadwal bentrok di kelas pada hari ${hari}: ` +
                `${jamMulai}-${jamSelesai} bertabrakan dengan ${existing.jamMulai}-${existing.jamSelesai}`,
            })
          }
        }

        // === Cek bentrok guru (jika ada) ===
        if (guruPengampuId) {
          const existingGuruSchedules = await ctx.db.classSchedule.findMany({
            where: {
              guruPengampuId,
              hari,
              NOT: { id: schedule.id },
            },
          })

          for (const existing of existingGuruSchedules) {
            const existingStart = timeStringToSeconds(existing.jamMulai)
            const existingEnd = timeStringToSeconds(existing.jamSelesai)

            const isOverlap = start < existingEnd && end > existingStart

            if (isOverlap) {
              throw new TRPCError({
                code: 'CONFLICT',
                message:
                  `Jadwal bentrok guru pada hari ${hari}: ` +
                  `${jamMulai}-${jamSelesai} bertabrakan dengan ` +
                  `${existing.jamMulai}-${existing.jamSelesai}`,
              })
            }
          }
        }
      }
    }

    await ctx.db.subject.update({
      where: { id },
      data: {
        ...(nama && { nama, kode: generateKodeMatpel(nama) }),
        ...(deskripsi && { deskripsi }),
        ...(schedules && {
          schedules: {
            deleteMany: {}, // delete all existing schedules
            create: schedules.map(schedule => ({
              id: schedule.id,
              hari: schedule.hari,
              jamMulai: schedule.jamMulai,
              jamSelesai: schedule.jamSelesai,
              guruPengampuId: schedule.guruPengampuId,
              kelasId: schedule.kelasId,
            })),
          },
        }),
      },
    })

    return {
      message: 'Berhasil mengupdate mata pelajaran',
    }
  }),

  deleteSubject: adminProcedure.input(deleteSubjectSchema).mutation(async ({ ctx, input }) => {
    const { subjectId: id } = input

    const subject = await ctx.db.subject.findUnique({
      where: { id },
      select: {
        id: true,
      },
    })

    if (!subject) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Mata pelajaran tidak ditemukan',
      })
    }

    await ctx.db.subject.delete({
      where: { id },
    })

    return {
      message: 'Berhasil menghapus mata pelajaran',
    }
  }),
})
