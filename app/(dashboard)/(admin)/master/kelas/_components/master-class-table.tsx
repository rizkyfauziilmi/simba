"use client";

import { DataTable } from "@/components/ui/data-table";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { classMasterColumns } from "./master-class-columns";

export function MasterClassTable() {
  const trpc = useTRPC();
  const { data: classes } = useSuspenseQuery(
    trpc.class.getAllClasses.queryOptions(),
  );

  return <DataTable columns={classMasterColumns} data={classes} />;
}
