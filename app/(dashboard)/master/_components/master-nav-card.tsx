"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import Link from "next/link";

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
