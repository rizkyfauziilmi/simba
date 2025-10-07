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

interface DeleteClassAlertDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  setIsLoading: (isLoading: boolean) => void;
  classId: string;
}

export function DeleteClassAlertDialog({
  open,
  setOpen,
  setIsLoading,
  classId,
}: DeleteClassAlertDialogProps) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const deleteClassMutationOptions = trpc.class.deleteClass.mutationOptions({
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: trpc.student.pathKey(),
      });
      queryClient.invalidateQueries({
        queryKey: trpc.teacher.pathKey(),
      });
      queryClient.invalidateQueries({
        queryKey: trpc.class.pathKey(),
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
  const deleteClassMutation = useMutation(deleteClassMutationOptions);
  const isDeleting = deleteClassMutation.isPending;

  return (
    <AlertDialog open={open} onOpenChange={(open) => setOpen(open)}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Apakah Anda yakin ingin menghapus kelas ini?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Tindakan ini tidak dapat dibatalkan. Ini akan menghapus kelas dan
            mengeluarkan semua siswa dari kelas ini.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Batal</AlertDialogCancel>
          <AlertDialogAction
            disabled={isDeleting}
            onClick={() =>
              deleteClassMutation.mutate({
                classId,
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
