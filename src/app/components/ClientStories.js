"use client";
import { useState } from "react";
import { ArrowLeft, ArrowRight, Quote } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
const stories = [
  {
    company: "NEXORA",
    industry: "Logistics platform",
    quote:
      "Al Mujrraha brought clarity to a complex product. The new platform is faster, easier to manage, and our team finally has the data it needs.",
    name: "Omar H.",
    quoteAr:
      "منح فريق المجرة الوضوح لمنتج معقد. المنصة الجديدة أسرع وأسهل إدارة، وأصبح لدى فريقنا أخيراً البيانات التي يحتاجها.",
    role: "Operations Director",
  },
  {
    company: "VITALIS",
    industry: "Healthcare technology",
    quote:
      "They feel like an extension of our internal team — thoughtful in the details and disciplined in delivery.",
    name: "Noura A.",
    quoteAr:
      "يعمل الفريق كامتداد لفريقنا الداخلي؛ يهتم بالتفاصيل ويلتزم دائماً بتسليم العمل باحترافية.",
    role: "Product Lead",
  },
  {
    company: "MERIDIAN",
    industry: "Retail group",
    quote:
      "From the ERP rollout to the customer experience, every decision was rooted in the actual needs of our business.",
    name: "Khalid R.",
    quoteAr:
      "من تطبيق نظام ERP إلى تجربة العميل، كان كل قرار مبنياً على احتياجات أعمالنا الحقيقية.",
    role: "Managing Partner",
  },
];
export default function ClientStories() {
  const t = useTranslations("clients");
  const locale = useLocale();
  const [active, setActive] = useState(0);
  const story = {
    ...stories[active],
    quote: locale === "ar" ? stories[active].quoteAr : stories[active].quote,
  };
  const change = (d) =>
    setActive((active + d + stories.length) % stories.length);
  return (
    <section id="clients" className="py-24">
      <div className="container">
        <p className="eyebrow">{t("eyebrow")}</p>
        <div className="mt-4 grid gap-10 lg:grid-cols-[.8fr_1.2fr]">
          <div>
            <h2 className="section-heading">{t("title")}</h2>
            <p className="section-copy">{t("copy")}</p>
            <div className="mt-9 flex gap-2">
              <button
                onClick={() => change(-1)}
                aria-label={t("prev")}
                className="grid h-11 w-11 place-items-center rounded-full border border-[var(--line)]"
              >
                <ArrowLeft size={18} />
              </button>
              <button
                onClick={() => change(1)}
                aria-label={t("next")}
                className="grid h-11 w-11 place-items-center rounded-full bg-blue-600 text-white"
              >
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
          <article className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-violet-700 via-indigo-700 to-blue-700 p-8 text-white shadow-2xl shadow-indigo-950/35 sm:p-11">
            <div className="absolute -right-20 -top-16 h-56 w-56 rounded-full bg-fuchsia-400/25 blur-3xl" />
            <div className="absolute -bottom-20 left-10 h-48 w-48 rounded-full bg-cyan-300/20 blur-3xl" />
            <div className="relative">
              <Quote className="text-cyan-200" size={34} />
              <p className="mt-8 text-2xl font-bold leading-relaxed tracking-tight sm:text-3xl">
                “{story.quote}”
              </p>
              <div className="mt-10 flex items-end justify-between gap-4 border-t border-white/20 pt-6">
                <div>
                  <p className="font-black">{story.name}</p>
                  <p className="mt-1 text-sm text-blue-100">
                    {story.role} · {story.company}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-black tracking-widest">{story.company}</p>
                  <p className="mt-1 text-xs text-blue-200">{story.industry}</p>
                </div>
              </div>
            </div>
          </article>
        </div>
        <div className="mt-5 flex gap-2">
          {stories.map((_, i) => (
            <button
              onClick={() => setActive(i)}
              aria-label={`${t("story")} ${i + 1}`}
              className={`h-1.5 rounded-full transition-all ${active === i ? "w-10 bg-blue-500" : "w-4 bg-[var(--line)]"}`}
              key={i}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
