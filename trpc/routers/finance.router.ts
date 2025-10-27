import { adminProcedure, createTRPCRouter } from "../init";
import {
  createTransactionSchema,
  deleteTransactionSchema,
  getFinanceSummarySchema,
} from "../schemas/finance.schema";
import {
  endOfDay,
  endOfMonth,
  endOfQuarter,
  endOfWeek,
  isWithinInterval,
  startOfDay,
  startOfMonth,
  startOfQuarter,
  startOfWeek,
} from "date-fns";
import { TRPCError } from "@trpc/server";
import { formatIDR } from "@/lib/string";
import {
  calendarPeriod,
  generateIntervalDates,
  getIntervalName,
  now,
  Period,
  startOfLastYear,
} from "@/lib/date";

export const financeRouter = createTRPCRouter({
  getFinanceSummary: adminProcedure
    .input(getFinanceSummarySchema)
    .query(async ({ ctx, input }) => {
      const { startDate, endDate, categories } = input;

      const start = startOfDay(startDate ?? startOfLastYear);
      const end = endOfDay(endDate ?? now);

      let balance = await ctx.db.schoolBalance.findFirst({
        where: { id: 1 },
        select: {
          amount: true,
          updatedAt: true,
        },
      });
      // Jika belum ada balance, buat dengan nilai 0
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
        ...(categories && categories.length > 0
          ? { category: { in: categories } }
          : {}),
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

      // cek apakah rentang waktu lebih dari harian, mingguan, bulanan, atau tahunan (gunakan date-fns)
      const periode = calendarPeriod(start, end);

      // buat interval dates berdasarkan periode
      const intervalDates = generateIntervalDates(start, end, periode);

      // Ambil semua record berdasarkan filter
      const records = await ctx.db.schoolFinance.findMany({
        where: {
          ...baseFilter,
        },
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

      type AggregatedFinance = {
        intervalName: string;
        start: Date;
        end: Date;
        totalIncome: number;
        totalExpense: number;
      };

      // Aggregate data berdasarkan interval
      const aggregated: AggregatedFinance[] = [];
      for (let i = 0; i < intervalDates.length; i++) {
        const currentStart = intervalDates[i];

        let range;
        switch (periode) {
          case Period.Daily:
            range = {
              start: startOfDay(currentStart),
              end: endOfDay(currentStart),
            };
            break;
          case Period.Weekly:
            range = {
              start: startOfWeek(currentStart, { weekStartsOn: 1 }),
              end: endOfWeek(currentStart, { weekStartsOn: 1 }),
            };
            break;
          case Period.Monthly:
            range = {
              start: startOfMonth(currentStart),
              end: endOfMonth(currentStart),
            };
            break;
          case Period.Yearly:
            range = {
              start: startOfQuarter(currentStart),
              end: endOfQuarter(currentStart),
            };
            break;
          default:
            range = {
              start: currentStart,
              end: currentStart,
            };
        }

        // Clamp the end of the interval to the requested end date
        if (range.end > end) {
          range.end = end;
        }

        // Clamp the start of the interval to the requested start date (for first interval)
        if (range.start < start) {
          range.start = start;
        }

        const itemsInInterval = records.filter((r) =>
          isWithinInterval(r.date, range),
        );

        const intervalName = getIntervalName(periode, currentStart, range);

        const totalIncome = itemsInInterval
          .filter((r) => r.type === "PEMASUKAN")
          .reduce((sum, r) => sum + r.amount, 0);

        const totalExpense = itemsInInterval
          .filter((r) => r.type === "PENGELUARAN")
          .reduce((sum, r) => sum + r.amount, 0);

        aggregated.push({
          intervalName,
          start: range.start,
          end: range.end,
          totalIncome,
          totalExpense,
        });
      }

      return {
        balance,
        totalPemasukan,
        totalPengeluaran,
        netPeriode,
        financeOverTime: {
          periode,
          data: aggregated,
        },
        transactions: records,
      };
    }),
  createTransaction: adminProcedure
    .input(createTransactionSchema)
    .mutation(async ({ ctx, input }) => {
      const { type, amount, date, description, category } = input;

      // handle masing-masing tipe transaksi
      if (type === "PENGELUARAN") {
        // Jika tipe pengeluaran, cek apakah saldo cukup
        const balance = await ctx.db.schoolBalance.findFirst({
          where: { id: 1 },
          select: { amount: true },
        });

        if (!balance || balance.amount < input.amount) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: `Saldo tidak mencukupi. Saldo saat ini ${formatIDR(
              balance?.amount ?? 0,
            )}.`,
          });
        }

        // Buat transaksi pengeluaran
        await ctx.db.schoolFinance.create({
          data: {
            type: "PENGELUARAN",
            amount,
            date,
            description,
            category,
            userId: ctx.session.user.id,
          },
        });

        // Kurangi saldo
        await ctx.db.schoolBalance.update({
          where: { id: 1 },
          data: {
            amount: {
              decrement: amount,
            },
          },
        });

        return {
          message: "Transaksi pengeluaran berhasil dibuat.",
        };
      } else if (type === "PEMASUKAN") {
        // Buat transaksi pemasukan
        await ctx.db.schoolFinance.create({
          data: {
            type: "PEMASUKAN",
            amount,
            date,
            description,
            category,
            userId: ctx.session.user.id,
          },
        });

        // Tambah saldo
        await ctx.db.schoolBalance.update({
          where: { id: 1 },
          data: {
            amount: {
              increment: amount,
            },
          },
        });

        return {
          message: "Transaksi pemasukan berhasil dibuat.",
        };
      } else {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Tipe transaksi tidak valid.",
        });
      }
    }),
  deleteTransaction: adminProcedure
    .input(deleteTransactionSchema)
    .mutation(async ({ ctx, input }) => {
      const { transactionId } = input;

      // Cari transaksi
      const transaction = await ctx.db.schoolFinance.findUnique({
        where: { id: transactionId },
        select: {
          id: true,
          type: true,
          amount: true,
        },
      });

      if (!transaction) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Transaksi tidak ditemukan.",
        });
      }

      // Hapus transaksi
      await ctx.db.schoolFinance.delete({
        where: { id: transactionId },
      });

      // Update saldo berdasarkan tipe transaksi
      if (transaction.type === "PEMASUKAN") {
        // Jika pemasukan, kurangi saldo
        await ctx.db.schoolBalance.update({
          where: { id: 1 },
          data: {
            amount: {
              decrement: transaction.amount,
            },
          },
        });
      } else if (transaction.type === "PENGELUARAN") {
        // Jika pengeluaran, tambah saldo
        await ctx.db.schoolBalance.update({
          where: { id: 1 },
          data: {
            amount: {
              increment: transaction.amount,
            },
          },
        });
      }

      return {
        message: "Transaksi berhasil dihapus.",
      };
    }),
});
