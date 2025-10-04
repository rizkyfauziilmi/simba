import { Gender, TeacherStatus } from "@/lib/generated/prisma";
import z from "zod";

export const createTeacherSchema = z.object({
  nama: z.string().min(1, "Nama wajib diisi"),
  // terdiri dari 18 digit angka yang tidak terpisahkan
  // dan tidak menggunakan tanda baca seperti titik atau spasi
  nip: z
    .string()
    .regex(
      /^\d{18}$/,
      "NIP harus memiliki 18 digit angka tanpa spasi atau tanda baca",
    )
    .min(18, "NIP wajib diisi")
    .max(18, "NIP harus memiliki 18 digit angka"),
  jenisKelamin: z.enum(Gender, {
    message: "Jenis kelamin wajib diisi",
  }),
  tanggalLahir: z.date("Tanggal lahir wajib diisi"),
  alamat: z.string().optional(),
  email: z.email("Email tidak valid").optional(),
  noTelepon: z
    .string()
    .regex(
      /^(?:\+62|62|0)8[1-9][0-9]{6,10}$/,
      "No. HP/WA harus berupa nomor Indonesia yang valid",
    )
    .min(1, "No. HP/WA harus diisi")
    .optional(),
  tanggalMasuk: z.date("Tanggal masuk wajib diisi"),
});

export const deleteTeacherSchema = z.object({
  teacherId: z.cuid("ID guru wajib diisi"),
});

export const getTeacherSchema = z.object({
  teacherId: z.string("ID guru wajib diisi"),
});

export const updateTeacherSchema = createTeacherSchema.partial().extend({
  teacherId: z.cuid("ID guru wajib diisi"),
  status: z.enum(TeacherStatus).optional(),
});
