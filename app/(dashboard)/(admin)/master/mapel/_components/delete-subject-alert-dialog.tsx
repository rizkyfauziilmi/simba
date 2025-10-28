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

interface DeleteSubjectAlertDialogProps {
  open: boolean
  setOpen: (open: boolean) => void
  setIsLoading: (isLoading: boolean) => void
  subjectId: string
}

export function DeleteSubjectAlertDialog({
  open,
  setOpen,
  setIsLoading,
  subjectId,
}: DeleteSubjectAlertDialogProps) {
  const trpc = useTRPC()
  const queryClient = useQueryClient()

  const deleteSubjectMutationOptions = trpc.subject.deleteSubject.mutationOptions({
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
  const deleteSubjectMutation = useMutation(deleteSubjectMutationOptions)
  const isDeleting = deleteSubjectMutation.isPending

  return (
    <AlertDialog open={open} onOpenChange={open => setOpen(open)}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Apakah Anda yakin ingin menghapus mata pelajaran ini?</AlertDialogTitle>
          <AlertDialogDescription>
            Menghapus mata pelajaran ini akan menghapus semua data terkait mata pelajaran ini,
            termasuk jadwal, guru pengampu, dan lainnya.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Batal</AlertDialogCancel>
          <AlertDialogAction
            disabled={isDeleting}
            onClick={() =>
              deleteSubjectMutation.mutate({
                subjectId,
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
