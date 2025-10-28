'use client'

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/components/ui/alert-dialog'
import { useTRPC } from '@/trpc/client'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

interface DeleteTransactionAlertDialogProps {
  open: boolean
  setOpen: (open: boolean) => void
  setIsLoading: (isLoading: boolean) => void
  transactionId: string
}

export function DeleteTransactionAlertDialog({
  open,
  setOpen,
  setIsLoading,
  transactionId,
}: DeleteTransactionAlertDialogProps) {
  const trpc = useTRPC()
  const queryClient = useQueryClient()

  const deleteTransactionMutationOptions = trpc.finance.deleteTransaction.mutationOptions({
    onSuccess: data => {
      queryClient.invalidateQueries({
        queryKey: trpc.finance.pathKey(),
      })
      toast.success(data.message)
      setOpen(false)
    },
    onError: error => {
      toast.error(error.message)
    },
    onMutate: () => {
      setIsLoading(true)
    },
    onSettled: () => {
      setIsLoading(false)
    },
  })
  const deleteTransactionMutation = useMutation(deleteTransactionMutationOptions)
  const isDeleting = deleteTransactionMutation.isPending

  return (
    <AlertDialog open={open} onOpenChange={open => setOpen(open)}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Apakah Anda yakin ingin menghapus transaksi ini?</AlertDialogTitle>
          <AlertDialogDescription>
            Data transaksi yang dihapus tidak dapat dikembalikan dan saldo akan disesuaikan.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Batal</AlertDialogCancel>
          <AlertDialogAction
            disabled={isDeleting}
            onClick={() =>
              deleteTransactionMutation.mutate({
                transactionId,
              })
            }
          >
            {isDeleting ? 'Menghapus...' : 'Ya, Hapus'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
