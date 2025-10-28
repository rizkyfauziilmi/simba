import { HydrateClient, prefetch, trpc } from '@/trpc/server'
import { ErrorBoundary } from 'react-error-boundary'
import { TeacherSchedules } from './_components/teacher-schedules'
import { Suspense } from 'react'
import { EmptyError } from '@/components/empty-error'
import { EmptyLoading } from '@/components/empty-loading'

export const dynamic = 'force-dynamic'

export default function JadwalMengajarPage() {
  prefetch(trpc.subject.getTeacherSchedules.queryOptions())

  return (
    <HydrateClient>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-foreground mb-2">Jadwal Mengajar</h1>
        <p className="text-muted-foreground">lihat jadwal mengajar Anda</p>
      </div>
      <ErrorBoundary
        fallback={
          <EmptyError
            title="Gagal memuat jadwal mengajar"
            description="Terjadi kesalahan saat memuat jadwal mengajar. Silakan coba lagi."
          />
        }
      >
        <Suspense
          fallback={
            <EmptyLoading
              title="Memuat jadwal mengajar"
              description="Mohon tunggu sementara kami memuat jadwal mengajar."
            />
          }
        >
          <TeacherSchedules />
        </Suspense>
      </ErrorBoundary>
    </HydrateClient>
  )
}
