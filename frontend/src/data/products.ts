// import productKoseret from "@/assets/product-koseret.jpg";
// import productMoringa from "@/assets/product-moringa.jpg";
// import productNigella from "@/assets/product-nigella.jpg";
// import productTenaAdam from "@/assets/product-tena-adam.jpg";
// import productEndod from "@/assets/product-endod.jpg";
// import productDamakesse from "@/assets/product-damakesse.jpg";

export interface Product {
  id: string;
  name: string;
  subtitle: string;
  category: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  reviews: number;
  inStock: boolean;
  description: string;
  benefits: string[];
  usage: string;
  origin: string;
  weight: string;
  practitionerRecommended?: string;
}

export const productCategories = [
  "All Products",
  "Dried Herbs",
  "Supplements",
  "Essential Oils",
  "Teas & Infusions",
  "Skincare",
];

export const products: Product[] = [
  {
    id: "koseret-blend",
    name: "Koseret Herbal Blend",
    subtitle: "Lippia abyssinica — Antimicrobial",
    category: "Dried Herbs",
    price: 280,
    originalPrice: 350,
    image: "../assets/product-koseret.jpg",
    rating: 4.8,
    reviews: 124,
    inStock: true,
    description:
      "Premium hand-harvested Koseret (Lippia abyssinica) from the highlands of southern Ethiopia. This aromatic herb has been used for centuries in Ethiopian traditional medicine for its potent antimicrobial and anti-inflammatory properties. Our blend is carefully dried and processed to preserve its essential oils and therapeutic compounds.",
    benefits: [
      "Natural antimicrobial properties",
      "Supports digestive health",
      "Anti-inflammatory action",
      "Rich in essential oils",
    ],
    usage: "Steep 1-2 teaspoons in hot water for 5-7 minutes. Can also be used as a culinary spice.",
    origin: "Sidama Region, Ethiopia",
    weight: "100g",
    practitionerRecommended: "Dr. Selamawit Gebre",
  },
  {
    id: "moringa-capsules",
    name: "Moringa Stenopetala Capsules",
    subtitle: "60 Capsules — Metabolic Support",
    category: "Supplements",
    price: 520,
    image: "../assets/product-moringa.jpg",
    rating: 4.9,
    reviews: 238,
    inStock: true,
    description:
      "Pure Moringa stenopetala leaf powder capsules sourced from certified organic farms in the Konso region. Known locally as 'Shiferaw', this superfood is packed with vitamins, minerals, and antioxidants. Clinically validated for metabolic health support and insulin sensitivity.",
    benefits: [
      "Supports insulin sensitivity",
      "Rich in vitamins A, C, and E",
      "Powerful antioxidant",
      "Supports hormonal balance",
    ],
    usage: "Take 2 capsules daily with meals. Consult your practitioner for personalized dosage.",
    origin: "Konso, Ethiopia",
    weight: "60 capsules (500mg each)",
    practitionerRecommended: "Dr. Selamawit Gebre",
  },
  {
    id: "nigella-oil",
    name: "Nigella Sativa Cold-Pressed Oil",
    subtitle: "Black Seed Oil — Immune Booster",
    category: "Essential Oils",
    price: 450,
    originalPrice: 500,
    image: "../assets/product-koseret.jpg",
    rating: 4.7,
    reviews: 186,
    inStock: true,
    description:
      "Cold-pressed Nigella sativa (black seed) oil from the fertile plains of western Ethiopia. This 'seed of blessing' has been used for over 2,000 years across Ethiopian, Egyptian, and Middle Eastern traditions. Our oil is extracted without heat to preserve thymoquinone, its most potent compound.",
    benefits: [
      "Immune system support",
      "Anti-inflammatory properties",
      "Supports respiratory health",
      "Rich in thymoquinone",
    ],
    usage: "Take 1 teaspoon daily, or mix with honey. Can also be applied topically.",
    origin: "Wellega, Ethiopia",
    weight: "250ml",
    practitionerRecommended: "Dr. Abebe Mengistu",
  },
  {
    id: "tena-adam-tea",
    name: "Tena Adam Herbal Tea",
    subtitle: "Rue Herb — Digestive Wellness",
    category: "Teas & Infusions",
    price: 180,
    image: "../assets/product-koseret.jpg",
    rating: 4.6,
    reviews: 92,
    inStock: true,
    description:
      "Traditional Tena Adam (Ruta chalepensis) tea blend, hand-picked and sun-dried in the highlands of Gondar. This sacred herb is a staple in Ethiopian households, used for generations to support digestive comfort and overall wellness.",
    benefits: [
      "Digestive comfort",
      "Calming properties",
      "Traditional wellness herb",
      "Aromatic and flavorful",
    ],
    usage: "Steep 1 teaspoon in boiling water for 3-5 minutes. Best enjoyed in the morning.",
    origin: "Gondar, Ethiopia",
    weight: "75g loose leaf",
  },
  {
    id: "endod-extract",
    name: "Endod Botanical Extract",
    subtitle: "Phytolacca dodecandra — Dermal Care",
    category: "Skincare",
    price: 380,
    image: "../assets/product-koseret.jpg",
    rating: 4.5,
    reviews: 67,
    inStock: false,
    description:
      "Concentrated Endod (Phytolacca dodecandra) extract, formulated for topical dermal applications. This Ethiopian native plant has been traditionally used for skin cleansing and is being studied for its remarkable saponin content.",
    benefits: [
      "Natural skin cleanser",
      "Rich in saponins",
      "Supports skin health",
      "Traditional dermal remedy",
    ],
    usage: "Apply a small amount to affected area twice daily. Patch test recommended.",
    origin: "Shewa Region, Ethiopia",
    weight: "50ml",
    practitionerRecommended: "Dr. Tigist Haile",
  },
  {
    id: "damakesse-blend",
    name: "Damakesse Respiratory Blend",
    subtitle: "Ocimum lamiifolium — Breathing Support",
    category: "Dried Herbs",
    price: 320,
    image: "../assets/product-koseret.jpg",
    rating: 4.8,
    reviews: 145,
    inStock: true,
    description:
      "Premium Damakesse (Ocimum lamiifolium) leaf blend, traditionally used across Ethiopia for respiratory health. This aromatic basil-family herb is carefully harvested during peak potency and gently dried to maintain its volatile oils.",
    benefits: [
      "Respiratory support",
      "Natural decongestant",
      "Anti-febrile properties",
      "Soothing aroma",
    ],
    usage: "Steep in hot water for steam inhalation, or brew as tea. 1-2 teaspoons per cup.",
    origin: "Harar, Ethiopia",
    weight: "80g",
    practitionerRecommended: "Dr. Dawit Bekele",
  },
];
