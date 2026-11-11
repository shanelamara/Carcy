import "server-only";

import type { ConceptProduct } from "../types/product-types";

// Illustrative collections from the supplied prototype, not a live product catalog.
export const conceptProducts: ConceptProduct[] = [
  { id: "cute-finds", collection: "Cute Finds", category: "Cute Finds", description: "A little personality for your favorite corner.", image: "/images/cute-finds.svg", order: 1 },
  { id: "personalized-creations", collection: "Personalized Creations", category: "Personalized Creations", description: "A personal touch to take along every day.", image: "/images/personalized-creations.svg", order: 2 },
  { id: "desk-accessories", collection: "Desk & Room Accessories", category: "Desk & Room Accessories", description: "A creative home for all your little essentials.", image: "/images/desk-accessories.svg", order: 3 },
  { id: "everyday-essentials", collection: "Everyday Essentials", category: "Everyday Essentials", description: "Thoughtful details for a more joyful everyday.", image: "/images/everyday-essentials.svg", order: 4 },
  { id: "gifts", collection: "Gifts & Special Items", category: "Gifts & Special Items", description: "An idea for a thoughtful, personal gift.", image: "/images/gifts.svg", order: 5 },
];
