import Link from "next/link";
import Image from "next/image";

interface ProductCardProps {
  handle: string;
  title: string;
  image: string;
}

export default function ProductCard({ handle, title, image }: ProductCardProps) {
  return (
    <Link
      href={`/products/${handle}`}
      className="bg-white border border-border-card h-[286px] overflow-clip relative block hover:opacity-80 transition-opacity -mr-px -mb-px"
    >
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 size-[161px]">
        <Image
          src={image}
          alt={title}
          fill
          className="object-contain"
          sizes="(max-width: 768px) 50vw, 16vw"
        />
      </div>
    </Link>
  );
}
