"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, Mail, MapPin } from "lucide-react";
import { services } from "@/lib/data";
import { useLanguage } from "@/components/shared/LanguageProvider";
import Container from "@/components/shared/Container";

export default function Footer() {
  const pathname = usePathname();
  const { t } = useLanguage();
  if (pathname.startsWith("/admin")) return null;

  return (
    <footer className="relative overflow-hidden bg-[#040b14] pb-7 pt-20 text-white">
      <div className="pointer-events-none absolute inset-0 opacity-20 [background-image:radial-gradient(circle_at_20%_30%,rgba(255,255,255,.14)_0_1px,transparent_1.4px),radial-gradient(circle_at_80%_62%,rgba(91,218,198,.13)_0_1px,transparent_1.4px)] [background-size:190px_190px,260px_260px]" />
      <Container className="relative z-10 grid gap-10 border-b border-white/[.08] pb-12 md:grid-cols-2 lg:grid-cols-[1.35fr_.8fr_.8fr_.8fr]">
        <div className="max-w-[420px]">
          <div className="flex items-center gap-3"><span className="grid h-[42px] w-[42px] place-items-center rounded-[14px] bg-gradient-to-br from-teal to-blue font-display font-black text-ink">A</span><span className="font-display text-xl font-bold rtl:font-arabic">almajrah<span className="opacity-50">.</span></span></div>
          <p className="mt-5 text-sm leading-7 text-[#8fa2b5]">{t("Enterprise software, ERP, web, mobile, AI and cloud engineering for businesses that need dependable digital operations.")}</p>
          <div className="mt-5 grid gap-2 text-xs text-[#9fb1c3]"><span className="flex items-center gap-2"><MapPin size={15} className="text-teal"/> Riyadh, Saudi Arabia</span><span className="flex items-center gap-2"><Mail size={15} className="text-teal"/> hello@almajrah.com</span></div>
        </div>
        <div><h5 className="mb-4 font-display text-sm font-bold rtl:font-arabic">{t("Solutions")}</h5><div className="grid gap-2.5">{services.slice(0,5).map(s => <Link className="text-sm text-[#8397ab] transition hover:text-white" key={s.slug} href={`/services/${s.slug}`}>{t(s.title)}</Link>)}</div></div>
        <div><h5 className="mb-4 font-display text-sm font-bold rtl:font-arabic">{t("Company")}</h5><div className="grid gap-2.5"><Link className="text-sm text-[#8397ab] hover:text-white" href="/company">{t("About")}</Link><Link className="text-sm text-[#8397ab] hover:text-white" href="/portfolio">{t("Portfolio")}</Link><Link className="text-sm text-[#8397ab] hover:text-white" href="/pricing">{t("Pricing")}</Link><Link className="text-sm text-[#8397ab] hover:text-white" href="/blog">{t("Insights")}</Link></div></div>
        <div><h5 className="mb-4 font-display text-sm font-bold rtl:font-arabic">{t("Connect")}</h5><div className="grid gap-2.5"><Link className="inline-flex items-center gap-1.5 text-sm text-[#8397ab] hover:text-white" href="/contact">{t("Start a project")} <ArrowUpRight size={13}/></Link><Link className="text-sm text-[#8397ab] hover:text-white" href="/admin">{t("Dashboard")}</Link><Link className="text-sm text-[#8397ab] hover:text-white" href="/contact">{t("Support")}</Link></div></div>
      </Container>
      <Container className="relative z-10 flex flex-col gap-2 pt-6 text-[11px] text-[#65798d] sm:flex-row sm:justify-between"><span>{t("© 2026 Almajrah. All rights reserved.")}</span><span>{t("Built for scalable digital operations.")}</span></Container>
    </footer>
  );
}
