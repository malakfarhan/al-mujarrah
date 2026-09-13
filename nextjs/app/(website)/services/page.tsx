"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";

import PageHero from "@/components/shared/PageHero";
import Reveal from "@/components/shared/Reveal";
import CTA from "@/components/shared/CTA";
import Container from "@/components/shared/Container";
import { useLanguage } from "@/components/shared/LanguageProvider";
import { services } from "@/lib/data";

export default function ServicesPage() {
  const { isArabic } = useLanguage();

  return (
    <main dir={isArabic ? "rtl" : "ltr"}>
      <PageHero
        kicker={isArabic ? "ما الذي نقدمه" : "What we do"}
        title={
          isArabic
            ? "خدمات تقنية متكاملة للأعمال الحديثة."
            : "End-to-end IT services for modern businesses."
        }
        copy={
          isArabic
            ? "من أنظمة ERP وتطوير الويب والجوال إلى الذكاء الاصطناعي والأمن السيبراني والسحابة، نقدم حلولاً تقنية مترابطة تخدم أهداف العمل."
            : "From enterprise resource planning and web development to mobile apps, AI, cybersecurity and cloud delivery, our services are designed to work together."
        }
      />

      <section className="bg-white py-20 md:py-[118px]">
        <Container>
          <div className="grid items-stretch gap-4 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service, index) => {
              const Icon = service.icon;
              const title = isArabic ? service.titleAr : service.title;
              const kicker = isArabic ? service.kickerAr : service.kicker;
              const short = isArabic ? service.shortAr : service.short;

              return (
                <Reveal key={service.slug} delay={(index % 3) * 60}>
                  <article className="group flex h-[390px] w-full flex-col rounded-[26px] border border-slate-200 bg-white p-7 transition duration-300 hover:-translate-y-1.5 hover:border-[#c8dce6] hover:shadow-card">
                    <span className="grid h-12 w-12 shrink-0 place-items-center rounded-[14px] bg-[#e6f5f1] text-teal-deep transition group-hover:scale-105">
                      <Icon size={22} />
                    </span>

                    <span className="mt-7 inline-flex h-[20px] shrink-0 items-center gap-2 text-[10px] font-extrabold uppercase tracking-[.14em] text-teal-deep before:h-px before:w-5 before:bg-current rtl:normal-case rtl:tracking-normal">
                      {kicker}
                    </span>

                    <div className="mt-3 h-[68px] shrink-0">
                      <h2 className="line-clamp-2 font-display text-[28px] font-semibold leading-[1.08] tracking-[-.04em] text-ink rtl:font-arabic rtl:tracking-normal">
                        {title}
                      </h2>
                    </div>

                    <div className="mt-3 h-[88px] shrink-0">
                      <p className="line-clamp-3 text-sm leading-7 text-muted">
                        {short}
                      </p>
                    </div>

                    {/* Real clickable service link */}
                    <Link
                      href={`/services/${service.slug}`}
                      className="relative z-10 mt-auto inline-flex w-fit items-center gap-2 pt-7 text-xs font-extrabold text-teal-deep transition hover:gap-3"
                    >
                      {isArabic ? "استكشف الخدمة" : "Explore service"}

                      {isArabic ? (
                        <ArrowLeft size={14} />
                      ) : (
                        <ArrowRight size={14} />
                      )}
                    </Link>
                  </article>
                </Reveal>
              );
            })}
          </div>
        </Container>
      </section>

      <CTA />
    </main>
  );
}