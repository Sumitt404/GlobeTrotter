import { Activity, Trip } from "../types";

export function parseTripDate(value: string): Date {
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return new Date(`${value}T12:00:00`);
  }
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? new Date() : parsed;
}

export function toDateInputValue(value: string): string {
  const date = parseTripDate(value);
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 10);
}

export function formatTripDate(value: string, withYear = true): string {
  return parseTripDate(value).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    ...(withYear ? { year: "numeric" } : {}),
  });
}

export function getTripDays(trip: Trip): string[] {
  const start = parseTripDate(trip.start);
  const end = parseTripDate(trip.end);
  start.setHours(12, 0, 0, 0);
  end.setHours(12, 0, 0, 0);
  const days: string[] = [];
  const cursor = new Date(start);
  while (cursor <= end && days.length < 366) {
    const local = new Date(cursor.getTime() - cursor.getTimezoneOffset() * 60000);
    days.push(local.toISOString().slice(0, 10));
    cursor.setDate(cursor.getDate() + 1);
  }
  return days;
}

export function totalActivityCost(activities: Activity[]): number {
  return activities.reduce((sum, activity) => sum + Math.max(0, Number(activity.cost) || 0), 0);
}

export function activityDate(activity: Activity, trip: Trip): string {
  return activity.date || toDateInputValue(trip.start);
}

export function tripDurationDays(trip: Trip): number {
  const days = getTripDays(trip).length;
  return Math.max(1, days);
}
