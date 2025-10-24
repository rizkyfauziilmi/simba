import { MasterTeacherHeader } from "./_components/master-teacher-header";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";
import { ErrorBoundary } from "react-error-boundary";
import { Suspense } from "react";
import { MasterTeacherTable } from "./_components/master-teacher-table";
import { TableSkeleton } from "@/components/skeleton/table-skeleton";
import { EmptyError } from "@/components/empty-error";

export default async function MasterGuruPage() {
  prefetch(trpc.teacher.getAllTeachers.queryOptions());

  return (
    <div className="space-y-4">
      <MasterTeacherHeader />
      <HydrateClient>
        <ErrorBoundary
          fallback={
            <EmptyError
              title="Gagal memuat data guru"
              description="Terjadi kesalahan saat memuat data guru. Silakan coba lagi."
            />
          }
        >
          <Suspense fallback={<TableSkeleton />}>
            <MasterTeacherTable />
          </Suspense>
        </ErrorBoundary>
      </HydrateClient>
    </div>
  );
}
