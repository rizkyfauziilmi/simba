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
import { Loader2Icon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { authClient } from "@/lib/auth-client";

interface DeleteUserAlertDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  userId: string;
}

export function DeleteUserAlertDialog({
  isOpen,
  setIsOpen,
  userId,
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
              setIsSubmitting(true);
              deleteUser().finally(() => setIsSubmitting(false));
            }}
            disabled={isSubmitting}
          >
            {isSubmitting && <Loader2Icon className="animate-spin" />}
            {isSubmitting ? "Menghapus..." : "Hapus Pengguna"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
