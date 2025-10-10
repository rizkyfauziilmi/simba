import { Prisma } from "@/lib/generated/prisma";
import { adminProcedure, createTRPCRouter } from "../init";
import {
  createSchoolFinanceSchema,
  deleteSchoolFinanceSchema,
  getSchoolFinanceSchema,
  updateSchoolFinanceSchema,
  getSchoolFinanceListSchema,
  updateSchoolBalanceSchema,
} from "../schemas/finance.schema";
import { TRPCError } from "@trpc/server";

export const financeRouter = createTRPCRouter({
  // Get school balance
  getSchoolBalance: adminProcedure.query(async ({ ctx }) => {
    const balance = await ctx.db.schoolBalance.findFirst({
      orderBy: {
        updatedAt: "desc",
      },
    });

    if (!balance) {
      // Create initial balance if none exists
      const newBalance = await ctx.db.schoolBalance.create({
        data: {
          amount: 0,
          description: "Saldo awal",
        },
      });
      return newBalance;
    }

    return balance;
  }),

  // Update school balance
  updateSchoolBalance: adminProcedure
    .input(updateSchoolBalanceSchema)
    .mutation(async ({ ctx, input }) => {
      const { amount, description } = input;

      const updatedBalance = await ctx.db.schoolBalance.upsert({
        where: {
          id: input.id || "non-existent",
        },
        update: {
          amount,
          description,
        },
        create: {
          amount,
          description,
        },
      });

      return {
        message: "Saldo berhasil diperbarui",
        data: updatedBalance,
      };
    }),

  // Get all finance records with pagination and filtering
  getAllFinanceRecords: adminProcedure
    .input(getSchoolFinanceListSchema)
    .query(async ({ ctx, input }) => {
      const {
        page = 1,
        limit = 10,
        type,
        category,
        startDate,
        endDate,
        search,
      } = input;

      const skip = (page - 1) * limit;

      const where: Prisma.SchoolFinanceWhereInput = {};

      if (type) {
        where.type = type;
      }

      if (category) {
        where.category = {
          contains: category,
          mode: "insensitive",
        };
      }

      if (startDate || endDate) {
        where.date = {};
        if (startDate) {
          where.date.gte = startDate;
        }
        if (endDate) {
          where.date.lte = endDate;
        }
      }

      if (search) {
        where.OR = [
          {
            category: {
              contains: search,
              mode: "insensitive",
            },
          },
          {
            description: {
              contains: search,
              mode: "insensitive",
            },
          },
        ];
      }

      const [records, total] = await Promise.all([
        ctx.db.schoolFinance.findMany({
          where,
          skip,
          take: limit,
          orderBy: {
            date: "desc",
          },
          include: {
            user: {
              select: {
                name: true,
                email: true,
              },
            },
          },
        }),
        ctx.db.schoolFinance.count({ where }),
      ]);

      return {
        records,
        total,
        pages: Math.ceil(total / limit),
        currentPage: page,
      };
    }),

  // Get finance record by ID
  getFinanceRecordById: adminProcedure
    .input(getSchoolFinanceSchema)
    .query(async ({ ctx, input }) => {
      const { id } = input;

      const record = await ctx.db.schoolFinance.findUnique({
        where: {
          id,
        },
        include: {
          user: {
            select: {
              name: true,
              email: true,
            },
          },
        },
      });

      if (!record) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Data transaksi tidak ditemukan",
        });
      }

      return record;
    }),

  // Create finance record
  createFinanceRecord: adminProcedure
    .input(createSchoolFinanceSchema)
    .mutation(async ({ ctx, input }) => {
      const { type, category, amount, description, date } = input;

      // Create the finance record
      const record = await ctx.db.schoolFinance.create({
        data: {
          type,
          category,
          amount,
          description,
          date,
          userId: ctx.session.user.id,
        },
        include: {
          user: {
            select: {
              name: true,
              email: true,
            },
          },
        },
      });

      // Update school balance
      const currentBalance = await ctx.db.schoolBalance.findFirst({
        orderBy: {
          updatedAt: "desc",
        },
      });

      const balanceChange = type === "PEMASUKAN" ? amount : -amount;
      const newBalance = (currentBalance?.amount || 0) + balanceChange;

      await ctx.db.schoolBalance.upsert({
        where: {
          id: currentBalance?.id || "non-existent",
        },
        update: {
          amount: newBalance,
          description: `${type}: ${category} - ${description || ""}`,
        },
        create: {
          amount: newBalance,
          description: `${type}: ${category} - ${description || ""}`,
        },
      });

      return {
        message: "Transaksi berhasil ditambahkan",
        data: record,
      };
    }),

  // Update finance record
  updateFinanceRecord: adminProcedure
    .input(updateSchoolFinanceSchema)
    .mutation(async ({ ctx, input }) => {
      const { id, type, category, amount, description, date } = input;

      const existingRecord = await ctx.db.schoolFinance.findUnique({
        where: { id },
      });

      if (!existingRecord) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Data transaksi tidak ditemukan",
        });
      }

      // Update the finance record
      const updatedRecord = await ctx.db.schoolFinance.update({
        where: { id },
        data: {
          type,
          category,
          amount,
          description,
          date,
        },
        include: {
          user: {
            select: {
              name: true,
              email: true,
            },
          },
        },
      });

      // Recalculate balance if amount or type changed
      if (existingRecord.amount !== amount || existingRecord.type !== type) {
        // Reverse the old transaction effect
        const oldBalanceChange =
          existingRecord.type === "PEMASUKAN"
            ? -existingRecord.amount
            : existingRecord.amount;

        // Apply the new transaction effect
        const newBalanceChange = type === "PEMASUKAN" ? amount : -amount;

        const totalChange = oldBalanceChange + newBalanceChange;

        const currentBalance = await ctx.db.schoolBalance.findFirst({
          orderBy: {
            updatedAt: "desc",
          },
        });

        const newBalance = (currentBalance?.amount || 0) + totalChange;

        await ctx.db.schoolBalance.upsert({
          where: {
            id: currentBalance?.id || "non-existent",
          },
          update: {
            amount: newBalance,
            description: `Update ${type}: ${category} - ${description || ""}`,
          },
          create: {
            amount: newBalance,
            description: `Update ${type}: ${category} - ${description || ""}`,
          },
        });
      }

      return {
        message: "Transaksi berhasil diperbarui",
        data: updatedRecord,
      };
    }),

  // Delete finance record
  deleteFinanceRecord: adminProcedure
    .input(deleteSchoolFinanceSchema)
    .mutation(async ({ ctx, input }) => {
      const { id } = input;

      const record = await ctx.db.schoolFinance.findUnique({
        where: { id },
      });

      if (!record) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Data transaksi tidak ditemukan",
        });
      }

      // Delete the record
      await ctx.db.schoolFinance.delete({
        where: { id },
      });

      // Update balance (reverse the transaction effect)
      const balanceChange =
        record.type === "PEMASUKAN" ? -record.amount : record.amount;

      const currentBalance = await ctx.db.schoolBalance.findFirst({
        orderBy: {
          updatedAt: "desc",
        },
      });

      const newBalance = (currentBalance?.amount || 0) + balanceChange;

      await ctx.db.schoolBalance.upsert({
        where: {
          id: currentBalance?.id || "non-existent",
        },
        update: {
          amount: newBalance,
          description: `Hapus ${record.type}: ${record.category} - ${record.description || ""}`,
        },
        create: {
          amount: newBalance,
          description: `Hapus ${record.type}: ${record.category} - ${record.description || ""}`,
        },
      });

      return {
        message: "Transaksi berhasil dihapus",
      };
    }),

  // Get finance summary/statistics
  getFinanceSummary: adminProcedure.query(async ({ ctx }) => {
    const currentMonth = new Date();
    currentMonth.setDate(1);
    currentMonth.setHours(0, 0, 0, 0);

    const nextMonth = new Date(currentMonth);
    nextMonth.setMonth(nextMonth.getMonth() + 1);

    const [
      totalIncome,
      totalExpense,
      monthlyIncome,
      monthlyExpense,
      recentTransactions,
    ] = await Promise.all([
      ctx.db.schoolFinance.aggregate({
        where: { type: "PEMASUKAN" },
        _sum: { amount: true },
      }),
      ctx.db.schoolFinance.aggregate({
        where: { type: "PENGELUARAN" },
        _sum: { amount: true },
      }),
      ctx.db.schoolFinance.aggregate({
        where: {
          type: "PEMASUKAN",
          date: {
            gte: currentMonth,
            lt: nextMonth,
          },
        },
        _sum: { amount: true },
      }),
      ctx.db.schoolFinance.aggregate({
        where: {
          type: "PENGELUARAN",
          date: {
            gte: currentMonth,
            lt: nextMonth,
          },
        },
        _sum: { amount: true },
      }),
      ctx.db.schoolFinance.findMany({
        take: 5,
        orderBy: {
          createdAt: "desc",
        },
        include: {
          user: {
            select: {
              name: true,
            },
          },
        },
      }),
    ]);

    return {
      totalIncome: totalIncome._sum.amount || 0,
      totalExpense: totalExpense._sum.amount || 0,
      monthlyIncome: monthlyIncome._sum.amount || 0,
      monthlyExpense: monthlyExpense._sum.amount || 0,
      netIncome:
        (totalIncome._sum.amount || 0) - (totalExpense._sum.amount || 0),
      monthlyNet:
        (monthlyIncome._sum.amount || 0) - (monthlyExpense._sum.amount || 0),
      recentTransactions,
    };
  }),

  // Get finance categories
  getFinanceCategories: adminProcedure.query(async ({ ctx }) => {
    const categories = await ctx.db.schoolFinance.groupBy({
      by: ["category", "type"],
      _count: {
        category: true,
      },
      orderBy: {
        _count: {
          category: "desc",
        },
      },
    });

    const income = categories
      .filter((cat) => cat.type === "PEMASUKAN")
      .map((cat) => cat.category);

    const expense = categories
      .filter((cat) => cat.type === "PENGELUARAN")
      .map((cat) => cat.category);

    return {
      income,
      expense,
      all: [...new Set([...income, ...expense])],
    };
  }),
});
