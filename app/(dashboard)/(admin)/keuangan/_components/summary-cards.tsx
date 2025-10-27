"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { filterSearchParams } from "@/lib/searchParams";
import { formatIDR } from "@/lib/string";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { id } from "date-fns/locale";
import { useQueryState } from "nuqs";

export function SummaryCards() {
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

  const { balance, totalPemasukan, totalPengeluaran, netPeriode } = data;

  const items = [
    {
      label: "Saldo Sekolah",
      value: formatIDR(balance.amount),
      hint: `Diperbarui ${formatDistanceToNow(balance.updatedAt, { addSuffix: true, locale: id })}`,
    },
    { label: "Total Pemasukan", value: formatIDR(totalPemasukan) },
    { label: "Total Pengeluaran", value: formatIDR(totalPengeluaran) },
    { label: "Net Periode", value: formatIDR(netPeriode) },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((item) => (
        <Card key={item.label} className="bg-card text-card-foreground">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {item.label}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col">
            <span className="text-2xl font-semibold">{item.value}</span>
            {item.hint ? (
              <span className="mt-1 text-xs text-muted-foreground">
                {item.hint}
              </span>
            ) : null}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
