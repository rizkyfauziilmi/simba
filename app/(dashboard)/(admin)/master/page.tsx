import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { routeData } from '@/constants/sidebar-item-data'
import { ParentNavCard } from '@/components/parent-nav-card'

export default async function MasterPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  const userRole = session?.user?.role
  const navData = routeData.navMain.filter(item => item.url === '/master')[0]
  const navBasedOnRole = navData.items.filter(item => item.role.includes(userRole ?? ''))

  return (
    <div className="space-y-4">
      {navBasedOnRole.map(item => (
        <ParentNavCard
          key={item.title}
          title={item.title}
          description={item.description}
          href={item.url}
        />
      ))}
    </div>
  )
}
