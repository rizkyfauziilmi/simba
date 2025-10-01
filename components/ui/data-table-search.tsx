"use client";

import { Table } from "@tanstack/react-table";
import { Input } from "./input";

export function DataTableSearch<TData>({
  table,
  searchKey,
}: {
  table: Table<TData>;
  searchKey: string;
}) {
  return (
    <Input
      placeholder={`Cari berdasarkan ${searchKey}`}
      value={(table.getColumn(searchKey)?.getFilterValue() as string) ?? ""}
      onChange={(event) =>
        table.getColumn(searchKey)?.setFilterValue(event.target.value)
      }
      className="max-w-sm"
    />
  );
}
