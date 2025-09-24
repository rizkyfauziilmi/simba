"use client";

import * as React from "react";
import {
  Award,
  CircleUser,
  Command,
  Database,
  FileUser,
  GraduationCap,
  LucideLayoutDashboard,
  ScanFace,
  Settings,
  ShieldUser,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { NavSecondary } from "./nav-secondary";
import { NavMain } from "./nav-main";
import { NavUser } from "./nav-user";
import { authClient } from "@/lib/auth-client";
import { UserDropdownSkeleton } from "./user-dropdown-skeleton";
import { NavMainSkeleton } from "./nav-main-skeleton";

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "#",
      icon: LucideLayoutDashboard,
    },
    {
      title: "Data Master",
      url: "#",
      icon: Database,
      role: ["admin"],
      items: [
        {
          title: "Siswa",
          url: "#",
          role: ["admin"],
        },
        {
          title: "Guru",
          url: "#",
          role: ["admin"],
        },
        {
          title: "Kelas",
          url: "#",
          role: ["admin"],
        },
        {
          title: "Mata Pelajaran",
          url: "#",
          role: ["admin"],
        },
      ],
    },
    {
      title: "Akademik",
      url: "#",
      icon: GraduationCap,
      role: ["teacher", "student"],
      items: [
        {
          title: "Jadwal Pelajaran",
          url: "#",
          role: ["teacher", "student"],
        },
        {
          title: "Kalender Akademik",
          url: "#",
          role: ["teacher", "student"],
        },
      ],
    },
    {
      title: "Absensi",
      url: "#",
      icon: ScanFace,
      role: ["admin", "teacher", "student"],
      items: [
        {
          title: "Absensi Siswa",
          url: "#",
          role: ["teacher", "student"],
        },
        {
          title: "Absensi Guru",
          url: "#",
          role: ["admin", "teacher"],
        },
      ],
    },
    {
      title: "Nilai",
      url: "#",
      icon: Award,
      role: ["teacher", "student"],
      items: [
        {
          title: "Input Nilai",
          url: "#",
          role: ["teacher"],
        },
        {
          title: "Rekap Nilai",
          url: "#",
          role: ["teacher", "student"],
        },
        {
          title: "Rapor",
          url: "#",
          role: ["teacher", "student"],
        },
      ],
    },
    {
      title: "Laporan",
      url: "#",
      icon: FileUser,
      role: ["admin"],
    },
    {
      title: "Manajemen Pengguna",
      url: "#",
      icon: ShieldUser,
      role: ["admin"],
    },
  ],
  navSecondary: [
    {
      title: "Profil / Akun",
      url: "#",
      icon: CircleUser,
    },
    {
      title: "Pengaturan",
      url: "#",
      icon: Settings,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: session, isPending } = authClient.useSession();

  const isSessionLoading = isPending || !session;

  return (
    <Sidebar variant="inset" collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <Command className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">SIMBA</span>
                  <span className="truncate text-xs text-muted-foreground">
                    Sistem Informasi Manajemen Bustanul Arifin
                  </span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {/*TODO: add loading UI*/}
        {isSessionLoading ? (
          <NavMainSkeleton />
        ) : (
          <NavMain
            items={data.navMain}
            currentRole={session.user.role ?? "student"}
          />
        )}
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        {isSessionLoading ? (
          <UserDropdownSkeleton />
        ) : (
          <NavUser
            name={session.user.name}
            email={session.user.email}
            image={session.user.image}
          />
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
