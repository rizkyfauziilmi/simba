import { Skeleton } from '@/components/ui/skeleton'

export const NavSecondarySkeleton = () => {
  return (
    <div className="p-4 space-y-4 mt-auto">
      <div className="flex items-center gap-2 w-full">
        <Skeleton className="size-4 rounded-sm"></Skeleton>
        <Skeleton className="h-4 w-3/5"></Skeleton>
      </div>
      <div className="flex items-center gap-2 w-full">
        <Skeleton className="size-4 rounded-sm"></Skeleton>
        <Skeleton className="h-4 w-3/5"></Skeleton>
      </div>
      <div className="flex items-center gap-2 w-full">
        <Skeleton className="size-4 rounded-sm"></Skeleton>
        <Skeleton className="h-4 w-3/5"></Skeleton>
      </div>
    </div>
  )
}
