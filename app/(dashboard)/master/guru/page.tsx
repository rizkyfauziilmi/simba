import { DataTable } from "@/components/ui/data-table";
import {
  Teacher,
  teacherMasterColumns,
} from "./_components/master-teacher-columns";
import { MasterTeacherHeader } from "./_components/master-teacher-header";

async function getData(): Promise<Teacher[]> {
  return [
    {
      id: "728ed52f",
      active: true,
      name: "John Doe",
      email: "john.doe@example.com",
    },
    {
      id: "728ed52f",
      active: true,
      name: "Jane Doe",
      email: "jane.doe@example.com",
    },
    {
      id: "728ed52f",
      active: true,
      name: "Alice Smith",
      email: "alice.smith@example.com",
    },
    {
      id: "728ed52f",
      active: true,
      name: "Bob Johnson",
      email: "bob.johnson@example.com",
    },
    {
      id: "728ed52f",
      active: true,
      name: "Charlie Brown",
      email: "charlie.brown@example.com",
    },
    {
      id: "728ed52f",
      active: true,
      name: "David Lee",
      email: "david.lee@example.com",
    },
  ];
}

export default async function MasterGuruPage() {
  const teachers = await getData();

  return (
    <div className="space-y-4">
      <MasterTeacherHeader />
      <DataTable columns={teacherMasterColumns} data={teachers} />
    </div>
  );
}
