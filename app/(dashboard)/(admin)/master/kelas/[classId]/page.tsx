import { getQueryClient, HydrateClient, trpc } from '@/trpc/server'
import { redirect } from 'next/navigation'
import { Suspense } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { EmptyError } from '@/components/empty-error'
import { EmptyLoading } from '@/components/empty-loading'
import { ClassDetail } from './_components/class-detail'

export default async function ClassDetailPage({
  params,
}: {
  params: Promise<{ classId: string }>
}) {
  const { classId } = await params
  const queryClient = getQueryClient()
  const classData = await queryClient.fetchQuery(trpc.class.getClassById.queryOptions({ classId }))

  if (!classData) {
    redirect('/master/kelas')
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
          <ClassDetail />
        </Suspense>
      </ErrorBoundary>
    </HydrateClient>
  )
}
