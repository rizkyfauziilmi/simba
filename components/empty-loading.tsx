import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Spinner } from "@/components/ui/spinner";

interface EmptyLoadingProps {
  title?: string;
  description?: string;
}

export function EmptyLoading({
  title = "Memproses permintaan Anda",
  description = "Mohon tunggu sementara kami memproses permintaan Anda. Jangan segarkan halaman.",
}: EmptyLoadingProps) {
  return (
    <Empty className="w-full">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Spinner />
        </EmptyMedia>
        <EmptyTitle>{title}</EmptyTitle>
        <EmptyDescription>{description}</EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}
