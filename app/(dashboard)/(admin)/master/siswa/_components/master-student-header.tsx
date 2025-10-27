"use client";

import { Button } from "@/components/ui/button";
import { DownloadIcon, UserPlus } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { downloadCSV, downloadExcel, downloadPDF } from "@/lib/download";

export const MasterStudentHeader = () => {
  const trpc = useTRPC();
  const { data: students } = useSuspenseQuery(
    trpc.student.getAllStudents.queryOptions(),
  );

  return (
    <div className="flex md:items-center md:justify-between flex-col md:flex-row md:gap-0 gap-4">
      <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
        Daftar Siswa
      </h3>
      <div className="flex items-center gap-2">
        <Button variant="outline" className="flex-1" asChild>
          <Link href="/master/siswa/tambah">
            <UserPlus />
            Tambah Siswa
          </Link>
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary">
              <DownloadIcon />
              Unduh Data
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Format File</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onSelect={() => downloadCSV(students, "data-siswa")}
            >
              CSV
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={() => downloadExcel(students, "data-siswa")}
            >
              Excel
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={() => downloadPDF(students, "data-siswa")}
            >
              PDF
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};
