'use client'

import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { authClient } from '@/lib/auth-client'
import { GraduationCap, Presentation, ShieldUser } from 'lucide-react'

export const RoleBadge = () => {
  const { data: session, isPending } = authClient.useSession()

  const isSessionLoading = isPending || !session

  if (isSessionLoading) {
    return <Skeleton className="h-5 w-[60px] rounded-md" />
  }

  const role = session.user.role as 'admin' | 'student' | 'teacher'

  return GetRoleBadge(role)
}

export function GetRoleBadge(role: 'admin' | 'student' | 'teacher') {
  return (
    <Badge variant={role === 'admin' ? 'default' : role === 'teacher' ? 'secondary' : 'outline'}>
      {role === 'admin' ? (
        <ShieldUser />
      ) : role === 'teacher' ? (
        <Presentation />
      ) : (
        <GraduationCap />
      )}{' '}
      {role === 'admin' ? <>Admin</> : role === 'teacher' ? <>Guru</> : <>Siswa</>}
    </Badge>
  )
}
