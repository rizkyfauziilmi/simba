import { HydrateClient, prefetch, trpc } from "@/trpc/server";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { JadwalPelajaran } from "./_components/jadwal-pelajaran";
import { EmptyError } from "@/components/empty-error";
import { EmptyLoading } from "@/components/empty-loading";

export const dynamic = "force-dynamic";

export default function JadwalPelajaranPage() {
  prefetch(trpc.class.getMySchoolTimeable.queryOptions());

  return (
    <HydrateClient>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Jadwal Pelajaran
        </h1>
        <p className="text-muted-foreground">
          Lihat jadwal kelas dan guru pengampu
        </p>
      </div>
      <ErrorBoundary
        fallback={
          <EmptyError
            title="Gagal memuat jadwal pelajaran"
            description="Terjadi kesalahan saat memuat jadwal pelajaran. Silakan coba lagi."
          />
        }
      >
        <Suspense
          fallback={
            <EmptyLoading
              title="Memuat jadwal pelajaran"
              description="Mohon tunggu sementara kami memuat jadwal pelajaran."
            />
          }
        >
          <JadwalPelajaran />
        </Suspense>
      </ErrorBoundary>
    </HydrateClient>
  );
}
