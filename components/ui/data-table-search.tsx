"use client";

import { Table } from "@tanstack/react-table";
import { Input } from "./input";

export function DataTableSearch<TData>({
  table,
  targetKey,
}: {
  table: Table<TData>;
  targetKey: string;
}) {
  return (
    <Input
      placeholder={`Cari berdasarkan ${targetKey}`}
      value={(table.getColumn(targetKey)?.getFilterValue() as string) ?? ""}
      onChange={(event) =>
        table.getColumn(targetKey)?.setFilterValue(event.target.value)
      }
      className="max-w-sm"
    />
  );
}
