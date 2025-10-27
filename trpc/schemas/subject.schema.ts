import { Hari } from "@/lib/generated/prisma";
import { timeStringToSeconds } from "@/lib/time";
import { zStringEmptyOptional } from "@/lib/zod-utils";
import z from "zod";

export const createSubjectSchema = z.object({
  nama: z.string().min(1, "Nama kelas wajib diisi"),
  deskripsi: zStringEmptyOptional(
    z.string().max(255, "Deskripsi maksimal 255 karakter"),
  ),
  schedules: z
    .array(
      z.object({
        id: z.cuid2("ID jadwal tidak valid"),
        hari: z.enum(Hari, {
          message: "Hari wajib diisi",
        }),
        jamMulai: z.string().min(1, "Jam mulai wajib diisi"),
        jamSelesai: z.string().min(1, "Jam selesai wajib diisi"),
        guruPengampuId: zStringEmptyOptional(z.string()),
        kelasId: z.cuid("ID kelas tidak valid"),
      }),
    )
    .superRefine((schedules, ctx) => {
      for (let i = 0; i < schedules.length; i++) {
        const a = schedules[i];
        const aStart = timeStringToSeconds(a.jamMulai);
        const aEnd = timeStringToSeconds(a.jamSelesai);

        for (let j = i + 1; j < schedules.length; j++) {
          const b = schedules[j];

          if (a.hari === b.hari) {
            const bStart = timeStringToSeconds(b.jamMulai);
            const bEnd = timeStringToSeconds(b.jamSelesai);

            const isOverlap = aStart < bEnd && aEnd > bStart;

            if (a.kelasId === b.kelasId && isOverlap) {
              ctx.addIssue({
                code: "custom",
                message: `Jadwal kelas bentrok antara item ke-${i + 1} dan ke-${j + 1}`,
                path: [i, "jamMulai"], // Menunjukkan lokasi error
              });

              ctx.addIssue({
                code: "custom",
                message: `Jadwal kelas bentrok antara item ke-${i + 1} dan ke-${j + 1}`,
                path: [j, "jamMulai"],
              });
            }

            if (
              a.guruPengampuId &&
              b.guruPengampuId &&
              a.guruPengampuId === b.guruPengampuId &&
              isOverlap
            ) {
              ctx.addIssue({
                code: "custom",
                message: `Jadwal guru bentrok antara item ke-${i + 1} dan ke-${j + 1}`,
                path: [i, "jamMulai"],
              });

              ctx.addIssue({
                code: "custom",
                message: `Jadwal guru bentrok antara item ke-${i + 1} dan ke-${j + 1}`,
                path: [j, "jamMulai"],
              });
            }
          }
        }
      }
    }),
});

export const updateSubjectSchema = createSubjectSchema.partial().extend({
  id: z.cuid("ID subjek tidak valid"),
});

export const deleteSubjectSchema = z.object({
  subjectId: z.cuid("ID mata pelajaran tidak valid"),
});

export type CreateSubjectSchema = z.infer<typeof createSubjectSchema>;
export type UpdateSubjectSchema = z.infer<typeof updateSubjectSchema>;
