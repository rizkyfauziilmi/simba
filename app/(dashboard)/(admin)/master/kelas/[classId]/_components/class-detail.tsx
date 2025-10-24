"use client";

import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { EmptyError } from "@/components/empty-error";
import { Separator } from "@/components/ui/separator";
import { GetClassStatusBadge } from "../../_components/get-class-status-badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { GetStudentStatusBadge } from "../../../siswa/_components/get-student-status-badge";
import { getTodayHariEnum } from "@/lib/date";
import { cn } from "@/lib/utils";
import { enumToReadable } from "@/lib/string";

export function ClassDetail() {
  const params = useParams<{ classId: string }>();
  const router = useRouter();

  const trpc = useTRPC();
  const { data: classData, refetch } = useSuspenseQuery(
    trpc.class.getClassById.queryOptions({ classId: params.classId }),
  );

  if (!classData) {
    return (
      <EmptyError
        title="Gagal memuat data kelas"
        description="Terjadi kesalahan saat memuat data kelas. Silakan coba lagi."
        onAction={() => refetch()}
      />
    );
  }

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
                <CardTitle className="text-2xl">
                  Kelas {classData.namaKelas}
                </CardTitle>
                <CardDescription>
                  {classData.tingkat} - Ruangan {classData.ruang}
                </CardDescription>
              </div>
              {GetClassStatusBadge({
                status: classData.status,
              })}
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div>
                <h3 className="font-semibold mb-2">Informasi Kelas</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Tingkat</p>
                    <p className="text-sm font-medium">{classData.tingkat}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Ruangan</p>
                    <p className="text-sm font-medium">{classData.ruang}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Jumlah Siswa
                    </p>
                    <p className="text-sm font-medium">
                      {classData.students.length} siswa
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <p className="text-sm font-medium">{classData.status}</p>
                  </div>
                </div>
              </div>

              <Separator />

              {classData.waliKelas ? (
                <div>
                  <h3 className="font-semibold mb-2">Wali Kelas</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Nama</p>
                      <p className="text-sm font-medium">
                        {classData.waliKelas.nama}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">NIP</p>
                      <p className="text-sm font-medium">
                        {classData.waliKelas.nip}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        No. Telepon
                      </p>
                      <p className="text-sm font-medium">
                        {classData.waliKelas.noTelepon}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <EmptyError
                  title="Wali kelas belum ditetapkan"
                  description="Kelas ini belum memiliki wali kelas. Silakan tetapkan wali kelas untuk kelas ini."
                />
              )}

              <Separator />

              <div>
                <h3 className="font-semibold mb-2">Daftar Siswa</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>NISN</TableHead>
                      <TableHead>Nama</TableHead>
                      <TableHead>Jenis Kelamin</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {classData.students.map((student, index) => (
                      <TableRow key={index}>
                        <TableCell>{student.nisn}</TableCell>
                        <TableCell>{student.nama}</TableCell>
                        <TableCell>
                          {student.jenisKelamin === "LAKI_LAKI"
                            ? "Laki-laki"
                            : "Perempuan"}
                        </TableCell>
                        <TableCell>
                          {GetStudentStatusBadge({
                            status: student.status,
                          })}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <Separator />

              <div>
                <h3 className="font-semibold mb-2">Jadwal Pelajaran</h3>
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
                    {classData.schedules.map((schedule, index) => {
                      const todayEnum = getTodayHariEnum();
                      return (
                        <TableRow
                          key={index}
                          className={cn(
                            schedule.hari === todayEnum
                              ? "bg-accent hover:bg-accent/80"
                              : "",
                          )}
                        >
                          <TableCell>{enumToReadable(schedule.hari)}</TableCell>
                          <TableCell>
                            {schedule.jamMulai} - {schedule.jamSelesai}
                          </TableCell>
                          <TableCell>
                            {schedule.subject.nama}
                            <span className="text-muted-foreground text-xs block">
                              {schedule.subject.kode}
                            </span>
                          </TableCell>
                          <TableCell>
                            {schedule.guruPengampu
                              ? schedule.guruPengampu.nama
                              : "-"}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
