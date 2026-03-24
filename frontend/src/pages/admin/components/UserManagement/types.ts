export interface UserEntry {
  id: string;
  name: string;
  role: "patient" | "practitioner" | "supplier" | "admin";
  dateJoined: string;
  status: "active" | "suspended" | "pending";
  initials: string;
  profilePicture?: string;
}
