import { adminProcedure, createTRPCRouter } from "../init";
import {
  createClassSchema,
  deleteClassSchema,
  getAvailableClassesSchema,
  updateClassSchema,
} from "../schemas/class.schema";
import { TRPCError } from "@trpc/server";

export const classRouter = createTRPCRouter({
  getAvailableClasses: adminProcedure
    .input(getAvailableClassesSchema)
    .query(async ({ ctx, input }) => {
      const classes = await ctx.db.class.findMany({
        where: {
          OR: [
            {
              id: input.currentClass,
            },
            {
              status: "AKTIF",
            },
          ],
        },
        select: {
          id: true,
          namaKelas: true,
          tingkat: true,
        },
        orderBy: {
          tingkat: "asc",
        },
      });
      return classes;
    }),
  getUnassignedHomeroomClasses: adminProcedure.query(async ({ ctx }) => {
    const classes = await ctx.db.class.findMany({
      where: {
        waliKelasId: null,
      },
      select: {
        id: true,
        namaKelas: true,
        tingkat: true,
      },
      orderBy: {
        tingkat: "asc",
      },
    });

    return classes;
  }),
  getAllClasses: adminProcedure.query(async ({ ctx }) => {
    const classes = await ctx.db.class.findMany({
      include: {
        waliKelas: {
          select: {
            nama: true,
          },
        },
        _count: {
          select: {
            students: true,
          },
        },
      },
      orderBy: {
        tingkat: "asc",
      },
    });
    return classes;
  }),
  createClass: adminProcedure
    .input(createClassSchema)
    .mutation(async ({ ctx, input }) => {
      const { waliKelasId, studentIds } = input;

      if (waliKelasId) {
        const isWaliKelasExists = await ctx.db.class.findFirst({
          where: {
            waliKelasId,
          },
          select: {
            id: true,
          },
        });

        if (isWaliKelasExists) {
          throw new TRPCError({
            code: "CONFLICT",
            message: "Guru tersebut sudah menjadi wali kelas",
          });
        }

        const homeroomTeacher = await ctx.db.teacher.findUnique({
          where: {
            id: waliKelasId,
          },
          select: {
            status: true,
          },
        });

        if (
          !homeroomTeacher ||
          homeroomTeacher.status === "KELUAR" ||
          homeroomTeacher.status === "PENSIUN"
        ) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message:
              "Wali tidak ditemukan atau sudah tidak aktif, mohon ubah status wali terlebih dahulu",
          });
        }
      }

      let filteredStudentIds: string[] = [];
      if (studentIds) {
        // filter studentIds to only include those not already assigned to a class and valid students in the database
        const existingStudents = await ctx.db.student.findMany({
          where: {
            id: {
              in: studentIds,
            },
            status: "AKTIF",
            kelasId: null,
          },
          select: {
            id: true,
          },
        });

        const existingStudentIds = existingStudents.map((s) => s.id);
        filteredStudentIds = studentIds.filter((id) =>
          existingStudentIds.includes(id),
        );
      }

      await ctx.db.class.create({
        data: {
          namaKelas: input.namaKelas,
          tingkat: input.tingkat,
          ruang: input.ruang,
          status: input.status,
          waliKelasId: input.waliKelasId,
          students: studentIds
            ? {
                connect: filteredStudentIds.map((id) => ({ id })),
              }
            : undefined,
        },
      });

      return {
        message: "Kelas berhasil dibuat",
      };
    }),
  deleteClass: adminProcedure
    .input(deleteClassSchema)
    .mutation(async ({ ctx, input }) => {
      const { classId } = input;

      const kelas = await ctx.db.class.findUnique({
        where: {
          id: classId,
        },
        select: {
          id: true,
        },
      });

      if (!kelas) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Kelas tidak ditemukan",
        });
      }

      await ctx.db.class.delete({
        where: {
          id: kelas.id,
        },
      });

      return {
        message: "Kelas berhasil dihapus",
      };
    }),
  updateClass: adminProcedure
    .input(updateClassSchema)
    .mutation(async ({ ctx, input }) => {
      const { classId, namaKelas, tingkat, ruang, status, waliKelasId } = input;

      const kelas = await ctx.db.class.findUnique({
        where: {
          id: classId,
        },
        select: {
          id: true,
          waliKelasId: true,
        },
      });

      if (!kelas) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Kelas tidak ditemukan",
        });
      }

      if (waliKelasId && waliKelasId !== kelas.waliKelasId) {
        const isWaliKelasExists = await ctx.db.class.findFirst({
          where: {
            waliKelasId,
            NOT: {
              id: classId,
            },
          },
          select: {
            id: true,
          },
        });

        if (isWaliKelasExists) {
          throw new TRPCError({
            code: "CONFLICT",
            message: "Guru tersebut sudah menjadi wali kelas",
          });
        }

        const homeroomTeacher = await ctx.db.teacher.findUnique({
          where: {
            id: waliKelasId,
          },
          select: {
            status: true,
          },
        });

        if (
          !homeroomTeacher ||
          homeroomTeacher.status === "KELUAR" ||
          homeroomTeacher.status === "PENSIUN"
        ) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message:
              "Wali tidak ditemukan atau sudah tidak aktif, mohon ubah status wali terlebih dahulu",
          });
        }
      }

      let filteredStudentIds: string[] = [];
      if (input.studentIds) {
        // filter studentIds to only include those not already assigned to a class and valid students in the database
        const existingStudents = await ctx.db.student.findMany({
          where: {
            id: {
              in: input.studentIds,
            },
            status: "AKTIF",
            OR: [
              { kelasId: null },
              { kelasId: classId }, // include students already in this class
            ],
          },
          select: {
            id: true,
          },
        });

        const existingStudentIds = existingStudents.map((s) => s.id);
        filteredStudentIds = input.studentIds.filter((id) =>
          existingStudentIds.includes(id),
        );
      }

      // disconnect all students currently in the class if studentIds is provided
      if (input.studentIds) {
        await ctx.db.student.updateMany({
          where: {
            kelasId: classId,
          },
          data: {
            kelasId: null,
          },
        });
      }

      // connect the filtered students to the class
      if (input.studentIds && filteredStudentIds.length > 0) {
        await ctx.db.student.updateMany({
          where: {
            id: {
              in: filteredStudentIds,
            },
          },
          data: {
            kelasId: classId,
          },
        });
      }

      await ctx.db.class.update({
        where: {
          id: kelas.id,
        },
        data: {
          namaKelas,
          tingkat,
          ruang,
          status,
          waliKelasId,
        },
      });

      return {
        message: "Kelas berhasil diupdate",
      };
    }),
});
