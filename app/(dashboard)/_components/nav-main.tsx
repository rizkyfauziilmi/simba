'use client'

import { ChevronRight, type LucideIcon } from 'lucide-react'

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@/components/ui/sidebar'
import { usePathname } from 'next/navigation'
import Link from 'next/link'

// Tambahkan props currentRole
export function NavMain({
  items,
  currentRole,
}: {
  items: {
    title: string
    url: string
    icon: LucideIcon
    role?: string[]
    items?: {
      title: string
      url: string
      role?: string[]
    }[]
  }[]
  currentRole: string
}) {
  const pathname = usePathname()

  // Filter parent items sesuai role
  const filteredItems = items
    .filter(item => !item.role || item.role.includes(currentRole))
    .map(item => ({
      ...item,
      // Filter child items sesuai role
      items: item.items?.filter(subItem => !subItem.role || subItem.role.includes(currentRole)),
    }))

  return (
    <SidebarGroup>
      <SidebarMenu>
        {filteredItems.map(item => (
          <Collapsible
            key={item.title}
            asChild
            defaultOpen={
              pathname === item.url ||
              item.items?.some(subItem => pathname === subItem.url) ||
              item.items?.some(subItem => pathname.startsWith(subItem.url + '/'))
            }
          >
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                tooltip={item.title}
                isActive={
                  // pathname === item.url || pathname.startsWith(item.url + "/")
                  // kode di atas salah, hanya tangkap sampai satu level, misal /master/siswa, tapi tidak untuk /master/siswa/buat karena /buat tidak ada di props items
                  // jadi harus hapus startsWith dan ganti dengan pengecekan exact match dan pengecekan pada subItem
                  pathname === item.url ||
                  item.items?.some(subItem => pathname === subItem.url) ||
                  item.items?.some(subItem => pathname.startsWith(subItem.url + '/')) ||
                  false
                }
              >
                <Link href={item.url}>
                  <item.icon />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
              {item.items?.length ? (
                <>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuAction className="data-[state=open]:rotate-90">
                      <ChevronRight />
                      <span className="sr-only">Toggle</span>
                    </SidebarMenuAction>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {item.items?.map(subItem => (
                        <SidebarMenuSubItem key={subItem.title}>
                          <SidebarMenuSubButton
                            asChild
                            isActive={
                              pathname === subItem.url || pathname.startsWith(subItem.url + '/')
                            }
                          >
                            <Link href={subItem.url}>{subItem.title}</Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </>
              ) : null}
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
