import { DataTable } from "@/components/ui/data-table";
import {
  studentMasterColumns,
  Student,
} from "./_components/master-student-columns";
import { MasterStudentHeader } from "./_components/master-student-header";

async function getData(): Promise<Student[]> {
  return [
    {
      id: "728ed52f",
      grade: "10",
      name: "John Doe",
      email: "john.doe@example.com",
    },
    {
      id: "728ed52f",
      grade: "10",
      name: "Jane Doe",
      email: "jane.doe@example.com",
    },
    {
      id: "728ed52f",
      grade: "10",
      name: "Alice Smith",
      email: "alice.smith@example.com",
    },
    {
      id: "728ed52f",
      grade: "10",
      name: "Bob Johnson",
      email: "bob.johnson@example.com",
    },
    {
      id: "728ed52f",
      grade: "10",
      name: "Charlie Brown",
      email: "charlie.brown@example.com",
    },
    {
      id: "728ed52f",
      grade: "10",
      name: "David Lee",
      email: "david.lee@example.com",
    },
  ];
}

export default async function MasterSiswaPage() {
  const students = await getData();

  return (
    <div className="space-y-4">
      <MasterStudentHeader />
      <DataTable columns={studentMasterColumns} data={students} />
    </div>
  );
}
