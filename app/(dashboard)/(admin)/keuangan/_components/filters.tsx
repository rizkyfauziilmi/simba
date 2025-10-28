'use client'

import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { useQueryState } from 'nuqs'
import { CalendarIcon, CalendarX } from 'lucide-react'
import { expenseCategories, incomeCategories } from '@/constants/categories'
import { formattedDate, now, startOfLastYear } from '@/lib/date'
import { isSameDay } from 'date-fns'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { id } from 'date-fns/locale'
import { filterSearchParams } from '@/lib/searchParams'
import { MultiSelect } from '@/components/multi-select'
import { useEffect } from 'react'

export function FinanceFilters() {
  const [categories, setCategories] = useQueryState('categories', filterSearchParams.categories)
  const [fromDate, setFromDate] = useQueryState('from', filterSearchParams.from)
  const [toDate, setToDate] = useQueryState('to', filterSearchParams.to)

  const groupedOptions = [
    {
      heading: 'Pengeluaran',
      options: expenseCategories.map(category => ({
        value: category,
        label: category,
      })),
    },
    {
      heading: 'Pemasukan',
      options: incomeCategories.map(category => ({
        value: category,
        label: category,
      })),
    },
  ]

  const isNotSelectDateRange = isSameDay(fromDate, startOfLastYear) && isSameDay(toDate, now)

  useEffect(() => {
    if (categories && categories.length === 0) setCategories(null)
  }, [categories, setCategories])

  return (
    <div className="rounded-lg border border-border bg-card p-4 text-card-foreground space-y-4">
      <div className="grid grid-cols-1 gap-4">
        <div className="space-y-2">
          <Label>Kategori</Label>
          <MultiSelect
            options={groupedOptions}
            onValueChange={value => setCategories(value)}
            responsive={true}
            placeholder="Pilih kategori"
          />
        </div>

        <div className="flex items-end gap-2">
          <div className="space-y-2 flex-1">
            <Label>Rentang Tanggal</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  data-empty={isSameDay(fromDate, startOfLastYear) && isSameDay(toDate, now)}
                  className="data-[empty=true]:text-muted-foreground w-full justify-start text-left font-normal"
                >
                  <CalendarIcon />
                  {fromDate ? (
                    `${formattedDate(fromDate)} - ${formattedDate(toDate)}`
                  ) : (
                    <span>Pilih rentang tanggal</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="range"
                  numberOfMonths={2}
                  defaultMonth={toDate || undefined}
                  disabled={date => date > now}
                  selected={{
                    from: fromDate,
                    to: toDate,
                  }}
                  locale={id}
                  onSelect={date => {
                    if (date?.from) {
                      setFromDate(date.from)
                    }

                    if (date?.to) {
                      setToDate(date.to)
                    }
                  }}
                />
              </PopoverContent>
            </Popover>
          </div>

          {!isNotSelectDateRange && (
            <Button
              variant="destructive"
              size="icon"
              onClick={() => {
                setFromDate(startOfLastYear)
                setToDate(now)
              }}
            >
              <CalendarX />
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
