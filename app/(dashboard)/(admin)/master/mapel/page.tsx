import { MasterSubjectHeader } from "./_components/master-subject-header";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { MasterSubjectTable } from "./_components/master-subject-table";
import { TableSkeleton } from "@/components/skeleton/table-skeleton";
import { EmptyError } from "@/components/empty-error";

export default async function MasterMapelPage() {
  prefetch(trpc.subject.getAllSubjects.queryOptions());

  return (
    <HydrateClient>
      <div className="space-y-4">
        <MasterSubjectHeader />
        <ErrorBoundary
          fallback={
            <EmptyError
              title="Gagal memuat data mata pelajaran"
              description="Terjadi kesalahan saat memuat data mata pelajaran. Silakan coba lagi."
            />
          }
        >
          <Suspense fallback={<TableSkeleton />}>
            <MasterSubjectTable />
          </Suspense>
        </ErrorBoundary>
      </div>
    </HydrateClient>
  );
}
