import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function FinanceCardSkeleton() {
  return (
    <Card className="bg-card h-44 text-card-foreground">
      <CardHeader className="pb-2">
        <Skeleton className="h-4 w-4/6" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-6 w-full mb-2" />
        <Skeleton className="h-4 w-3/4" />
      </CardContent>
    </Card>
  );
}

export function FinanceCardSkeletonList({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: count }).map((_, index) => (
        <FinanceCardSkeleton key={index} />
      ))}
    </div>
  );
}
