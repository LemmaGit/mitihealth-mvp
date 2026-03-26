export const PRACTITIONER_PLACEHOLDER_IMG =
  "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=800";

export function formatSpecialization(raw: string | undefined) {
  if (!raw) return "Clinical herbalist";
  return raw
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export function yearsPracticing(practicingSinceEC: number | undefined) {
  const y = Number(practicingSinceEC);
  if (!y || Number.isNaN(y)) return 0;
  
  // Ethiopian calendar is roughly 7-8 years behind Gregorian calendar
  // Convert EC year to approximate Gregorian year for calculation
  const currentEthiopianYear = new Date().getFullYear() - 7; // Approximate conversion
  return Math.max(0, currentEthiopianYear - y);
}
