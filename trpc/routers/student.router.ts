import { auth } from "@/lib/auth";
import { adminProcedure, createTRPCRouter } from "../init";
import {
  createStudentSchema,
  deleteStudentSchema,
  getAllStudentsWithNoClassSchema,
  getStudentSchema,
  updateStudentSchema,
} from "../schemas/student.schema";
import { TRPCError } from "@trpc/server";
import { headers } from "next/headers";

export const studentRouter = createTRPCRouter({
  getAllStudents: adminProcedure.query(async ({ ctx }) => {
    const students = await ctx.db.student.findMany();
    return students;
  }),
  getAllStudentsWithNoClass: adminProcedure
    .input(getAllStudentsWithNoClassSchema)
    .query(async ({ ctx, input: currentClassId }) => {
      const students = await ctx.db.student.findMany({
        where: {
          OR: currentClassId
            ? [
                {
                  kelasId: null,
                },
                {
                  kelasId: currentClassId,
                },
              ]
            : [
                {
                  kelasId: null,
                },
              ],
          status: "AKTIF",
        },
        select: {
          nama: true,
          nisn: true,
          id: true,
        },
      });
      return students;
    }),
  getStudentById: adminProcedure
    .input(getStudentSchema)
    .query(async ({ ctx, input }) => {
      const { studentId } = input;

      const student = await ctx.db.student.findUnique({
        where: {
          id: studentId,
        },
      });

      return student;
    }),
  createStudent: adminProcedure
    .input(createStudentSchema)
    .mutation(async ({ ctx, input }) => {
      const { nama, nisn } = input;

      const isNisnExists = await ctx.db.student.findFirst({
        where: {
          nisn,
        },
        select: {
          id: true,
        },
      });

      if (isNisnExists) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "NISN sudah digunakan",
        });
      }

      const namaFormatted = nama.toLowerCase().replace(/\s/g, "");

      const newUserStudent = await auth.api.createUser({
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

      await ctx.db.student.create({
        data: {
          nama: input.nama,
          nisn: input.nisn,
          tanggalLahir: input.tanggalLahir,
          jenisKelamin: input.jenisKelamin,
          alamat: input.alamat,
          noTelepon: input.noTelepon,
          status: input.status,
          kelasId: input.kelasId || null,
          userId: newUserStudent.user.id,
        },
      });

      return {
        message: "Siswa berhasil ditambahkan",
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

      await auth.api.removeUser({
        body: {
          userId: student.userId,
        },
        headers: await headers(),
      });

      return {
        message: "Siswa berhasil dihapus",
      };
    }),
  updateStudent: adminProcedure
    .input(updateStudentSchema)
    .mutation(async ({ ctx, input }) => {
      const { studentId, kelasId, ...data } = input;

      const student = await ctx.db.student.findUnique({
        where: {
          id: studentId,
        },
        select: {
          id: true,
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
        data: {
          ...data,
          kelasId: kelasId || null,
        },
      });

      return {
        message: "Data siswa berhasil diperbarui",
      };
    }),
});
