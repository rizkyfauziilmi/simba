import {
  startOfYear,
  subYears,
  differenceInDays,
  format,
  getQuarter,
  formatDistance,
  eachDayOfInterval,
  eachWeekOfInterval,
  eachMonthOfInterval,
  eachQuarterOfInterval,
  formatDistanceToNow,
} from "date-fns";
import { id } from "date-fns/locale";

export const startOfLastYear = startOfYear(subYears(new Date(), 1));
export const now = new Date();

export enum Period {
  Daily = "DAILY",
  Weekly = "WEEKLY",
  Monthly = "MONTHLY",
  Yearly = "YEARLY",
}

export function periodEnumToString(period: Period): string {
  switch (period) {
    case Period.Daily:
      return "Harian";
    case Period.Weekly:
      return "Mingguan";
    case Period.Monthly:
      return "Bulanan";
    case Period.Yearly:
      return "Tahunan";
    default:
      return "Tidak diketahui";
  }
}
// Fungsi ini menebak periode berdasarkan jarak antara start dan end
export function calendarPeriod(start: Date, end: Date): Period {
  const days = differenceInDays(end, start);

  // shows daily if range is 2 week - 1 day or less
  if (days <= 13) return Period.Daily;
  // shows weekly if range is 2 month - 1 day or less
  if (days <= 59) return Period.Weekly;
  // shows monthly if range is 1 year - 1 day or less
  if (days <= 364) return Period.Monthly;
  // shows yearly if range is more than 1 year
  return Period.Yearly;
}

export function getIntervalName(
  periode: Period,
  start: Date,
  range: { start: Date; end: Date },
): string {
  switch (periode) {
    case Period.Daily:
      return format(start, "EEEE, dd", { locale: id });
    case Period.Weekly:
      return `${format(range.start, "d MMM", { locale: id })} – ${format(
        range.end,
        "d MMM",
        { locale: id },
      )}`;
    case Period.Monthly:
      return format(start, "MMMM yyyy", { locale: id });
    case Period.Yearly:
      return `Q${getQuarter(start)} ${format(start, "yyyy")}`;
    default:
      return format(start, "P", { locale: id });
  }
}

export function generateIntervalDates(
  start: Date,
  end: Date,
  periode: Period,
): Date[] {
  switch (periode) {
    case Period.Daily:
      return eachDayOfInterval({ start, end });
    case Period.Weekly:
      return eachWeekOfInterval({ start, end }, { weekStartsOn: 1 });
    case Period.Monthly:
      return eachMonthOfInterval({ start, end });
    case Period.Yearly:
      return eachQuarterOfInterval({ start, end });
    default:
      return [];
  }
}

export function formatDateToNow(date: Date) {
  return formatDistanceToNow(date, { locale: id });
}

export function formatDistanceDate(start: Date, end: Date) {
  return formatDistance(start, end, { locale: id });
}

export function formattedDate(date: Date) {
  return format(date, "dd MMM yyyy", { locale: id });
}
