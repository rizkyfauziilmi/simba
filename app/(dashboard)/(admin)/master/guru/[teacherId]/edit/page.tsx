import { getQueryClient, HydrateClient, trpc } from "@/trpc/server";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { EditTeacherForm } from "./_components/edit-teacher-form";
import { EmptyError } from "@/components/empty-error";
import { EmptyLoading } from "@/components/empty-loading";

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
      <ErrorBoundary
        fallback={
          <EmptyError
            title="Gagal memuat data guru"
            description="Terjadi kesalahan saat memuat data guru. Silakan coba lagi."
          />
        }
      >
        <Suspense
          fallback={
            <EmptyLoading
              title="Memuat data guru"
              description="Mohon tunggu sementara kami memuat data guru."
            />
          }
        >
          <EditTeacherForm />
        </Suspense>
      </ErrorBoundary>
    </HydrateClient>
  );
}
