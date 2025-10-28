'use client'

import { ColumnDef } from '@tanstack/react-table'
import { Ban, Cookie, KeyRound, Mail, MoreHorizontal, Trash2, VenetianMask } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { DataTableColumnHeader } from '@/components/data-table-column-header'
import { Checkbox } from '@/components/ui/checkbox'
import { useState } from 'react'
import { UserWithRole } from 'better-auth/plugins'
import { GetRoleBadge } from '@/app/(dashboard)/_components/role-badge'
import { Badge } from '@/components/ui/badge'
import { formattedDate } from '@/lib/date'
import { SetUserPasswordDialog } from './set-user-password-dialog'
import { BanUserAlertDialog } from './ban-user-alert-dialog'
import { DeleteUserAlertDialog } from './delete-user-alert-dialog'
import { RevokeAllUserSessionAlertDialog } from './revoke-all-user-session-alert-dialog'
import { ImpersonateButton } from './impersonate-button'
import { UnbanButton } from './unban-button'
import { Spinner } from '@/components/ui/spinner'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { getAvatarFallback } from '@/lib/string'
import { UpdateEmailDialog } from './update-email-dialog'
import { authClient } from '@/lib/auth-client'

export const userColumns: ColumnDef<UserWithRole>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={value => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={value => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'name',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Nama" />,
    cell: ({ row }) => {
      const { name, image } = row.original
      return (
        <div className="flex items-center gap-2">
          <Avatar className="size-8">
            <AvatarImage src={image ?? undefined} />
            <AvatarFallback>{getAvatarFallback(name)}</AvatarFallback>
          </Avatar>
          {name}
        </div>
      )
    },
  },
  {
    accessorKey: 'email',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Email" />,
  },
  {
    accessorKey: 'role',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Peran" />,
    cell: ({ row }) => {
      const { role } = row.original
      return GetRoleBadge((role as 'student' | 'teacher' | 'admin') ?? 'student')
    },
  },
  {
    accessorKey: 'banned',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Status Blokir" />,
    cell: ({ row }) => {
      const { banned } = row.original
      return (
        <Badge variant={banned ? 'destructive' : 'success'}>{banned ? 'Diblokir' : 'Aktif'}</Badge>
      )
    },
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Tanggal Dibuat" />,
    cell: ({ row }) => {
      const { createdAt } = row.original
      return <div>{formattedDate(createdAt)}</div>
    },
  },
  {
    id: 'actions',
    header: 'Aksi',
    cell: function ActionsComponent({ row }) {
      const { id, banned } = row.original
      const { data: session } = authClient.useSession()
      const [isOpenDialogPs, setIsOpenDialogPs] = useState(false)
      const [isOpenDialogBan, setIsOpenDialogBan] = useState(false)
      const [isOpenDialogDelete, setIsOpenDialogDelete] = useState(false)
      const [isOpenDialogRevoke, setIsOpenDialogRevoke] = useState(false)
      const [isOpenDialogUpdateEmail, setIsOpenDialogUpdateEmail] = useState(false)
      const [isLoading, setIsLoading] = useState(false)

      const isMe = session?.user.id === id

      return (
        <>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" disabled={isLoading || isMe}>
                <span className="sr-only">Open menu</span>
                {isLoading ? <Spinner /> : <MoreHorizontal className="h-4 w-4" />}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Aksi</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={() => setIsOpenDialogPs(true)}>
                <KeyRound />
                Atur Ulang Kata Sandi
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setIsOpenDialogUpdateEmail(true)}>
                <Mail />
                Atur Ulang Email
              </DropdownMenuItem>
              {banned === true ? (
                <DropdownMenuItem disabled>
                  <VenetianMask />
                  Tidak Tersedia (Diblokir)
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem>
                  <ImpersonateButton
                    onStart={() => setIsLoading(true)}
                    onComplete={() => setIsLoading(false)}
                    userId={id}
                  />
                </DropdownMenuItem>
              )}
              {banned === true ? (
                <DropdownMenuItem>
                  <UnbanButton
                    onStart={() => setIsLoading(true)}
                    onComplete={() => setIsLoading(false)}
                    userId={id}
                  />
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem onSelect={() => setIsOpenDialogBan(true)} variant="destructive">
                  <Ban />
                  Blokir Pengguna
                </DropdownMenuItem>
              )}
              <DropdownMenuItem onSelect={() => setIsOpenDialogRevoke(true)} variant="destructive">
                <Cookie />
                Cabut Semua Sesi
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setIsOpenDialogDelete(true)} variant="destructive">
                <Trash2 />
                Hapus Pengguna
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <SetUserPasswordDialog
            isOpen={isOpenDialogPs}
            setIsOpen={setIsOpenDialogPs}
            onStart={() => setIsLoading(true)}
            onComplete={() => setIsLoading(false)}
            userId={id}
          />
          <UpdateEmailDialog
            isOpen={isOpenDialogUpdateEmail}
            setIsOpen={setIsOpenDialogUpdateEmail}
            onStart={() => setIsLoading(true)}
            onComplete={() => setIsLoading(false)}
            userId={id}
          />
          <BanUserAlertDialog
            isOpen={isOpenDialogBan}
            setIsOpen={setIsOpenDialogBan}
            onStart={() => setIsLoading(true)}
            onComplete={() => setIsLoading(false)}
            userId={id}
          />
          <DeleteUserAlertDialog
            isOpen={isOpenDialogDelete}
            setIsOpen={setIsOpenDialogDelete}
            onStart={() => setIsLoading(true)}
            onComplete={() => setIsLoading(false)}
            userId={id}
          />
          <RevokeAllUserSessionAlertDialog
            isOpen={isOpenDialogRevoke}
            setIsOpen={setIsOpenDialogRevoke}
            onStart={() => setIsLoading(true)}
            onComplete={() => setIsLoading(false)}
            userId={id}
          />
        </>
      )
    },
  },
]
