import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Clock,
  GraduationCap,
  Users,
  BookOpen,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";

export function AdminDashboard() {
  return (
    <>
      {/* Admin Dashboard Stats */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Siswa</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,245</div>
            <p className="text-xs text-muted-foreground">
              +12% dari bulan lalu
            </p>
          </CardContent>
        </Card>
        <Card className="rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Guru</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">87</div>
            <p className="text-xs text-muted-foreground">
              +2 guru baru bulan ini
            </p>
          </CardContent>
        </Card>
        <Card className="rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Kelas</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">42</div>
            <p className="text-xs text-muted-foreground">Dari kelas 1 - 12</p>
          </CardContent>
        </Card>
        <Card className="rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Absensi Hari Ini
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">94.8%</div>
            <p className="text-xs text-muted-foreground">+1.2% dari kemarin</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        {/* Recent Activity */}
        <Card className="col-span-4 rounded-2xl">
          <CardHeader>
            <CardTitle>Aktivitas Terbaru</CardTitle>
            <CardDescription>
              Ringkasan aktivitas sistem dalam 24 jam terakhir
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="flex h-2 w-2 rounded-full bg-primary"></div>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium leading-none">
                  Data siswa baru telah ditambahkan
                </p>
                <p className="text-sm text-muted-foreground">
                  25 siswa baru terdaftar hari ini
                </p>
              </div>
              <div className="text-sm text-muted-foreground">2 jam lalu</div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex h-2 w-2 rounded-full bg-primary"></div>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium leading-none">
                  Absensi kelas X-A telah diperbarui
                </p>
                <p className="text-sm text-muted-foreground">
                  Oleh Budi Santoso, S.Pd
                </p>
              </div>
              <div className="text-sm text-muted-foreground">4 jam lalu</div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex h-2 w-2 rounded-full bg-primary"></div>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium leading-none">
                  Nilai ulangan Matematika telah diinput
                </p>
                <p className="text-sm text-muted-foreground">
                  Untuk kelas IX-B
                </p>
              </div>
              <div className="text-sm text-muted-foreground">6 jam lalu</div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="col-span-3 rounded-2xl">
          <CardHeader>
            <CardTitle>Aksi Cepat</CardTitle>
            <CardDescription>
              Shortcut ke fitur yang sering digunakan
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid gap-3">
              <Link
                href="/master/siswa"
                className="flex items-center justify-between rounded-lg border p-3 hover:bg-accent transition-colors"
              >
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4" />
                  <span className="text-sm font-medium">Data Siswa</span>
                </div>
                <span className="text-xs text-muted-foreground">Kelola</span>
              </Link>
              <Link
                href="/absensi"
                className="flex items-center justify-between rounded-lg border p-3 hover:bg-accent transition-colors"
              >
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4" />
                  <span className="text-sm font-medium">Absensi</span>
                </div>
                <span className="text-xs text-muted-foreground">Lihat</span>
              </Link>
              <Link
                href="/laporan"
                className="flex items-center justify-between rounded-lg border p-3 hover:bg-accent transition-colors"
              >
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-4 w-4" />
                  <span className="text-sm font-medium">Laporan</span>
                </div>
                <span className="text-xs text-muted-foreground">Buat</span>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
