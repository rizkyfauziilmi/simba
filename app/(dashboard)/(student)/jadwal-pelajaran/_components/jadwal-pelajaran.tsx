'use client'

import type { Hari } from '@/lib/generated/prisma'
import { useTRPC } from '@/trpc/client'
import type { SchoolSchedule } from '@/types/database-return.type'
import { useSuspenseQuery } from '@tanstack/react-query'
import { Card, CardContent } from '@/components/ui/card'
import { BookOpen, Clock } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { enumToReadable } from '@/lib/string'
import { getTodayHariEnum } from '@/lib/date'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

const hariOrder: Record<Hari, number> = {
  SENIN: 0,
  SELASA: 1,
  RABU: 2,
  KAMIS: 3,
  JUMAT: 4,
  SABTU: 5,
}

export function JadwalPelajaran() {
  const trpc = useTRPC()

  const { data } = useSuspenseQuery(trpc.class.getMySchoolTimeable.queryOptions())

  // Sort data by day
  const sortedData = [...data].sort((a, b) => hariOrder[a.hari] - hariOrder[b.hari])

  // Group by day
  const groupedByDay = sortedData.reduce(
    (acc, item) => {
      if (!acc[item.hari]) {
        acc[item.hari] = []
      }
      acc[item.hari].push(item)
      return acc
    },
    {} as Record<Hari, SchoolSchedule[]>
  )

  if (data.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <BookOpen className="w-12 h-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">Tidak ada jadwal</h3>
          <p className="text-muted-foreground text-center">
            Jadwal pelajaran belum tersedia. Silakan hubungi administrator.
          </p>
        </CardContent>
      </Card>
    )
  }

  const todayHariEnum = getTodayHariEnum()
  const todaySchedules = todayHariEnum ? groupedByDay[todayHariEnum] : todayHariEnum

  const renderScheduleTable = (schedules: SchoolSchedule[]) => (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted">
            <TableHead className="font-semibold">Mata Pelajaran</TableHead>
            <TableHead className="font-semibold">Waktu</TableHead>
            <TableHead className="font-semibold">Guru Pengampu</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {schedules.map((schedule, idx) => (
            <TableRow key={idx} className="hover:bg-muted/50 transition-colors">
              <TableCell className="font-medium">{schedule.subject.nama}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm">
                    {schedule.jamMulai} - {schedule.jamSelesai}
                  </span>
                </div>
              </TableCell>
              <TableCell>
                {schedule.guruPengampu ? (
                  <Badge variant="secondary" className="bg-blue-100 text-blue-900">
                    {schedule.guruPengampu.nama}
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-muted-foreground">
                    Belum ditentukan
                  </Badge>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )

  return (
    <div>
      {!todaySchedules || !todayHariEnum ? (
        <Card className="mb-8 border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <BookOpen className="w-12 h-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Tidak ada jadwal hari ini
            </h3>
            <p className="text-muted-foreground text-center">Hari ini bukan hari sekolah.</p>
          </CardContent>
        </Card>
      ) : todaySchedules.length > 0 ? (
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-foreground mb-4">
            Jadwal Hari Ini ({enumToReadable(todayHariEnum)})
          </h2>
          {renderScheduleTable(todaySchedules)}
        </div>
      ) : (
        <Card className="mb-8 border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <BookOpen className="w-12 h-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Tidak ada jadwal hari ini
            </h3>
            <p className="text-muted-foreground text-center">
              Tidak ada jadwal pelajaran untuk hari {enumToReadable(todayHariEnum)}.
            </p>
          </CardContent>
        </Card>
      )}

      <div className="space-y-8">
        {Object.entries(groupedByDay).map(([hari, schedules]) => (
          <div key={hari}>
            <h2 className="text-xl font-semibold text-foreground mb-4">{enumToReadable(hari)}</h2>
            {schedules.length === 0 ? (
              <Card className="border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-8">
                  <BookOpen className="w-10 h-10 text-muted-foreground mb-3" />
                  <p className="text-sm text-muted-foreground">
                    Tidak ada jadwal untuk hari {enumToReadable(hari)}
                  </p>
                </CardContent>
              </Card>
            ) : (
              renderScheduleTable(schedules)
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
