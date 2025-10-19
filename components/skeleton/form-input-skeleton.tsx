import { Skeleton } from "../ui/skeleton";

export function FormInputSkeleton() {
  return (
    <div className="space-y-2">
      <Skeleton className="h-3 w-12" />
      <Skeleton className="h-10 w-full rounded-md" />
    </div>
  );
}
