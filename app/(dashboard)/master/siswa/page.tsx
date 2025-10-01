import { MasterStudentHeader } from "./_components/master-student-header";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { MasterStudentTable } from "./_components/master-student-table";

export default async function MasterSiswaPage() {
  prefetch(trpc.student.getAllStudents.queryOptions());

  return (
    <div className="space-y-4">
      <MasterStudentHeader />
      <HydrateClient>
        <ErrorBoundary fallback={<div>Something went wrong</div>}>
          <Suspense fallback={<div>Loading...</div>}>
            <MasterStudentTable />
          </Suspense>
        </ErrorBoundary>
      </HydrateClient>
    </div>
  );
}
