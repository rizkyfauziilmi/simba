import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { BookOpenIcon, UserIcon, UserPlusIcon, UsersIcon } from "lucide-react";
import Link from "next/link";

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
    icon: <UserPlusIcon className="size-6" />,
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

interface MasterNavCardProps {
  label: string;
  description: string;
  href: string;
  icon: React.ReactNode;
}

export function MasterNavCard({
  label,
  description,
  href,
  icon,
}: MasterNavCardProps) {
  return (
    <Card>
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4 pl-6">
          {icon}
          <div className="space-y-1">
            <CardTitle>{label}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
        </div>
        <CardContent>
          <Button variant="outline" asChild>
            <Link href={href}>Kelola</Link>
          </Button>
        </CardContent>
      </div>
    </Card>
  );
}

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
