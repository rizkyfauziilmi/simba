"use client";

import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, Ban, KeyRound, Cookie } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { useQuery } from "@tanstack/react-query";
import { GetRoleBadge } from "@/app/(dashboard)/_components/role-badge";
import { formattedDate } from "@/lib/date";
import { SetUserPasswordDialog } from "./set-user-password-dialog";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { BanUserAlertDialog } from "./ban-user-alert-dialog";
import { DeleteUserAlertDialog } from "./delete-user-alert-dialog";
import { UnbanButton } from "./unban-button";
import { ImpersonateButton } from "./impersonate-button";
import { RevokeAllUserSessionAlertDialog } from "./revoke-all-user-session-alert-dialog";
import { useDebounce } from "@uidotdev/usehooks";

export function UserTable() {
  const [searchEmail, setSearchEmail] = useState<string | undefined>(undefined);
  const debouncedEmail = useDebounce(searchEmail, 300);
  const [isOpenDialogPs, setIsOpenDialogPs] = useState(false);
  const [isOpenDialogBan, setIsOpenDialogBan] = useState(false);
  const [isOpenDialogDelete, setIsOpenDialogDelete] = useState(false);
  const [isOpenDialogRevoke, setIsOpenDialogRevoke] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const { data: session } = authClient.useSession();

  const {
    data: usersData,
    isPending,
    error,
  } = useQuery({
    queryKey: ["users", debouncedEmail],
    queryFn: async () => {
      const users = await authClient.admin.listUsers({
        query: {
          searchValue: debouncedEmail,
          searchField: "email",
          searchOperator: "contains",
          filterField: "id",
          filterValue: session?.user.id || "",
          filterOperator: "ne",
        },
      });
      return users;
    },
  });

  if (error) {
    return <div>Gagal memuat pengguna.</div>;
  }

  return (
    <div>
      <Input
        type="text"
        placeholder="Cari berdasarkan email..."
        className="mb-4"
        value={searchEmail ?? ""}
        onChange={(e) => setSearchEmail(e.target.value)}
      />
      {isPending || !usersData || !usersData.data ? (
        <div>Memuat...</div>
      ) : (
        <>
          <div className="overflow-x-auto rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Peran</TableHead>
                  <TableHead>Status Blokir</TableHead>
                  <TableHead>Tanggal Dibuat</TableHead>
                  <TableHead>Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {usersData.data.users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      {GetRoleBadge(
                        (user.role as "student" | "teacher" | "admin") ??
                          "student",
                      )}
                    </TableCell>
                    <TableCell>
                      {user.banned ? (
                        <Badge variant="destructive">Diblokir</Badge>
                      ) : (
                        <Badge variant="default">Aktif</Badge>
                      )}
                    </TableCell>
                    <TableCell>{formattedDate(user.createdAt)}</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              type="button"
                              size="icon"
                              variant="outline"
                              onClick={() => {
                                setSelectedUserId(user.id);
                                setIsOpenDialogPs(true);
                              }}
                            >
                              <KeyRound />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Atur kata sandi untuk {user.email}</p>
                          </TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span tabIndex={0}>
                              <ImpersonateButton userId={user.id} />
                            </span>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Menyamar sebagai {user.email}</p>
                          </TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            {user.banned ? (
                              <span tabIndex={0}>
                                <UnbanButton userId={user.id} />
                              </span>
                            ) : (
                              <Button
                                type="button"
                                size="icon"
                                variant="destructive"
                                onClick={() => {
                                  setSelectedUserId(user.id);
                                  setIsOpenDialogBan(true);
                                }}
                              >
                                <Ban />
                              </Button>
                            )}
                          </TooltipTrigger>
                          <TooltipContent>
                            {user.banned ? (
                              <p>Buka blokir {user.email}</p>
                            ) : (
                              <p>Blokir {user.email}</p>
                            )}
                          </TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              size="icon"
                              variant="destructive"
                              onClick={() => {
                                setSelectedUserId(user.id);
                                setIsOpenDialogDelete(true);
                              }}
                            >
                              <Trash2 />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Hapus {user.email}</p>
                          </TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              size="icon"
                              variant="destructive"
                              onClick={() => {
                                setSelectedUserId(user.id);
                                setIsOpenDialogRevoke(true);
                              }}
                            >
                              <Cookie />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Cabut semua sesi untuk {user.email}</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mt-4">
              Total: {usersData.data.users.length} pengguna
            </p>
          </div>
        </>
      )}
      {selectedUserId && (
        <SetUserPasswordDialog
          isOpen={isOpenDialogPs}
          setIsOpen={setIsOpenDialogPs}
          userId={selectedUserId}
        />
      )}
      {selectedUserId && (
        <BanUserAlertDialog
          isOpen={isOpenDialogBan}
          setIsOpen={setIsOpenDialogBan}
          userId={selectedUserId}
        />
      )}
      {selectedUserId && (
        <DeleteUserAlertDialog
          isOpen={isOpenDialogDelete}
          setIsOpen={setIsOpenDialogDelete}
          userId={selectedUserId}
        />
      )}
      {selectedUserId && (
        <RevokeAllUserSessionAlertDialog
          isOpen={isOpenDialogRevoke}
          setIsOpen={setIsOpenDialogRevoke}
          userId={selectedUserId}
        />
      )}
    </div>
  );
}
