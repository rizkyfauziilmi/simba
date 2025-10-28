'use client'

import { DataTable } from '@/components/ui/data-table'
import { useTRPC } from '@/trpc/client'
import { useSuspenseQuery } from '@tanstack/react-query'
import { teacherMasterColumns } from './master-teacher-columns'

export function MasterTeacherTable() {
  const trpc = useTRPC()
  const { data: teachers } = useSuspenseQuery(trpc.teacher.getAllTeachers.queryOptions())

  return <DataTable columns={teacherMasterColumns} data={teachers} />
}
