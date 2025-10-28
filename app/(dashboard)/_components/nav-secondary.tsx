'use client'

import { type LucideIcon } from 'lucide-react'

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import { usePathname } from 'next/navigation'
import Link from 'next/link'

export function NavSecondary({
  items,
  currentRole,
  ...props
}: {
  currentRole: string
  items: {
    title: string
    url: string
    icon: LucideIcon
    role: string[]
    items: never[]
  }[]
} & React.ComponentPropsWithoutRef<typeof SidebarGroup>) {
  const pathname = usePathname()

  // Filter parent items sesuai role
  const filteredItems = items.filter(item => !item.role || item.role.includes(currentRole))

  return (
    <SidebarGroup {...props}>
      <SidebarGroupContent>
        <SidebarMenu>
          {filteredItems.map(item => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild size="sm" isActive={pathname === item.url}>
                <Link href={item.url}>
                  <item.icon />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
