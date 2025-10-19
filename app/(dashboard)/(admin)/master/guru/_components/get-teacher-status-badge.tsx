import { Badge } from "@/components/ui/badge";
import { TeacherStatus } from "@/lib/generated/prisma";
import { enumToReadable } from "@/lib/string";

export function GetTeacherStatusBadge({ status }: { status: TeacherStatus }) {
  return (
    <Badge
      variant={
        status === "AKTIF"
          ? "default"
          : status === "CUTI"
            ? "secondary"
            : "destructive"
      }
    >
      {enumToReadable(status)}
    </Badge>
  );
}
