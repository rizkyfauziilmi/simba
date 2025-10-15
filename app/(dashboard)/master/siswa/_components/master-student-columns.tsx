"use client";

import { ColumnDef } from "@tanstack/react-table";
import {
  BookUser,
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
import { Student } from "@/lib/generated/prisma";
import { useState } from "react";
import { enumToReadable } from "@/lib/string";
import { DeleteStudentAlertDialog } from "./delete-student-alert-dialog";
import { useRouter } from "next/navigation";
import { GetStudentStatusBadge } from "./get-student-status-badge";
import { formattedDate } from "@/lib/date";

export const studentMasterColumns: ColumnDef<Student>[] = [
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
    accessorKey: "nisn",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="NISN" />
    ),
  },
  {
    accessorKey: "nama",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nama" />
    ),
  },
  {
    accessorKey: "jenisKelamin",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Jenis Kelamin" />
    ),
    cell: ({ row }) => (
      <div>{enumToReadable(row.getValue("jenisKelamin"))}</div>
    ),
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) =>
      GetStudentStatusBadge({
        status: row.getValue("status"),
      }),
  },
  {
    accessorKey: "tanggalLahir",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Tanggal Lahir" />
    ),
    cell: ({ row }) => <div>{formattedDate(row.getValue("tanggalLahir"))}</div>,
  },
  {
    id: "actions",
    header: "Aksi",
    cell: function ActionsComponent({ row }) {
      const { id } = row.original;
      const router = useRouter();
      const [isLoading, setIsLoading] = useState(false);
      const [confirmDelete, setConfirmDelete] = useState(false);

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
                onSelect={() => router.push(`/master/siswa/${id}`)}
              >
                <BookUser />
                Lihat Detail
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={() => router.push(`/master/siswa/${id}/edit`)}
              >
                <UserPen />
                Edit Siswa
              </DropdownMenuItem>
              <DropdownMenuItem
                variant="destructive"
                onSelect={() => setConfirmDelete(true)}
              >
                <Trash />
                Hapus Siswa
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DeleteStudentAlertDialog
            setIsLoading={setIsLoading}
            studentId={row.original.id}
            open={confirmDelete}
            setOpen={setConfirmDelete}
          />
        </>
      );
    },
  },
];
