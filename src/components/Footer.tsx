import CtaButton from "./CtaButton";

export default function Footer() {
  return (
    <footer className="bg-bg-primary flex flex-col items-start justify-end px-4 md:px-[31px] py-[27px] w-full gap-[20px] md:gap-[30px]">
      <div className="flex flex-wrap items-center gap-[12px]">
        <CtaButton href="https://www.solaya.ai/" external>
          Download Solaya
        </CtaButton>
        <CtaButton href="https://www.solaya.ai/contact" external className="bg-transparent !text-[#2A2A27] border border-[#2A2A27] hover:!bg-[#2A2A27] hover:!text-white">
          Book a Demo
        </CtaButton>
      </div>
      <div className="flex flex-wrap gap-[20px] md:gap-[50px] items-center w-full">
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
