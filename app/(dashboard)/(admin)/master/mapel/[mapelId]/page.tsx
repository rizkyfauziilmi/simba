import { EmptyError } from '@/components/empty-error'
import { EmptyLoading } from '@/components/empty-loading'
import { getQueryClient, HydrateClient, trpc } from '@/trpc/server'
import { redirect } from 'next/navigation'
import { Suspense } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { MapelDetail } from './_components/mapel-detail'

export default async function MapelDetailPage({
  params,
}: {
  params: Promise<{ mapelId: string }>
}) {
  const { mapelId } = await params
  const queryClient = getQueryClient()
  const subject = await queryClient.fetchQuery(
    trpc.subject.getSubjectById.queryOptions({
      subjectId: mapelId,
    })
  )

  if (!subject) {
    redirect('/master/mapel')
  }

  return (
    <HydrateClient>
      <ErrorBoundary
        fallback={
          <EmptyError
            title="Gagal memuat data mata pelajaran"
            description="Terjadi kesalahan saat memuat data mata pelajaran. Silakan coba lagi."
          />
        }
      >
        <Suspense
          fallback={
            <EmptyLoading
              title="Memuat data mata pelajaran"
              description="Mohon tunggu sementara kami memuat data mata pelajaran."
            />
          }
        >
          <MapelDetail />
        </Suspense>
      </ErrorBoundary>
    </HydrateClient>
  )
}
