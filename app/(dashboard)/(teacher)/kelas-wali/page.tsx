import { HydrateClient, prefetch, trpc } from "@/trpc/server";
import { ClassHeader } from "./_components/class-header";
import { ClassSchedule } from "./_components/class-schedule";
import { StudentsList } from "./_components/students-list";
import { ErrorBoundary } from "react-error-boundary";
import { Suspense } from "react";

export default async function KelasWaliPage() {
  prefetch(trpc.class.getMyHomeroomClass.queryOptions());

  return (
    <HydrateClient>
      <h1 className="text-3xl font-bold text-foreground mb-8">Kelas Saya</h1>

      <div className="space-y-6">
        <ErrorBoundary
          fallback={<div>Something went wrong loading class info.</div>}
        >
          <Suspense fallback={<div>Loading class info...</div>}>
            <ClassHeader />
          </Suspense>
        </ErrorBoundary>
        <ErrorBoundary
          fallback={<div>Something went wrong loading students list.</div>}
        >
          <Suspense fallback={<div>Loading students list...</div>}>
            <StudentsList />
          </Suspense>
        </ErrorBoundary>
        <ErrorBoundary
          fallback={<div>Something went wrong loading class schedule.</div>}
        >
          <Suspense fallback={<div>Loading class schedule...</div>}>
            <ClassSchedule />
          </Suspense>
        </ErrorBoundary>
      </div>
    </HydrateClient>
  );
}
