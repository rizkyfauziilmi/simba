"use client";

import { Input } from "./input";

export function DataTableSearch({
  globalFilter,
  setGlobalFilterAction,
}: {
  globalFilter: string;
  setGlobalFilterAction: (value: string) => void;
}) {
  return (
    <Input
      placeholder="Cari berdasarkan kolom apapun..."
      type="search"
      value={globalFilter ?? ""}
      onChange={(e) => setGlobalFilterAction(e.target.value)}
      className="lg:max-w-sm w-full"
    />
  );
}
