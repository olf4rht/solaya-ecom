export interface IndustryData {
  id: number;
  industry: string;
  slug: string;
  brand: string;
  videoUrl?: string;
  image?: string;
}

export const industries: IndustryData[] = [
  {
    id: 1,
    industry: "Food & Beverages",
    slug: "food-and-beverages",
    brand: "Walmart",
    videoUrl: "/assets/videos/01.mp4",
  },
  {
    id: 2,
    industry: "Art, Culture & Collectibles",
    slug: "art-culture-and-collectibles",
    brand: "Sotheby's",
    videoUrl: "/assets/videos/02.mp4",
  },
  {
    id: 3,
    industry: "Consumer Electronics",
    slug: "consumer-electronics",
    brand: "Samsung",
    videoUrl: "/assets/videos/03.mp4",
  },
  {
    id: 4,
    industry: "Cosmetics & Beauty",
    slug: "cosmetics-and-beauty",
    brand: "Chanel",
    videoUrl: "/assets/videos/04.mp4",
  },
  {
    id: 5,
    industry: "Fashion & Apparel",
    slug: "fashion-and-apparel",
    brand: "Gucci",
    videoUrl: "/assets/videos/05.mp4",
  },
  {
    id: 6,
    industry: "Furniture & Homeware",
    slug: "furniture-and-homeware",
    brand: "IKEA",
    videoUrl: "/assets/videos/06.mp4",
  },
  {
    id: 7,
    industry: "Manufacturing & Industrial Design",
    slug: "manufacturing-and-industrial-design",
    brand: "Siemens",
    image: "/assets/products/pink-sneaker.png",
  },
];

export const TOTAL_INDUSTRIES = industries.length;
