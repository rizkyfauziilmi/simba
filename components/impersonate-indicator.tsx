"use client";

import { authClient } from "@/lib/auth-client";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { LockOpen } from "lucide-react";
import { useState } from "react";
import { Spinner } from "./ui/spinner";

export function ImpersonateIndicator() {
  const [isLoading, setIsLoading] = useState(false);
  const { data: session, isPending, error } = authClient.useSession();

  if (!session || !session.session || isPending || error) return null;

  const isImpersonating = session.session.impersonatedBy !== null;

  if (!isImpersonating) return null;

  const stopImpersonation = async () => {
    const { error } = await authClient.admin.stopImpersonating();

    if (error) {
      toast.error("Gagal menghentikan penyamaran", {
        description: error.message,
      });
      return;
    }
  };

  return (
    <div>
      <div className="md:block hidden">
        <Button
          variant="destructive"
          size="sm"
          disabled={isLoading}
          onClick={() => {
            setIsLoading(true);
            stopImpersonation().finally(() => {
              setIsLoading(false);
              toast.success("Penyamaran dihentikan");
              window.location.href = "/kelola-akun";
            });
          }}
        >
          {isLoading ? <Spinner /> : <LockOpen />}
          {isLoading ? "Memproses..." : "Berhenti Penyamaran"}
        </Button>
      </div>
      <div className="md:hidden block">
        <Button
          variant="destructive"
          size="icon"
          disabled={isLoading}
          onClick={() => {
            setIsLoading(true);
            stopImpersonation().finally(() => {
              setIsLoading(false);
              toast.success("Penyamaran dihentikan");
              window.location.href = "/kelola-akun";
            });
          }}
        >
          {isLoading ? <Spinner /> : <LockOpen />}
        </Button>
      </div>
    </div>
  );
}
