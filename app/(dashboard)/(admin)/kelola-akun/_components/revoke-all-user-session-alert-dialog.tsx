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
import { authClient } from "@/lib/auth-client";

interface RevokeAllUserSessionAlertDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  userId: string;
}

export function RevokeAllUserSessionAlertDialog({
  isOpen,
  setIsOpen,
  userId,
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
              setIsSubmitting(true);
              revokeAllSession().finally(() => setIsSubmitting(false));
            }}
            disabled={isSubmitting}
          >
            {isSubmitting && <Loader2Icon className="animate-spin" />}
            {isSubmitting ? "Memproses..." : "Cabut Semua Sesi"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
