import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Convert Date to Unix Time
export function dateToUnixTime(date: Date) {
  return Math.floor(date.getTime() / 1000);
}

// Convert Unix Time to Date
export function unixTimeToDate(unixTime: number) {
  return new Date(unixTime * 1000).toDateString();
}