import { HydrateClient, prefetch, trpc } from "@/trpc/server";
import { ClassHeader } from "./_components/class-header";
import { ClassSchedule } from "./_components/class-schedule";
import { StudentsList } from "./_components/students-list";
import { ErrorBoundary } from "react-error-boundary";
import { Suspense } from "react";
import { EmptyError } from "@/components/empty-error";
import { EmptyLoading } from "@/components/empty-loading";

export const dynamic = "force-dynamic";

export default function KelasWaliPage() {
  prefetch(trpc.class.getMyHomeroomClass.queryOptions());

  return (
    <HydrateClient>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-foreground mb-2">Kelas Saya</h1>
        <p className="text-muted-foreground">Lihat informasi kelas wali Anda</p>
      </div>
      <div className="space-y-6">
        <ErrorBoundary
          fallback={
            <EmptyError
              title="Gagal memuat informasi kelas"
              description="Terjadi kesalahan saat memuat informasi kelas. Silakan coba lagi."
            />
          }
        >
          <Suspense
            fallback={
              <EmptyLoading
                title="Memuat informasi kelas"
                description="Mohon tunggu sementara kami memuat informasi kelas."
              />
            }
          >
            <ClassHeader />
            <StudentsList />
            <ClassSchedule />
          </Suspense>
        </ErrorBoundary>
      </div>
    </HydrateClient>
  );
}
