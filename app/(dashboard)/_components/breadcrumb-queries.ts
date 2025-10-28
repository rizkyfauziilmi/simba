'use client'

import { useQueries } from '@tanstack/react-query'
import { getEntityName } from './breadcrumb-actions'
import z from 'zod'

const isId = (label: string) => {
  return z.cuid().safeParse(label).success || z.cuid2().safeParse(label).success
}

const getEntityType = (segments: string[], index: number): string | null => {
  // Check if the previous segment indicates an entity type
  if (index > 0) {
    const prevSegment = segments[index - 1].toLowerCase()
    if (['siswa', 'guru', 'kelas', 'mapel'].includes(prevSegment)) {
      return prevSegment
    }
  }

  // Check in the path structure for master routes
  if (index > 1 && segments[index - 2].toLowerCase() === 'master') {
    const entitySegment = segments[index - 1].toLowerCase()
    if (['siswa', 'guru', 'kelas', 'mapel'].includes(entitySegment)) {
      return entitySegment
    }
  }

  return null
}

export const useBreadcrumbNames = (segments: string[]) => {
  // Pre-calculate which segments need queries
  const segmentData = segments.map((segment, index) => ({
    segment,
    index,
    entityType: getEntityType(segments, index),
    isId: isId(segment),
  }))

  // Use useQueries to handle multiple queries at once
  const queries = useQueries({
    queries: segmentData.map(data => ({
      queryKey: ['entity-name', data.entityType, data.segment],
      queryFn: async () => {
        if (!data.entityType || !data.segment || !data.isId) return null
        return await getEntityName(data.entityType, data.segment)
      },
      enabled: !!data.entityType && !!data.segment && data.isId,
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10, // 10 minutes
    })),
  })

  // Combine the query results with segment data
  return segmentData.map((data, index) => ({
    segment: data.segment,
    entityType: data.entityType,
    isId: data.isId,
    query: queries[index],
  }))
}
