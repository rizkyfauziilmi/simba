"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardTitle,
  CardDescription,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import { type LucideIcon } from "lucide-react";
import Link from "next/link";

interface MasterNavCardProps {
  title: string;
  description: string;
  href: string;
}

export function ParentNavCard({
  title,
  description,
  href,
}: MasterNavCardProps) {
  return (
    <Card>
      <div className="flex justify-between items-center">
        <CardHeader className="flex-1">
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="outline" asChild>
            <Link href={href}>Kelola</Link>
          </Button>
        </CardContent>
      </div>
    </Card>
  );
}
