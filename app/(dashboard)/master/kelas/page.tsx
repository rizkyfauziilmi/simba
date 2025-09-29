import { DataTable } from "@/components/ui/data-table";
import { Class, classMasterColumns } from "./_components/master-class-columns";
import { MasterClassHeader } from "./_components/master-class-header";

async function getData(): Promise<Class[]> {
  return [
    {
      id: "728ed52f",
      name: "10 MIPA",
      active: true,
      students: 30,
    },
    {
      id: "728ed52f",
      name: "10 MIPA X",
      active: true,
      students: 25,
    },
    {
      id: "728ed52f",
      name: "12 MIPA",
      active: true,
      students: 20,
    },
  ];
}

export default async function MasterKelasPage() {
  const classes = await getData();

  return (
    <div className="space-y-4">
      <MasterClassHeader />
      <DataTable columns={classMasterColumns} data={classes} />
    </div>
  );
}
