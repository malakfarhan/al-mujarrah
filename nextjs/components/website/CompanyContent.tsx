"use client";

import {
  CheckCircle2,
  Compass,
  Handshake,
  ShieldCheck,
} from "lucide-react";

import PageHero from "@/components/shared/PageHero";
import Reveal from "@/components/shared/Reveal";
import SectionHeading from "@/components/shared/SectionHeading";
import CTA from "@/components/shared/CTA";
import Container from "@/components/shared/Container";
import { useLanguage } from "@/components/shared/LanguageProvider";

export default function CompanyContent() {
  const { isArabic } = useLanguage();

  const values = [
    {
      icon: Compass,
      title: isArabic
        ? "الوضوح قبل التعقيد"
        : "Clarity before complexity",
      copy: isArabic
        ? "نوضح الخيارات والمفاضلات التقنية ونبني أبسط بنية قادرة على تلبية المتطلبات الحقيقية."
        : "We explain the trade-offs and shape the simplest architecture that can support the real requirement.",
    },
    {
      icon: Handshake,
      title: isArabic
        ? "الملكية بعد الإطلاق"
        : "Ownership after launch",
      copy: isArabic
        ? "يشمل التسليم التوثيق ونقل المعرفة والدعم وخطة واضحة للتطوير المستقبلي."
        : "Delivery includes documentation, handover, support and a clear path for what comes next.",
    },
    {
      icon: ShieldCheck,
      title: isArabic
        ? "الأمن كأساس"
        : "Security as a baseline",
      copy: isArabic
        ? "نتعامل مع الهوية والصلاحيات وحماية البيانات وأمان النشر كمتطلبات أساسية للمنتج."
        : "We treat identity, permissions, data protection and deployment hygiene as product requirements.",
    },
    {
      icon: CheckCircle2,
      title: isArabic
        ? "هندسة تركز على النتائج"
        : "Outcome-led engineering",
      copy: isArabic
        ? "نربط نطاق المشروع بتحسين تشغيلي واضح وليس بمجرد قائمة من الخصائص."
        : "Scope is connected to an operational improvement, not just a list of features.",
    },
  ];

  const stats = [
    {
      value: "6",
      label: isArabic ? "تخصصات أساسية" : "Core disciplines",
    },
    {
      value: "1",
      label: isArabic
        ? "نموذج تسليم متكامل"
        : "Connected delivery model",
    },
    {
      value: "24/7",
      label: isArabic
        ? "عقلية تشغيلية"
        : "Operational mindset",
    },
  ];

  return (
    <main dir={isArabic ? "rtl" : "ltr"}>
      <PageHero
        kicker={isArabic ? "عن المجرة" : "About Almajrah"}
        title={
          isArabic
            ? "شريك تقني لأنظمة الأعمال المصممة للاستمرار."
            : "A technology partner for business systems that need to last."
        }
        copy={
          isArabic
            ? "تجمع المجرة بين أنظمة المؤسسات وهندسة المنتجات والبنية التحتية الحديثة ضمن نموذج تسليم واحد يركز على الوضوح والجودة والملكية طويلة المدى."
            : "Almajrah brings enterprise systems, product engineering and modern infrastructure into one delivery model — with a focus on clarity, quality and long-term ownership."
        }
      />

      <section className="bg-white py-20 md:py-[118px]">
        <Container className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <div className="relative grid min-h-[430px] place-items-center overflow-hidden rounded-[30px] bg-[radial-gradient(circle_at_65%_35%,rgba(49,210,181,.16),transparent_25%),radial-gradient(circle_at_30%_70%,rgba(93,140,255,.22),transparent_28%),linear-gradient(145deg,#06101d,#102b48)] text-white">
              <span className="relative z-10 font-display text-[clamp(36px,5vw,70px)] font-bold tracking-[-.06em]">
                ALMAJRAH
              </span>

              <div className="absolute h-[68%] w-[68%] animate-orbit rounded-full border border-white/10 motion-reduce:animate-none" />
              <div className="absolute h-[42%] w-[82%] animate-orbit-tilt rounded-full border border-teal/15 motion-reduce:animate-none" />
              <div className="absolute h-[74%] w-[44%] animate-orbit-tall rounded-full border border-blue/15 motion-reduce:animate-none" />
            </div>
          </Reveal>

          <Reveal delay={120}>
            <SectionHeading
              kicker={isArabic ? "منهجنا" : "Our approach"}
              title={
                isArabic
                  ? "نربط بين عمليات الأعمال وهندسة البرمجيات."
                  : "We bridge business operations and software engineering."
              }
              copy={
                isArabic
                  ? "تقع الأنظمة الرقمية القوية عند تقاطع العمليات والبيانات وتجربة المستخدم والبنية التحتية. ودورنا هو إبقاء هذه العناصر مترابطة من مرحلة التحليل وحتى التشغيل."
                  : "Strong digital systems sit at the intersection of process, data, user experience and infrastructure. Our role is to keep those pieces aligned from discovery through production."
              }
            />

            <div className="grid grid-cols-3 gap-3 max-sm:grid-cols-1">
              {stats.map((item) => (
                <div
                  key={item.label}
                  className="rounded-[18px] border border-slate-200 bg-slate-50 p-5 text-center"
                >
                  <strong className="block font-display text-3xl text-ink">
                    {item.value}
                  </strong>

                  <span className="mt-1 block text-xs font-semibold text-muted">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </Reveal>
        </Container>
      </section>

      <section className="bg-[#f1f4f7] py-20 md:py-[118px]">
        <Container>
          <Reveal>
            <SectionHeading
              kicker={isArabic ? "مبادئنا" : "Principles"}
              title={
                isArabic
                  ? "كيف نتخذ القرارات التقنية."
                  : "How we make technical decisions."
              }
            />
          </Reveal>

          <div className="grid items-stretch gap-4 md:grid-cols-2 lg:grid-cols-4">
            {values.map(({ icon: Icon, title, copy }, index) => (
              <Reveal key={title} delay={index * 70}>
                <div className="h-full min-h-[300px] rounded-[26px] border border-slate-200 bg-white p-6">
                  <span className="grid h-12 w-12 place-items-center rounded-[14px] bg-[#e6f5f1] text-teal-deep">
                    <Icon />
                  </span>

                  <h3 className="mt-6 font-display text-2xl font-semibold leading-tight rtl:font-arabic">
                    {title}
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-muted">
                    {copy}
                  </p>
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