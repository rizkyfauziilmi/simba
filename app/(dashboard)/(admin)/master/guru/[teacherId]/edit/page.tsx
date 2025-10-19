import { getQueryClient, HydrateClient, trpc } from "@/trpc/server";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { EditTeacherForm } from "./_components/edit-teacher-form";

export default async function MasterUpdateGuruPage({
  params,
}: {
  params: Promise<{ teacherId: string }>;
}) {
  const { teacherId } = await params;
  const queryClient = getQueryClient();
  const teacher = await queryClient.fetchQuery(
    trpc.teacher.getTeacherById.queryOptions({ teacherId }),
  );

  if (!teacher) {
    redirect("/master/siswa");
  }

  return (
    <HydrateClient>
      <ErrorBoundary fallback={<div>Something went wrong</div>}>
        <Suspense fallback={<div>Loading...</div>}>
          <EditTeacherForm />
        </Suspense>
      </ErrorBoundary>
    </HydrateClient>
  );
}
