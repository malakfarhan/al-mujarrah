"use client";

import { Moon, Sun } from "lucide-react";
import { useTranslations } from "next-intl";

export default function Header({
  theme,
  onThemeChange,
  locale,
  onLocaleChange,
}) {
  const t = useTranslations("nav");
  const links = [
    ["home", t("home")],
    ["about", t("about")],
    ["services", t("services")],
    ["clients", t("clients")],
    [
      "partners",
      locale === "ar"
        ? "\u0634\u0631\u0643\u0627\u0624\u0646\u0627"
        : "Partners",
    ],
    ["team", locale === "ar" ? "\u0641\u0631\u064a\u0642\u0646\u0627" : "Team"],
    ["contact", t("contact")],
  ];
  return (
    <header className="sticky top-0 z-50 border-b border-[var(--line)] bg-[color:color-mix(in_srgb,var(--surface)_88%,transparent)] backdrop-blur-xl">
      <div className="container flex h-18 items-center justify-between gap-4 py-3">
        <a
          href="#home"
          className="flex items-center gap-2 font-black tracking-tight text-[var(--ink)] no-underline"
        >
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-blue-600 text-lg text-white">
            A
          </span>
          <span>
            Al Mujrraha<span className="text-blue-500">.</span>
          </span>
        </a>
        <nav className="hidden gap-6 text-sm font-bold text-[var(--muted)] md:flex">
          {links.map(([id, label]) => (
            <a
              className="no-underline transition hover:text-blue-500"
              href={`#${id}`}
              key={id}
            >
              {label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <button
            onClick={onLocaleChange}
            className="rounded-full border border-[var(--line)] bg-[var(--card)] px-3 py-2 text-xs font-black text-[var(--ink)]"
          >
            {t("language")}
          </button>
          <button
            onClick={onThemeChange}
            aria-label="Change theme"
            className="grid h-10 w-10 place-items-center rounded-full border border-[var(--line)] bg-[var(--card)] text-[var(--ink)]"
          >
            {theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}
          </button>
          <a
            href="#contact"
            className="hidden rounded-full bg-blue-600 px-4 py-2 text-sm font-bold text-white no-underline sm:block"
          >
            {t("talk")}
          </a>
        </div>
      </div>
    </header>
  );
}
