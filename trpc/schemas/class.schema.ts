import { ClassStatus, StudentGrade } from '@/lib/generated/prisma'
import { zStringEmptyOptional } from '@/lib/zod-utils'
import z from 'zod'

export const createClassSchema = z.object({
  namaKelas: z.string().min(1, 'Nama kelas wajib diisi'),
  tingkat: z.enum(StudentGrade, {
    message: 'Tingkat kelas wajib diisi',
  }),
  ruang: zStringEmptyOptional(z.string()),
  status: z
    .enum(ClassStatus, {
      message: 'Status kelas wajib diisi',
    })
    .optional(),
  isLast: z.boolean().default(false).optional(),
  waliKelasId: zStringEmptyOptional(z.string()),
  studentIds: z.array(z.cuid('ID siswa tidak valid')).optional(),
})

export const updateClassSchema = createClassSchema.partial().extend({
  classId: z.cuid('ID kelas tidak valid'),
})

export const getAvailableClassesSchema = zStringEmptyOptional(z.string())

export const getClassByIdSchema = z.object({
  classId: z.string(),
})

export const deleteClassSchema = z.object({
  classId: z.cuid('ID kelas tidak valid'),
})

export const markAsPassedSchema = z.object({
  classId: z.cuid('ID kelas tidak valid'),
  promotedClassId: zStringEmptyOptional(z.string()),
})

export type CreateClassSchema = z.infer<typeof createClassSchema>
export type UpdateClassSchema = z.infer<typeof updateClassSchema>
export type DeleteClassSchema = z.infer<typeof deleteClassSchema>
export type MarkAsPassedSchema = z.infer<typeof markAsPassedSchema>
