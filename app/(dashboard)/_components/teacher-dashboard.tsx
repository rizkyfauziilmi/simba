import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Calendar, BookOpen, FileText, Bell, AlertCircle } from "lucide-react";

export function TeacherDashboard() {
  return (
    <>
      {/* Teacher Dashboard Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Jadwal Hari Ini
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">Jam pelajaran</p>
          </CardContent>
        </Card>
        <Card className="rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Kelas Aktif</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">Kelas yang diampu</p>
          </CardContent>
        </Card>
        <Card className="rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Tugas Belum Dinilai
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">23</div>
            <p className="text-xs text-muted-foreground">
              Memerlukan penilaian
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Today's Schedule */}
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle>Jadwal Mengajar Hari Ini</CardTitle>
            <CardDescription>Rabu, 18 Desember 2024</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg bg-primary/5 border-l-4 border-l-primary">
              <div>
                <p className="font-medium">Matematika - Kelas X-A</p>
                <p className="text-sm text-muted-foreground">07:30 - 09:00</p>
              </div>
              <span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded">
                Sedang Berlangsung
              </span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg border">
              <div>
                <p className="font-medium">Matematika - Kelas X-B</p>
                <p className="text-sm text-muted-foreground">10:00 - 11:30</p>
              </div>
              <span className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded">
                Selanjutnya
              </span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg border">
              <div>
                <p className="font-medium">Matematika - Kelas XI-C</p>
                <p className="text-sm text-muted-foreground">13:30 - 15:00</p>
              </div>
              <span className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded">
                Nanti
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Reminders */}
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Pengingat
            </CardTitle>
            <CardDescription>Hal-hal yang perlu diperhatikan</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start space-x-3 p-3 rounded-lg bg-orange-500/5 border-l-4 border-l-orange-500">
              <AlertCircle className="h-4 w-4 text-orange-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium">Absensi Belum Diisi</p>
                <p className="text-xs text-muted-foreground">
                  Kelas X-A periode kemarin
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3 p-3 rounded-lg bg-blue-500/5 border-l-4 border-l-blue-500">
              <FileText className="h-4 w-4 text-blue-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium">Deadline Nilai UTS</p>
                <p className="text-xs text-muted-foreground">3 hari lagi</p>
              </div>
            </div>
            <div className="flex items-start space-x-3 p-3 rounded-lg bg-green-500/5 border-l-4 border-l-green-500">
              <Calendar className="h-4 w-4 text-green-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium">Rapat Koordinasi</p>
                <p className="text-xs text-muted-foreground">
                  Jumat, 20 Des - 14:00
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
