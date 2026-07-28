import Link from "next/link";

interface CtaButtonProps {
  children: React.ReactNode;
  href: string;
  external?: boolean;
  className?: string;
}

export default function CtaButton({ children, href, external = false, className = "" }: CtaButtonProps) {
  const styles = `inline-flex items-center justify-center h-[38px] px-[20px] rounded-[12px] bg-[#2A2A27] text-[12px] font-medium text-white tracking-[0.2px] hover:bg-[#3a3a37] transition-colors whitespace-nowrap ${className}`;

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={styles}
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={styles}>
      {children}
    </Link>
  );
}
