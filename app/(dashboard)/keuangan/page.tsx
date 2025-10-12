import { Button } from "@/components/ui/button";
import { FinanceFilters } from "./_components/filters";
import { FinanceChart } from "./_components/finance-chart";
import { SummaryCards } from "./_components/summary-cards";
import { TransactionsTable } from "./_components/transactions-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DownloadIcon } from "lucide-react";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";
import { ErrorBoundary } from "react-error-boundary";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

export default async function KeuanganPage() {
  prefetch(trpc.finance.getFinanceSummary.queryOptions({}));

  return (
    <HydrateClient>
      <main className="mx-auto w-full max-w-7xl p-4 md:p-6 lg:p-8">
        <header className="mb-6 flex items-center justify-between gap-14">
          <div className="space-y-2">
            <h1 className="text-pretty text-2xl font-semibold tracking-tight md:text-3xl">
              Dashboard Keuangan Sekolah
            </h1>
            <p className="text-sm text-muted-foreground">
              Ikhtisar saldo, transaksi, dan tren pemasukan/pengeluaran. UI saja
              — tanpa fungsionalitas backend.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="secondary">
                  <DownloadIcon />
                  Unduh Data
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Format File</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>CSV</DropdownMenuItem>
                <DropdownMenuItem>Excel</DropdownMenuItem>
                <DropdownMenuItem>PDF</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button>Tambah Transaksi</Button>
          </div>
        </header>

        <section aria-labelledby="ringkasan" className="mb-6">
          <h2 id="ringkasan" className="sr-only">
            Ringkasan
          </h2>
          <ErrorBoundary fallback={<div>Error loading summary cards.</div>}>
            <Suspense fallback={<div>Loading summary cards...</div>}>
              <SummaryCards />
            </Suspense>
          </ErrorBoundary>
        </section>

        <section aria-labelledby="filter" className="mb-6">
          <h2 id="filter" className="sr-only">
            Filter
          </h2>
          <FinanceFilters />
        </section>

        <section aria-labelledby="grafik" className="mb-6">
          <div className="mb-3 flex items-center justify-between">
            <h2 id="grafik" className="text-lg font-medium">
              Tren Transaksi
            </h2>
          </div>
          <ErrorBoundary fallback={<div>Error loading chart.</div>}>
            <Suspense fallback={<div>Loading chart...</div>}>
              <FinanceChart />
            </Suspense>
          </ErrorBoundary>
        </section>

        <section aria-labelledby="transaksi-terbaru" className="mb-6">
          <div className="mb-3 flex items-center justify-between">
            <h2 id="transaksi-terbaru" className="text-lg font-medium">
              Transaksi Terbaru
            </h2>
          </div>
          <ErrorBoundary fallback={<div>Error loading transactions.</div>}>
            <Suspense fallback={<div>Loading transactions...</div>}>
              <TransactionsTable />
            </Suspense>
          </ErrorBoundary>
        </section>
      </main>
    </HydrateClient>
  );
}
