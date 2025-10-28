'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useState } from 'react'
import { authClient } from '@/lib/auth-client'
import { toast } from 'sonner'
import { Spinner } from '@/components/ui/spinner'
import z from 'zod'
import { useQueryClient } from '@tanstack/react-query'

interface UpdateEmailDialogProps {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  onStart?: () => void
  onComplete?: () => void
  userId: string
}

export function UpdateEmailDialog({
  userId,
  isOpen,
  setIsOpen,
  onStart,
  onComplete,
}: UpdateEmailDialogProps) {
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const queryClient = useQueryClient()

  const updateEmail = async () => {
    const isEmail = z.email().safeParse(email).success

    if (!isEmail) {
      toast.error('Email tidak valid')
      return
    }

    const { error } = await authClient.admin.updateUser({
      userId,
      data: {
        email,
      },
    })

    if (error) {
      toast.error('Gagal mengatur email', {
        description: error.message,
      })

      return
    }

    queryClient.invalidateQueries({ queryKey: ['users'] })

    toast.success('Email berhasil diperbarui')
    setEmail('')
    setIsOpen(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Atur Email Pengguna</DialogTitle>
          <DialogDescription>Email digunakan untuk masuk ke akun pengguna.</DialogDescription>
        </DialogHeader>
        <div className="space-y-2">
          <Label htmlFor="updateEmail">Email Baru</Label>
          <div className="relative">
            <Input id="updateEmail" value={email} onChange={e => setEmail(e.target.value)} />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" disabled={isSubmitting}>
              Batal
            </Button>
          </DialogClose>
          <Button
            type="button"
            onClick={() => {
              onStart?.()
              setIsSubmitting(true)
              updateEmail().finally(() => {
                setIsSubmitting(false)
                onComplete?.()
              })
            }}
            disabled={isSubmitting}
          >
            {isSubmitting && <Spinner />}
            {isSubmitting ? 'Menyimpan...' : 'Simpan Email'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
