import ProductCard from "./ProductCard";

interface Product {
  handle: string;
  title: string;
  image: string;
}

interface CategorySectionProps {
  title: string;
  handle: string;
  products: Product[];
}

export default function CategorySection({ title, handle, products }: CategorySectionProps) {
  // Pad to fill complete rows of 6
  const totalSlots = Math.ceil(products.length / 6) * 6;

  const cells = [];
  for (let i = 0; i < totalSlots; i++) {
    if (i < products.length) {
      cells.push(
        <ProductCard
          key={products[i].handle}
          handle={products[i].handle}
          title={products[i].title}
          image={products[i].image}
        />
      );
    } else {
      cells.push(
        <div
          key={`empty-${i}`}
          className="bg-white border border-border-card h-[286px]"
        />
      );
    }
  }

  return (
    <section id={handle} className="w-full scroll-mt-20">
      {/* Title */}
      <div className="flex h-[65px] items-center px-[44px] py-[36px]">
        <h2 className="font-normal text-[40px] leading-[1.1] tracking-[-0.8px] text-content-primary whitespace-nowrap">
          {title}
        </h2>
      </div>

      {/* Product Grid - 6 columns */}
      <div
        className="grid grid-cols-6 w-full"
        style={{
          borderCollapse: "collapse",
        }}
      >
        {cells}
      </div>
    </section>
  );
}
