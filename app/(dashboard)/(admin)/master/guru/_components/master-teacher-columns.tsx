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
import { enumToReadable, formattedNip, getAvatarFallback } from "@/lib/string";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { GetTeacherStatusBadge } from "./get-teacher-status-badge";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { DeleteTeacherAlertDialog } from "./delete-teacher-alert-dialog";
import { formattedDate } from "@/lib/date";
import { TeacherWithImage } from "@/types/database-return.type";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Spinner } from "@/components/ui/spinner";

export const teacherMasterColumns: ColumnDef<TeacherWithImage>[] = [
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
    accessorKey: "nip",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="NIP" />
    ),
    cell: ({ row }) => (
      <Tooltip>
        <TooltipTrigger>
          <div className="max-w-[100px] text-xs truncate">
            {formattedNip(row.getValue("nip"))}
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>{formattedNip(row.getValue("nip"))}</p>
        </TooltipContent>
      </Tooltip>
    ),
  },
  {
    accessorKey: "nama",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nama" />
    ),

    cell: ({ row }) => {
      const { nama, user } = row.original;

      return (
        <div className="flex items-center gap-3">
          <Avatar className="size-8">
            <AvatarImage src={user.image ?? undefined} />
            <AvatarFallback>{getAvatarFallback(nama)}</AvatarFallback>
          </Avatar>
          {nama}
        </div>
      );
    },
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
    accessorKey: "tanggalLahir",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Tanggal Lahir" />
    ),
    cell: ({ row }) => <div>{formattedDate(row.getValue("tanggalLahir"))}</div>,
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) =>
      GetTeacherStatusBadge({
        status: row.getValue("status"),
      }),
  },
  {
    accessorKey: "tanggalMasuk",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Tanggal Masuk" />
    ),
    cell: ({ row }) => <div>{formattedDate(row.getValue("tanggalMasuk"))}</div>,
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
                onSelect={() => router.push(`/master/guru/${id}`)}
              >
                <BookUser />
                Lihat Detail
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={() => router.push(`/master/guru/${id}/edit`)}
              >
                <UserPen />
                Edit Guru
              </DropdownMenuItem>
              <DropdownMenuItem
                variant="destructive"
                onSelect={() => setConfirmDelete(true)}
              >
                <Trash />
                Hapus Guru
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DeleteTeacherAlertDialog
            setIsLoading={setIsLoading}
            teacherId={row.original.id}
            open={confirmDelete}
            setOpen={setConfirmDelete}
          />
        </>
      );
    },
  },
];
