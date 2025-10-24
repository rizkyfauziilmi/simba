import { TRPCError } from "@trpc/server";
import { adminProcedure, createTRPCRouter } from "../init";
import {
  createTeacherSchema,
  deleteTeacherSchema,
  getNotHomeRoomTeachersSchema,
  getTeacherSchema,
  updateTeacherSchema,
} from "../schemas/teacher.schema";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export const teacherRouter = createTRPCRouter({
  getAllTeachers: adminProcedure.query(async ({ ctx }) => {
    const teachers = await ctx.db.teacher.findMany({
      include: {
        user: {
          select: {
            image: true,
          },
        },
      },
    });
    return teachers;
  }),
  getActiveTeachers: adminProcedure.query(async ({ ctx }) => {
    const teachers = await ctx.db.teacher.findMany({
      where: {
        status: "AKTIF",
      },
    });

    return teachers;
  }),
  getNotHomeRoomTeachers: adminProcedure
    .input(getNotHomeRoomTeachersSchema)
    .query(async ({ ctx, input: currentClassId }) => {
      const teachers = await ctx.db.teacher.findMany({
        where: {
          NOT: {
            OR: [{ status: "KELUAR" }, { status: "PENSIUN" }],
          },
          OR: currentClassId
            ? [
                {
                  waliKelas: null,
                },
                {
                  waliKelas: {
                    id: currentClassId,
                  },
                },
              ]
            : [
                {
                  waliKelas: null,
                },
              ],
        },
        select: {
          nama: true,
          id: true,
          nip: true,
        },
      });

      return teachers;
    }),
  getTeacherById: adminProcedure
    .input(getTeacherSchema)
    .query(async ({ ctx, input }) => {
      const { teacherId } = input;

      const teacher = await ctx.db.teacher.findUnique({
        where: {
          id: teacherId,
        },
        include: {
          waliKelas: {
            select: {
              namaKelas: true,
              tingkat: true,
              ruang: true,
            },
          },
          ClassSchedule: {
            select: {
              hari: true,
              jamMulai: true,
              jamSelesai: true,
              subject: {
                select: {
                  nama: true,
                },
              },
              kelas: {
                select: {
                  namaKelas: true,
                  ruang: true,
                },
              },
            },
            orderBy: [{ hari: "asc" }, { jamMulai: "asc" }],
          },
        },
      });

      return teacher;
    }),
  createTeacher: adminProcedure
    .input(createTeacherSchema)
    .mutation(async ({ ctx, input }) => {
      const { nama, nip } = input;

      const isNipExists = await ctx.db.teacher.findFirst({
        where: {
          nip,
        },
        select: {
          id: true,
        },
      });

      if (isNipExists) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "NIP sudah digunakan",
        });
      }

      const namaFormatted = nama.toLowerCase().replace(/\s/g, "");

      const newUserTeacher = await auth.api.createUser({
        body: {
          email: `${namaFormatted}@example.com`,
          password: `${namaFormatted}@1234`,
          name: nama,
          role: "teacher",
          data: {
            username: namaFormatted,
            displayUsername: nama,
          },
        },
      });

      await ctx.db.teacher.create({
        data: {
          ...input,
          userId: newUserTeacher.user.id,
        },
      });

      return {
        message: "Guru berhasil ditambahkan",
      };
    }),
  deleteTeacher: adminProcedure
    .input(deleteTeacherSchema)
    .mutation(async ({ ctx, input }) => {
      const { teacherId } = input;

      const teacher = await ctx.db.teacher.findUnique({
        where: {
          id: teacherId,
        },
        select: {
          id: true,
          userId: true,
        },
      });

      if (!teacher) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Guru tidak ditemukan",
        });
      }

      await ctx.db.teacher.delete({
        where: {
          id: teacher.id,
        },
      });

      await auth.api.removeUser({
        body: {
          userId: teacher.userId,
        },
        headers: await headers(),
      });

      return {
        message: "Guru berhasil dihapus",
      };
    }),
  updateTeacher: adminProcedure
    .input(updateTeacherSchema)
    .mutation(async ({ ctx, input }) => {
      const { teacherId, ...data } = input;

      const teacher = await ctx.db.teacher.findUnique({
        where: {
          id: teacherId,
        },
        select: {
          userId: true,
          user: {
            select: {
              email: true,
            },
          },
        },
      });

      if (!teacher) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Guru tidak ditemukan",
        });
      }

      await ctx.db.teacher.update({
        where: {
          id: teacherId,
        },
        data,
      });

      return {
        message: "Guru berhasil diperbarui",
      };
    }),
});
