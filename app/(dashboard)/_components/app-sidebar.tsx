"use client";

import * as React from "react";
import { Command } from "lucide-react";

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
import { routeData } from "@/constants/sidebar-item-data";
import Link from "next/link";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: session, isPending } = authClient.useSession();

  const isSessionLoading = isPending || !session;

  return (
    <Sidebar variant="inset" collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <Command className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">SIMBA</span>

                  <span className="truncate text-xs text-muted-foreground">
                    Sistem Informasi Manajemen Bustanul Arifin
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {isSessionLoading ? (
          <NavMainSkeleton />
        ) : (
          <NavMain
            items={routeData.navMain}
            currentRole={session.user.role ?? "student"}
          />
        )}
        <NavSecondary items={routeData.navSecondary} className="mt-auto" />
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
