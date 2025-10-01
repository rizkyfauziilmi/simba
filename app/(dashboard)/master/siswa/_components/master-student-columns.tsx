"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Loader2, MoreHorizontal, Trash, UserPen } from "lucide-react";

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
import { enumToReadable, formattedDate } from "@/lib/string";
import { Badge } from "@/components/ui/badge";
import { UpdateStudentDialog } from "./update-student-dialog";
import { DeleteStudentAlertDialog } from "./delete-student-alert-dialog";

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
    cell: ({ row }) => (
      <Badge
        variant={row.getValue("status") === "AKTIF" ? "default" : "destructive"}
      >
        {enumToReadable(row.getValue("status"))}
      </Badge>
    ),
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
      const [isLoading, setIsLoading] = useState(false);
      const [confirmDelete, setConfirmDelete] = useState(false);
      const [openUpdateDialog, setOpenUpdateDialog] = useState(false);

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
              <DropdownMenuItem onSelect={() => setOpenUpdateDialog(true)}>
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
          <UpdateStudentDialog
            setIsLoading={setIsLoading}
            student={row.original}
            open={openUpdateDialog}
            setOpen={setOpenUpdateDialog}
          />
        </>
      );
    },
  },
];
