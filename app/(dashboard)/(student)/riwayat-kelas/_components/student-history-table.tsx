'use client'

import { EmptyError } from '@/components/empty-error'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Item, ItemMedia, ItemTitle, ItemContent } from '@/components/ui/item'
import { formatDateToNow, formattedDate } from '@/lib/date'
import { ClassStatus, StudentStatus } from '@/lib/generated/prisma'
import { useTRPC } from '@/trpc/client'
import { useSuspenseQuery } from '@tanstack/react-query'
import { Calendar, Check } from 'lucide-react'

// Status badge colors
const getStatusColor = (status: StudentStatus | ClassStatus) => {
  switch (status) {
    case 'AKTIF':
      return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200'
    case 'NON_AKTIF':
      return 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200'
    case 'ALUMNI':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
    case 'KELUAR':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
  }
}

export function StudentHistoryTable() {
  const trpc = useTRPC()

  const { data, refetch } = useSuspenseQuery(trpc.class.getMyClassHistories.queryOptions())

  if (data.length === 0) {
    return (
      <EmptyError
        title="Tidak Ada Riwayat"
        description="Tidak ada riwayat kelas siswa untuk ditampilkan."
        onAction={() => refetch()}
      />
    )
  }

  return (
    <div className="space-y-4">
      {data.map(record => (
        <Card key={record.id}>
          <CardHeader>
            <CardTitle>{record.class.namaKelas}</CardTitle>
            <CardDescription>
              {record.class.tingkat}
              {record.class.ruang && ` • Ruang ${record.class.ruang}`}
            </CardDescription>
            <CardAction>
              {record.class.isLast && (
                <Badge className={getStatusColor(record.student.status)}>
                  {record.student.status}
                </Badge>
              )}
            </CardAction>
          </CardHeader>
          <CardContent>
            {/* Details Row */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Tanggal Masuk</p>
                  <p className="text-sm font-semibold text-foreground">
                    {formattedDate(record.createdAt)}
                  </p>
                  <p className="text-sm font-semibold text-foreground">
                    {formatDateToNow(record.createdAt)}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-xs font-medium text-muted-foreground">ID Kelas</p>
                <p className="text-sm font-mono text-foreground">{record.classId}</p>
              </div>

              <div>
                <p className="text-xs font-medium text-muted-foreground">ID Siswa</p>
                <p className="text-sm font-mono text-foreground">{record.studentId}</p>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            {/* Last Class Indicator */}
            {record.class.isLast && (
              <Item variant="outline" size="sm" className="w-full">
                <ItemMedia>
                  <Check className="size-5" />
                </ItemMedia>
                <ItemContent>
                  <ItemTitle>Kelas Terakhir</ItemTitle>
                </ItemContent>
              </Item>
            )}
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
