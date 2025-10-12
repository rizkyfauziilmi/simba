import z from "zod";
import { adminProcedure, createTRPCRouter } from "../init";
import { getFinanceSummarySchema } from "../schemas/finance.schema";
import {
  endOfQuarter,
  endOfYear,
  getQuarter,
  startOfQuarter,
  startOfYear,
} from "date-fns";
import { TRPCError } from "@trpc/server";
import { formatIDR } from "@/lib/string";

export const financeRouter = createTRPCRouter({
  getFinanceSummary: adminProcedure
    .input(getFinanceSummarySchema)
    .query(async ({ ctx, input }) => {
      const { startDate, endDate, type, category } = input;

      // Default tanggal ke awal dan akhir tahun jika tidak diset
      const start = startDate ?? startOfYear(new Date());
      const end = endDate ?? endOfYear(new Date());

      // Get atau create school balance
      let balance = await ctx.db.schoolBalance.findFirst({
        where: { id: 1 },
        select: {
          amount: true,
          updatedAt: true,
        },
      });
      if (!balance) {
        balance = await ctx.db.schoolBalance.create({
          data: {
            description: "Initial balance",
            amount: 0,
          },
          select: {
            amount: true,
            updatedAt: true,
          },
        });
      }

      // Build filter dasar
      const baseFilter = {
        date: {
          gte: start,
          lte: end,
        },
        ...(type && { type }),
        ...(category && { category }),
      };

      // Aggregate total pemasukan & pengeluaran (selalu tanpa filter type)
      const [pemasukan, pengeluaran] = await ctx.db.$transaction([
        ctx.db.schoolFinance.aggregate({
          where: {
            ...baseFilter,
            type: "PEMASUKAN",
          },
          _sum: { amount: true },
        }),
        ctx.db.schoolFinance.aggregate({
          where: {
            ...baseFilter,
            type: "PENGELUARAN",
          },
          _sum: { amount: true },
        }),
      ]);

      const totalPemasukan = pemasukan._sum.amount ?? 0;
      const totalPengeluaran = pengeluaran._sum.amount ?? 0;
      const netPeriode = totalPemasukan - totalPengeluaran;

      // Ambil semua record dengan filter dasar
      const records = await ctx.db.schoolFinance.findMany({
        where: baseFilter,
        select: {
          id: true,
          type: true,
          amount: true,
          date: true,
          category: true,
          description: true,
        },
        orderBy: { date: "desc" },
      });

      // Siapkan data kuartal
      const quartals: Record<
        `Q${1 | 2 | 3 | 4}`,
        {
          pemasukan: number;
          pengeluaran: number;
          startDate: Date;
          endDate: Date;
        }
      > = {
        Q1: {
          pemasukan: 0,
          pengeluaran: 0,
          startDate: startOfQuarter(new Date(start.getFullYear(), 0, 1)),
          endDate: endOfQuarter(new Date(start.getFullYear(), 0, 1)),
        },
        Q2: {
          pemasukan: 0,
          pengeluaran: 0,
          startDate: startOfQuarter(new Date(start.getFullYear(), 3, 1)),
          endDate: endOfQuarter(new Date(start.getFullYear(), 3, 1)),
        },
        Q3: {
          pemasukan: 0,
          pengeluaran: 0,
          startDate: startOfQuarter(new Date(start.getFullYear(), 6, 1)),
          endDate: endOfQuarter(new Date(start.getFullYear(), 6, 1)),
        },
        Q4: {
          pemasukan: 0,
          pengeluaran: 0,
          startDate: startOfQuarter(new Date(start.getFullYear(), 9, 1)),
          endDate: endOfQuarter(new Date(start.getFullYear(), 9, 1)),
        },
      };

      // Hitung total per kuartal
      for (const item of records) {
        const q =
          `Q${getQuarter(new Date(item.date))}` as keyof typeof quartals;

        if (item.type === "PEMASUKAN") {
          quartals[q].pemasukan += item.amount;
        } else if (item.type === "PENGELUARAN") {
          quartals[q].pengeluaran += item.amount;
        }
      }

      return {
        balance,
        totalPemasukan,
        totalPengeluaran,
        netPeriode,
        perKuartal: quartals,
        transactions: records,
      };
    }),
  topUpBalance: adminProcedure
    .input(
      z.object({
        amount: z.number().min(1, "Jumlah top up harus lebih dari Rp 0"),
        description: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { amount, description } = input;

      if (amount <= 0) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Jumlah top up harus lebih dari Rp 0",
        });
      }

      // Tambah ke school balance
      const updatedBalance = await ctx.db.$transaction(async (tx) => {
        // Update atau create balance
        const balance = await tx.schoolBalance.upsert({
          where: { id: 1 }, // Asumsi hanya ada satu record
          create: {
            amount: amount,
            description: "Initial balance",
          },
          update: {
            amount: {
              increment: amount,
            },
            updatedAt: new Date(),
          },
          select: {
            amount: true,
            updatedAt: true,
          },
        });

        // Buat record pemasukan
        await tx.schoolFinance.create({
          data: {
            type: "PEMASUKAN",
            amount,
            date: new Date(),
            category: "TOP_UP",
            description,
          },
        });

        return balance;
      });

      return {
        message: `Berhasil melakukan top up saldo sebesar ${formatIDR(updatedBalance.amount)}`,
      };
    }),
});
