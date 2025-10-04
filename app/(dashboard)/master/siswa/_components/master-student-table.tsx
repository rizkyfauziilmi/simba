"use client";

import { DataTable } from "@/components/ui/data-table";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { studentMasterColumns } from "./master-student-columns";

export function MasterStudentTable() {
  const trpc = useTRPC();
  const { data: students } = useSuspenseQuery(
    trpc.student.getAllStudents.queryOptions(),
  );

  return <DataTable columns={studentMasterColumns} data={students} />;
}
