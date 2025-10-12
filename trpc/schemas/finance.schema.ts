import { FinanceType } from "@/lib/generated/prisma";
import { endOfYear, startOfYear } from "date-fns";
import z from "zod";

export const getFinanceSummarySchema = z.object({
  startDate: z.date().default(startOfYear(new Date())).optional(),
  endDate: z.date().default(endOfYear(new Date())).optional(),
  type: z.enum(FinanceType).optional(),
  category: z.string().optional(),
});

export type GetFinanceSummaryInput = z.infer<typeof getFinanceSummarySchema>;
