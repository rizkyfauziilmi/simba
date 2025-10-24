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

export const MasterClassHeader = () => {
  const trpc = useTRPC();
  const { data: classes } = useSuspenseQuery(
    trpc.class.getAllClasses.queryOptions(),
  );

  return (
    <div className="flex items-center justify-between">
      <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
        Daftar Kelas
      </h3>
      <div className="space-x-4">
        <Button variant="outline" asChild>
          <Link href="/master/kelas/tambah">
            <Plus />
            Tambah Kelas
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
              onSelect={() => downloadCSV(classes, "data-kelas")}
            >
              CSV
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={() => downloadExcel(classes, "data-kelas")}
            >
              Excel
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={() => downloadPDF(classes, "data-kelas")}
            >
              PDF
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};
