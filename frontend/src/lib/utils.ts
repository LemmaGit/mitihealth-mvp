import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

  // write a function that gets me the first letter of the first name and second name if given "Sarah Amde"=>"SA"
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