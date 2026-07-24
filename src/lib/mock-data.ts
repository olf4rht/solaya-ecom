export interface MockProduct {
  id: string;
  title: string;
  handle: string;
  description: string;
  category: string;
  categoryHandle: string;
  image: string;
  detailImages: string[];
  scans: number;
  hasIntegrations: boolean;
  hasExtensions: boolean;
  hasPlyFile: boolean;
  plyUrl?: string; // Path to .ply Gaussian Splat file (e.g. "/assets/models/product.ply")
  commercialUsage: boolean;
}

export interface MockCollection {
  title: string;
  handle: string;
  products: MockProduct[];
}

function makeProduct(
  id: string,
  title: string,
  handle: string,
  imageNum: number,
  category: string,
  categoryHandle: string,
): MockProduct {
  return {
    id,
    title,
    handle,
    description: "This is a fictitious product page created by Solaya for demo purposes.",
    category,
    categoryHandle,
    image: `/assets/products/product-${imageNum}.png`,
    detailImages: [
      "/assets/products/detail-main.png",
      "/assets/products/detail-thumb-2.png",
      "/assets/products/detail-thumb-3.png",
      "/assets/products/detail-thumb-4.png",
      "/assets/products/detail-thumb-5.png",
    ],
    scans: 5,
    hasIntegrations: true,
    hasExtensions: true,
    hasPlyFile: true,
    commercialUsage: true,
  };
}

const FA = "Fashion & Apparel";
const FAH = "fashion-apparel";

const fashionProducts: MockProduct[] = [
  makeProduct("1", "Kandee - Bianco Sandals", "kandee-bianco-sandals", 1, FA, FAH),
  makeProduct("2", "Stellina - Crystal Mules", "stellina-crystal-mules", 2, FA, FAH),
  makeProduct("3", "Riviera - Strappy Heels", "riviera-strappy-heels", 3, FA, FAH),
  makeProduct("4", "Luxe - Gold Sandals", "luxe-gold-sandals", 4, FA, FAH),
  makeProduct("5", "Viola - Purple Pumps", "viola-purple-pumps", 5, FA, FAH),
  makeProduct("6", "Noir - Classic Stilettos", "noir-classic-stilettos", 6, FA, FAH),
  makeProduct("7", "Ebony - Pointed Heels", "ebony-pointed-heels", 7, FA, FAH),
  makeProduct("8", "Ankle Strap - Black Heels", "ankle-strap-black-heels", 8, FA, FAH),
  makeProduct("9", "Crossover - Black Mules", "crossover-black-mules", 9, FA, FAH),
  makeProduct("10", "Ivory - Slingback Heels", "ivory-slingback-heels", 10, FA, FAH),
  makeProduct("11", "Rosa - Pink Stilettos", "rosa-pink-stilettos", 11, FA, FAH),
  makeProduct("12", "Amber - Orange Pumps", "amber-orange-pumps", 12, FA, FAH),
  makeProduct("13", "Cloud - White Sneakers", "cloud-white-sneakers", 13, FA, FAH),
  makeProduct("14", "Gazelle - Stripe Sneakers", "gazelle-stripe-sneakers", 14, FA, FAH),
  makeProduct("15", "Shadow - Black Sneakers", "shadow-black-sneakers", 15, FA, FAH),
  makeProduct("16", "Retro - Gold Sneakers", "retro-gold-sneakers", 16, FA, FAH),
  makeProduct("17", "Dimple - Leather Bag", "dimple-leather-bag", 17, FA, FAH),
];

const furnitureProducts: MockProduct[] = [
  makeProduct("18", "Ergon - Office Chair", "ergon-office-chair", 18, "Furniture & Homeware", "furniture-homeware"),
  makeProduct("19", "Blanc - Side Table", "blanc-side-table", 19, "Furniture & Homeware", "furniture-homeware"),
];

const electronicsProducts: MockProduct[] = [
  makeProduct("20", "Marshall - Portable Speaker", "marshall-portable-speaker", 20, "Consumer Electronics", "consumer-electronics"),
];

const cosmeticsProducts: MockProduct[] = [
  makeProduct("21", "Luxe - Cosmetics Case", "luxe-cosmetics-case", 20, "Cosmetics & Beauty", "cosmetics-beauty"),
];

export const mockCollections: MockCollection[] = [
  { title: "Fashion & Apparel", handle: "fashion-apparel", products: fashionProducts },
  { title: "Furniture & Homeware", handle: "furniture-homeware", products: furnitureProducts },
  { title: "Consumer Electronics", handle: "consumer-electronics", products: electronicsProducts },
  { title: "Cosmetics & Beauty", handle: "cosmetics-beauty", products: cosmeticsProducts },
];

export const allProducts: MockProduct[] = [
  ...fashionProducts,
  ...furnitureProducts,
  ...electronicsProducts,
  ...cosmeticsProducts,
];

export function getMockProduct(handle: string): MockProduct | undefined {
  return allProducts.find((p) => p.handle === handle);
}
