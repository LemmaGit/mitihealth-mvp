import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { differenceInMinutes, format, isValid } from "date-fns";
import { parse, set } from "date-fns";
import { CheckCircle, Clock, Package, Truck, XCircle } from "lucide-react";


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function getInitials(name?: string | null): string {
  if (!name) return "";
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "";
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

export async function urlToFile(imageUrl: string) {
  const response = await fetch(imageUrl);
  const blob = await response.blob();

  const file = new File([blob], "image.jpg", {
    type: blob.type,
  });

  return file;
}

export function getSessionDate(dateStr: string, timeStr: string) {
  const baseDate = new Date(dateStr);

  if (!timeStr || !timeStr.includes("-")) return baseDate;

  const [start] = timeStr.split("-"); // "09:30 AM"

  // Parse time safely
  const parsedTime = parse(start.trim(), "hh:mm a", new Date());

  // Merge date + time
  return set(baseDate, {
    hours: parsedTime.getHours(),
    minutes: parsedTime.getMinutes(),
    seconds: 0,
    milliseconds: 0,
  });
}

export function getTimeText(sessionDate: Date) {
  if (!isValid(sessionDate)) return "Invalid time";

  const now = new Date();
  const minsLeft = differenceInMinutes(sessionDate, now);

  if (minsLeft <= -120) return "Ended";
  if (minsLeft <= 0) return "In progress";

  // If session is more than 12 hours away, show date + hours remaining
  if (minsLeft > 12 * 60) {
    const dateStr = format(sessionDate, "yyyy-MM-dd");
    return `${dateStr}`;
  }

  if (minsLeft < 60) return `In ${minsLeft}m`;

  const hrs = Math.floor(minsLeft / 60);
  const m = minsLeft % 60;
  return `In ${hrs}h ${m}m`;
}

export const statusConfig = {
  pending: {
    icon: Clock,
    label: "Pending",
    variant: "secondary" as const,
    color: "text-yellow-600 bg-yellow-50 border-yellow-200",
  },
  processing: {
    icon: Package,
    label: "Processing",
    variant: "default" as const,
    color: "text-blue-600 bg-blue-50 border-blue-200",
  },
  shipped: {
    icon: Truck,
    label: "Shipped",
    variant: "default" as const,
    color: "text-purple-600 bg-purple-50 border-purple-200",
  },
  delivered: {
    icon: CheckCircle,
    label: "Delivered",
    variant: "default" as const,
    color: "text-green-600 bg-green-50 border-green-200",
  },
  cancelled: {
    icon: XCircle,
    label: "Cancelled",
    variant: "destructive" as const,
    color: "text-red-600 bg-red-50 border-red-200",
  },
};

export type Day = {
  day: string;
  enabled: boolean;
  slots: any[];
};

export function mergeAvailability(base: Day[], override: Day[]): Day[] {
  const map = new Map<string, Day>();

  base.forEach(d => map.set(d.day, d));

  override.forEach(d => {
    if (d.enabled) {
      map.set(d.day, d);
    }
  });

  return Array.from(map.values());
}