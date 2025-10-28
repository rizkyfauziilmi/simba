import { Separator } from '../ui/separator'
import { Skeleton } from '../ui/skeleton'

export function TableSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Skeleton className="w-full md:w-2/5 rounded-md h-8" />
        <Skeleton className="w-1/9 hidden md:block rounded-md h-8" />
      </div>
      <div className="flex flex-col gap-4 border rounded-sm py-4">
        <TableRow />
        <Separator />
        <TableRow />
        <Separator />
        <TableRow />
        <Separator />
        <TableRow />
        <Separator />
        <TableRow />
        <Separator />
        <TableRow />
        <Separator />
        <TableRow />
        <Separator />
        <TableRow />
        <Separator />
        <TableRow />
        <Separator />
        <TableRow />
      </div>
      <div className="flex items-center justify-between">
        <Skeleton className="w-1/7 h-3" />
        <div className="flex items-center gap-2">
          <Skeleton className="size-8 rounded-md" />
          <Skeleton className="size-8 rounded-md" />
          <Skeleton className="size-8 rounded-md" />
          <Skeleton className="size-8 rounded-md" />
        </div>
      </div>
    </div>
  )
}

function TableRow() {
  return (
    <div className="flex items-center justify-between px-2">
      <Skeleton className="w-1/10 rounded-md h-4" />
      <Skeleton className="w-1/10 rounded-md h-4" />
      <Skeleton className="w-1/10 rounded-md h-4" />
      <Skeleton className="w-1/10 rounded-md h-4" />
      <Skeleton className="w-1/10 rounded-md h-4" />
      <Skeleton className="w-1/10 rounded-md h-4" />
    </div>
  )
}
