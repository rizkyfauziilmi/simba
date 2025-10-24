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
import { formattedNip } from "@/lib/string";
import { GetTeacherStatusBadge } from "../../_components/get-teacher-status-badge";
import { formattedDate, getTodayHariEnum } from "@/lib/date";
import { EmptyError } from "@/components/empty-error";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

export function TeacherDetail() {
  const params = useParams<{ teacherId: string }>();
  const router = useRouter();

  const trpc = useTRPC();
  const { data: teacher, refetch } = useSuspenseQuery(
    trpc.teacher.getTeacherById.queryOptions({ teacherId: params.teacherId }),
  );

  if (!teacher)
    return (
      <EmptyError
        title="Guru tidak ditemukan"
        description="Guru yang Anda cari tidak ada. Silakan coba lagi."
        onAction={() => refetch()}
      />
    );

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
                <CardTitle className="text-2xl">{teacher.nama}</CardTitle>
                <CardDescription>
                  NIP: {formattedNip(teacher.nip)}
                </CardDescription>
              </div>
              {GetTeacherStatusBadge({
                status: teacher.status,
              })}
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div>
                <h3 className="font-semibold mb-2">Informasi Pribadi</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Tanggal Lahir
                    </p>
                    <p className="text-sm font-medium">
                      {formattedDate(teacher.tanggalLahir)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Jenis Kelamin
                    </p>
                    <p className="text-sm font-medium">
                      {teacher.jenisKelamin === "LAKI_LAKI"
                        ? "Laki-laki"
                        : "Perempuan"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">No. Telepon</p>
                    <p className="text-sm font-medium">{teacher.noTelepon}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Tanggal Masuk
                    </p>
                    <p className="text-sm font-medium">
                      {formattedDate(teacher.tanggalMasuk)}
                    </p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm text-muted-foreground">Alamat</p>
                    <p className="text-sm font-medium">{teacher.alamat}</p>
                  </div>
                </div>
              </div>

              <Separator />

              {teacher.waliKelas ? (
                <div>
                  <h3 className="font-semibold mb-2">Wali Kelas</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Kelas</p>
                      <p className="text-sm font-medium">
                        {teacher.waliKelas.namaKelas}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Tingkat</p>
                      <p className="text-sm font-medium">
                        {teacher.waliKelas.tingkat}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Ruangan</p>
                      <p className="text-sm font-medium">
                        {teacher.waliKelas.ruang}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <EmptyError
                  title="Tidak Ada Wali Kelas"
                  description="Guru ini tidak ditugaskan sebagai wali kelas."
                  onAction={() => refetch()}
                />
              )}

              <Separator />

              <div>
                <h3 className="font-semibold mb-2">Jadwal Mengajar</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Hari</TableHead>
                      <TableHead>Jam</TableHead>
                      <TableHead>Kelas</TableHead>
                      <TableHead>Mata Pelajaran</TableHead>
                      <TableHead>Lokasi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {teacher.ClassSchedule.map((jadwal, index) => {
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
                          <TableCell>{jadwal.hari}</TableCell>
                          <TableCell>
                            {jadwal.jamMulai} - {jadwal.jamSelesai}
                          </TableCell>
                          <TableCell>{jadwal.kelas.namaKelas}</TableCell>
                          <TableCell>{jadwal.subject.nama}</TableCell>
                          <TableCell>{jadwal.kelas.ruang}</TableCell>
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
