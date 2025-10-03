import { Badge } from "@/components/ui/badge";
import { StudentStatus } from "@/lib/generated/prisma";
import { enumToReadable } from "@/lib/string";

export function GetStudentStatusBadge({ status }: { status: StudentStatus }) {
  return (
    <Badge variant={status === "AKTIF" ? "default" : "destructive"}>
      {enumToReadable(status)}
    </Badge>
  );
}
