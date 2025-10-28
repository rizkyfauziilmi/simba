import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { StudentHistoryTable } from './_components/student-history-table'
import { HydrateClient, prefetch, trpc } from '@/trpc/server'
import { ErrorBoundary } from 'react-error-boundary'
import { Suspense } from 'react'
import { EmptyLoading } from '@/components/empty-loading'
import { EmptyError } from '@/components/empty-error'

export const dynamic = 'force-dynamic'

export default function HistoryKelasPage() {
  prefetch(trpc.class.getMyClassHistories.queryOptions())

  return (
    <HydrateClient>
      <Card className="border-border">
        <CardHeader>
          <CardTitle>Riwayat Kelas Siswa</CardTitle>
          <CardDescription>Lihat riwayat kelas yang telah diikuti oleh siswa.</CardDescription>
        </CardHeader>
        <CardContent>
          <ErrorBoundary
            fallback={
              <EmptyError
                title="Gagal memuat riwayat kelas"
                description="Terjadi kesalahan saat memuat riwayat kelas. Silakan coba lagi."
              />
            }
          >
            <Suspense
              fallback={
                <EmptyLoading
                  title="Memuat riwayat kelas"
                  description="Mohon tunggu sementara kami memuat riwayat kelas."
                />
              }
            >
              <StudentHistoryTable />
            </Suspense>
          </ErrorBoundary>
        </CardContent>
      </Card>
    </HydrateClient>
  )
}
