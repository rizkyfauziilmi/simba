import { HydrateClient, prefetch, trpc } from "@/trpc/server";
import { MasterClassHeader } from "./_components/master-class-header";
import { ErrorBoundary } from "react-error-boundary";
import { Suspense } from "react";
import { MasterClassTable } from "./_components/master-class-table";
import { TableSkeleton } from "@/components/skeleton/table-skeleton";

export default async function MasterKelasPage() {
  prefetch(trpc.class.getAllClasses.queryOptions());

  return (
    <div className="space-y-4">
      <MasterClassHeader />
      <HydrateClient>
        <ErrorBoundary fallback={<div>Something went wrong</div>}>
          <Suspense fallback={<TableSkeleton />}>
            <MasterClassTable />
          </Suspense>
        </ErrorBoundary>
      </HydrateClient>
    </div>
  );
}
