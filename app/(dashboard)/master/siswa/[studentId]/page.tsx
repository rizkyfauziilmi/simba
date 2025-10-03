import { getQueryClient, HydrateClient, trpc } from "@/trpc/server";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { StudentDetail } from "./_components/student-detail";

export default async function SiswaDetailPage({
  params,
}: {
  params: Promise<{ studentId: string }>;
}) {
  const { studentId } = await params;
  const queryClient = getQueryClient();
  const student = await queryClient.fetchQuery(
    trpc.student.getStudentById.queryOptions({ studentId }),
  );

  if (!student) {
    redirect("/master/siswa");
  }

  return (
    <HydrateClient>
      <ErrorBoundary fallback={<div>Something went wrong</div>}>
        <Suspense fallback={<div>Loading...</div>}>
          <StudentDetail />
        </Suspense>
      </ErrorBoundary>
    </HydrateClient>
  );
}
