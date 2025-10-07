import { Badge } from "@/components/ui/badge";
import { ClassStatus } from "@/lib/generated/prisma";
import { enumToReadable } from "@/lib/string";

export function GetClassStatusBadge({ status }: { status: ClassStatus }) {
  return (
    <Badge variant={status === "AKTIF" ? "default" : "destructive"}>
      {enumToReadable(status)}
    </Badge>
  );
}
