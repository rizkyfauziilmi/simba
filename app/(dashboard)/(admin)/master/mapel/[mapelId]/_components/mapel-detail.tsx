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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getTodayHariEnum } from "@/lib/date";
import { cn } from "@/lib/utils";

export function MapelDetail() {
  const params = useParams<{ mapelId: string }>();
  const router = useRouter();

  const trpc = useTRPC();
  const { data: subject, refetch } = useSuspenseQuery(
    trpc.subject.getSubjectById.queryOptions({ subjectId: params.mapelId }),
  );

  if (!subject)
    return (
      <EmptyError
        title="Gagal memuat mata pelajaran"
        description="Terjadi kesalahan saat memuat data mata pelajaran. Silakan coba lagi."
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
            <div>
              <CardTitle className="text-2xl">{subject.nama}</CardTitle>
              <CardDescription>Kode: {subject.kode}</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div>
                <h3 className="font-semibold mb-2">Deskripsi</h3>
                <p className="text-sm">{subject.deskripsi}</p>
              </div>

              <Separator />

              <div>
                <h3 className="font-semibold mb-2">Jadwal Pelajaran</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Total {subject.schedules.length} jadwal mengajar
                </p>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Hari</TableHead>
                      <TableHead>Jam</TableHead>
                      <TableHead>Kelas</TableHead>
                      <TableHead>Ruangan</TableHead>
                      <TableHead>Guru Pengampu</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {subject.schedules.map((schedule, index) => {
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
                          <TableCell>{schedule.hari}</TableCell>
                          <TableCell>
                            {schedule.jamMulai} - {schedule.jamSelesai}
                          </TableCell>
                          <TableCell>{schedule.kelas.namaKelas}</TableCell>
                          <TableCell>{schedule.kelas.ruang}</TableCell>
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
