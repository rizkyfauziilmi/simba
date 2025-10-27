"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { formatDateToNow } from "@/lib/date";
import { parseUserAgent } from "@/lib/string";
import { LogOut, Tablet, HelpCircle } from "lucide-react";
import { Linux } from "@/components/svgs/linux";
import { Apple } from "@/components/svgs/apple";
import { Windows } from "@/components/svgs/windows";
import { Android } from "@/components/svgs/android";
import { Safari } from "@/components/svgs/safari";
import { Chrome } from "@/components/svgs/chrome";
import { Firefox } from "@/components/svgs/firefox";
import { Edge } from "@/components/svgs/edge";
import { Opera } from "@/components/svgs/opera";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import { Session } from "better-auth";
import { toast } from "sonner";
import { EmptyLoading } from "@/components/empty-loading";
import { EmptyError } from "@/components/empty-error";

export default function SessionManagment() {
  const {
    data: sessionsResponse,
    isPending,
    error,
    refetch,
  } = useQuery({
    queryKey: ["sessions"],
    queryFn: async () => {
      return await authClient.listSessions();
    },
  });
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [showRevokeAllDialog, setShowRevokeAllDialog] = useState(false);
  const { data: session, refetch: refetchCurrentSession } =
    authClient.useSession();
  const queryClient = useQueryClient();

  const handleRevokeSession = async (session: Session) => {
    setSelectedSession(session);
    setShowDialog(true);
  };

  const confirmRevoke = async () => {
    if (!selectedSession) return;

    await authClient.revokeSession({ token: selectedSession.token });

    queryClient.invalidateQueries({ queryKey: ["sessions"] });
    setShowDialog(false);
    setSelectedSession(null);

    toast.success("Sesi telah dicabut.");
  };

  const handleRevokeAllOtherSessions = async () => {
    setShowRevokeAllDialog(true);
  };

  const confirmRevokeAllOtherSessions = async () => {
    if (!session) return;

    await authClient.revokeOtherSessions();

    queryClient.invalidateQueries({ queryKey: ["sessions"] });
    setShowRevokeAllDialog(false);

    toast.success("Semua sesi lain telah dicabut.");
  };

  const getDeviceIcon = (os: string) => {
    const d = os.toLowerCase();

    // 🍎 iOS
    if (d.includes("ios") || d.includes("iphone")) {
      return <Apple className="size-8" />;
    }

    // 🤖 Android
    if (d.includes("android")) {
      return <Android className="size-8" />;
    }

    // 💻 macOS
    if (d.includes("mac")) {
      return <Apple className="size-8" />;
    }

    // 🪟 Windows
    if (d.includes("windows")) {
      return <Windows className="size-8" />;
    }

    // 🐧 Linux
    if (d.includes("linux") || d.includes("x11")) {
      return <Linux className="size-8" />;
    }

    // 📲 iPad / Tablet
    if (d.includes("ipad") || d.includes("tablet")) {
      return <Tablet className="size-8" />;
    }

    // ❓ Fallback icon
    return <HelpCircle className="size-8" />;
  };

  const getBrowserIcon = (browser: string) => {
    const b = browser.toLowerCase();

    // 🌐 Chrome
    if (b.includes("chrome")) {
      return <Chrome className="size-8" />;
    }

    // 🦊 Firefox
    if (b.includes("firefox")) {
      return <Firefox className="size-8" />;
    }

    // 🧭 Safari
    if (b.includes("safari")) {
      return <Safari className="size-8" />;
    }

    // 🪟 Edge
    if (b.includes("edge")) {
      return <Edge className="size-8" />;
    }

    // 🧭 Opera (or OPR in UA)
    if (b.includes("opera") || b.includes("opr")) {
      return <Opera className="size-8" />;
    }

    // ❓ Fallback
    return <HelpCircle className="w-5 h-5 text-gray-400" />;
  };

  if (isPending)
    return (
      <EmptyLoading
        title="Memuat sesi aktif"
        description="Mohon tunggu sementara kami memuat sesi aktif Anda."
      />
    );

  if (error)
    return (
      <EmptyError
        title="Gagal memuat sesi aktif"
        description="Terjadi kesalahan saat memuat sesi aktif Anda. Silakan coba lagi."
        onAction={() => refetch()}
      />
    );

  if (!sessionsResponse || !sessionsResponse.data || !session)
    return (
      <EmptyError
        title="Gagal memuat sesi aktif"
        description="Terjadi kesalahan saat memuat sesi aktif Anda. Silakan coba lagi."
        onAction={() => {
          refetch();
          refetchCurrentSession();
        }}
      />
    );

  const { data: sessions } = sessionsResponse;
  const { session: currentSession } = session;

  const deviceInfoSelected = selectedSession
    ? parseUserAgent(selectedSession.userAgent ?? undefined)
    : null;

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Manajemen Sesi</CardTitle>
          <CardDescription>
            Lihat dan kelola semua sesi aktif Anda
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Current Session */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground">
              Sesi Saat Ini
            </h3>
            {sessions
              .filter((s) => s.id === currentSession.id)
              .map((session) => {
                const deviceInfo = parseUserAgent(
                  session.userAgent ?? undefined,
                );

                return (
                  <div
                    key={session.id}
                    className="flex items-start justify-between p-4 rounded-lg border"
                  >
                    <div className="flex gap-4 flex-1">
                      <div className="text-muted-foreground mt-1 space-y-1">
                        {getDeviceIcon(deviceInfo.os ?? "Unknown OS")}
                        {getBrowserIcon(
                          deviceInfo.browser ?? "Unknown Browser",
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-medium text-foreground">
                            {deviceInfo.platform ?? "Perangkat Tidak Dikenal"}
                          </p>
                          <Badge variant="default">Saat Ini</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {deviceInfo.browser} • {deviceInfo.os}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          IP: {session.ipAddress} •{" "}
                          {formatDateToNow(session.updatedAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>

          {/* Other Sessions */}
          {sessions.filter((s) => s.id !== currentSession.id).length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-foreground">
                  Sesi Lainnya
                </h3>
                {sessions.filter((s) => s.id !== currentSession.id).length >
                  0 && (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={handleRevokeAllOtherSessions}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Cabut Semua Sesi Lain
                  </Button>
                )}
              </div>

              <div className="space-y-3">
                {sessions
                  .filter((s) => s.id !== currentSession.id)
                  .map((session) => {
                    const deviceInfo = parseUserAgent(
                      session.userAgent ?? undefined,
                    );

                    return (
                      <div
                        key={session.id}
                        className="flex items-start justify-between p-4 rounded-lg border"
                      >
                        <div className="flex gap-4 flex-1">
                          <div className="text-muted-foreground mt-1 space-y-1">
                            {getDeviceIcon(deviceInfo.os ?? "Unknown OS")}
                            {getBrowserIcon(
                              deviceInfo.browser ?? "Unknown Browser",
                            )}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-foreground">
                              {deviceInfo.platform ?? "Perangkat Tidak Dikenal"}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {deviceInfo.browser} • {deviceInfo.os}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              IP: {session.ipAddress} •{" "}
                              {formatDateToNow(session.updatedAt)}
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleRevokeSession(session)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}

          {/* Info Box */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-foreground">
              💡 Tips Keamanan:
            </p>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Cabut sesi dari perangkat yang tidak Anda kenal</li>
              <li>
                • Periksa secara berkala untuk aktivitas yang mencurigakan
              </li>
              <li>• Gunakan kata sandi yang kuat dan unik</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Revoke Session Dialog */}
      {selectedSession && (
        <AlertDialog open={showDialog} onOpenChange={setShowDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Cabut Sesi?</AlertDialogTitle>
              <AlertDialogDescription>
                Anda akan keluar dari {deviceInfoSelected?.os} (
                {deviceInfoSelected?.browser}). Anda perlu masuk kembali untuk
                menggunakan perangkat ini.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Batal</AlertDialogCancel>
              <AlertDialogAction onClick={confirmRevoke}>
                Cabut Sesi
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
      {/* Revoke All Other Sessions Dialog */}
      <AlertDialog
        open={showRevokeAllDialog}
        onOpenChange={setShowRevokeAllDialog}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cabut Semua Sesi Lain?</AlertDialogTitle>
            <AlertDialogDescription>
              Anda akan keluar dari semua perangkat lain kecuali yang sedang
              Anda gunakan sekarang. Anda perlu masuk kembali pada perangkat
              tersebut.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={confirmRevokeAllOtherSessions}>
              Cabut Semua Sesi Lain
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
