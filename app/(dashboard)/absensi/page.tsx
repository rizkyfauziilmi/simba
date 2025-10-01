import { ParentNavCard } from "@/components/parent-nav-card";
import { auth } from "@/lib/auth";
import { GraduationCap, User } from "lucide-react";
import { headers } from "next/headers";

const navItems = [
  {
    label: "Absensi Guru",
    description: "Kelola absensi guru",
    href: "/absensi/guru",
    icon: <GraduationCap className="size-6" />,
    role: ["admin", "teacher"],
  },
  {
    label: "Absensi Siswa",
    description: "Kelola absensi siswa",
    href: "/absensi/siswa",
    icon: <User className="size-6" />,
    role: ["student", "teacher"],
  },
];

export default async function AbsensiPage() {
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
