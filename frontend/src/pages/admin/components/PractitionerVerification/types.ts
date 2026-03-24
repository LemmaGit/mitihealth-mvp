export interface Practitioner {
  id: string; // usually clerkId
  name: string;
  specialty: string;
  location: string;
  dateApplied: string;
  status: "pending" | "approved" | "rejected";
  image: string;
  initials: string;
  bio: string;
  email: string;
  phone: string;
  practicingSince: string | number;
  specializations: string[];
  consultationTypes: { label: string; fee: string; enabled: boolean }[];
  availability: { day: string; from: string; to: string }[];
  conditionsTreated: string[];
}
