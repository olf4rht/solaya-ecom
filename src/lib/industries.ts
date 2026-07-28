export interface IndustryProduct {
  name: string;
  brand: string;
  handle: string;
}

export interface IndustryData {
  id: number;
  industry: string;
  slug: string;
  brand: string;
  videoUrl?: string;
  image?: string;
  products: IndustryProduct[];
}

export const industries: IndustryData[] = [
  {
    id: 1,
    industry: "Food & Beverages",
    slug: "food-and-beverages",
    brand: "Walmart",
    videoUrl: "/assets/videos/01.mp4",
    products: [
      { name: "Organic Juice Bottle", brand: "Walmart", handle: "organic-juice-bottle" },
      { name: "Craft Beer Can", brand: "Walmart", handle: "craft-beer-can" },
      { name: "Premium Coffee Bag", brand: "Walmart", handle: "premium-coffee-bag" },
      { name: "Artisan Chocolate Box", brand: "Walmart", handle: "artisan-chocolate-box" },
      { name: "Sparkling Water Bottle", brand: "Walmart", handle: "sparkling-water-bottle" },
      { name: "Gourmet Sauce Jar", brand: "Walmart", handle: "gourmet-sauce-jar" },
    ],
  },
  {
    id: 2,
    industry: "Art, Culture & Collectibles",
    slug: "art-culture-and-collectibles",
    brand: "Sotheby's",
    videoUrl: "/assets/videos/02.mp4",
    products: [
      { name: "Bronze Sculpture", brand: "Sotheby's", handle: "bronze-sculpture" },
      { name: "Ceramic Vase", brand: "Sotheby's", handle: "ceramic-vase" },
      { name: "Abstract Canvas", brand: "Sotheby's", handle: "abstract-canvas" },
      { name: "Marble Bust", brand: "Sotheby's", handle: "marble-bust" },
      { name: "Glass Ornament", brand: "Sotheby's", handle: "glass-ornament" },
      { name: "Antique Clock", brand: "Sotheby's", handle: "antique-clock" },
    ],
  },
  {
    id: 3,
    industry: "Consumer Electronics",
    slug: "consumer-electronics",
    brand: "Samsung",
    videoUrl: "/assets/videos/03.mp4",
    products: [
      { name: "Wireless Earbuds", brand: "Samsung", handle: "wireless-earbuds" },
      { name: "Smart Watch", brand: "Samsung", handle: "smart-watch" },
      { name: "Portable Speaker", brand: "Samsung", handle: "portable-speaker" },
      { name: "Tablet Stand", brand: "Samsung", handle: "tablet-stand" },
      { name: "Charging Dock", brand: "Samsung", handle: "charging-dock" },
      { name: "VR Headset", brand: "Samsung", handle: "vr-headset" },
    ],
  },
  {
    id: 4,
    industry: "Cosmetics & Beauty",
    slug: "cosmetics-and-beauty",
    brand: "Chanel",
    videoUrl: "/assets/videos/04.mp4",
    products: [
      { name: "Perfume Bottle", brand: "Chanel", handle: "perfume-bottle" },
      { name: "Lipstick Case", brand: "Chanel", handle: "lipstick-case" },
      { name: "Compact Mirror", brand: "Chanel", handle: "compact-mirror" },
      { name: "Skincare Serum", brand: "Chanel", handle: "skincare-serum" },
      { name: "Makeup Palette", brand: "Chanel", handle: "makeup-palette" },
      { name: "Face Cream Jar", brand: "Chanel", handle: "face-cream-jar" },
    ],
  },
  {
    id: 5,
    industry: "Fashion & Apparel",
    slug: "fashion-and-apparel",
    brand: "Gucci",
    videoUrl: "/assets/videos/05.mp4",
    products: [
      { name: "Bianco Sandals", brand: "Kandee", handle: "kandee-bianco-sandals" },
      { name: "Crystal Mules", brand: "Stellina", handle: "stellina-crystal-mules" },
      { name: "Strappy Heels", brand: "Riviera", handle: "riviera-strappy-heels" },
      { name: "Gold Sandals", brand: "Luxe", handle: "luxe-gold-sandals" },
      { name: "Purple Pumps", brand: "Viola", handle: "viola-purple-pumps" },
      { name: "Classic Stilettos", brand: "Noir", handle: "noir-classic-stilettos" },
    ],
  },
  {
    id: 6,
    industry: "Furniture & Homeware",
    slug: "furniture-and-homeware",
    brand: "IKEA",
    videoUrl: "/assets/videos/06.mp4",
    products: [
      { name: "Office Chair", brand: "IKEA", handle: "ergon-office-chair" },
      { name: "Side Table", brand: "IKEA", handle: "blanc-side-table" },
      { name: "Floor Lamp", brand: "IKEA", handle: "floor-lamp" },
      { name: "Bookshelf", brand: "IKEA", handle: "bookshelf" },
      { name: "Dining Chair", brand: "IKEA", handle: "dining-chair" },
      { name: "Desk Organizer", brand: "IKEA", handle: "desk-organizer" },
    ],
  },
  {
    id: 7,
    industry: "Manufacturing & Industrial Design",
    slug: "manufacturing-and-industrial-design",
    brand: "Siemens",
    image: "/assets/products/pink-sneaker.png",
    products: [
      { name: "Turbine Blade", brand: "Siemens", handle: "turbine-blade" },
      { name: "Circuit Board", brand: "Siemens", handle: "circuit-board" },
      { name: "Motor Housing", brand: "Siemens", handle: "motor-housing" },
      { name: "Sensor Module", brand: "Siemens", handle: "sensor-module" },
      { name: "Gear Assembly", brand: "Siemens", handle: "gear-assembly" },
      { name: "Control Panel", brand: "Siemens", handle: "control-panel" },
    ],
  },
];

export const TOTAL_INDUSTRIES = industries.length;
