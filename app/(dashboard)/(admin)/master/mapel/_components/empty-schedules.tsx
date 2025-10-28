import { Button } from '@/components/ui/button'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
import { BrushCleaning } from 'lucide-react'

interface CreateMapelFormProps {
  onClick?: () => void
}

export function EmptySchedules({ onClick }: CreateMapelFormProps) {
  return (
    <Empty className="border border-dashed">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <BrushCleaning />
        </EmptyMedia>
        <EmptyTitle>Tidak ada jadwal yang ditambahkan</EmptyTitle>
        <EmptyDescription>Tekan tombol tambah untuk menambahkan jadwal baru.</EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button variant="outline" size="sm" onClick={onClick}>
          Tambah Jadwal
        </Button>
      </EmptyContent>
    </Empty>
  )
}
