import { CircleUser, FileUser, LucideLayoutDashboard, Settings, 
    UsersRound, Award, Database, GraduationCap, ScanFace,
} from "lucide-react";

export const routeData = {
  navMain: [
    {
      title: "Dashboard",
      url: "/",
      icon: LucideLayoutDashboard,
      role: ["admin", "teacher", "student"],
      items: undefined,
    },
    {
      title: "Data Master",
      url: "/master",
      icon: Database,
      role: ["admin"],
      items: [
        {
          title: "Siswa",
          url: "/master/siswa",
          role: ["admin"],
        },
        {
          title: "Guru",
          url: "/master/guru",
          role: ["admin"],
        },
        {
          title: "Kelas",
          url: "/master/kelas",
          role: ["admin"],
        },
        {
          title: "Mata Pelajaran",
          url: "/master/mapel",
          role: ["admin"],
        },
      ],
    },
    {
      title: "Akademik",
      url: "/akademik",
      icon: GraduationCap,
      role: ["teacher", "student"],
      items: [
        {
          title: "Jadwal Pelajaran",
          url: "/akademik/jadwal",
          role: ["teacher", "student"],
        },
        {
          title: "Kalender Akademik",
          url: "/akademik/kalender",
          role: ["teacher", "student"],
        },
      ],
    },
    {
      title: "Absensi",
      url: "/absensi",
      icon: ScanFace,
      role: ["admin", "teacher", "student"],
      items: [
        {
          title: "Absensi Siswa",
          url: "/absensi/siswa",
          role: ["teacher", "student"],
        },
        {
          title: "Absensi Guru",
          url: "/absensi/guru",
          role: ["admin", "teacher"],
        },
      ],
    },
    {
      title: "Nilai",
      url: "/nilai",
      icon: Award,
      role: ["teacher", "student"],
      items: [
        {
          title: "Input Nilai",
          url: "/nilai/input",
          role: ["teacher"],
        },
        {
          title: "Rekap Nilai",
          url: "/nilai/rekap",
          role: ["teacher", "student"],
        },
        {
          title: "Rapor",
          url: "/nilai/rapor",
          role: ["teacher", "student"],
        },
      ],
    },
    {
      title: "Laporan",
      url: "/laporan",
      icon: FileUser,
      role: ["admin"],
      items: undefined,
    },
    {
      title: "Manajemen Pengguna",
      url: "/pengguna",
      icon: UsersRound,
      role: ["admin"],
      items: undefined,
    },
  ],
  navSecondary: [
    {
      title: "Profil / Akun",
      url: "/akun",
      icon: CircleUser,
      role: ["admin", "teacher", "student"],
      items: undefined,
    },
    {
      title: "Pengaturan",
      url: "/pengaturan",
      icon: Settings,
      role: ["admin", "teacher", "student"],
      items: undefined,
    },
  ],
};