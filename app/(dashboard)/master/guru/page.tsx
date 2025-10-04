import { MasterTeacherHeader } from "./_components/master-teacher-header";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";
import { ErrorBoundary } from "react-error-boundary";
import { Suspense } from "react";
import { MasterTeacherTable } from "./_components/master-teacher-table";

export default async function MasterGuruPage() {
  prefetch(trpc.teacher.getAllTeachers.queryOptions());

  return (
    <div className="space-y-4">
      <MasterTeacherHeader />
      <HydrateClient>
        <ErrorBoundary fallback={<div>Something went wrong</div>}>
          <Suspense fallback={<div>Loading...</div>}>
            <MasterTeacherTable />
          </Suspense>
        </ErrorBoundary>
      </HydrateClient>
    </div>
  );
}
