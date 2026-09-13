"use client";

import Link from "next/link";
import { Check } from "lucide-react";

import PageHero from "@/components/shared/PageHero";
import Reveal from "@/components/shared/Reveal";
import CTA from "@/components/shared/CTA";
import Container from "@/components/shared/Container";
import { useLanguage } from "@/components/shared/LanguageProvider";

export default function PricingContent() {
  const { isArabic } = useLanguage();

  const plans = [
    {
      name: isArabic ? "مرحلة الاستكشاف" : "Discovery Sprint",
      price: isArabic ? "تبدأ من 8,000 ر.س" : "From SAR 8K",
      copy: isArabic
        ? "للمشاريع المعقدة التي تحتاج إلى خطة تقنية وتشغيلية واضحة قبل بدء التطوير."
        : "For complex projects that need a clear technical and operational plan before build.",
      items: isArabic
        ? [
            "تحليل سير العمل",
            "تصميم البنية التقنية",
            "تحديد النطاق والمراحل",
            "تقييم المخاطر",
          ]
        : [
            "Workflow discovery",
            "Architecture outline",
            "Scope & milestones",
            "Risk register",
          ],
    },
    {
      name: isArabic ? "تطوير المنتج أو المنصة" : "Product / Platform Build",
      price: isArabic ? "حسب نطاق المشروع" : "Custom scope",
      copy: isArabic
        ? "لأنظمة ERP والبوابات وتطبيقات الجوال ومنصات الويب والمنتجات الرقمية المتكاملة."
        : "For ERP, portals, mobile apps and connected digital products.",
      items: isArabic
        ? [
            "نظام التصميم",
            "الواجهة الأمامية وواجهات API",
            "تصميم قاعدة البيانات",
            "الاختبارات والنشر",
          ]
        : [
            "Design system",
            "Frontend + API",
            "Database design",
            "Testing & deployment",
          ],
      featured: true,
    },
    {
      name: isArabic ? "الدعم والتطوير المستمر" : "Support & Evolution",
      price: isArabic ? "اشتراك شهري" : "Monthly retainer",
      copy: isArabic
        ? "للأنظمة العاملة التي تحتاج إلى تحسين مستمر ودعم موثوق وملكية تقنية طويلة المدى."
        : "For production systems that need continuous improvement and reliable technical ownership.",
      items: isArabic
        ? [
            "المراقبة",
            "إصلاح الأخطاء",
            "التحسينات والتطوير",
            "دعم بأولوية",
          ]
        : [
            "Monitoring",
            "Bug fixes",
            "Enhancements",
            "Priority support",
          ],
    },
  ];

  return (
    <main dir={isArabic ? "rtl" : "ltr"}>
      <PageHero
        kicker={isArabic ? "نقاط بداية واضحة" : "Transparent starting points"}
        title={
          isArabic
            ? "تقنية احترافية مع طرق أوضح لبدء المشروع."
            : "Serious technology, with clearer ways to start."
        }
        copy={
          isArabic
            ? "يختلف كل مشروع عن الآخر، لكن نموذج التعاون يجب أن يكون واضحاً وسهل الفهم. هذه نماذج عملية تساعدك على تحديد نقطة البداية المناسبة."
            : "Every project is different, but the engagement model should still be easy to understand. These are practical starting points for planning."
        }
      />

      <section className="bg-white py-20 md:py-[118px]">
        <Container>
          <div className="grid items-stretch gap-4 lg:grid-cols-3">
            {plans.map((plan, index) => (
              <Reveal key={plan.name} delay={index * 80}>
                <div
                  className={`relative flex h-full min-h-[500px] flex-col overflow-hidden rounded-[28px] border p-7 ${
                    plan.featured
                      ? "border-[#153c4c] bg-[#07111f] text-white shadow-[0_30px_70px_rgba(7,17,31,.18)]"
                      : "border-slate-200 bg-white text-ink"
                  }`}
                >
                  {plan.featured && (
                    <span className="absolute right-5 top-5 rounded-full bg-teal px-3 py-1.5 text-[9px] font-black uppercase tracking-[.1em] text-[#052118] rtl:left-5 rtl:right-auto rtl:normal-case rtl:tracking-normal">
                      {isArabic ? "الأكثر مرونة" : "Most flexible"}
                    </span>
                  )}

                  <span
                    className={`inline-flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-[.14em] before:h-px before:w-5 before:bg-current rtl:normal-case rtl:tracking-normal ${
                      plan.featured ? "text-[#6ee2cf]" : "text-teal-deep"
                    }`}
                  >
                    {plan.name}
                  </span>

                  <h2 className="mt-6 min-h-[52px] font-display text-[36px] font-semibold tracking-[-.045em] rtl:font-arabic rtl:tracking-normal">
                    {plan.price}
                  </h2>

                  <p
                    className={`mt-4 min-h-[84px] text-sm leading-7 ${
                      plan.featured ? "text-[#9fb2c7]" : "text-muted"
                    }`}
                  >
                    {plan.copy}
                  </p>

                  <ul className="mt-8 grid gap-3">
                    {plan.items.map((item) => (
                      <li
                        key={item}
                        className={`flex items-center gap-2.5 text-sm ${
                          plan.featured ? "text-[#d2dde7]" : "text-[#526477]"
                        }`}
                      >
                        <span
                          className={`grid h-6 w-6 shrink-0 place-items-center rounded-full ${
                            plan.featured
                              ? "bg-teal/10 text-teal"
                              : "bg-[#e6f5f1] text-teal-deep"
                          }`}
                        >
                          <Check size={14} />
                        </span>

                        {item}
                      </li>
                    ))}
                  </ul>

                  <Link
                    href="/contact"
                    className={`mt-auto inline-flex items-center justify-center rounded-[14px] px-5 py-3.5 text-sm font-extrabold transition hover:-translate-y-0.5 ${
                      plan.featured
                        ? "bg-gradient-to-r from-teal to-[#67dfcb] text-[#052118]"
                        : "border border-line bg-white text-ink hover:border-teal-deep hover:text-teal-deep"
                    }`}
                  >
                    {isArabic ? "ناقش نطاق المشروع" : "Discuss scope"}
                  </Link>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <CTA />
    </main>
  );
}