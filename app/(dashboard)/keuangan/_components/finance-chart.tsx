"use client";

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { filterSearchParams } from "@/lib/searchParams";
import { useQueryState } from "nuqs";
import { formatDistanceDate, periodEnumToString } from "@/lib/date";

const chartConfig = {
  pengeluaran: {
    label: "Pengeluaran",
    color: "var(--chart-1)",
  },
  pemasukan: {
    label: "Pemasukan",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

export function FinanceChart() {
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

  const { financeOverTime } = data;

  const chartData = financeOverTime.data.map((item) => ({
    interval: item.intervalName,
    pemasukan: item.totalIncome,
    pengeluaran: item.totalExpense,
  }));

  const firstInterval = financeOverTime.data[0];
  const lastInterval = financeOverTime.data[financeOverTime.data.length - 1];
  // calculate trend percentage and direction (for pengeluaran and pemasukan)

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Pemasukan & Pengeluaran {periodEnumToString(financeOverTime.periode)}
        </CardTitle>
        <CardDescription>
          Perbandingan pemasukan dan pengeluaran selama{" "}
          {formatDistanceDate(firstInterval.start, lastInterval.end)}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="interval"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dashed" />}
            />
            <Bar
              dataKey="pengeluaran"
              fill="var(--color-pengeluaran)"
              radius={4}
            />
            <Bar dataKey="pemasukan" fill="var(--color-pemasukan)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="text-muted-foreground leading-none"></div>
      </CardFooter>
    </Card>
  );
}
