'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import {
  Users,
  GraduationCap,
  Building2,
  TrendingUp,
  Wallet,
  BookOpen,
  UserCog,
  Settings,
  User,
} from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import Link from 'next/link'
import { useSuspenseQuery } from '@tanstack/react-query'
import { useTRPC } from '@/trpc/client'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { getAvatarFallback } from '@/lib/string'
import { GetBadgeTransactionType } from '@/components/get-badge-transaction-type'
import { formattedDate } from '@/lib/date'

export function AdminDashboard() {
  const trpc = useTRPC()
  const { data: adminDashboardData } = useSuspenseQuery(
    trpc.roleData.getAdminDashboardData.queryOptions()
  )

  return (
    <div className="space-y-8">
      <div className="mb-8 space-y-2">
        <h1 className="text-4xl font-bold">Dashboard Admin</h1>
        <p className="text-muted-foreground">Selamat datang di sistem manajemen sekolah</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Aksi Cepat</CardTitle>
          <CardDescription>Akses cepat ke fitur utama</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-4">
            <Button variant="outline" className="h-auto flex-col gap-2 p-4" asChild>
              <Link href="/keuangan">
                <Wallet className="h-6 w-6" />
                <span>Kelola Keuangan</span>
              </Link>
            </Button>
            <Button variant="outline" className="h-auto flex-col gap-2 p-4" asChild>
              <Link href="/master/guru">
                <Users className="h-6 w-6" />
                <span>Kelola Guru</span>
              </Link>
            </Button>
            <Button variant="outline" className="h-auto flex-col gap-2 p-4" asChild>
              <Link href="/master/siswa">
                <GraduationCap className="h-6 w-6" />
                <span>Kelola Siswa</span>
              </Link>
            </Button>
            <Button variant="outline" className="h-auto flex-col gap-2 p-4" asChild>
              <Link href="/master/kelas">
                <Building2 className="h-6 w-6" />
                <span>Kelola Kelas</span>
              </Link>
            </Button>
            <Button variant="outline" className="h-auto flex-col gap-2 p-4" asChild>
              <Link href="/master/mapel">
                <BookOpen className="h-6 w-6" />
                <span>Kelola Mata Pelajaran</span>
              </Link>
            </Button>
            <Button variant="outline" className="h-auto flex-col gap-2 p-4" asChild>
              <Link href="/kelola-akun">
                <UserCog className="h-6 w-6" />
                <span>Kelola Akun</span>
              </Link>
            </Button>
            <Button variant="outline" className="h-auto flex-col gap-2 p-4" asChild>
              <Link href="/pengaturan">
                <Settings className="h-6 w-6" />
                <span>Pengaturan</span>
              </Link>
            </Button>
            <Button variant="outline" className="h-auto flex-col gap-2 p-4" asChild>
              <Link href="/profil">
                <User className="h-6 w-6" />
                <span>Profil</span>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Siswa</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{adminDashboardData.studentCount}</div>
            <p className="text-xs text-muted-foreground">Siswa aktif</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Guru</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{adminDashboardData.teacherCount}</div>
            <p className="text-xs text-muted-foreground">Guru aktif</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Kelas</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{adminDashboardData.classCount}</div>
            <p className="text-xs text-muted-foreground">Kelas aktif</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Saldo Sekolah</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(adminDashboardData.schoolBalance)}
            </div>
            <p className="text-xs text-muted-foreground">Saldo saat ini</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="transaksi" className="space-y-4">
        <TabsList>
          <TabsTrigger value="transaksi">Transaksi Terbaru</TabsTrigger>
          <TabsTrigger value="siswa">Siswa Terbaru</TabsTrigger>
        </TabsList>

        <TabsContent value="transaksi" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Transaksi Keuangan Terbaru</CardTitle>
              <CardDescription>Daftar transaksi pemasukan dan pengeluaran sekolah</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tanggal</TableHead>
                    <TableHead>Tipe</TableHead>
                    <TableHead>Kategori</TableHead>
                    <TableHead>Keterangan</TableHead>
                    <TableHead>Pencatat</TableHead>
                    <TableHead className="text-right">Jumlah</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {adminDashboardData.newestTransactions.map(transaction => (
                    <TableRow key={transaction.id}>
                      <TableCell>{formattedDate(transaction.date)}</TableCell>
                      <TableCell>
                        {GetBadgeTransactionType({
                          type: transaction.type,
                        })}
                      </TableCell>
                      <TableCell>{transaction.category}</TableCell>
                      <TableCell>{transaction.description ?? '-'}</TableCell>
                      <TableCell>
                        {!transaction.user ? (
                          <div className="flex items-center gap-2">
                            <Avatar className="size-8">
                              <AvatarImage src={undefined} />
                              <AvatarFallback>
                                {getAvatarFallback('Tidak Diketahui')}
                              </AvatarFallback>
                            </Avatar>
                            Tidak Diketahui
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <Avatar className="size-8">
                              <AvatarImage src={transaction.user.image ?? undefined} />
                              <AvatarFallback>
                                {getAvatarFallback(transaction.user.name)}
                              </AvatarFallback>
                            </Avatar>
                            {transaction.user.name}
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrency(transaction.amount)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="siswa" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Siswa Terbaru</CardTitle>
              <CardDescription>Daftar siswa yang baru terdaftar</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>NISN</TableHead>
                    <TableHead>Nama</TableHead>
                    <TableHead>Kelas</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {adminDashboardData.newestStudents.map(student => (
                    <TableRow key={student.nisn}>
                      <TableCell className="font-medium">{student.nisn}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="size-8">
                            <AvatarImage src={student.user.image ?? undefined} />
                            <AvatarFallback>{getAvatarFallback(student.nama)}</AvatarFallback>
                          </Avatar>
                          {student.nama}
                        </div>
                      </TableCell>
                      <TableCell>{student.kelas ? student.kelas.namaKelas : '-'}</TableCell>
                      <TableCell>
                        <Badge variant="default">{student.status}</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
