import { Gender, StudentStatus } from "@/lib/generated/prisma";
import z from "zod";

export const createStudentSchema = z.object({
  nama: z.string().min(1, "Name wajib diisi"),
  nisn: z
    .string()
    .regex(/^\d+$/, "NISN hanya boleh berisi angka")
    .min(10, "NISN harus memiliki 10 digit")
    .max(10, "NISN harus memiliki 10 digit"),
  tanggalLahir: z.date("Tanggal lahir wajib diisi"),
  jenisKelamin: z.enum(Gender, {
    message: "Jenis kelamin wajib diisi",
  }),
  alamat: z.string().min(1, "Alamat wajib diisi"),
  nomorTelepon: z.string().min(1, "Nomor telepon wajib diisi"),
  status: z.enum(StudentStatus, {
    message: "Status wajib diisi",
  }),
});

export const deleteStudentSchema = z.object({
  studentId: z.cuid("ID siswa wajib diisi"),
});

export const updateStudentSchema = createStudentSchema.partial().extend({
  studentId: z.cuid("ID siswa wajib diisi"),
});
