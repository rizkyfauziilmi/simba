import { HydrateClient, prefetch, trpc } from "@/trpc/server";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { JadwalPelajaran } from "./_components/jadwal-pelajaran";

export default async function JadwalPelajaranPage() {
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
      <ErrorBoundary fallback={<div>Terjadi kesalahan.</div>}>
        <Suspense fallback={<div>Memuat jadwal pelajaran...</div>}>
          <JadwalPelajaran />
        </Suspense>
      </ErrorBoundary>
    </HydrateClient>
  );
}
