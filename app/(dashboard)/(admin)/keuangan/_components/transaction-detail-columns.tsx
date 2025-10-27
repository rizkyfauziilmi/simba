"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, Trash } from "lucide-react";

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
import { useState } from "react";
import { formatIDR, getAvatarFallback } from "@/lib/string";
import { TransactionFinanceRecord } from "@/types/database-return.type";
import { formattedDate } from "@/lib/date";
import { DeleteTransactionAlertDialog } from "./delete-transaction-alert-dialog";
import { GetBadgeTransactionType } from "@/components/get-badge-transaction-type";
import { Spinner } from "@/components/ui/spinner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const transactionDetailColumns: ColumnDef<TransactionFinanceRecord>[] = [
  {
    accessorKey: "date",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Tanggal" />
    ),
    cell: ({ row }) => <div>{formattedDate(row.getValue("date"))}</div>,
  },
  {
    accessorKey: "type",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Tipe" />
    ),
    cell: ({ row }) =>
      GetBadgeTransactionType({
        type: row.getValue("type"),
      }),
  },
  {
    accessorKey: "category",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Kategori" />
    ),
  },
  {
    accessorKey: "description",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Keterangan" />
    ),
    cell: ({ row }) => {
      const description = row.original.description;
      return <div>{description ? description : "-"}</div>;
    },
  },
  {
    accessorKey: "user",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Pencatat" />
    ),
    cell: ({ row }) => {
      const user = row.original.user;

      if (!user)
        return (
          <div className="flex items-center gap-2">
            <Avatar className="size-8">
              <AvatarImage src={undefined} />
              <AvatarFallback>
                {getAvatarFallback("Tidak Diketahui")}
              </AvatarFallback>
            </Avatar>
            Tidak Diketahui
          </div>
        );

      const { name, image } = user;

      return (
        <div className="flex items-center gap-2">
          <Avatar className="size-8">
            <AvatarImage src={image ?? undefined} />
            <AvatarFallback>{getAvatarFallback(name)}</AvatarFallback>
          </Avatar>
          {name}
        </div>
      );
    },
  },
  {
    accessorKey: "amount",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Jumlah" />
    ),
    cell: ({ row }) => <div>{formatIDR(row.getValue("amount"))}</div>,
  },
  {
    id: "actions",
    header: "Aksi",
    cell: function ActionsComponent({ row }) {
      const { id } = row.original;
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
                variant="destructive"
                onSelect={() => setConfirmDelete(true)}
              >
                <Trash />
                Hapus Transaksi
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DeleteTransactionAlertDialog
            setIsLoading={setIsLoading}
            transactionId={id}
            open={confirmDelete}
            setOpen={setConfirmDelete}
          />
        </>
      );
    },
  },
];
