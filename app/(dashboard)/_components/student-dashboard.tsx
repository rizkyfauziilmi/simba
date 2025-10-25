"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Clock,
  GraduationCap,
  User,
  Users,
  History,
  Settings,
} from "lucide-react";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { EmptyError } from "@/components/empty-error";
import { getAvatarFallback } from "@/lib/string";
import { calculateAge, formattedDate } from "@/lib/date";
import Link from "next/link";

export function StudentDashboard() {
  const trpc = useTRPC();
  const { data: studentDashboardData, refetch } = useSuspenseQuery(
    trpc.roleData.getStudentDashboardData.queryOptions(),
  );

  const { studentInfo, jadwalPelajaran, kelasInfo, temanSekelas } =
    studentDashboardData;

  return (
    <div className="space-y-8">
      <div className="mb-8 space-y-2">
        <h1 className="text-4xl font-bold">Dashboard Siswa</h1>
        <p className="text-muted-foreground">
          Selamat datang, {studentInfo?.nama}!
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Aksi Cepat</CardTitle>
          <CardDescription>Akses cepat ke fitur utama</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-4">
            <Button
              variant="outline"
              className="h-auto flex-col gap-2 p-4"
              asChild
            >
              <Link href="/riwayat-kelas">
                <History className="h-6 w-6" />
                <span>Riwayat Kelas</span>
              </Link>
            </Button>
            <Button
              variant="outline"
              className="h-auto flex-col gap-2 p-4"
              asChild
            >
              <Link href="/jadwal-pelajaran">
                <Calendar className="h-6 w-6" />
                <span>Jadwal Pelajaran</span>
              </Link>
            </Button>
            <Button
              variant="outline"
              className="h-auto flex-col gap-2 p-4"
              asChild
            >
              <Link href="/pengaturan">
                <Settings className="h-6 w-6" />
                <span>Pengaturan</span>
              </Link>
            </Button>
            <Button
              variant="outline"
              className="h-auto flex-col gap-2 p-4"
              asChild
            >
              <Link href="/profil">
                <User className="h-6 w-6" />
                <span>Profil</span>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        {studentInfo ? (
          <Card>
            <CardHeader>
              <CardTitle>Informasi Pribadi</CardTitle>
              <CardDescription>Data diri siswa</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-4">
                <Avatar className="size-16">
                  <AvatarImage src={studentInfo.user.image ?? undefined} />
                  <AvatarFallback>
                    {getAvatarFallback(studentInfo.nama)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-lg font-semibold">{studentInfo.nama}</p>
                  <p className="text-sm text-muted-foreground">
                    NISN: {studentInfo.nisn}
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tanggal Lahir</span>
                  <span className="font-medium">
                    {formattedDate(studentInfo.tanggalLahir)} (
                    {calculateAge(studentInfo.tanggalLahir)} tahun)
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Jenis Kelamin</span>
                  <span className="font-medium">
                    {studentInfo.jenisKelamin === "LAKI_LAKI"
                      ? "Laki-laki"
                      : "Perempuan"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">No. Telepon</span>
                  <span className="font-medium">{studentInfo.noTelepon}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status</span>
                  <Badge variant="default">{studentInfo.status}</Badge>
                </div>
              </div>
              <div className="pt-2 border-t">
                <p className="text-sm text-muted-foreground">Alamat</p>
                <p className="text-sm font-medium">{studentInfo.alamat}</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <EmptyError
            title="Data siswa tidak ditemukan."
            description="Tidak dapat memuat informasi siswa. Silakan coba lagi."
            onAction={() => refetch()}
          />
        )}

        {kelasInfo ? (
          <Card>
            <CardHeader>
              <CardTitle>Informasi Kelas</CardTitle>
              <CardDescription>Kelas dan wali kelas</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="h-5 w-5 text-muted-foreground" />
                    <p className="text-2xl font-bold">{kelasInfo.namaKelas}</p>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {kelasInfo.tingkat}
                  </p>
                </div>
                <Badge variant="outline">{kelasInfo.ruang}</Badge>
              </div>
              {kelasInfo.waliKelas ? (
                <div className="space-y-2 p-4 bg-muted rounded-lg">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <p className="text-sm font-medium">Wali Kelas</p>
                  </div>
                  <p className="text-lg font-semibold">
                    {kelasInfo.waliKelas.nama}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    No. Telepon: {kelasInfo.waliKelas.noTelepon}
                  </p>
                </div>
              ) : (
                <EmptyError
                  title="Kelas belum memiliki wali kelas."
                  description="Silakan hubungi administrator untuk informasi lebih lanjut."
                />
              )}
            </CardContent>
          </Card>
        ) : (
          <EmptyError
            title="Anda belum tergabung di kelas manapun."
            description="Silakan hubungi wali kelas atau administrator untuk informasi lebih lanjut."
            onAction={() => refetch()}
          />
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Jadwal Pelajaran
          </CardTitle>
          <CardDescription>Jadwal pelajaran minggu ini</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Hari</TableHead>
                <TableHead>Waktu</TableHead>
                <TableHead>Mata Pelajaran</TableHead>
                <TableHead>Guru Pengajar</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {jadwalPelajaran.map((jadwal, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{jadwal.hari}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3 text-muted-foreground" />
                      <span className="text-sm">
                        {jadwal.jamMulai} - {jadwal.jamSelesai}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{jadwal.mataPelajaran}</Badge>
                  </TableCell>
                  <TableCell className="text-sm">
                    {jadwal.guruPengampu ? jadwal.guruPengampu.nama : "-"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {kelasInfo ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Teman Sekelas
            </CardTitle>
            <CardDescription>
              Daftar teman sekelas di {kelasInfo.namaKelas}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>NISN</TableHead>
                  <TableHead>Nama</TableHead>
                  <TableHead>Jenis Kelamin</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {temanSekelas.map((teman) => (
                  <TableRow key={teman.nisn}>
                    <TableCell className="font-medium">{teman.nisn}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="size-8">
                          <AvatarImage src={teman.user.image ?? undefined} />
                          <AvatarFallback>
                            {getAvatarFallback(teman.nama)}
                          </AvatarFallback>
                        </Avatar>
                        {teman.nama}
                      </div>
                    </TableCell>
                    <TableCell>
                      {teman.jenisKelamin === "LAKI_LAKI"
                        ? "Laki-laki"
                        : "Perempuan"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ) : (
        <EmptyError
          title="Anda belum tergabung di kelas manapun."
          description="Silakan hubungi wali kelas atau administrator untuk informasi lebih lanjut."
          onAction={() => refetch()}
        />
      )}
    </div>
  );
}
