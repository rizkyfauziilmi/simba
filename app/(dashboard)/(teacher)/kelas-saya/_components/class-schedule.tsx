'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useTRPC } from '@/trpc/client'
import { useSuspenseQuery } from '@tanstack/react-query'
import { getTodayHariEnum } from '@/lib/date'
import { cn } from '@/lib/utils'
import { enumToReadable } from '@/lib/string'

export function ClassSchedule() {
  const trpc = useTRPC()

  const { data: kelas } = useSuspenseQuery(trpc.class.getMyHomeroomClass.queryOptions())

  if (!kelas || kelas.schedules.length === 0) {
    return (
      <Card className="border-border">
        <CardContent className="pt-6">
          <p className="text-muted-foreground">Tidak ada jadwal pelajaran untuk kelas ini.</p>
        </CardContent>
      </Card>
    )
  }

  const schedules = kelas.schedules

  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle>Jadwal Pelajaran</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Hari</TableHead>
                <TableHead>Jam</TableHead>
                <TableHead>Mata Pelajaran</TableHead>
                <TableHead>Guru Pengampu</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {schedules.map(schedule => {
                const todayEnum = getTodayHariEnum()

                return (
                  <TableRow
                    key={schedule.id}
                    className={cn(
                      schedule.hari === todayEnum ? 'bg-accent hover:bg-accent/80' : ''
                    )}
                  >
                    <TableCell className="font-medium">{enumToReadable(schedule.hari)}</TableCell>
                    <TableCell>
                      {schedule.jamMulai} - {schedule.jamSelesai}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{schedule.subject.nama}</Badge>
                    </TableCell>
                    {schedule.guruPengampu === null ? (
                      <TableCell className="text-sm">-</TableCell>
                    ) : (
                      <TableCell className="text-sm">{schedule.guruPengampu.nama}</TableCell>
                    )}
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
