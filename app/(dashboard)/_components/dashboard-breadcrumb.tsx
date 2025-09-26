"use client";

import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { routeData } from "@/constants/sidebar-item-data";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

type SidebarItem = {
  title: string;
  url: string;
  role?: string[];
  items?: SidebarItem[];
};

const findLabel = (segments: string[]): { label: string; href: string } => {
  let items: SidebarItem[] = [...routeData.navMain, ...routeData.navSecondary];
  let label = "";
  let url = "";
  for (let i = 0; i < segments.length; i++) {
    const segment = segments[i];
    // Try to find matching item
    const found = items.find((item: SidebarItem) => {
      // Remove leading slash for comparison
      const itemUrl = item.url.startsWith("/") ? item.url.slice(1) : item.url;
      return itemUrl.split("/")[i] === segment;
    });
    if (found) {
      label = found.title;
      url = found.url;
      // If nested, update items for next segment
      if (
        found &&
        typeof found === "object" &&
        "items" in found &&
        Array.isArray(found.items)
      ) {
        items = found.items;
      }
    } else {
      // Fallback: use segment as label
      label = segment.charAt(0).toUpperCase() + segment.slice(1);
      url = "/" + segments.slice(0, i + 1).join("/");
    }
  }
  return { label, href: url };
};

export const DashboardBreadcrumb = () => {
  const pathname = usePathname();
  const segments: string[] = pathname.split("/").filter(Boolean);
  const breadcrumbs: { label: string; href: string }[] = segments.map(
    (_, idx: number) => {
      const pathSegments: string[] = segments.slice(0, idx + 1);
      return findLabel(pathSegments);
    }
  );

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {breadcrumbs.length > 0 ? (
          breadcrumbs.map((breadcrumb, index) => {
            const isLast = index === breadcrumbs.length - 1;
            return (
              <React.Fragment key={breadcrumb.href}>
                {isLast ? (
                  <BreadcrumbItem>
                    <BreadcrumbPage>{breadcrumb.label}</BreadcrumbPage>
                  </BreadcrumbItem>
                ) : (
                  <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                      <Link href={breadcrumb.href}>{breadcrumb.label}</Link>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                )}
                {!isLast && <BreadcrumbSeparator />}
              </React.Fragment>
            );
          })
        ) : (
          <BreadcrumbItem>
            <BreadcrumbPage>Dashboard</BreadcrumbPage>
          </BreadcrumbItem>
        )}
      </BreadcrumbList>
    </Breadcrumb>
  );
};
