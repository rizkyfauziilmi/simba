import { MasterTeacherHeader } from "./_components/master-teacher-header";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";
import { ErrorBoundary } from "react-error-boundary";
import { Suspense } from "react";
import { MasterTeacherTable } from "./_components/master-teacher-table";
import { TableSkeleton } from "@/components/skeleton/table-skeleton";
import { EmptyError } from "@/components/empty-error";

export const dynamic = "force-dynamic";

export default async function MasterGuruPage() {
  prefetch(trpc.teacher.getAllTeachers.queryOptions());

  return (
    <HydrateClient>
      <div className="space-y-4">
        <MasterTeacherHeader />
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
      </div>
    </HydrateClient>
  );
}
