import { getQueryClient, HydrateClient, trpc } from "@/trpc/server";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { UpdateStudentForm } from "./_components/update-student-form";

export default async function MasterUpdateSiswaPage({
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
          <UpdateStudentForm />
        </Suspense>
      </ErrorBoundary>
    </HydrateClient>
  );
}
