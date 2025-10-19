import { getQueryClient, HydrateClient, trpc } from "@/trpc/server";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

export default async function MapelDetailPage({
  params,
}: {
  params: Promise<{ mapelId: string }>;
}) {
  const { mapelId } = await params;
  const queryClient = getQueryClient();
  const subject = await queryClient.fetchQuery(
    trpc.subject.getSubjectById.queryOptions({
      subjectId: mapelId,
    }),
  );

  if (!subject) {
    redirect("/master/mapel");
  }

  return (
    <HydrateClient>
      <ErrorBoundary fallback={<div>Something went wrong</div>}>
        <Suspense fallback={<div>Loading...</div>}>
          {/*<StudentDetail />*/}
        </Suspense>
      </ErrorBoundary>
    </HydrateClient>
  );
}
