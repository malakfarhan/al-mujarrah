import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Container from "./Container";

export default function PageHero({ kicker, title, copy }: { kicker: string; title: string; copy: string }) {
  return (
    <section className="relative overflow-hidden bg-[#06101d] pb-20 pt-36 text-white md:pb-24 md:pt-40">
      <div className="pointer-events-none absolute inset-0 opacity-25 [background-image:linear-gradient(rgba(255,255,255,.07)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.07)_1px,transparent_1px)] [background-size:72px_72px] [mask-image:linear-gradient(to_bottom,#000,transparent_92%)]" />
      <div className="pointer-events-none absolute -right-40 top-8 h-[440px] w-[440px] rounded-full bg-[radial-gradient(circle,rgba(93,140,255,.22),transparent_67%)] blur-2xl rtl:-left-40 rtl:right-auto" />
      <Container className="relative z-10">
        <span className="inline-flex items-center gap-2.5 text-[11px] font-extrabold uppercase tracking-[0.15em] text-[#6ee2cf] before:h-px before:w-6 before:bg-current rtl:normal-case rtl:tracking-normal">{kicker}</span>
        <h1 className="mt-4 max-w-[980px] font-display text-[clamp(48px,6vw,82px)] font-semibold leading-[.98] tracking-[-0.055em] rtl:font-arabic rtl:tracking-[-0.02em]">{title}</h1>
        <p className="mt-5 max-w-[730px] text-[clamp(16px,1.4vw,19px)] leading-8 text-[#aab9c8]">{copy}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/contact" className="inline-flex items-center justify-center gap-2 rounded-[14px] bg-gradient-to-r from-teal to-[#67dfcb] px-5 py-3.5 text-sm font-extrabold text-[#052118] shadow-[0_10px_24px_rgba(49,210,181,.22)] transition hover:-translate-y-0.5">Talk to an expert <ArrowRight size={16} className="rtl:rotate-180" /></Link>
          <Link href="/portfolio" className="inline-flex items-center justify-center rounded-[14px] border border-white/15 bg-white/[.06] px-5 py-3.5 text-sm font-extrabold text-white transition hover:bg-white/10">View our work</Link>
        </div>
      </Container>
    </section>
  );
}
