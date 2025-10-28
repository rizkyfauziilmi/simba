import { RefreshCcwIcon, ServerCrash } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'

interface EmptyErrorProps {
  title?: string
  description?: string
  onAction?: () => void
}

export function EmptyError({
  title = 'Terjadi kesalahan.',
  description = 'Terjadi error saat memuat data. Silakan coba lagi.',
  onAction,
}: EmptyErrorProps) {
  return (
    <Empty className="from-muted/50 to-background h-full bg-gradient-to-b from-30%">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <ServerCrash />
        </EmptyMedia>
        <EmptyTitle>{title}</EmptyTitle>
        <EmptyDescription>{description}</EmptyDescription>
      </EmptyHeader>
      {onAction && (
        <EmptyContent>
          <Button variant="outline" size="sm">
            <RefreshCcwIcon />
            Refresh
          </Button>
        </EmptyContent>
      )}
    </Empty>
  )
}
