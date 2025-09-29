import { Button } from "@/components/ui/button";
import { DownloadIcon, UserPlus } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const MasterStudentHeader = () => {
  return (
    <div className="flex items-center justify-between">
      <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
        Daftar Siswa
      </h3>
      <div className="space-x-4">
        <Button variant="outline">
          <UserPlus />
          Tambah Siswa
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary">
              <DownloadIcon />
              Unduh Data
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Format File</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>CSV</DropdownMenuItem>
            <DropdownMenuItem>Excel</DropdownMenuItem>
            <DropdownMenuItem>PDF</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};
