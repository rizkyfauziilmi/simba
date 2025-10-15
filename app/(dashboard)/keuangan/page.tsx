import { FinanceFilters } from "./_components/filters";
import { FinanceChart } from "./_components/finance-chart";
import { SummaryCards } from "./_components/summary-cards";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";
import { ErrorBoundary } from "react-error-boundary";
import { Suspense } from "react";
import type { SearchParams } from "nuqs/server";
import { loadSearchParams } from "@/lib/searchParams";
import { TransactionDetailTable } from "./_components/transaction-detail-table";
import { TransactionHeader } from "./_components/transaction-header";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams: Promise<SearchParams>;
};

export default async function KeuanganPage({ searchParams }: PageProps) {
  const { categories, from, to } = await loadSearchParams(searchParams);

  prefetch(
    trpc.finance.getFinanceSummary.queryOptions({
      categories: categories ?? undefined,
      startDate: from,
      endDate: to,
    }),
  );

  return (
    <HydrateClient>
      <main className="mx-auto w-full max-w-7xl p-4 md:p-6 lg:p-8">
        <TransactionHeader />

        <section className="mb-6">
          <h2 className="sr-only">Ringkasan</h2>
          <ErrorBoundary fallback={<div>Error loading summary cards.</div>}>
            <Suspense fallback={<div>Loading summary cards...</div>}>
              <SummaryCards />
            </Suspense>
          </ErrorBoundary>
        </section>

        <section className="mb-6">
          <h2 className="sr-only">Filter</h2>
          <FinanceFilters />
        </section>

        <section className="mb-6">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-medium">Tren Transaksi</h2>
          </div>
          <ErrorBoundary fallback={<div>Error loading chart.</div>}>
            <Suspense fallback={<div>Loading chart...</div>}>
              <FinanceChart />
            </Suspense>
          </ErrorBoundary>
        </section>

        <section className="mb-6">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-medium">Transaksi Detail</h2>
          </div>
          <ErrorBoundary fallback={<div>Error loading transactions.</div>}>
            <Suspense fallback={<div>Loading transactions...</div>}>
              <TransactionDetailTable />
            </Suspense>
          </ErrorBoundary>
        </section>
      </main>
    </HydrateClient>
  );
}
