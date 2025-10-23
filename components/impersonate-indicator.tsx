"use client";

import { authClient } from "@/lib/auth-client";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { Loader2Icon, LockOpen } from "lucide-react";
import { useState } from "react";

export function ImpersonateIndicator() {
  const [isLoading, setIsLoading] = useState(false);
  const { data: session, isPending, error } = authClient.useSession();

  if (!session || !session.session || isPending || error) return null;

  const isImpersonating = session.session.impersonatedBy !== null;

  if (!isImpersonating) return null;

  const stopImpersonation = async () => {
    const { error } = await authClient.admin.stopImpersonating();

    if (error) {
      toast.error("Gagal menghentikan impersonasi", {
        description: error.message,
      });
      return;
    }
  };

  return (
    <Button
      variant="destructive"
      disabled={isLoading}
      onClick={() => {
        setIsLoading(true);
        stopImpersonation().finally(() => {
          setIsLoading(false);
          toast.success("Impersonasi dihentikan");
          window.location.href = "/kelola-akun";
        });
      }}
    >
      {isLoading ? <Loader2Icon className="animate-spin" /> : <LockOpen />}
      {isLoading ? "Memproses..." : "Berhenti Impersonasi"}
    </Button>
  );
}
