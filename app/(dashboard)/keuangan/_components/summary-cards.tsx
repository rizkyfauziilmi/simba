"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatIDR } from "@/lib/string";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { id } from "date-fns/locale";

export function SummaryCards() {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(
    trpc.finance.getFinanceSummary.queryOptions({}),
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
