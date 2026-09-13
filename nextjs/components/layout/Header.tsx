"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowUpRight, ChevronDown, Languages, Menu, X } from "lucide-react";

import { services } from "@/lib/data";
import { useLanguage } from "@/components/shared/LanguageProvider";
import Container from "@/components/shared/Container";

const navLink =
  "rounded-full px-4 py-2.5 text-[11px] font-mono font-bold uppercase tracking-[.04em] transition";

export default function Header() {
  const pathname = usePathname();
  const { isArabic, toggleLanguage, t } = useLanguage();
  const [open, setOpen] = useState(false);

  useEffect(() => setOpen(false), [pathname]);

  if (pathname.startsWith("/admin")) return null;

  return (
    <header className="fixed inset-x-0 top-0 z-[1000] h-[100px] border-b border-white/[.06] bg-[#040b14]">
      <Container className="relative grid h-full grid-cols-[1fr_auto_1fr] items-center gap-4">
        <Link href="/" aria-label="Al Majara home" className="justify-self-start">
          <Image
            src="/logo.png"
            alt="Al Majara"
            width={241}
            height={227}
            priority
            className="h-[88px] w-auto object-contain"
          />
        </Link>

        <nav className="hidden items-center rounded-full border border-white/[.10] bg-white/[.04] p-1 lg:flex">
          <Link
            href="/"
            className={`${navLink} ${
              pathname === "/"
                ? "bg-white/[.12] text-white"
                : "text-white/55 hover:text-white"
            }`}
          >
            {t("Home")}
          </Link>

          {/* Click opens Services page, hover keeps dropdown */}
          <div className="group relative">
            <Link
              href="/services"
              className={`${navLink} flex items-center gap-1.5 ${
                pathname.startsWith("/services")
                  ? "bg-white/[.12] text-white"
                  : "text-white/55 hover:text-white"
              }`}
            >
              {t("Solutions")}
              <ChevronDown size={13} />
            </Link>

            <div className="invisible absolute left-1/2 top-[calc(100%+14px)] w-[620px] -translate-x-1/2 translate-y-2 rounded-[22px] border border-white/[.10] bg-[#040b14] p-3 opacity-0 shadow-2xl transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
              <div className="grid grid-cols-2 gap-1">
                {services.slice(0, 6).map((service) => {
                  const Icon = service.icon;

                  return (
                    <Link
                      key={service.slug}
                      href={`/services/${service.slug}`}
                      className="flex items-center gap-3 rounded-[14px] p-3 text-white/70 transition hover:bg-white/[.07] hover:text-white"
                    >
                      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white/[.06] text-teal">
                        <Icon size={17} />
                      </span>

                      <span className="text-xs font-bold">
                        {isArabic ? service.titleAr : service.title}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>

          <Link
            href="/industries"
            className={`${navLink} ${
              pathname === "/industries"
                ? "bg-white/[.12] text-white"
                : "text-white/55 hover:text-white"
            }`}
          >
            {t("Industries")}
          </Link>

          <Link
            href="/portfolio"
            className={`${navLink} ${
              pathname.startsWith("/portfolio")
                ? "bg-white/[.12] text-white"
                : "text-white/55 hover:text-white"
            }`}
          >
            {isArabic ? "معرض الأعمال" : "Portfolio"}
          </Link>

          <Link
            href="/blog"
            className={`${navLink} ${
              pathname.startsWith("/blog")
                ? "bg-white/[.12] text-white"
                : "text-white/55 hover:text-white"
            }`}
          >
            {isArabic ? "الرؤى" : "Insights"}
          </Link>

          <Link
            href="/company"
            className={`${navLink} ${
              pathname === "/company"
                ? "bg-white/[.12] text-white"
                : "text-white/55 hover:text-white"
            }`}
          >
            {t("Company")}
          </Link>

          <Link
            href="/pricing"
            className={`${navLink} ${
              pathname === "/pricing"
                ? "bg-white/[.12] text-white"
                : "text-white/55 hover:text-white"
            }`}
          >
            {t("Pricing")}
          </Link>

          <Link
            href="/contact"
            className={`${navLink} ${
              pathname === "/contact"
                ? "bg-white/[.12] text-white"
                : "text-white/55 hover:text-white"
            }`}
          >
            {t("Contact")}
          </Link>
        </nav>

        <div className="hidden items-center justify-self-end gap-2 lg:flex">
          <button
            type="button"
            onClick={toggleLanguage}
            className="inline-flex items-center gap-2 rounded-full border border-white/[.12] bg-white/[.03] px-4 py-2.5 text-[11px] font-bold text-white/80"
          >
            <Languages size={15} className="text-teal" />
            {isArabic ? "EN" : "العربية"}
          </button>

          <Link
            href="/contact"
            className="hidden items-center gap-3 rounded-full border border-white/[.12] bg-white/[.04] px-5 py-2.5 text-xs font-bold text-white xl:inline-flex"
          >
            {t("Let's Talk")}
            <ArrowUpRight size={15} />
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="absolute right-0 grid h-10 w-10 place-items-center rounded-full border border-white/[.12] bg-white/[.05] text-white lg:hidden"
        >
          {open ? <X size={19} /> : <Menu size={19} />}
        </button>
      </Container>

      <div
        className={`fixed left-4 right-4 top-[108px] rounded-[20px] border border-white/[.08] bg-[#040b14] p-5 text-white shadow-2xl transition-all duration-300 lg:hidden ${
          open
            ? "visible translate-y-0 opacity-100"
            : "invisible -translate-y-3 opacity-0"
        }`}
      >
        <button
          type="button"
          onClick={toggleLanguage}
          className="mb-4 flex w-full items-center justify-center gap-2 rounded-full border border-white/[.12] bg-white/[.05] px-4 py-3 text-sm font-bold"
        >
          <Languages size={16} className="text-teal" />
          {isArabic ? "English" : "العربية"}
        </button>

        <div className="grid">
          <Link className="border-b border-white/[.07] py-3 text-sm font-bold" href="/">
            {t("Home")}
          </Link>

          <Link
            className="border-b border-white/[.07] py-3 text-sm font-bold"
            href="/services"
          >
            {t("Solutions")}
          </Link>

          <Link
            className="border-b border-white/[.07] py-3 text-sm font-bold"
            href="/industries"
          >
            {t("Industries")}
          </Link>

          <Link
            className="border-b border-white/[.07] py-3 text-sm font-bold"
            href="/portfolio"
          >
            {isArabic ? "معرض الأعمال" : "Portfolio"}
          </Link>

          <Link
            className="border-b border-white/[.07] py-3 text-sm font-bold"
            href="/blog"
          >
            {isArabic ? "الرؤى" : "Insights"}
          </Link>

          <Link
            className="border-b border-white/[.07] py-3 text-sm font-bold"
            href="/company"
          >
            {t("Company")}
          </Link>

          <Link
            className="border-b border-white/[.07] py-3 text-sm font-bold"
            href="/pricing"
          >
            {t("Pricing")}
          </Link>

          <Link className="py-3 text-sm font-bold" href="/contact">
            {t("Contact")}
          </Link>
        </div>
      </div>
    </header>
  );
}