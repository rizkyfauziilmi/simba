import { HydrateClient, prefetch, trpc } from '@/trpc/server'
import { MasterClassHeader } from './_components/master-class-header'
import { ErrorBoundary } from 'react-error-boundary'
import { Suspense } from 'react'
import { MasterClassTable } from './_components/master-class-table'
import { TableSkeleton } from '@/components/skeleton/table-skeleton'
import { EmptyError } from '@/components/empty-error'

export const dynamic = 'force-dynamic'

export default function MasterKelasPage() {
  prefetch(trpc.class.getAllClasses.queryOptions())

  return (
    <HydrateClient>
      <div className="space-y-4">
        <MasterClassHeader />
        <ErrorBoundary
          fallback={
            <EmptyError
              title="Gagal memuat data kelas"
              description="Terjadi kesalahan saat memuat data kelas. Silakan coba lagi."
            />
          }
        >
          <Suspense fallback={<TableSkeleton />}>
            <MasterClassTable />
          </Suspense>
        </ErrorBoundary>
      </div>
    </HydrateClient>
  )
}
