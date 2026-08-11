"use client";

import { useTranslations } from "next-intl";

const partners = [
  { name: "AWS", category: "cloud" },
  { name: "Microsoft", category: "business" },
  { name: "Odoo", category: "business" },
  { name: "Google Cloud", category: "cloud" },
  { name: "OpenAI", category: "innovation" },
];

export default function Partners() {
  const t = useTranslations("partners");

  return (
    <section id="partners" className="border-y border-[var(--line)] py-24">
      <div className="container">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <div>
            <p className="eyebrow">{t("eyebrow")}</p>
            <h2 className="section-heading">{t("title")}</h2>
          </div>
          <p className="section-copy">{t("copy")}</p>
        </div>
        <div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {partners.map((partner) => (
            <article
              className="rounded-3xl border border-[var(--line)] bg-[var(--card)] p-5 transition hover:-translate-y-1 hover:border-blue-400"
              key={partner.name}
            >
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-blue-500/10 font-black text-blue-500">
                {partner.name.charAt(0)}
              </div>
              <h3 className="mt-8 text-lg font-black">{partner.name}</h3>
              <p className="mt-1 text-xs font-bold text-[var(--muted)]">
                {t(partner.category)}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
