import { BookOpenIcon, GraduationCap, UserIcon, UsersIcon } from "lucide-react";
import { MasterNavCard } from "./_components/master-nav-card";

const navItems = [
  {
    label: "Siswa",
    description: "Kelola data siswa dalam sistem.",
    href: "/master/siswa",
    icon: <UserIcon className="size-6" />,
  },
  {
    label: "Guru",
    description: "Kelola data guru dalam sistem.",
    href: "/master/guru",
    icon: <GraduationCap className="size-6" />,
  },
  {
    label: "Kelas",
    description: "Kelola data kelas dalam sistem.",
    href: "/master/kelas",
    icon: <UsersIcon className="size-6" />,
  },
  {
    label: "Mata Pelajaran",
    description: "Kelola data mata pelajaran dalam sistem.",
    href: "/master/mapel",
    icon: <BookOpenIcon className="size-6" />,
  },
];

export default function MasterPage() {
  return (
    <div className="space-y-4">
      {navItems.map((item) => (
        <MasterNavCard
          key={item.label}
          label={item.label}
          description={item.description}
          href={item.href}
          icon={item.icon}
        />
      ))}
    </div>
  );
}
