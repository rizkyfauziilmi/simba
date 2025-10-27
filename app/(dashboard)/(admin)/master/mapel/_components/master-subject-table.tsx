"use client";

import { DataTable } from "@/components/ui/data-table";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { subjectMasterColumns } from "./master-subject-columns";

export function MasterSubjectTable() {
  const trpc = useTRPC();
  const { data: subjects } = useSuspenseQuery(
    trpc.subject.getAllSubjects.queryOptions(),
  );

  return <DataTable columns={subjectMasterColumns} data={subjects} />;
}
