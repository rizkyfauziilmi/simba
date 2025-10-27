import { Badge } from "@/components/ui/badge";
import { StudentGrade } from "@/lib/generated/prisma";

export function GetStudentGradeBadge({ grade }: { grade: StudentGrade }) {
  return (
    <Badge
      variant={
        grade === "SMK" ? "default" : grade === "SMP" ? "secondary" : "outline"
      }
    >
      {grade}
    </Badge>
  );
}
