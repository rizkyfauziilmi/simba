import { DataTable } from "@/components/ui/data-table";
import {
  Subject,
  subjectMasterColumns,
} from "./_components/master-subject-columns";
import { MasterSubjectHeader } from "./_components/master-subject-header";

async function getData(): Promise<Subject[]> {
  return [
    {
      id: "728ed52f",
      name: "Python",
      difficulty: "Intermediate",
    },
    {
      id: "728ed52f",
      name: "JavaScript",
      difficulty: "Beginner",
    },
  ];
}

export default async function MasterMapelPage() {
  const subjects = await getData();

  return (
    <div className="space-y-4">
      <MasterSubjectHeader />
      <DataTable columns={subjectMasterColumns} data={subjects} />
    </div>
  );
}
