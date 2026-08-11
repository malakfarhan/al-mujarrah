"use client";

import { useTranslations } from "next-intl";
export default function About() {
  const t = useTranslations("about");
  const stats = [
    ["250+", t("projects")],
    ["10+", t("experience")],
    ["99.8%", t("satisfaction")],
  ];
  return (
    <section id="about" className="py-24">
      <div className="container grid gap-12 lg:grid-cols-[.8fr_1.2fr]">
        <div>
          <p className="eyebrow">{t("eyebrow")}</p>
          <h2 className="section-heading">{t("title")}</h2>
        </div>
        <div>
          <p className="section-copy">{t("copy")}</p>
          <div className="mt-10 grid gap-3 sm:grid-cols-3">
            {stats.map(([number, label]) => (
              <div
                className="rounded-2xl border border-[var(--line)] bg-[var(--card)] p-5"
                key={label}
              >
                <p className="text-3xl font-black text-blue-500">{number}</p>
                <p className="mt-2 text-sm font-semibold text-[var(--muted)]">
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
