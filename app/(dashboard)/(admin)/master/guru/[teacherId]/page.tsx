import { getQueryClient, HydrateClient, trpc } from "@/trpc/server";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { TeacherDetail } from "./_components/teacher-detail";

export default async function SiswaDetailPage({
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
          <TeacherDetail />
        </Suspense>
      </ErrorBoundary>
    </HydrateClient>
  );
}
