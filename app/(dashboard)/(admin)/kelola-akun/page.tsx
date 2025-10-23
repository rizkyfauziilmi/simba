"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { CreateAdminDialog } from "./_components/create-admin-dialog";
import { UserTable } from "./_components/user-table";

export default function KelolaAkunPage() {
  return (
    <Card>
      <div className="flex flex-row items-center justify-between px-6">
        <CardHeader className="flex-1 p-0">
          <CardTitle>Kelola Semua Akun</CardTitle>
          <CardDescription>
            Kelola semua akun pengguna dengan mudah: ubah kata sandi, aktifkan
            penyamaran, dan lakukan pengaturan lainnya.
          </CardDescription>
        </CardHeader>
        <CreateAdminDialog />
      </div>
      <CardContent>
        <UserTable />
      </CardContent>
    </Card>
  );
}
