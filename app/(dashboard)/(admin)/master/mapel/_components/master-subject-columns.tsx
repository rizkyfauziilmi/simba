"use client";

import { ColumnDef } from "@tanstack/react-table";
import { BookUser, MoreHorizontal, Trash, UserPen } from "lucide-react";

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
import { useState } from "react";
import { DeleteSubjectAlertDialog } from "./delete-subject-alert-dialog";
import { useRouter } from "next/navigation";
import { SubjectWithScheduleCount } from "@/types/database-return.type";
import { Spinner } from "@/components/ui/spinner";

export const subjectMasterColumns: ColumnDef<SubjectWithScheduleCount>[] = [
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
    accessorKey: "kode",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Kode" />
    ),
  },
  {
    accessorKey: "nama",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nama Pelajaran" />
    ),
  },
  {
    accessorKey: "deskripsi",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Deskripsi" />
    ),
    cell: ({ row }) => {
      const deskripsi = row.original.deskripsi;

      return <div>{deskripsi ? deskripsi : "-"}</div>;
    },
  },
  {
    accessorKey: "_count",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Jumlah Jadwal" />
    ),
    cell: ({ row }) => <div>{row.original._count.schedules}</div>,
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
                  <Spinner />
                ) : (
                  <MoreHorizontal className="h-4 w-4" />
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Aksi</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onSelect={() => router.push(`/master/mapel/${id}`)}
              >
                <BookUser />
                Lihat Detail
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={() => router.push(`/master/mapel/${id}/edit`)}
              >
                <UserPen />
                Edit Mapel
              </DropdownMenuItem>
              <DropdownMenuItem
                variant="destructive"
                onSelect={() => setConfirmDelete(true)}
              >
                <Trash />
                Hapus Mapel
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DeleteSubjectAlertDialog
            setIsLoading={setIsLoading}
            subjectId={row.original.id}
            open={confirmDelete}
            setOpen={setConfirmDelete}
          />
        </>
      );
    },
  },
];
