import { Skeleton } from '@/components/ui/skeleton'

export const UserDropdownSkeleton = () => {
  return (
    <Skeleton className="flex items-center gap-2 bg-accent/50 p-2">
      <Skeleton className="h-8 w-8 rounded-lg" />
      <div className="flex flex-col w-full gap-2 justify-between">
        <Skeleton className="h-2 w-8" />
        <Skeleton className="h-2 w-3/5" />
      </div>
    </Skeleton>
  )
}
