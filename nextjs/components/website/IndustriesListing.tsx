"use client";

import PageHero from "@/components/shared/PageHero";
import Reveal from "@/components/shared/Reveal";
import CTA from "@/components/shared/CTA";
import Container from "@/components/shared/Container";
import { useLanguage } from "@/components/shared/LanguageProvider";
import { industries } from "@/lib/data";

export default function IndustriesListing() {
  const { isArabic } = useLanguage();

  return (
    <main dir={isArabic ? "rtl" : "ltr"}>
      <PageHero
        kicker={isArabic ? "حلول القطاعات" : "Industry solutions"}
        title={
          isArabic
            ? "تقنية مصممة وفقاً لطريقة عمل القطاع فعلياً."
            : "Technology shaped by how the business actually operates."
        }
        copy={
          isArabic
            ? "لكل قطاع عملياته وتحدياته الخاصة. نكيّف أنظمة ERP والتطبيقات والأتمتة وتدفقات البيانات بما يتناسب مع طبيعة العمل."
            : "Industry context matters. We adapt ERP, applications, automation and data flows to the decisions, constraints and handoffs unique to each operation."
        }
      />

      <section className="bg-white py-20 md:py-[118px]">
        <Container className="grid gap-5">
          {industries.map((industry, index) => {
            const Icon = industry.icon;
            const title = isArabic ? industry.titleAr : industry.title;
            const copy = isArabic ? industry.copyAr : industry.copy;
            const tags = isArabic ? industry.tagsAr : industry.tags;

            return (
              <Reveal key={industry.title} delay={(index % 3) * 70}>
                <article className="grid min-h-[320px] overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm md:grid-cols-[.42fr_.58fr]">
                  <div className="relative grid min-h-[260px] place-items-center overflow-hidden bg-[radial-gradient(circle_at_70%_30%,rgba(49,210,181,.18),transparent_24%),radial-gradient(circle_at_30%_70%,rgba(93,140,255,.20),transparent_28%),linear-gradient(145deg,#07111f,#123354)] text-[#7cebd7]">
                    <Icon size={64} />

                    <div className="absolute -bottom-20 -right-14 h-52 w-52 rounded-full border border-white/10 shadow-[0_0_0_35px_rgba(255,255,255,.025)] rtl:-left-14 rtl:right-auto" />
                  </div>

                  <div className="flex flex-col p-7 md:p-10">
                    <span className="inline-flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-[.14em] text-teal-deep before:h-px before:w-5 before:bg-current rtl:normal-case rtl:tracking-normal">
                      {isArabic
                        ? `القطاع ${String(index + 1).padStart(2, "0")}`
                        : `Industry ${String(index + 1).padStart(2, "0")}`}
                    </span>

                    <h2 className="mt-3 font-display text-[clamp(30px,3vw,44px)] font-semibold tracking-[-.04em] text-ink rtl:font-arabic rtl:tracking-normal">
                      {title}
                    </h2>

                    <p className="mt-4 max-w-[670px] text-[15px] leading-7 text-muted">
                      {copy}
                    </p>

                    <div className="mt-auto flex flex-wrap gap-2 pt-6">
                      {tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full bg-slate-100 px-3 py-2 text-[10px] font-extrabold text-[#496076]"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </Container>
      </section>

      <CTA />
    </main>
  );
}