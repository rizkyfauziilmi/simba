import { MasterStudentHeader } from "./_components/master-student-header";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { MasterStudentTable } from "./_components/master-student-table";
import { TableSkeleton } from "@/components/skeleton/table-skeleton";
import { EmptyError } from "@/components/empty-error";

export default async function MasterSiswaPage() {
  prefetch(trpc.student.getAllStudents.queryOptions());

  return (
    <div className="space-y-4">
      <MasterStudentHeader />
      <HydrateClient>
        <ErrorBoundary
          fallback={
            <EmptyError
              title="Gagal memuat data siswa"
              description="Terjadi kesalahan saat memuat data siswa. Silakan coba lagi."
            />
          }
        >
          <Suspense fallback={<TableSkeleton />}>
            <MasterStudentTable />
          </Suspense>
        </ErrorBoundary>
      </HydrateClient>
    </div>
  );
}
