"use client";

import { ColumnDef } from "@tanstack/react-table";
import {
  BookUser,
  GraduationCap,
  Loader2,
  MoreHorizontal,
  Trash,
  UserPen,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DataTableColumnHeader } from "@/components/data-table-column-header";
import { Checkbox } from "@/components/ui/checkbox";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ClassWithWaliAndCount } from "@/types/database-return.type";
import { GetStudentGradeBadge } from "./get-student-grade-badge";
import { GetClassStatusBadge } from "./get-class-status-badge";
import { DeleteClassAlertDialog } from "./delete-class-alert-dialog";
import { GraduateClassAlertDialog } from "./graduate-class-alert-dialog";

export const classMasterColumns: ColumnDef<ClassWithWaliAndCount>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "namaKelas",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nama Kelas" />
    ),
  },
  {
    accessorKey: "tingkat",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Tingkat" />
    ),
    cell: ({ row }) => GetStudentGradeBadge({ grade: row.getValue("tingkat") }),
  },
  {
    accessorKey: "isLast",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Tingkat Terakhir" />
    ),
    cell: ({ row }) => <div>{row.getValue("isLast") ? "Ya" : "Bukan"}</div>,
  },
  {
    accessorKey: "ruang",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Ruang" />
    ),
    cell: ({ row }) => {
      const ruang = row.original.ruang;

      if (!ruang) {
        return <div>-</div>;
      }

      return <div>{ruang}</div>;
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => GetClassStatusBadge({ status: row.getValue("status") }),
  },
  {
    accessorKey: "waliKelas",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Wali Kelas" />
    ),
    cell: ({ row }) => {
      const waliKelas = row.original.waliKelas;

      if (!waliKelas) {
        return <div>-</div>;
      }

      return <div>{waliKelas.nama}</div>;
    },
  },
  {
    accessorKey: "_count",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Jumlah Siswa" />
    ),
    cell: ({ row }) => <div>{row.original._count.students}</div>,
  },
  {
    id: "actions",
    header: "Aksi",
    cell: function ActionsComponent({ row }) {
      const { id } = row.original;
      const router = useRouter();
      const [isLoading, setIsLoading] = useState(false);
      const [confirmDelete, setConfirmDelete] = useState(false);
      const [confirmGraduate, setConfirmGraduate] = useState(false);

      return (
        <>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="h-8 w-8 p-0"
                disabled={isLoading}
              >
                <span className="sr-only">Open menu</span>
                {isLoading ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <MoreHorizontal className="h-4 w-4" />
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Aksi</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onSelect={() => router.push(`/master/kelas/${id}`)}
              >
                <BookUser />
                Lihat Detail
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={() => router.push(`/master/kelas/${id}/edit`)}
              >
                <UserPen />
                Edit Kelas
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setConfirmGraduate(true)}>
                <GraduationCap />
                Naikkan Kelas
              </DropdownMenuItem>
              <DropdownMenuItem
                variant="destructive"
                onSelect={() => setConfirmDelete(true)}
              >
                <Trash />
                Hapus Kelas
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DeleteClassAlertDialog
            setIsLoading={setIsLoading}
            classId={row.original.id}
            open={confirmDelete}
            setOpen={setConfirmDelete}
          />
          <GraduateClassAlertDialog
            classId={row.original.id}
            isLast={row.original.isLast}
            open={confirmGraduate}
            setIsLoading={setIsLoading}
            setOpen={setConfirmGraduate}
          />
        </>
      );
    },
  },
];
