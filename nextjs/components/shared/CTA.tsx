import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Container from "./Container";

export default function CTA() {
  return (
    <section className="bg-white py-14 md:py-20">
      <Container>
        <div className="relative overflow-hidden rounded-[32px] border border-[#16304f] bg-[radial-gradient(circle_at_82%_22%,rgba(108,95,255,.22),transparent_25%),radial-gradient(circle_at_72%_80%,rgba(36,213,187,.17),transparent_28%),linear-gradient(120deg,#071221_0%,#0a1d35_58%,#10254a_100%)] px-7 py-10 text-white shadow-[0_32px_85px_rgba(7,17,31,.18)] md:flex md:items-center md:justify-between md:gap-10 md:px-12 md:py-12">
          <div className="relative z-10 max-w-[760px]">
            <span className="inline-flex items-center gap-2.5 text-[11px] font-extrabold uppercase tracking-[0.15em] text-[#6ee2cf] before:h-px before:w-6 before:bg-current rtl:normal-case rtl:tracking-normal">Ready when you are</span>
            <h2 className="mt-3 font-display text-[clamp(34px,4vw,58px)] font-semibold leading-[1.04] tracking-[-0.04em] rtl:font-arabic rtl:tracking-[-0.02em]">Bring us the complex workflow.</h2>
            <p className="mt-3 text-base leading-7 text-[#9fb2c7]">We’ll turn it into a clear, scalable digital system.</p>
          </div>
          <Link href="/contact" className="relative z-10 mt-7 inline-flex items-center justify-center gap-2 rounded-[14px] bg-gradient-to-r from-teal to-[#67dfcb] px-5 py-3.5 text-sm font-extrabold text-[#052118] transition hover:-translate-y-0.5 md:mt-0">Start a project <ArrowRight size={16} className="rtl:rotate-180" /></Link>
        </div>
      </Container>
    </section>
  );
}
