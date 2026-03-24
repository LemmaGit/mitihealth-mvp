export interface Product {
  id: string;
  name: string;
  supplier: string;
  ingredients: string;
  price: string;
  status: "pending" | "approved" | "rejected";
  image: string;
  images: string[];
  category: string;
  description: string;
  dosage: string;
  sideEffects: string;
  storage: string;
  weight: string;
}
