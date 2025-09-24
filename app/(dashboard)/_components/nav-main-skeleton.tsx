import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronRight } from "lucide-react";

export const NavMainSkeleton = () => {
  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center gap-2 w-full">
        <Skeleton className="size-4 rounded-sm"></Skeleton>
        <Skeleton className="h-4 w-3/5"></Skeleton>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 w-full">
          <Skeleton className="size-4 rounded-sm"></Skeleton>
          <Skeleton className="h-4 w-3/5"></Skeleton>
        </div>
        <ChevronRight className="size-4 text-muted-foreground" />
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 w-full">
          <Skeleton className="size-4 rounded-sm"></Skeleton>
          <Skeleton className="h-4 w-3/5"></Skeleton>
        </div>
        <ChevronRight className="size-4 text-muted-foreground" />
      </div>
      <div className="flex items-center gap-2 w-full">
        <Skeleton className="size-4 rounded-sm"></Skeleton>
        <Skeleton className="h-4 w-3/5"></Skeleton>
      </div>
      <div className="flex items-center gap-2 w-full">
        <Skeleton className="size-4 rounded-sm"></Skeleton>
        <Skeleton className="h-4 w-3/5"></Skeleton>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 w-full">
          <Skeleton className="size-4 rounded-sm"></Skeleton>
          <Skeleton className="h-4 w-3/5"></Skeleton>
        </div>
        <ChevronRight className="size-4 text-muted-foreground" />
      </div>
    </div>
  );
};
