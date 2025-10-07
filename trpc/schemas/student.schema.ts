import { Gender, StudentStatus } from "@/lib/generated/prisma";
import z from "zod";

export const createStudentSchema = z.object({
  nama: z.string().min(1, "Name wajib diisi"),
  // terdiri dari 10 digit angka
  nisn: z
    .string()
    .regex(/^[0-9]{10}$/, "NISN harus terdiri dari 10 digit angka")
    .min(1, "NISN wajib diisi")
    .max(10, "NISN harus terdiri dari 10 digit angka"),
  tanggalLahir: z.date("Tanggal lahir wajib diisi"),
  jenisKelamin: z.enum(Gender, {
    message: "Jenis kelamin wajib diisi",
  }),
  alamat: z.string().min(1, "Alamat wajib diisi"),
  noTelepon: z
    .string()
    .regex(
      /^(?:\+62|62|0)8[1-9][0-9]{6,10}$/,
      "No. HP/WA harus berupa nomor Indonesia yang valid",
    )
    .min(1, "No. HP/WA harus diisi"),
  status: z
    .enum(StudentStatus, {
      message: "Status siswa wajib diisi",
    })
    .optional(),
  kelasId: z.string().optional(),
});

export const deleteStudentSchema = z.object({
  studentId: z.cuid("ID siswa tidak valid"),
});

export const getStudentSchema = z.object({
  studentId: z.string("ID siswa tidak valid"),
});

export const updateStudentSchema = createStudentSchema.partial().extend({
  studentId: z.cuid("ID siswa tidak valid"),
});
