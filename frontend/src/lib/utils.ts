import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { addMinutes, differenceInMinutes, format, isAfter, isBefore, isEqual, isValid } from "date-fns";
import { parse, set, } from "date-fns";
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

export const parseTime = (time: string) => {
  const parsed = parse(time, "hh:mm a", new Date());
  return isValid(parsed) ? parsed : new Date();
};

export const formatTime = (date: Date) => {
  if (!isValid(date)) return "12:00 AM";
  return format(date, "hh:mm a");
};

export const isTimeOverlap = (
  newStart: string,
  newEnd: string,
  existingSlots: { start: string; end: string }[]
): boolean => {
  const newStartDate = parseTime(newStart);
  const newEndDate = parseTime(newEnd);

  return existingSlots.some(slot => {
    const slotStart = parseTime(slot.start);
    const slotEnd = parseTime(slot.end);

    return isBefore(newStartDate, slotEnd) && isAfter(newEndDate, slotStart);
  });
};

export const isDuplicateSlot = (
  newStart: string,
  newEnd: string,
  existingSlots: { start: string; end: string }[]
): boolean => {
  return existingSlots.some(slot => {
    const slotStart = parseTime(slot.start);
    const slotEnd = parseTime(slot.end);

    return (
      isEqual(parseTime(newStart), slotStart) &&
      isEqual(parseTime(newEnd), slotEnd)
    );
  });
};

export const findNextAvailableSlot = (
  existingSlots: { start: string; end: string }[]
): { start: string; end: string } | null => {

  const MIN = 30;
  const MAX = 60;
  const BUFFER = 30;
  // const DAY_END = parseTime("11:59 PM");

  // If no slots → just start from "now" or 00:00 (your choice)
  if (existingSlots.length === 0) {
    return { start: "12:00 AM", end: "01:00 AM" };
  }

  const sorted = [...existingSlots].sort(
    (a, b) => parseTime(a.start).getTime() - parseTime(b.start).getTime()
  );
  // Check gaps between slots only
  for (let i = 0; i < sorted.length - 1; i++) {
    const currentEnd = parseTime(sorted[i].end);
    const nextStart = parseTime(sorted[i + 1].start);

    const gapStart = addMinutes(currentEnd, BUFFER);
    const gapEndLimit = addMinutes(gapStart, MAX);
    const gapEnd = isBefore(gapEndLimit, addMinutes(nextStart, -BUFFER))
      ? gapEndLimit
      : addMinutes(nextStart, -BUFFER);

    if ((differenceInMinutes(gapEnd, gapStart) >= MIN) && !isInvalidSlot(formatTime(gapStart), formatTime(gapEnd), existingSlots)) {
      
      return {
        start: formatTime(gapStart),
        end: formatTime(gapEnd),
      };
    }
  }

  // Check if we can add after last slot
  const lastEnd = parseTime(sorted[sorted.length - 1].end);
  const start = addMinutes(lastEnd, BUFFER);
  const end = addMinutes(start, MAX);

 /* if (isAfter(start, parseTime("11:00 PM")) || isAfter(end, DAY_END)) {
    return null;
  }*/

    const formattedstart = formatTime(start)
    const formattedEnd = formatTime(end)
  if (isInvalidSlot(formattedstart, formattedEnd, existingSlots)) {
    return null;
  }
  return {
    start: formattedstart,
    end: formattedEnd,
  };
};

export const isDayFullyBooked = (
  existingSlots: { start: string; end: string }[]
): boolean => {
  return findNextAvailableSlot(existingSlots) === null;
};

export const canUpdateSlot = ({
  time,
  slot,
  slotIndex,
  slots,
}: {
  time: string;
  slot: { start?: string; end?: string };
  slotIndex: number;
  slots: { start: string; end: string }[];
}): boolean => {
  const otherSlots = slots.filter((_, i) => i !== slotIndex);

  // Allow the current value to be selected
  if (slot.start === time) return true;

  if (!slot.end) return false;

  const isInvalid = isInvalidSlot(time, slot.end, otherSlots);
  const startDate = parseTime(time);
  const endDate = parseTime(slot.end);

  const isValidTime = isAfter(endDate, startDate);

  return !(isInvalid || !isValidTime);
};

export const canUpdateEndTime = ({
  time,
  slot,
  slotIndex,
  slots,
}: {
  time: string;
  slot: { start?: string; end?: string };
  slotIndex: number;
  slots: { start: string; end: string }[];
}): boolean => {
  const otherSlots = slots.filter((_, i) => i !== slotIndex);

  // Allow the current value to be selected
  if (slot.end === time) return true;

  if (!slot.start) return false;

  const isInvalid = isInvalidSlot(slot.start, time, otherSlots);
  const startDate = parseTime(slot.start);
  const endDate = parseTime(time);

  const isValidTime = isAfter(endDate, startDate);

  return !(isInvalid || !isValidTime);
};

export const isInvalidSlot = (
  newStart: string,
  newEnd: string,
  existingSlots: { start: string; end: string }[]
): boolean => {

  // {"start": "12:30 AM","end": "01:30 AM"}
  const newStartDate = parseTime(newStart);
  const newEndDate = parseTime(newEnd);

  return existingSlots.some(slot => {
    const slotStart = parseTime(slot.start);
    const slotEnd = parseTime(slot.end);

    const isDuplicate =
      isEqual(newStartDate, slotStart) &&
      isEqual(newEndDate, slotEnd);

    const isOverlap =
      isBefore(newStartDate, slotEnd) &&
      isAfter(newEndDate, slotStart);
    return isDuplicate || isOverlap;
  });
};