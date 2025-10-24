import { FinanceType } from "@/lib/generated/prisma";
import { Badge } from "./ui/badge";
import { TrendingDown, TrendingUp } from "lucide-react";

export function GetBadgeTransactionType({ type }: { type: FinanceType }) {
  return type === "PEMASUKAN" ? (
    <Badge variant="default" className="gap-1">
      <TrendingUp className="h-3 w-3" />
      Pemasukan
    </Badge>
  ) : (
    <Badge variant="destructive" className="gap-1">
      <TrendingDown className="h-3 w-3" />
      Pengeluaran
    </Badge>
  );
}
