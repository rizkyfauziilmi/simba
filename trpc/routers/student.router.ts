import { auth } from "@/lib/auth";
import { adminProcedure, createTRPCRouter } from "../init";
import {
  createStudentSchema,
  deleteStudentSchema,
  updateStudentSchema,
} from "../schemas/student.schema";
import { TRPCError } from "@trpc/server";
import { headers } from "next/headers";

export const studentRouter = createTRPCRouter({
  getAllStudents: adminProcedure.query(async ({ ctx }) => {
    const students = await ctx.db.student.findMany();
    return students;
  }),
  createStudent: adminProcedure
    .input(createStudentSchema)
    .mutation(async ({ ctx, input }) => {
      const {
        alamat,
        jenisKelamin,
        nama,
        nisn,
        nomorTelepon,
        status,
        tanggalLahir,
      } = input;

      const isNisnExists = await ctx.db.student.findFirst({
        where: {
          nisn,
        },
      });

      if (isNisnExists) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "NISN sudah digunakan",
        });
      }

      const namaFormatted = nama.toLowerCase().replace(/\s/g, "");

      let newUserStudent;
      try {
        newUserStudent = await auth.api.createUser({
          body: {
            email: `${namaFormatted}@example.com`,
            password: `${namaFormatted}@1234`,
            name: nama,
            role: "student",
            data: {
              username: namaFormatted,
              displayUsername: nama,
            },
          },
        });
      } catch {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Gagal membuat siswa baru",
        });
      }

      await ctx.db.student.create({
        data: {
          alamat,
          jenisKelamin,
          nama,
          nisn,
          nomorTelepon,
          status,
          tanggalLahir,
          userId: newUserStudent.user.id,
        },
        select: {
          id: true,
        },
      });

      return {
        message: "Siswa berhasil dibuat",
      };
    }),
  deleteStudent: adminProcedure
    .input(deleteStudentSchema)
    .mutation(async ({ ctx, input }) => {
      const { studentId } = input;

      const student = await ctx.db.student.findUnique({
        where: {
          id: studentId,
        },
        select: {
          id: true,
          userId: true,
        },
      });

      if (!student) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Siswa tidak ditemukan",
        });
      }

      await ctx.db.student.delete({
        where: {
          id: student.id,
        },
      });

      try {
        await auth.api.removeUser({
          body: {
            userId: student.userId,
          },
          headers: await headers(),
        });
      } catch {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Gagal menghapus siswa",
        });
      }

      return {
        message: "Siswa berhasil dihapus",
      };
    }),
  updateStudent: adminProcedure
    .input(updateStudentSchema)
    .mutation(async ({ ctx, input }) => {
      const { studentId, ...data } = input;

      const student = await ctx.db.student.findUnique({
        where: {
          id: studentId,
        },
      });

      if (!student) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Siswa tidak ditemukan",
        });
      }

      await ctx.db.student.update({
        where: {
          id: studentId,
        },
        data,
      });

      return {
        message: "Siswa berhasil diupdate",
      };
    }),
});
