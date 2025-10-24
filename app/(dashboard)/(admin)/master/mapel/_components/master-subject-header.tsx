"use client";

import { Button } from "@/components/ui/button";
import { DownloadIcon, Plus } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { downloadCSV, downloadExcel, downloadPDF } from "@/lib/download";

export const MasterSubjectHeader = () => {
  const trpc = useTRPC();
  const { data: subjects } = useSuspenseQuery(
    trpc.subject.getAllSubjects.queryOptions(),
  );

  return (
    <div className="flex items-center justify-between">
      <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
        Daftar Mata Pelajaran
      </h3>
      <div className="flex items-center gap-2">
        <Button variant="outline" asChild>
          <Link href="/master/mapel/tambah">
            <Plus />
            Tambah Mata Pelajaran
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
              onSelect={() => downloadCSV(subjects, "data-mata-pelajaran")}
            >
              CSV
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={() => downloadExcel(subjects, "data-mata-pelajaran")}
            >
              Excel
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={() => downloadPDF(subjects, "data-mata-pelajaran")}
            >
              PDF
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};
