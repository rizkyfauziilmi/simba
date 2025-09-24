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
      items: [
        {
          title: "Siswa",
          url: "#",
        },
        {
          title: "Guru",
          url: "#",
        },
        {
          title: "Kelas",
          url: "#",
        },
        {
          title: "Mata Pelajaran",
          url: "#",
        },
      ],
    },
    {
      title: "Akademik",
      url: "#",
      icon: GraduationCap,
      items: [
        {
          title: "Jadwal Pelajaran",
          url: "#",
        },
        {
          title: "Kalender Akademik",
          url: "#",
        },
      ],
    },
    {
      title: "Absensi",
      url: "#",
      icon: ScanFace,
      items: [
        {
          title: "Absensi Siswa",
          url: "#",
        },
        {
          title: "Absensi Guru",
          url: "#",
        },
      ],
    },
    {
      title: "Nilai",
      url: "#",
      icon: Award,
      items: [
        {
          title: "Input Nilai",
          url: "#",
        },
        {
          title: "Rekap Nilai",
          url: "#",
        },
        {
          title: "Rapor",
          url: "#",
        },
      ],
    },
    {
      title: "Laporan",
      url: "#",
      icon: FileUser,
    },
    {
      title: "Manajemen Pengguna",
      url: "#",
      icon: ShieldUser,
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
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
