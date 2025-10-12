"use client";

import { TrendingUp } from "lucide-react";
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
import { formatDate, formatDistance } from "date-fns";
import { id } from "date-fns/locale";

const chartConfig = {
  desktop: {
    label: "Pengeluaran",
    color: "var(--chart-1)",
  },
  mobile: {
    label: "Pemasukan",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

export function FinanceChart() {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(
    trpc.finance.getFinanceSummary.queryOptions({}),
  );

  const { perKuartal } = data;

  const chartData = Object.entries(perKuartal).map(([quarter, data]) => ({
    quarter,
    start: data.startDate,
    end: data.endDate,
    pengeluaran: data.pengeluaran,
    pemasukan: data.pemasukan,
  }));

  // get first and last quarter
  const firstQuarter = chartData[0];
  const lastQuarter = chartData[chartData.length - 1];

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Pemasukan & Pengeluaran per Kuartal
          {formatDate(new Date(firstQuarter.start), " dd MMMM yyyy", {
            locale: id,
          })}{" "}
          -{" "}
          {formatDate(new Date(lastQuarter.end), " dd MMMM yyyy", {
            locale: id,
          })}
        </CardTitle>
        <CardDescription>
          Perbandingan pemasukan dan pengeluaran selama{" "}
          {formatDistance(
            new Date(firstQuarter.start),
            new Date(lastQuarter.end),
            {
              locale: id,
            },
          )}
          .
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="quarter"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
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
        <div className="flex gap-2 leading-none font-medium">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="text-muted-foreground leading-none">
          Showing total visitors for the last 6 months
        </div>
      </CardFooter>
    </Card>
  );
}
