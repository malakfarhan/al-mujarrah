"use client";

const technologies = [
  "PHP",
  "Laravel",
  "Next.js",
  "React",
  "TypeScript",
  "Odoo",
  "AWS",
  "Docker",
  "Flutter",
  "PostgreSQL",
  "Python",
  "OpenAI",
];
import { useTranslations } from "next-intl";
export default function TechMarquee() {
  const t = useTranslations("stack");
  const items = [...technologies, ...technologies];
  return (
    <section className="overflow-hidden py-10">
      <div className="container mb-5 flex items-center justify-between">
        <p className="eyebrow">{t("eyebrow")}</p>
        <p className="text-sm text-[var(--muted)]">{t("copy")}</p>
      </div>
      <div className="marquee-track flex gap-3 px-4">
        {items.map((item, index) => (
          <span
            className="rounded-full border border-[var(--line)] bg-[var(--card)] px-6 py-3 text-sm font-black text-[var(--ink)] shadow-sm"
            key={`${item}-${index}`}
          >
            {item}
          </span>
        ))}
      </div>
    </section>
  );
}
