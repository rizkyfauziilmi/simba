"use client";

import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  Hash,
  Mail,
  MapPin,
  Phone,
  User,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { enumToReadable } from "@/lib/string";
import { GetTeacherStatusBadge } from "../../_components/get-teacher-status-badge";
import { formattedDate } from "@/lib/date";

export function TeacherDetail() {
  const params = useParams<{ teacherId: string }>();
  const router = useRouter();

  const trpc = useTRPC();
  const { data: teacher } = useSuspenseQuery(
    trpc.teacher.getTeacherById.queryOptions({ teacherId: params.teacherId }),
  );

  if (!teacher) return null;

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
              {teacher.nama}
            </h1>
            <p className="mt-1 text-muted-foreground">Detail informasi siswa</p>
          </div>
          {GetTeacherStatusBadge({
            status: teacher.status,
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
              <dd className="text-base text-foreground">{teacher.nama}</dd>
            </div>

            <div className="space-y-1">
              <dt className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Hash className="h-4 w-4" />
                NIP
              </dt>
              <dd className="font-mono text-base text-foreground">
                {teacher.nip}
              </dd>
            </div>

            <div className="space-y-1">
              <dt className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Users className="h-4 w-4" />
                Jenis Kelamin
              </dt>
              <dd className="text-base text-foreground">
                {enumToReadable(teacher.jenisKelamin)}
              </dd>
            </div>

            <div className="space-y-1">
              <dt className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Calendar className="h-4 w-4" />
                Tanggal Lahir
              </dt>
              <dd className="text-base text-foreground">
                {formattedDate(teacher.tanggalLahir)}
              </dd>
            </div>

            <div className="space-y-1">
              <dt className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Calendar className="h-4 w-4" />
                Tanggal Masuk
              </dt>
              <dd className="text-base text-foreground">
                {formattedDate(teacher.tanggalMasuk)}
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
              <dd className="text-base text-foreground">{teacher.noTelepon}</dd>
            </div>

            <div className="space-y-1">
              <dt className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <MapPin className="h-4 w-4" />
                Alamat
              </dt>
              <dd className="text-base leading-relaxed text-foreground">
                {teacher.alamat}
              </dd>
            </div>

            <div className="space-y-1">
              <dt className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Mail className="h-4 w-4" />
                Email
              </dt>
              <dd className="text-base text-foreground">{teacher.email}</dd>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="mt-8 flex gap-3">
        <Button asChild>
          <Link href={`/master/guru/${teacher.id}/edit`}>Edit Data Guru</Link>
        </Button>
        <Button variant="outline">Cetak Profil</Button>
      </div>
    </div>
  );
}
