"use client";

import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  Hash,
  MapPin,
  Phone,
  User,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { enumToReadable } from "@/lib/string";
import { GetStudentStatusBadge } from "../../_components/get-student-status-badge";
import { formattedDate } from "@/lib/date";

export function StudentDetail() {
  const params = useParams<{ studentId: string }>();
  const router = useRouter();

  const trpc = useTRPC();
  const { data: student } = useSuspenseQuery(
    trpc.student.getStudentById.queryOptions({ studentId: params.studentId }),
  );

  if (!student) return null;

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <Button
          variant="ghost"
          size="sm"
          className="mb-4 -ml-2"
          onClick={() => router.back()}
        >
          <ArrowLeft />
          Kembali
        </Button>

        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-foreground">
              {student.nama}
            </h1>
            <p className="mt-1 text-muted-foreground">Detail informasi siswa</p>
          </div>
          {GetStudentStatusBadge({
            status: student.status,
          })}
        </div>
      </div>

      {/* Main Content */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <User className="h-5 w-5 text-muted-foreground" />
              Informasi Pribadi
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <dt className="text-sm font-medium text-muted-foreground">
                Nama Lengkap
              </dt>
              <dd className="text-base text-foreground">{student.nama}</dd>
            </div>

            <div className="space-y-1">
              <dt className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Hash className="h-4 w-4" />
                NISN
              </dt>
              <dd className="font-mono text-base text-foreground">
                {student.nisn}
              </dd>
            </div>

            <div className="space-y-1">
              <dt className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Calendar className="h-4 w-4" />
                Tanggal Lahir
              </dt>
              <dd className="text-base text-foreground">
                {formattedDate(student.tanggalLahir)}
              </dd>
            </div>

            <div className="space-y-1">
              <dt className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Users className="h-4 w-4" />
                Jenis Kelamin
              </dt>
              <dd className="text-base text-foreground">
                {enumToReadable(student.jenisKelamin)}
              </dd>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Phone className="h-5 w-5 text-muted-foreground" />
              Informasi Kontak
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <dt className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Phone className="h-4 w-4" />
                Nomor Telepon
              </dt>
              <dd className="text-base text-foreground">{student.noTelepon}</dd>
            </div>

            <div className="space-y-1">
              <dt className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <MapPin className="h-4 w-4" />
                Alamat
              </dt>
              <dd className="text-base leading-relaxed text-foreground">
                {student.alamat}
              </dd>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="mt-8 flex gap-3">
        <Button asChild>
          <Link href={`/master/siswa/${student.id}/edit`}>Edit Data Siswa</Link>
        </Button>
        <Button variant="outline">Cetak Profil</Button>
      </div>
    </div>
  );
}
