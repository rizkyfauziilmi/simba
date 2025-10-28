import { createLoader, parseAsString, parseAsIsoDate, parseAsArrayOf } from 'nuqs/server'
import { now, startOfLastYear } from './date'

export const filterSearchParams = {
  categories: parseAsArrayOf(parseAsString).withOptions({ shallow: true }),
  from: parseAsIsoDate.withDefault(startOfLastYear).withOptions({ shallow: false }),
  to: parseAsIsoDate.withDefault(now).withOptions({ shallow: false }),
}

export const loadSearchParams = createLoader(filterSearchParams)
