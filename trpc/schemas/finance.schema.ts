import { FinanceType } from "@/lib/generated/prisma";
import { zStringEmptyOptional } from "@/lib/zod-utils";
import { endOfYear, startOfYear } from "date-fns";
import z from "zod";

export const getFinanceSummarySchema = z.object({
  startDate: z.date().default(startOfYear(new Date())).optional(),
  endDate: z.date().default(endOfYear(new Date())).optional(),
  categories: z.array(z.string()).optional(),
});
export const createTransactionSchema = z.object({
  type: z.enum(FinanceType, {
    message: "Pilih tipe pemasukan atau pengeluaran.",
  }),
  category: z
    .string("Kategori tidak boleh kosong.")
    .min(1, { message: "Kategori harus diisi." }),
  amount: z
    .number("Jumlah tidak valid.")
    .min(1, { message: "Jumlah harus minimal Rp 1." }),
  description: zStringEmptyOptional(z.string()),
  date: z.date("Pilih tanggal transaksi."),
});

export const deleteTransactionSchema = z.object({
  transactionId: z.cuid("ID transaksi tidak valid."),
});

export type CreateTransactionSchema = z.infer<typeof createTransactionSchema>;
