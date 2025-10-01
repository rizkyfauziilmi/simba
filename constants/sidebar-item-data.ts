import {
  CircleUser,
  LucideLayoutDashboard,
  Settings,
  Database,
} from "lucide-react";

export const routeData = {
  navMain: [
    {
      title: "Dashboard",
      url: "/",
      icon: LucideLayoutDashboard,
      role: ["admin", "teacher", "student"],
      items: [],
    },
    {
      title: "Data Master",
      url: "/master",
      icon: Database,
      role: ["admin"],
      items: [
        {
          title: "Siswa",
          description: "Kelola data siswa dalam sekolah",
          url: "/master/siswa",
          role: ["admin"],
        },
        {
          title: "Guru",
          description: "Kelola data guru dalam sekolah",
          url: "/master/guru",
          role: ["admin"],
        },
        {
          title: "Kelas",
          description: "Kelola data kelas dalam sekolah",
          url: "/master/kelas",
          role: ["admin"],
        },
        {
          title: "Mata Pelajaran",
          description: "Kelola data mata pelajaran dalam sekolah",
          url: "/master/mapel",
          role: ["admin"],
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Profil / Akun",
      url: "/akun",
      icon: CircleUser,
      role: ["admin", "teacher", "student"],
      items: [],
    },
    {
      title: "Pengaturan",
      url: "/pengaturan",
      icon: Settings,
      role: ["admin", "teacher", "student"],
      items: [],
    },
  ],
};
