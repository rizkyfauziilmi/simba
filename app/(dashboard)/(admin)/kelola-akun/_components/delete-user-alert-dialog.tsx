"use client";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { useState } from "react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { authClient } from "@/lib/auth-client";
import { Spinner } from "@/components/ui/spinner";

interface DeleteUserAlertDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  onStart?: () => void;
  onComplete?: () => void;
  userId: string;
}

export function DeleteUserAlertDialog({
  isOpen,
  setIsOpen,
  userId,
  onStart,
  onComplete,
}: DeleteUserAlertDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();

  const deleteUser = async () => {
    const { error } = await authClient.admin.removeUser({
      userId,
    });

    if (error) {
      toast.error("Gagal menghapus pengguna", {
        description: error.message,
      });

      return;
    }

    queryClient.invalidateQueries({ queryKey: ["users"] });
    setIsOpen(false);
    toast.success("Pengguna berhasil dihapus");
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Apakah Anda yakin ingin menghapus pengguna ini?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Tindakan ini tidak dapat dibatalkan. Pengguna akan dihapus secara
            permanen dari sistem.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isSubmitting}>Batal</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              onStart?.();
              setIsSubmitting(true);
              deleteUser().finally(() => {
                setIsSubmitting(false);
                onComplete?.();
              });
            }}
            disabled={isSubmitting}
          >
            {isSubmitting && <Spinner />}
            {isSubmitting ? "Menghapus..." : "Hapus Pengguna"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
