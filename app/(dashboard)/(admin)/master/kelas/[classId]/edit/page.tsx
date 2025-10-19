import { getQueryClient, HydrateClient, trpc } from "@/trpc/server";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { EditClassForm } from "./_components/edit-class-form";

export default async function MasterUpdateGuruPage({
  params,
}: {
  params: Promise<{ classId: string }>;
}) {
  const { classId } = await params;
  const queryClient = getQueryClient();
  const classData = await queryClient.fetchQuery(
    trpc.class.getClassById.queryOptions({ classId }),
  );

  if (!classData) {
    redirect("/master/kelas");
  }

  return (
    <HydrateClient>
      <ErrorBoundary fallback={<div>Something went wrong</div>}>
        <Suspense fallback={<div>Loading...</div>}>
          <EditClassForm />
        </Suspense>
      </ErrorBoundary>
    </HydrateClient>
  );
}
