import { Badge } from "@/components/ui/badge";
import { FinanceType } from "@/lib/generated/prisma";
import { enumToReadable } from "@/lib/string";

export function GetTransactionTypeBadge({ type }: { type: FinanceType }) {
  return (
    <Badge variant={type === "PEMASUKAN" ? "default" : "secondary"}>
      {enumToReadable(type)}
    </Badge>
  );
}
