// import drSelamawit from "@/assets/dr-selamawit.png";
// import drAbebe from "@/assets/dr-abebe.png";
// import drTigist from "@/assets/dr-tigist.png";
// import drDawit from "@/assets/dr-dawit.png";

export interface Practitioner {
  id: string;
  name: string;
  title: string;
  specialties: string[];
  yearsExp: number;
  consultations: string;
  rating: number;
  price: number;
  image: string;
  verified: boolean;
  bio: string;
  education: string[];
  associations: string[];
  location: string;
  hours: string;
  availableSlots: string[];
}

export const practitioners: Practitioner[] = [
  {
    id: "dr-selamawit",
    name: "Dr. Selamawit Gebre",
    title: "Clinical Herbalist & MD",
    specialties: ["Metabolic Wellness", "Endocrine Support", "Traditional Ethnobotany"],
    yearsExp: 14,
    consultations: "2.4k",
    rating: 4.9,
    price: 450,
    image: "../assets/dr-dawit.png",
    verified: true,
    bio: `Dr. Selamawit Gebre bridges the gap between modern internal medicine and Ethiopia's ancient botanical heritage. With over a decade of clinical practice at the Tikur Anbessa Specialized Hospital and specialized training in traditional phytotherapy, she offers a unique, holistic approach to metabolic health.

Her methodology focuses on "The Root Cause Alignment," utilizing indigenous flora such as Moringa stenopetala and Nigella sativa to support insulin sensitivity and hormonal balance. She is a lead researcher for Ethio-Botanica, dedicated to validating traditional knowledge through clinical precision.`,
    education: ["MD, Addis Ababa University School of Medicine", "MSc in Phytotherapy, Kew Royal Botanic Gardens"],
    associations: ["Ethiopian Medical Association (EMA)", "Global Society for Ethnobotany"],
    location: "Cape Verde St, Addis Ababa, Ethiopia",
    hours: "Mon-Fri 08:00 - 17:00",
    availableSlots: ["09:00 AM", "10:30 AM", "02:00 PM", "03:30 PM"],
  },
  {
    id: "dr-abebe",
    name: "Dr. Abebe Mengistu",
    title: "Integrative Medicine Specialist",
    specialties: ["Digestive Health", "Immune Support", "Herbal Pharmacology"],
    yearsExp: 18,
    consultations: "3.1k",
    rating: 4.8,
    price: 550,
    image: "../assets/dr-dawit.png",
    verified: true,
    bio: `Dr. Abebe Mengistu is a pioneer in integrating traditional Ethiopian herbal remedies with evidence-based medicine. His research on Tena Adam and Damakesse has been published in leading phytotherapy journals.

He specializes in gastrointestinal health and immune system optimization through personalized herbal protocols, drawing from both Amhara and Oromo traditional healing practices.`,
    education: ["MD, Gondar University", "PhD in Ethnopharmacology, University of London"],
    associations: ["Ethiopian Public Health Institute", "International Society for Ethnopharmacology"],
    location: "Bole Medhanialem, Addis Ababa, Ethiopia",
    hours: "Mon-Sat 09:00 - 18:00",
    availableSlots: ["09:00 AM", "11:00 AM", "01:00 PM", "04:00 PM"],
  },
  {
    id: "dr-tigist",
    name: "Dr. Tigist Haile",
    title: "Botanical Dermatologist",
    specialties: ["Skin Health", "Anti-inflammatory", "Natural Cosmetics"],
    yearsExp: 8,
    consultations: "1.8k",
    rating: 4.7,
    price: 350,
    image: "../assets/dr-dawit.png",
    verified: true,
    bio: `Dr. Tigist Haile combines dermatological science with Ethiopia's rich botanical traditions. She specializes in treating skin conditions using plant-based formulations derived from indigenous herbs like Endod and Koseret.

Her clinic offers a unique "Botanical Skin Mapping" approach to create personalized herbal skincare regimens.`,
    education: ["MD, Jimma University", "Diploma in Botanical Dermatology, University of Cape Town"],
    associations: ["Ethiopian Dermatology Society", "African Botanical Research Network"],
    location: "Kazanchis, Addis Ababa, Ethiopia",
    hours: "Tue-Sat 10:00 - 17:00",
    availableSlots: ["10:00 AM", "11:30 AM", "02:30 PM", "04:00 PM"],
  },
  {
    id: "dr-dawit",
    name: "Dr. Dawit Bekele",
    title: "Traditional Phytotherapist",
    specialties: ["Respiratory Health", "Stress Management", "Sleep Disorders"],
    yearsExp: 22,
    consultations: "4.2k",
    rating: 4.9,
    price: 600,
    image: "../assets/dr-dawit.png",
    verified: true,
    bio: `Dr. Dawit Bekele is one of Ethiopia's most respected traditional phytotherapists with over two decades of practice. He is renowned for his holistic approach to respiratory health and stress-related disorders.

His signature treatment protocols combine ancient Ethiopian inhalation therapies with modern nebulizer technology, using herbs like Tosign and Nech Sar.`,
    education: ["Traditional Medicine Certificate, Axum Heritage Institute", "MSc in Respiratory Medicine, Addis Ababa University"],
    associations: ["Ethiopian Traditional Medicine Council", "Pan-African Herbalists Guild"],
    location: "Piazza, Addis Ababa, Ethiopia",
    hours: "Mon-Fri 08:30 - 16:30",
    availableSlots: ["08:30 AM", "10:00 AM", "01:30 PM", "03:00 PM"],
  },
];
