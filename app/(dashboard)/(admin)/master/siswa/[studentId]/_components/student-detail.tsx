'use client'

import { useTRPC } from '@/trpc/client'
import { useSuspenseQuery } from '@tanstack/react-query'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { GetStudentStatusBadge } from '../../_components/get-student-status-badge'
import { EmptyError } from '@/components/empty-error'
import { Separator } from '@/components/ui/separator'
import { formattedDate } from '@/lib/date'

export function StudentDetail() {
  const params = useParams<{ studentId: string }>()
  const router = useRouter()

  const trpc = useTRPC()
  const { data: student, refetch } = useSuspenseQuery(
    trpc.student.getStudentById.queryOptions({ studentId: params.studentId })
  )

  if (!student)
    return (
      <EmptyError
        title="Siswa tidak ditemukan"
        description="Siswa yang Anda cari tidak ada atau telah dihapus."
        onAction={() => refetch()}
      />
    )

  return (
    <div>
      <Button variant="ghost" onClick={() => router.back()} className="mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Kembali
      </Button>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-2xl">{student.nama}</CardTitle>
                <CardDescription>NISN: {student.nisn}</CardDescription>
              </div>
              {GetStudentStatusBadge({
                status: student.status,
              })}
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div>
                <h3 className="font-semibold mb-2">Informasi Pribadi</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Tanggal Lahir</p>
                    <p className="text-sm font-medium">{formattedDate(student.tanggalLahir)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Jenis Kelamin</p>
                    <p className="text-sm font-medium">
                      {student.jenisKelamin === 'LAKI_LAKI' ? 'Laki-laki' : 'Perempuan'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">No. Telepon</p>
                    <p className="text-sm font-medium">{student.noTelepon}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm text-muted-foreground">Alamat</p>
                    <p className="text-sm font-medium">{student.alamat}</p>
                  </div>
                </div>
              </div>

              <Separator />

              {student.kelas ? (
                <div>
                  <h3 className="font-semibold mb-2">Informasi Kelas</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Kelas</p>
                      <p className="text-sm font-medium">{student.kelas.namaKelas}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Tingkat</p>
                      <p className="text-sm font-medium">{student.kelas.tingkat}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Ruangan</p>
                      <p className="text-sm font-medium">{student.kelas.ruang}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Wali Kelas</p>
                      <p className="text-sm font-medium">
                        {student.kelas.waliKelas ? student.kelas.waliKelas.nama : '-'}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <EmptyError
                  title="Anda belum tergabung di kelas manapun"
                  description="Hubungi administrator untuk menambahkan Anda ke dalam kelas."
                  onAction={() => refetch()}
                />
              )}

              <Separator />

              <div>
                <h3 className="font-semibold mb-2">Informasi Sistem</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Terdaftar Sejak</p>
                    <p className="text-sm font-medium">{formattedDate(student.createdAt)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Terakhir Diperbarui</p>
                    <p className="text-sm font-medium">{formattedDate(student.updatedAt)}</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
