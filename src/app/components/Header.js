"use client";

import { useState } from "react";
import { Moon, Sun, Menu, X } from "lucide-react";
import { useTranslations } from "next-intl";

export default function Header({
  theme,
  onThemeChange,
  locale,
  onLocaleChange,
}) {
  const t = useTranslations("nav");
  const [open, setOpen] = useState(false);

  const links = [
    ["home", t("home")],
    ["about", t("about")],
    ["services", t("services")],
    ["clients", t("clients")],
    [
      "partners",
      locale === "ar"
        ? "شركاؤنا"
        : "Partners",
    ],
    [
      "team",
      locale === "ar"
        ? "فريقنا"
        : "Team",
    ],
    ["contact", t("contact")],
  ];

  return (
    <header className="sticky top-0 z-50 border-t border-b border-[var(--line)] bg-[color:color-mix(in_srgb,var(--surface)_88%,transparent)] backdrop-blur-xl">

      <div className="container flex h-18 items-center justify-between gap-4 py-3">

        {/* Logo */}
        <a
          href="#home"
          onClick={() => setOpen(false)}
          className="flex items-center gap-2 font-black tracking-tight text-[var(--ink)] no-underline"
        >
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-blue-600 text-lg text-white">
            A
          </span>

          <span>
            Al Mujrraha<span className="text-blue-500">.</span>
          </span>
        </a>

        {/* Desktop Navigation */}
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

        {/* Right Side Buttons */}
        <div className="flex items-center gap-2">

          {/* Language */}
          <button
            onClick={onLocaleChange}
            className="rounded-full border border-[var(--line)] bg-[var(--card)] px-3 py-2 text-xs font-black text-[var(--ink)]"
          >
            {t("language")}
          </button>

          {/* Theme */}
          <button
            onClick={onThemeChange}
            aria-label="Change theme"
            className="grid h-10 w-10 place-items-center rounded-full border border-[var(--line)] bg-[var(--card)] text-[var(--ink)]"
          >
            {theme === "dark" ? (
              <Sun size={17} />
            ) : (
              <Moon size={17} />
            )}
          </button>

          {/* Talk */}
          <a
            href="#contact"
            onClick={() => setOpen(false)}
            className="hidden rounded-full bg-blue-600 px-4 py-2 text-sm font-bold text-white no-underline sm:block"
          >
            {t("talk")}
          </a>

          {/* Mobile Menu Toggle - LAST */}
          <button
            onClick={() => setOpen(!open)}
            aria-label="Toggle navigation"
            aria-expanded={open}
            className="grid h-10 w-10 place-items-center rounded-full border border-[var(--line)] bg-[var(--card)] text-[var(--ink)] md:hidden"
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>

        </div>
      </div>

      {/* Mobile Navigation */}
      {open && (
        <nav className="md:hidden">
          <div className="border-t border-[var(--line)] bg-[var(--surface)]">
            <div className="container flex flex-col gap-2 py-3">

              {links.map(([id, label]) => (
                <a
                  key={id}
                  href={`#${id}`}
                  onClick={() => setOpen(false)}
                  className="no-underline py-2 text-sm font-bold text-[var(--muted)] transition hover:text-blue-500"
                >
                  {label}
                </a>
              ))}

              {/* Mobile Talk Button */}
              <a
                href="#contact"
                onClick={() => setOpen(false)}
                className="mt-2 inline-flex w-max items-center gap-2 rounded-full bg-blue-600 px-4 py-2 text-sm font-bold text-white no-underline"
              >
                {t("talk")}
              </a>

            </div>
          </div>
        </nav>
      )}

    </header>
  );
}
