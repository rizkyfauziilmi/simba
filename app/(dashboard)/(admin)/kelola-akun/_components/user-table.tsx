'use client'

import { authClient } from '@/lib/auth-client'
import { useQuery } from '@tanstack/react-query'
import { EmptyError } from '@/components/empty-error'
import { DataTable } from '@/components/ui/data-table'
import { TableSkeleton } from '@/components/skeleton/table-skeleton'
import { userColumns } from './user-columns'

export function UserTable() {
  const { data: session } = authClient.useSession()

  const {
    data: usersData,
    isPending,
    error,
    refetch,
  } = useQuery({
    queryKey: ['users', session?.user.id],
    queryFn: async () => {
      const users = await authClient.admin.listUsers({
        query: {
          filterField: 'id',
          filterValue: session?.user.id || '',
          filterOperator: 'ne',
        },
      })
      return users
    },
  })

  if (isPending) {
    return <TableSkeleton />
  }

  if (error || !usersData.data) {
    return (
      <EmptyError
        title="Gagal memuat pengguna"
        description="Terjadi kesalahan saat memuat data pengguna. Silakan coba lagi."
        onAction={() => refetch()}
      />
    )
  }

  return <DataTable columns={userColumns} data={usersData.data.users} />
}
