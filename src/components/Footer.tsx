export default function Footer() {
  return (
    <footer className="bg-bg-primary flex flex-col h-[166px] items-start justify-end px-[31px] py-[27px] w-full">
      <div className="flex gap-[50px] items-center w-full">
        <a
          href="/terms"
          className="bg-bg-footer-pill flex items-center justify-center p-[6px] rounded-[5px] text-[11px] font-medium text-content-primary hover:opacity-70 transition-opacity"
        >
          Terms of Service
        </a>
        <a
          href="/contact"
          className="bg-bg-footer-pill flex items-center justify-center p-[6px] rounded-[5px] text-[11px] font-medium text-content-primary hover:opacity-70 transition-opacity"
        >
          Contact
        </a>
        <a
          href="https://linkedin.com"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-bg-footer-pill flex items-center justify-center p-[6px] rounded-[5px] text-[11px] font-medium text-content-primary hover:opacity-70 transition-opacity"
        >
          LinkedIn
        </a>
      </div>
    </footer>
  );
}
