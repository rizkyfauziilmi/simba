import { FinanceType } from "@/lib/generated/prisma";
import { z } from "zod";

// School Balance schemas
export const updateSchoolBalanceSchema = z.object({
  id: z.string().optional(),
  amount: z.number().int().min(0, "Saldo tidak boleh negatif"),
  description: z.string().optional(),
});

// School Finance schemas
export const createSchoolFinanceSchema = z.object({
  type: z.enum(FinanceType, {
    message: "Jenis keuangan tidak valid",
  }),
  category: z.string().min(1, "Kategori harus diisi"),
  amount: z.number().int().min(1, "Jumlah harus lebih dari 0"),
  description: z.string().optional(),
  date: z.date(),
});

export const updateSchoolFinanceSchema = z.object({
  id: z.string(),
  type: z.enum(FinanceType, {
    message: "Jenis keuangan tidak valid",
  }),
  category: z.string().min(1, "Kategori harus diisi"),
  amount: z.number().int().min(1, "Jumlah harus lebih dari 0"),
  description: z.string().optional(),
  date: z.date(),
});

export const getSchoolFinanceSchema = z.object({
  id: z.string(),
});

export const deleteSchoolFinanceSchema = z.object({
  id: z.string(),
});

export const getSchoolFinanceListSchema = z.object({
  page: z.number().int().min(1).optional().default(1),
  limit: z.number().int().min(1).max(100).optional().default(10),
  type: z
    .enum(FinanceType, {
      message: "Jenis keuangan tidak valid",
    })
    .optional(),
  category: z.string().optional(),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  search: z.string().optional(),
});

// Type exports
export type CreateSchoolFinanceSchema = z.infer<
  typeof createSchoolFinanceSchema
>;
export type UpdateSchoolFinanceSchema = z.infer<
  typeof updateSchoolFinanceSchema
>;
export type GetSchoolFinanceSchema = z.infer<typeof getSchoolFinanceSchema>;
export type DeleteSchoolFinanceSchema = z.infer<
  typeof deleteSchoolFinanceSchema
>;
export type GetSchoolFinanceListSchema = z.infer<
  typeof getSchoolFinanceListSchema
>;
export type UpdateSchoolBalanceSchema = z.infer<
  typeof updateSchoolBalanceSchema
>;
