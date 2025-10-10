import { ClassStatus, StudentGrade } from "@/lib/generated/prisma";
import z from "zod";

export const createClassSchema = z.object({
  namaKelas: z.string().min(1, "Nama kelas wajib diisi"),
  tingkat: z.enum(StudentGrade, {
    message: "Tingkat kelas wajib diisi",
  }),
  ruang: z.string().optional(),
  status: z
    .enum(ClassStatus, {
      message: "Status kelas wajib diisi",
    })
    .optional(),
  isLast: z.boolean().default(false).optional(),
  waliKelasId: z.cuid("ID guru tidak valid").optional(),
  studentIds: z.array(z.cuid("ID siswa tidak valid")).optional(),
});

export const updateClassSchema = createClassSchema.partial().extend({
  classId: z.cuid("ID kelas tidak valid"),
});

export const getAvailableClassesSchema = z.string().optional();

export const getClassByIdSchema = z.object({
  classId: z.string(),
});

export const deleteClassSchema = z.object({
  classId: z.cuid("ID kelas tidak valid"),
});

export const markAsPassedSchema = z.object({
  classId: z.cuid("ID kelas tidak valid"),
  promotedClassId: z.string().optional(),
});

export type CreateClassSchema = z.infer<typeof createClassSchema>;
export type UpdateClassSchema = z.infer<typeof updateClassSchema>;
export type DeleteClassSchema = z.infer<typeof deleteClassSchema>;
export type MarkAsPassedSchema = z.infer<typeof markAsPassedSchema>;
