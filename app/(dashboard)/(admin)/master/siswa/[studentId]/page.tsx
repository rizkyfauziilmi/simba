import { getQueryClient, HydrateClient, trpc } from "@/trpc/server";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { StudentDetail } from "./_components/student-detail";
import { EmptyError } from "@/components/empty-error";
import { EmptyLoading } from "@/components/empty-loading";

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
      <ErrorBoundary
        fallback={
          <EmptyError
            title="Gagal memuat data siswa"
            description="Terjadi kesalahan saat memuat data siswa. Silakan coba lagi."
          />
        }
      >
        <Suspense
          fallback={
            <EmptyLoading
              title="Memuat data siswa"
              description="Mohon tunggu sementara kami memuat data siswa."
            />
          }
        >
          <StudentDetail />
        </Suspense>
      </ErrorBoundary>
    </HydrateClient>
  );
}
