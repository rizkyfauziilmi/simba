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

interface DeleteTeacherAlertDialogProps {
  open: boolean
  setOpen: (open: boolean) => void
  setIsLoading: (isLoading: boolean) => void
  teacherId: string
}

export function DeleteTeacherAlertDialog({
  open,
  setOpen,
  setIsLoading,
  teacherId,
}: DeleteTeacherAlertDialogProps) {
  const trpc = useTRPC()
  const queryClient = useQueryClient()

  const deleteTeacherMutationOptions = trpc.teacher.deleteTeacher.mutationOptions({
    onSuccess: data => {
      queryClient.invalidateQueries({
        queryKey: trpc.student.pathKey(),
      })
      queryClient.invalidateQueries({
        queryKey: trpc.teacher.pathKey(),
      })
      queryClient.invalidateQueries({
        queryKey: trpc.class.pathKey(),
      })
      queryClient.invalidateQueries({
        queryKey: trpc.subject.pathKey(),
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
  const deleteTeacherMutation = useMutation(deleteTeacherMutationOptions)
  const isDeleting = deleteTeacherMutation.isPending

  return (
    <AlertDialog open={open} onOpenChange={open => setOpen(open)}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Apakah Anda yakin ingin menghapus guru ini?</AlertDialogTitle>
          <AlertDialogDescription>
            Aksi ini tidak dapat dibatalkan. Ini akan menghapus guru dan menghapus data guru dari
            server kami.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Batal</AlertDialogCancel>
          <AlertDialogAction
            disabled={isDeleting}
            onClick={() =>
              deleteTeacherMutation.mutate({
                teacherId,
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
