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
import { Calendar, Clock, Users, BookOpen, Settings, User } from "lucide-react";
import Link from "next/link";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { EmptyError } from "@/components/empty-error";
import { enumToReadable, formattedNip, getAvatarFallback } from "@/lib/string";
import { getTodayHariEnum } from "@/lib/date";
import { cn } from "@/lib/utils";

export function TeacherDashboard() {
  const trpc = useTRPC();
  const { data: teacherDashboardData, refetch } = useSuspenseQuery(
    trpc.roleData.getTeacherDashboardData.queryOptions(),
  );

  const { daftarSiswa, jadwalMengajar, teacherInfo, waliKelas } =
    teacherDashboardData;

  return (
    <div className="space-y-8">
      <div className="mb-8 space-y-2">
        <h1 className="text-4xl font-bold">Dashboard Guru</h1>
        <p className="text-muted-foreground">
          Selamat datang, {teacherInfo?.nama ?? "Guru"}!
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
              <Link href="/jadwal-mengajar">
                <Calendar className="h-6 w-6" />
                <span>Jadwal Mengajar</span>
              </Link>
            </Button>
            <Button
              variant="outline"
              className="h-auto flex-col gap-2 p-4"
              asChild
            >
              <Link href="/kelas-saya">
                <Users className="h-6 w-6" />
                <span>Kelas Saya</span>
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
        {teacherInfo ? (
          <Card>
            <CardHeader>
              <CardTitle>Informasi Guru</CardTitle>
              <CardDescription>
                Data pribadi dan status kepegawaian
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-4">
                <Avatar className="size-16">
                  <AvatarImage src={teacherInfo.user.image ?? undefined} />
                  <AvatarFallback>
                    {getAvatarFallback(teacherInfo.nama)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-lg font-semibold">{teacherInfo.nama}</p>
                  <p className="text-sm text-muted-foreground">
                    NIP: {formattedNip(teacherInfo.nip)}
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Jenis Kelamin</span>
                  <span className="font-medium">
                    {teacherInfo.jenisKelamin === "LAKI_LAKI"
                      ? "Laki-laki"
                      : "Perempuan"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">No. Telepon</span>
                  <span className="font-medium">{teacherInfo.noTelepon}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status</span>
                  <Badge variant="default">{teacherInfo.status}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <EmptyError
            title="Data Guru Tidak Tersedia"
            description="Tidak dapat memuat informasi guru. Silakan coba lagi."
            onAction={() => refetch()}
          />
        )}

        {waliKelas ? (
          <Card>
            <CardHeader>
              <CardTitle>Wali Kelas</CardTitle>
              <CardDescription>Informasi kelas yang diampu</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-1">
                  <p className="text-2xl font-bold">{waliKelas.namaKelas}</p>
                  <p className="text-sm text-muted-foreground">
                    {waliKelas.tingkat}
                  </p>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-2xl font-bold">
                      {waliKelas.jumlahSiswa}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">Siswa</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <EmptyError
            title="Anda bukan wali kelas."
            description="Tidak ada data wali kelas untuk ditampilkan."
            onAction={() => refetch()}
          />
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Jadwal Mengajar
          </CardTitle>
          <CardDescription>Jadwal mengajar minggu ini</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Hari</TableHead>
                <TableHead>Waktu</TableHead>
                <TableHead>Kelas</TableHead>
                <TableHead>Mata Pelajaran</TableHead>
                <TableHead>Lokasi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {jadwalMengajar.map((jadwal, index) => {
                const todayEnum = getTodayHariEnum();

                return (
                  <TableRow
                    key={index}
                    className={cn(
                      jadwal.hari === todayEnum
                        ? "bg-accent hover:bg-accent/80"
                        : "",
                    )}
                  >
                    <TableCell className="font-medium">
                      {enumToReadable(jadwal.hari)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3 text-muted-foreground" />
                        <span>
                          {jadwal.jamMulai} - {jadwal.jamSelesai}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{jadwal.kelas}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4 text-muted-foreground" />
                        {jadwal.mataPelajaran}
                      </div>
                    </TableCell>
                    <TableCell>{jadwal.lokasi}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {waliKelas ? (
        <Card>
          <CardHeader>
            <CardTitle>Daftar Siswa Kelas {waliKelas.namaKelas}</CardTitle>
            <CardDescription>Siswa dalam kelas wali</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>NISN</TableHead>
                  <TableHead>Nama Siswa</TableHead>
                  <TableHead>Jenis Kelamin</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {daftarSiswa.map((siswa) => (
                  <TableRow key={siswa.nisn}>
                    <TableCell className="font-medium">{siswa.nisn}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="size-8">
                          <AvatarImage src={siswa.user.image ?? undefined} />
                          <AvatarFallback>
                            {getAvatarFallback(siswa.nama)}
                          </AvatarFallback>
                        </Avatar>
                        {siswa.nama}
                      </div>
                    </TableCell>
                    <TableCell>
                      {siswa.jenisKelamin === "LAKI_LAKI"
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
          title="Anda bukan wali kelas."
          description="Tidak ada data siswa untuk ditampilkan."
          onAction={() => refetch()}
        />
      )}
    </div>
  );
}
