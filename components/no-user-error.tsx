import { UserX2 } from "lucide-react";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "./ui/item";

interface NoUserErrorProps {
  title?: string;
  description?: string;
}

export function NoUserError({
  title = "Tidak ada siswa yang tersedia",
  description = "Hanya siswa dengan status aktif dan yang belum memiliki kelas yang dapat dimasukkan ke dalam kelas ini. Jika tidak ada siswa yang muncul, pastikan kembali data siswa sudah benar.",
}: NoUserErrorProps) {
  return (
    <Item variant="outline">
      <ItemMedia variant="icon">
        <UserX2 />
      </ItemMedia>
      <ItemContent>
        <ItemTitle>{title}</ItemTitle>
        <ItemDescription>{description}</ItemDescription>
      </ItemContent>
    </Item>
  );
}
