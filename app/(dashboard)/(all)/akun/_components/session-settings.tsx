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
import { LogOut, Globe, Tablet, HelpCircle } from "lucide-react";
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

export default function SessionSettings() {
  const {
    data: sessionsResponse,
    isPending,
    error,
  } = useQuery({
    queryKey: ["sessions"],
    queryFn: async () => {
      return await authClient.listSessions();
    },
  });
  const queryClient = useQueryClient();
  const { data: session } = authClient.useSession();

  const handleLogoutSession = async (token: string) => {
    await authClient.revokeSession({
      token,
    });

    queryClient.invalidateQueries({ queryKey: ["sessions"] });
  };

  const handleLogoutAll = async () => {
    await authClient.revokeOtherSessions();

    queryClient.invalidateQueries({ queryKey: ["sessions"] });
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

    console.log("Browser detected:", b);

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

  if (isPending) return "Loading...";

  if (error) return "An error has occurred: " + error.message;

  if (!sessionsResponse || !sessionsResponse.data || !session)
    return "No sessions found.";

  const { data: sessions } = sessionsResponse;
  const { session: currentSession } = session;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Sesi Aktif</h1>
        <p className="text-muted-foreground">
          Kelola sesi aktif Anda dan keluar dari perangkat lain
        </p>
      </div>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Sesi Anda</CardTitle>
            <CardDescription>
              Perangkat yang sedang masuk ke akun Anda
            </CardDescription>
          </div>
          {sessions.length > 1 && (
            <Button variant="destructive" size="sm" onClick={handleLogoutAll}>
              <LogOut className="w-4 h-4 mr-2" />
              Keluar Semua
            </Button>
          )}
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {sessions.map((session) => {
              const userAgentInfo = parseUserAgent(
                session.userAgent ?? undefined,
              );
              const OsIcon = getDeviceIcon(
                userAgentInfo.platform ?? "Unknown Device",
              );
              const BrowserIcon = getBrowserIcon(
                userAgentInfo.browser ?? "Unknown Browser",
              );

              return (
                <div
                  key={session.id}
                  className={`p-4 rounded-lg border ${
                    session.id === currentSession.id
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  } transition-colors`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          {OsIcon}
                          {BrowserIcon}
                          <h3 className="font-semibold text-foreground">
                            {userAgentInfo.platform
                              ? userAgentInfo.platform
                              : "Unknown Platform"}
                            {userAgentInfo.os ? ` • ${userAgentInfo.os}` : ""}
                            {userAgentInfo.browser
                              ? ` • ${userAgentInfo.browser}`
                              : ""}
                            {userAgentInfo.browserVersion
                              ? ` ${userAgentInfo.browserVersion}`
                              : ""}
                          </h3>
                          {session.id === currentSession.id && (
                            <Badge className="ml-auto">Sesi Saat Ini</Badge>
                          )}
                        </div>
                        <div className="space-y-1 text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <Globe className="w-4 h-4" />
                            <p>
                              Login pada: {formatDateToNow(session.createdAt)}
                            </p>
                          </div>
                          <p>Alamat IP: {session.ipAddress}</p>
                          <p>
                            Aktif terakhir: {formatDateToNow(session.updatedAt)}
                          </p>
                        </div>
                      </div>
                    </div>
                    {session.id !== currentSession.id && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleLogoutSession(session.token)}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <LogOut className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Tips Keamanan</CardTitle>
          <CardDescription>Jaga keamanan akun Anda</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li className="flex gap-3">
              <span className="text-primary font-bold">•</span>
              <span>
                Secara rutin tinjau sesi aktif Anda dan keluar dari perangkat
                yang tidak dikenal
              </span>
            </li>
            <li className="flex gap-3">
              <span className="text-primary font-bold">•</span>
              <span>
                Jika Anda melihat sesi yang tidak dikenali, segera ganti kata
                sandi Anda
              </span>
            </li>
            <li className="flex gap-3">
              <span className="text-primary font-bold">•</span>
              <span>Gunakan kata sandi yang kuat dan unik untuk akun Anda</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
