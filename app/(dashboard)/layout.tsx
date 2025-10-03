import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "./_components/app-sidebar";
import { RoleBadge } from "./_components/role-badge";
import { DashboardBreadcrumb } from "./_components/dashboard-breadcrumb";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="overflow-hidden">
        <main className="h-[calc(100vh_-_1rem)] overflow-y-auto">
          <header className="flex pr-4 justify-between h-16 shrink-0 items-center gap-2 sticky top-0 z-10 bg-background backdrop-blur-sm border-b">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator
                orientation="vertical"
                className="mr-2 data-[orientation=vertical]:h-4"
              />
              <DashboardBreadcrumb />
            </div>
            <RoleBadge />
          </header>
          <div className="flex flex-1 flex-col gap-4 p-4 md:p-6 pt-0">
            {children}
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
