import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Calendar, Award, Clock, FileText, Bell } from "lucide-react";

export function StudentDashboard() {
  return (
    <>
      {/* Student Dashboard Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Jadwal Hari Ini
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7</div>
            <p className="text-xs text-muted-foreground">Jam pelajaran</p>
          </CardContent>
        </Card>
        <Card className="rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Nilai Rata-rata
            </CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">85.4</div>
            <p className="text-xs text-muted-foreground">
              +2.1 dari semester lalu
            </p>
          </CardContent>
        </Card>
        <Card className="rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Kehadiran</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">96%</div>
            <p className="text-xs text-muted-foreground">Bulan ini</p>
          </CardContent>
        </Card>
        <Card className="rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tugas Selesai</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12/15</div>
            <p className="text-xs text-muted-foreground">3 tugas tertunda</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Today's Schedule */}
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle>Jadwal Pelajaran Hari Ini</CardTitle>
            <CardDescription>
              Rabu, 18 Desember 2024 - Kelas XI IPA 2
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-lg border">
              <div>
                <p className="font-medium">Matematika</p>
                <p className="text-sm text-muted-foreground">
                  07:30 - 09:00 • Pak Budi
                </p>
              </div>
              <span className="text-xs bg-green-500 text-white px-2 py-1 rounded">
                Selesai
              </span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-primary/5 border-l-4 border-l-primary">
              <div>
                <p className="font-medium">Fisika</p>
                <p className="text-sm text-muted-foreground">
                  09:15 - 10:45 • Bu Sari
                </p>
              </div>
              <span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded">
                Sedang Berlangsung
              </span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg border">
              <div>
                <p className="font-medium">Kimia</p>
                <p className="text-sm text-muted-foreground">
                  11:00 - 12:30 • Pak Andi
                </p>
              </div>
              <span className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded">
                Selanjutnya
              </span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg border">
              <div>
                <p className="font-medium">Bahasa Indonesia</p>
                <p className="text-sm text-muted-foreground">
                  13:30 - 15:00 • Bu Maya
                </p>
              </div>
              <span className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded">
                Nanti
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Recent Grades & Announcements */}
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle>Nilai Terbaru</CardTitle>
            <CardDescription>Update nilai dan pengumuman</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg bg-green-500/5 border-l-4 border-l-green-500">
              <div>
                <p className="font-medium">Matematika - Ulangan Harian</p>
                <p className="text-sm text-muted-foreground">
                  16 Desember 2024
                </p>
              </div>
              <span className="text-lg font-bold text-green-600">88</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-blue-500/5 border-l-4 border-l-blue-500">
              <div>
                <p className="font-medium">Fisika - Praktikum</p>
                <p className="text-sm text-muted-foreground">
                  14 Desember 2024
                </p>
              </div>
              <span className="text-lg font-bold text-blue-600">92</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-orange-500/5 border-l-4 border-l-orange-500">
              <div>
                <p className="font-medium">Kimia - Tugas Kelompok</p>
                <p className="text-sm text-muted-foreground">
                  12 Desember 2024
                </p>
              </div>
              <span className="text-lg font-bold text-orange-600">85</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Announcements */}
      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Pengumuman Penting
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="rounded-lg border-l-4 border-l-red-500 bg-red-500/5 p-4">
              <h4 className="font-medium">Ujian Tengah Semester</h4>
              <p className="text-sm text-muted-foreground mt-1">
                UTS akan dilaksanakan mulai tanggal 20 Desember 2024. Pastikan
                untuk belajar dan mempersiapkan diri dengan baik.
              </p>
            </div>
            <div className="rounded-lg border-l-4 border-l-blue-500 bg-blue-500/5 p-4">
              <h4 className="font-medium">Libur Semester</h4>
              <p className="text-sm text-muted-foreground mt-1">
                Libur semester akan dimulai pada tanggal 25 Desember 2024 hingga
                8 Januari 2025.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
