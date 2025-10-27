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
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";
import { useState } from "react";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useQueryClient } from "@tanstack/react-query";
import { secondsToReadable } from "@/lib/date";
import { Spinner } from "@/components/ui/spinner";

interface BanUserAlertDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  onStart?: () => void;
  onComplete?: () => void;
  userId: string;
}

// duration in seconds
const BAN_DURATIONS = [
  {
    label: "1 Jam",
    value: 3600,
  },
  {
    label: "24 Jam",
    value: 86400,
  },
  {
    label: "7 Hari",
    value: 604800,
  },
  {
    label: "30 Hari",
    value: 2592000,
  },
  {
    label: "Permanen",
    value: undefined,
  },
];

export function BanUserAlertDialog({
  isOpen,
  setIsOpen,
  userId,
  onStart,
  onComplete,
}: BanUserAlertDialogProps) {
  const [banReason, setBanReason] = useState("");
  const [banDurationSelect, setBanDurationSelect] = useState("Permanen");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();

  const banUser = async () => {
    const banDuration = BAN_DURATIONS.find(
      (d) => d.label === banDurationSelect,
    );

    const { error } = await authClient.admin.banUser({
      userId: userId,
      banReason,
      banExpiresIn: banDuration?.value,
    });

    if (error) {
      toast.error("Gagal memblokir pengguna", {
        description: error.message,
      });
      return;
    }

    queryClient.invalidateQueries({ queryKey: ["users"] });

    toast.success("Pengguna berhasil diblokir", {
      description: (
        <ul>
          <li>
            <strong>Alasan:</strong> {banReason || "Tidak ada alasan diberikan"}
          </li>
          <li>
            <strong>Durasi:</strong>{" "}
            {banDuration?.value
              ? secondsToReadable(banDuration.value)
              : "Permanen"}
          </li>
        </ul>
      ),
    });
    setIsOpen(false);
    setBanReason("");
    setBanDurationSelect("Permanen");
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Apakah Anda yakin ingin memblokir pengguna ini?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Tindakan ini akan mencegah pengguna mengakses akun dan semua layanan
            terkait. Tindakan ini tidak dapat dibatalkan.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="space-y-2">
          <Label htmlFor="ban-duration" className="mt-4">
            Alasan Pemblokiran (opsional):
          </Label>
          <Input
            id="ban-reason"
            type="text"
            placeholder="Masukkan alasan pemblokiran"
            value={banReason}
            onChange={(e) => setBanReason(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="ban-duration" className="mt-4">
            Durasi Pemblokiran
          </Label>
          <Select
            defaultValue={banDurationSelect}
            onValueChange={(value) => setBanDurationSelect(value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Pilih durasi" />
            </SelectTrigger>
            <SelectContent>
              {BAN_DURATIONS.map((duration) => (
                <SelectItem key={duration.label} value={duration.label}>
                  {duration.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isSubmitting}>Batal</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              onStart?.();
              setIsSubmitting(true);
              banUser().finally(() => {
                setIsSubmitting(false);
                onComplete?.();
              });
            }}
            disabled={isSubmitting}
          >
            {isSubmitting && <Spinner />}
            {isSubmitting ? "Memblokir..." : "Konfirmasi Pemblokiran"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
