"use client";

import { DataTable } from "@/components/ui/data-table";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { transactionDetailColumns } from "./transaction-detail-columns";
import { useQueryState } from "nuqs";
import { filterSearchParams } from "@/lib/searchParams";

export function TransactionDetailTable() {
  const trpc = useTRPC();
  const [categories] = useQueryState(
    "categories",
    filterSearchParams.categories,
  );
  const [fromDate] = useQueryState("from", filterSearchParams.from);
  const [toDate] = useQueryState("to", filterSearchParams.to);
  const { data } = useSuspenseQuery(
    trpc.finance.getFinanceSummary.queryOptions({
      categories: categories ?? undefined,
      startDate: fromDate,
      endDate: toDate,
    }),
  );

  const { transactions } = data;

  return <DataTable columns={transactionDetailColumns} data={transactions} />;
}
