import { Spinner } from "@/components/ui/spinner";
import { authClient } from "@/lib/auth-client";
import { VenetianMask } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface ImpersonateButtonProps {
  userId: string;
  onStart?: () => void;
  onComplete?: () => void;
}

export function ImpersonateButton({
  userId,
  onStart,
  onComplete,
}: ImpersonateButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const impersonateUser = async (userId: string) => {
    const { error } = await authClient.admin.impersonateUser({
      userId,
    });

    if (error) {
      toast.error("Gagal menyamar sebagai pengguna", {
        description: error.message,
      });
      return;
    }

    toast.success("Penyamaran pengguna berhasil dimulai");
    window.location.href = "/";
  };

  return (
    <div
      onClick={() => {
        onStart?.();
        setIsLoading(true);
        impersonateUser(userId).finally(() => {
          setIsLoading(false);
          onComplete?.();
        });
      }}
      aria-disabled={isLoading}
      className="flex items-center gap-2 aria-disabled:opacity-50 cursor-pointer aria-disabled:cursor-not-allowed"
    >
      {isLoading ? <Spinner /> : <VenetianMask />}
      {isLoading ? "Menyamar..." : "Menyamar sebagai pengguna"}
    </div>
  );
}
