import { HydrateClient, prefetch, trpc } from "@/trpc/server";
import { ErrorBoundary } from "react-error-boundary";
import { TeacherSchedules } from "./_components/teacher-schedules";
import { Suspense } from "react";

export default function JadwalMengajarPage() {
  prefetch(trpc.subject.getTeacherSchedules.queryOptions());

  return (
    <HydrateClient>
      <ErrorBoundary fallback={<div>Something went wrong.</div>}>
        <Suspense fallback={<div>Loading...</div>}>
          <TeacherSchedules />
        </Suspense>
      </ErrorBoundary>
    </HydrateClient>
  );
}
