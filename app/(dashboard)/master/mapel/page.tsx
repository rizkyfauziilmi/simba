import { MasterSubjectHeader } from "./_components/master-subject-header";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { MasterSubjectTable } from "./_components/master-subject-table";

export default async function MasterMapelPage() {
  prefetch(trpc.subject.getAllSubjects.queryOptions());

  return (
    <div className="space-y-4">
      <MasterSubjectHeader />
      <HydrateClient>
        <ErrorBoundary fallback={<div>Something went wrong</div>}>
          <Suspense fallback={<div>Loading...</div>}>
            <MasterSubjectTable />
          </Suspense>
        </ErrorBoundary>
      </HydrateClient>
    </div>
  );
}
