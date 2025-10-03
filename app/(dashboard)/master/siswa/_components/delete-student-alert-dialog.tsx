"use client";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface DeleteStudentAlertDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  setIsLoading: (isLoading: boolean) => void;
  studentId: string;
}

export function DeleteStudentAlertDialog({
  open,
  setOpen,
  setIsLoading,
  studentId,
}: DeleteStudentAlertDialogProps) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const deleteStudentMutationOptions =
    trpc.student.deleteStudent.mutationOptions({
      onSuccess: (data) => {
        queryClient.invalidateQueries({
          queryKey: trpc.student.getAllStudents.queryKey(),
        });
        toast.success(data.message);
        setOpen(false);
      },
      onError: (error) => {
        toast.error(error.message);
        setOpen(false);
      },
      onMutate: () => {
        setIsLoading(true);
      },
      onSettled: () => {
        setIsLoading(false);
      },
    });
  const deleteStudentMutation = useMutation(deleteStudentMutationOptions);
  const isDeleting = deleteStudentMutation.isPending;

  return (
    <AlertDialog open={open} onOpenChange={(open) => setOpen(open)}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Apakah Anda yakin ingin menghapus siswa ini?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Aksi ini tidak dapat dibatalkan. Ini akan menghapus siswa dan
            menghapus data siswa dari server kami.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Batal</AlertDialogCancel>
          <AlertDialogAction
            disabled={isDeleting}
            onClick={() =>
              deleteStudentMutation.mutate({
                studentId,
              })
            }
          >
            {isDeleting ? "Menghapus..." : "Ya, Hapus"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
