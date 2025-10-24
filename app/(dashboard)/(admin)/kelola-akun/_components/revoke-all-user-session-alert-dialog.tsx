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
import { authClient } from "@/lib/auth-client";
import { Spinner } from "@/components/ui/spinner";

interface RevokeAllUserSessionAlertDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  onStart?: () => void;
  onComplete?: () => void;
  userId: string;
}

export function RevokeAllUserSessionAlertDialog({
  isOpen,
  setIsOpen,
  userId,
  onStart,
  onComplete,
}: RevokeAllUserSessionAlertDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const revokeAllSession = async () => {
    const { error } = await authClient.admin.revokeUserSessions({
      userId,
    });

    if (error) {
      toast.error("Gagal mencabut sesi pengguna", {
        description: error.message,
      });

      return;
    }

    setIsOpen(false);
    toast.success("Semua sesi pengguna berhasil dicabut");
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Apakah Anda yakin ingin mencabut semua sesi untuk pengguna ini?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Tindakan ini akan mengeluarkan pengguna dari semua perangkat dan
            membatalkan semua sesi aktif.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isSubmitting}>Batal</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              onStart?.();
              setIsSubmitting(true);
              revokeAllSession().finally(() => {
                setIsSubmitting(false);
                onComplete?.();
              });
            }}
            disabled={isSubmitting}
          >
            {isSubmitting && <Spinner />}
            {isSubmitting ? "Memproses..." : "Cabut Semua Sesi"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
