"use client";

import {
  BrainCircuit,
  CloudCog,
  Code2,
  DatabaseZap,
  Smartphone,
  Workflow,
} from "lucide-react";
import { useTranslations } from "next-intl";
export default function Services() {
  const t = useTranslations("services");
  const services = [
    [Code2, "web", "webCopy"],
    [Smartphone, "mobile", "mobileCopy"],
    [DatabaseZap, "laravel", "laravelCopy"],
    [Workflow, "odoo", "odooCopy"],
    [CloudCog, "cloud", "cloudCopy"],
    [BrainCircuit, "ai", "aiCopy"],
  ];
  return (
    <section
      id="services"
      className="border-y border-[var(--line)] bg-[color:color-mix(in_srgb,var(--card)_65%,transparent)] py-24"
    >
      <div className="container">
        <p className="eyebrow">{t("eyebrow")}</p>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <h2 className="section-heading">{t("title")}</h2>
          <p className="section-copy">{t("copy")}</p>
        </div>
        <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {services.map(([Icon, title, text], index) => (
            <article
              className="group rounded-3xl border border-[var(--line)] bg-[var(--card)] p-6 transition duration-300 hover:-translate-y-1 hover:border-blue-400"
              key={title}
            >
              <div className="flex items-center justify-between">
                <span className="grid h-11 w-11 place-items-center rounded-2xl bg-blue-500/10 text-blue-500">
                  <Icon size={21} />
                </span>
                <span className="text-sm font-bold text-[var(--muted)]">
                  0{index + 1}
                </span>
              </div>
              <h3 className="mt-9 text-xl font-black">{t(title)}</h3>
              <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
                {t(text)}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
