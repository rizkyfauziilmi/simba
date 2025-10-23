import {
  startOfYear,
  subYears,
  format,
  getQuarter,
  formatDistance,
  eachDayOfInterval,
  eachWeekOfInterval,
  eachMonthOfInterval,
  eachQuarterOfInterval,
  formatDistanceToNow,
  differenceInWeeks,
  differenceInMonths,
  differenceInDays,
  formatDuration,
  intervalToDuration,
} from "date-fns";
import { id } from "date-fns/locale";
import { Hari } from "./generated/prisma";

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

export function calendarPeriod(start: Date, end: Date): Period {
  const days = differenceInDays(end, start) + 1;
  const weeks = differenceInWeeks(end, start) + 1;
  const months = differenceInMonths(end, start) + 1;

  if (days <= 7) return Period.Daily; // daily display for up to 7 days
  if (weeks <= 4) return Period.Weekly; // weekly display for up to 1 month
  if (months <= 12) return Period.Monthly; // monthly display for up to 12 months
  return Period.Yearly; // display quarterly for more than 1 year
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
      return format(start, "MMMM", { locale: id });
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

export function getTodayHariEnum() {
  // get current day in Hari enum
  const today = new Date().getDay();
  switch (today) {
    case 1:
      return Hari.SENIN;
    case 2:
      return Hari.SELASA;
    case 3:
      return Hari.RABU;
    case 4:
      return Hari.KAMIS;
    case 5:
      return Hari.JUMAT;
    case 6:
      return Hari.SABTU;
    default:
      return null;
  }
}

/**
 * Converts seconds to a human-readable duration string.
 * @param seconds Number of seconds
 * @returns Human-readable duration (e.g. "1 hour 5 minutes")
 */
export function secondsToReadable(seconds: number): string {
  return formatDuration(intervalToDuration({ start: 0, end: seconds * 1000 }), {
    locale: id,
  });
}
