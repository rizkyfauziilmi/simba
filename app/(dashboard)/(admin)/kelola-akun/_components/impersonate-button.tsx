import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { Loader2Icon, VenetianMask } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface ImpersonateButtonProps {
  userId: string;
}

export function ImpersonateButton({ userId }: ImpersonateButtonProps) {
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
    <Button
      type="button"
      size="icon"
      variant="outline"
      onClick={() => {
        setIsLoading(true);
        impersonateUser(userId).finally(() => setIsLoading(false));
      }}
      disabled={isLoading}
    >
      {isLoading ? <Loader2Icon className="animate-spin" /> : <VenetianMask />}
    </Button>
  );
}
