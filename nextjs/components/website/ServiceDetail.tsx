"use client";

import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Layers3,
  ShieldCheck,
  Workflow,
} from "lucide-react";

import { services } from "@/lib/data";
import Container from "@/components/shared/Container";
import Reveal from "@/components/shared/Reveal";
import SectionHeading from "@/components/shared/SectionHeading";
import CTA from "@/components/shared/CTA";
import { useLanguage } from "@/components/shared/LanguageProvider";

export default function ServiceDetail({ slug }: { slug: string }) {
  const { isArabic } = useLanguage();
  const service = services.find((item) => item.slug === slug);

  if (!service) {
    return (
      <main className="bg-white">
        <Container className="py-32 text-center">
          <h1 className="font-display text-4xl font-semibold text-ink">
            {isArabic ? "الخدمة غير موجودة" : "Service not found"}
          </h1>

          <Link
            href="/services"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-ink px-5 py-3 text-sm font-bold text-white"
          >
            {isArabic ? <ArrowRight size={16} /> : <ArrowLeft size={16} />}
            {isArabic ? "العودة إلى الخدمات" : "Back to services"}
          </Link>
        </Container>
      </main>
    );
  }

  const Icon = service.icon;

  const kicker = isArabic ? service.kickerAr : service.kicker;
  const hero = isArabic ? service.heroAr : service.hero;
  const description = isArabic
    ? service.descriptionAr
    : service.description;

  const features = isArabic
    ? service.featuresAr
    : service.features;

  const outcomes = isArabic
    ? service.outcomesAr
    : service.outcomes;

  const deliveryItems = [
    {
      icon: Workflow,
      title: isArabic ? "اكتشاف سير العمل" : "Workflow discovery",
      copy: isArabic
        ? "نحلل المستخدمين والقرارات ونقاط التسليم والاستثناءات قبل بدء التطوير."
        : "Map users, decisions, handoffs and exceptions before build.",
    },
    {
      icon: Layers3,
      title: isArabic ? "بنية مترابطة" : "Connected architecture",
      copy: isArabic
        ? "نصمم الواجهات وواجهات API والبيانات والتكاملات كنظام واحد مترابط."
        : "Define UI, APIs, data and integrations as one system.",
    },
    {
      icon: ShieldCheck,
      title: isArabic ? "جاهزية للإنتاج" : "Production readiness",
      copy: isArabic
        ? "الأمن والاختبارات والمراقبة والنشر جزء أساسي من عملية التسليم."
        : "Security, testing, observability and deployment are part of delivery.",
    },
    {
      icon: CheckCircle2,
      title: isArabic ? "دعم وتطوير مستمر" : "Ongoing ownership",
      copy: isArabic
        ? "التوثيق والدعم والتطوير المستمر يحافظ على قيمة النظام بعد الإطلاق."
        : "Documentation, support and evolution keep the platform useful.",
    },
  ];

  return (
    <main dir={isArabic ? "rtl" : "ltr"}>
      <section className="relative isolate overflow-hidden bg-[#020710] pb-20 pt-36 text-white md:pb-28 md:pt-40">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_76%_35%,rgba(49,210,181,.13),transparent_25%),radial-gradient(circle_at_25%_70%,rgba(93,140,255,.15),transparent_30%),linear-gradient(120deg,#020710,#07172b)]" />

        <div className="absolute inset-0 -z-10 opacity-20 [background-image:linear-gradient(rgba(255,255,255,.07)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.07)_1px,transparent_1px)] [background-size:72px_72px] [mask-image:linear-gradient(to_bottom,#000,transparent_90%)]" />

        <Container className="grid items-center gap-12 lg:grid-cols-[1.05fr_.95fr]">
          <div>
            <span className="inline-flex items-center gap-2.5 text-[11px] font-extrabold uppercase tracking-[.15em] text-[#6ee2cf] before:h-px before:w-6 before:bg-current rtl:normal-case rtl:tracking-normal">
              {kicker}
            </span>

            <h1 className="mt-4 max-w-[850px] font-display text-[clamp(48px,6vw,82px)] font-semibold leading-[.98] tracking-[-.055em] rtl:font-arabic rtl:tracking-[-.02em]">
              {hero}
            </h1>

            <p className="mt-6 max-w-[680px] text-[17px] leading-8 text-[#aab9c8]">
              {description}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-[14px] bg-gradient-to-r from-teal to-[#67dfcb] px-5 py-3.5 text-sm font-extrabold text-[#052118] transition hover:-translate-y-0.5"
              >
                {isArabic ? "ابدأ مشروعاً" : "Start a project"}

                {isArabic ? (
                  <ArrowLeft size={16} />
                ) : (
                  <ArrowRight size={16} />
                )}
              </Link>

              <Link
                href="/portfolio"
                className="rounded-[14px] border border-white/15 bg-white/[.06] px-5 py-3.5 text-sm font-extrabold text-white"
              >
                {isArabic ? "عرض أعمالنا" : "View relevant work"}
              </Link>
            </div>
          </div>

          <div className="relative mx-auto grid aspect-square w-full max-w-[520px] place-items-center">
            <div className="absolute inset-[6%] rounded-full border border-white/10" />
            <div className="absolute inset-[18%] rounded-full border border-teal/15" />
            <div className="absolute inset-[30%] rounded-full border border-blue/15" />

            <div className="relative z-10 grid h-32 w-32 place-items-center rounded-[34px] border border-white/15 bg-white/[.07] text-[#7cebd7] shadow-[0_25px_70px_rgba(0,0,0,.3)] backdrop-blur-xl">
              <Icon size={52} />
            </div>

            <span className="absolute left-[4%] top-[32%] rounded-full border border-white/10 bg-[#071523cc] px-4 py-2 text-[10px] font-extrabold text-[#9fb5c9] backdrop-blur-lg">
              {isArabic ? "البنية" : "Architecture"}
            </span>

            <span className="absolute right-[2%] top-[23%] rounded-full border border-white/10 bg-[#071523cc] px-4 py-2 text-[10px] font-extrabold text-[#9fb5c9] backdrop-blur-lg">
              {isArabic ? "التكامل" : "Integration"}
            </span>

            <span className="absolute bottom-[20%] right-[8%] rounded-full border border-white/10 bg-[#071523cc] px-4 py-2 text-[10px] font-extrabold text-[#9fb5c9] backdrop-blur-lg">
              {isArabic ? "الدعم" : "Support"}
            </span>
          </div>
        </Container>
      </section>

      <section className="bg-white py-20 md:py-[118px]">
        <Container>
          <Reveal>
            <SectionHeading
              kicker={isArabic ? "القدرات" : "Capabilities"}
              title={
                isArabic
                  ? "ما الذي يمكن أن يتضمنه هذا التعاون."
                  : "What this engagement can include."
              }
              copy={
                isArabic
                  ? "نحدد نطاق العمل وفقاً لسير العمل والأنظمة الحالية وأولويات التنفيذ بدلاً من فرض حزمة ثابتة."
                  : "We scope the pieces around the workflow, existing systems and delivery priorities instead of forcing a fixed package."
              }
            />
          </Reveal>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {features.map((item, index) => (
              <Reveal key={item} delay={(index % 3) * 55}>
                <div className="flex h-full min-h-[160px] items-start gap-4 rounded-3xl border border-slate-200 bg-slate-50 p-6">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#e6f5f1] text-teal-deep">
                    <CheckCircle2 size={19} />
                  </span>

                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-[.12em] text-[#91a0b1] rtl:normal-case rtl:tracking-normal">
                      {isArabic
                        ? `القدرة ${String(index + 1).padStart(2, "0")}`
                        : `Capability ${String(index + 1).padStart(2, "0")}`}
                    </span>

                    <h3 className="mt-2 font-display text-xl font-semibold rtl:font-arabic">
                      {item}
                    </h3>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-[#eff3f7] py-20 md:py-[118px]">
        <Container className="grid gap-12 lg:grid-cols-[.85fr_1.15fr]">
          <Reveal>
            <SectionHeading
              kicker={isArabic ? "نموذج التنفيذ" : "Delivery model"}
              title={
                isArabic
                  ? "نبني الحل حول عملياتك، وليس حول اسم التقنية."
                  : "Built around the operation, not the technology label."
              }
              copy={
                isArabic
                  ? "يبقى التحليل والتصميم والتنفيذ والدعم مترابطاً حتى يظل الحل واضحاً وقابلاً للتطوير بعد الإطلاق."
                  : "Discovery, architecture, implementation and support stay connected so the solution remains understandable after launch."
              }
            />
          </Reveal>

          <div className="grid gap-4 sm:grid-cols-2">
            {deliveryItems.map(({ icon: ItemIcon, title, copy }, index) => (
              <Reveal key={title} delay={(index % 2) * 70}>
                <div className="h-full min-h-[230px] rounded-[26px] border border-slate-200 bg-white p-6 shadow-sm">
                  <span className="grid h-12 w-12 place-items-center rounded-[14px] bg-[#edf9f6] text-teal-deep">
                    <ItemIcon />
                  </span>

                  <h3 className="mt-5 font-display text-2xl font-semibold rtl:font-arabic">
                    {title}
                  </h3>

                  <p className="mt-2 text-sm leading-7 text-muted">
                    {copy}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-white py-20 md:py-[118px]">
        <Container>
          <Reveal>
            <SectionHeading
              kicker={isArabic ? "النتائج المتوقعة" : "Expected outcomes"}
              title={
                isArabic
                  ? "ما الذي يجب أن يتحسن بعد تنفيذ المشروع."
                  : "What should improve after the project."
              }
            />
          </Reveal>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {outcomes.map((outcome, index) => (
              <Reveal key={outcome} delay={index * 60}>
                <div className="h-full rounded-3xl border border-line p-6">
                  <strong className="font-display text-3xl text-teal-deep">
                    {String(index + 1).padStart(2, "0")}
                  </strong>

                  <p className="mt-5 text-base font-bold leading-7 text-ink">
                    {outcome}
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