import { getQueryClient, HydrateClient, trpc } from "@/trpc/server";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { EditClassForm } from "./_components/edit-class-form";
import { EmptyError } from "@/components/empty-error";
import { EmptyLoading } from "@/components/empty-loading";

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
      <ErrorBoundary
        fallback={
          <EmptyError
            title="Gagal memuat data kelas"
            description="Terjadi kesalahan saat memuat data kelas. Silakan coba lagi."
          />
        }
      >
        <Suspense
          fallback={
            <EmptyLoading
              title="Memuat data kelas"
              description="Mohon tunggu sementara kami memuat data kelas."
            />
          }
        >
          <EditClassForm />
        </Suspense>
      </ErrorBoundary>
    </HydrateClient>
  );
}
