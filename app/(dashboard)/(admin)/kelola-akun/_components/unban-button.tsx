import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2Icon, Undo2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface UnbanButtonProps {
  userId: string;
}

export function UnbanButton({ userId }: UnbanButtonProps) {
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
    <Button
      type="button"
      size="icon"
      variant="secondary"
      onClick={() => {
        setIsLoading(true);
        unbanUser(userId).finally(() => setIsLoading(false));
      }}
      disabled={isLoading}
    >
      {isLoading ? <Loader2Icon className="animate-spin" /> : <Undo2 />}
    </Button>
  );
}
