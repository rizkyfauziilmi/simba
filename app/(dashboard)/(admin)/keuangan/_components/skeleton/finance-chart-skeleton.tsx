import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

const MIN_HEIGHT = 250;
const MAX_HEIGHT = 384;

export function FinanceChartSkeleton() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <Skeleton className="h-4 w-4/12" />
        </CardTitle>
        <CardDescription>
          <Skeleton className="h-4 w-1/2" />
        </CardDescription>
      </CardHeader>
      <CardContent className="h-96 relative flex items-end justify-between mt-24">
        {Array.from({ length: 6 }).map((_, index) => {
          const randomLeftHeight =
            Math.floor(Math.random() * (MAX_HEIGHT - MIN_HEIGHT + 1)) +
            MIN_HEIGHT;
          const randomRightHeight =
            Math.floor(Math.random() * (MAX_HEIGHT - MIN_HEIGHT + 1)) +
            MIN_HEIGHT;

          return (
            <ChartSkeletonBar
              key={index}
              leftHeight={randomLeftHeight}
              rightHeight={randomRightHeight}
            />
          );
        })}
        <div className="z-10 absolute inset-0 flex flex-col justify-between pb-5">
          <div className="bg-muted w-full h-0.5"></div>
          <div className="bg-muted w-full h-0.5"></div>
          <div className="bg-muted w-full h-0.5"></div>
          <div className="bg-muted w-full h-0.5"></div>
        </div>
      </CardContent>
    </Card>
  );
}

function ChartSkeletonBar({
  leftHeight = 384,
  rightHeight = 384,
}: {
  leftHeight?: number;
  rightHeight?: number;
}) {
  // The issue with cn is that Tailwind does not parse dynamic values inside square brackets in template strings.
  // Instead, use inline style for dynamic heights.
  return (
    <div className="flex items-center gap-2 z-20 flex-col">
      <div className="flex gap-1 items-end">
        <Skeleton
          className={cn("w-12 rounded-md")}
          style={{ height: leftHeight }}
        />
        <Skeleton
          className={cn("w-12 rounded-md")}
          style={{ height: rightHeight }}
        />
      </div>
      <Skeleton className="h-3 w-16 rounded-md" />
    </div>
  );
}
