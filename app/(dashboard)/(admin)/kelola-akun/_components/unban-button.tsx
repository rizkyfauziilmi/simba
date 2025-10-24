import { Spinner } from "@/components/ui/spinner";
import { authClient } from "@/lib/auth-client";
import { useQueryClient } from "@tanstack/react-query";
import { Undo2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface UnbanButtonProps {
  onStart?: () => void;
  onComplete?: () => void;
  userId: string;
}

export function UnbanButton({ userId, onStart, onComplete }: UnbanButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();

  const unbanUser = async (userId: string) => {
    const { error } = await authClient.admin.unbanUser({ userId });

    if (error) {
      toast.error("Gagal membuka blokir pengguna", {
        description: error.message,
      });
      return;
    }

    queryClient.invalidateQueries({ queryKey: ["users"] });
    toast.success("Blokir pengguna berhasil dibuka");
  };

  return (
    <div
      onClick={() => {
        onStart?.();
        setIsLoading(true);
        unbanUser(userId).finally(() => {
          setIsLoading(false);
          onComplete?.();
        });
      }}
      className="flex items-center gap-2 aria-disabled:opacity-50 cursor-pointer aria-disabled:cursor-not-allowed"
      aria-disabled={isLoading}
    >
      {isLoading ? <Spinner /> : <Undo2 />}
      {isLoading ? "Memproses..." : "Buka Blokir"}
    </div>
  );
}
