import { BookOpenIcon, GraduationCap, UserIcon, UsersIcon } from "lucide-react";
import { ParentNavCard } from "../../../components/parent-nav-card";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

const navItems = [
  {
    label: "Siswa",
    description: "Kelola data siswa dalam sistem.",
    href: "/master/siswa",
    icon: <UserIcon className="size-6" />,
    role: ["admin"],
  },
  {
    label: "Guru",
    description: "Kelola data guru dalam sistem.",
    href: "/master/guru",
    icon: <GraduationCap className="size-6" />,
    role: ["admin"],
  },
  {
    label: "Kelas",
    description: "Kelola data kelas dalam sistem.",
    href: "/master/kelas",
    icon: <UsersIcon className="size-6" />,
    role: ["admin"],
  },
  {
    label: "Mata Pelajaran",
    description: "Kelola data mata pelajaran dalam sistem.",
    href: "/master/mapel",
    icon: <BookOpenIcon className="size-6" />,
    role: ["admin"],
  },
];

export default async function MasterPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const userRole = session?.user?.role;
  const navBasedOnRole = navItems.filter((item) =>
    item.role.includes(userRole ?? ""),
  );

  return (
    <div className="space-y-4">
      {navBasedOnRole.map((item) => (
        <ParentNavCard
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
