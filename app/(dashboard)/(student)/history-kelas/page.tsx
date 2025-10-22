import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { StudentHistoryTable } from "./_components/student-history-table";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";
import { ErrorBoundary } from "react-error-boundary";
import { Suspense } from "react";

export default async function HistoryKelasPage() {
  prefetch(trpc.class.getMyClassHistories.queryOptions());

  return (
    <HydrateClient>
      <Card className="border-border">
        <CardHeader>
          <CardTitle>Riwayat Kelas Siswa</CardTitle>
          <CardDescription>
            Lihat riwayat kelas yang telah diikuti oleh siswa.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ErrorBoundary
            fallback={<div>Terjadi kesalahan saat memuat data.</div>}
          >
            <Suspense fallback={<div>Memuat riwayat kelas...</div>}>
              <StudentHistoryTable />
            </Suspense>
          </ErrorBoundary>
        </CardContent>
      </Card>
    </HydrateClient>
  );
}
