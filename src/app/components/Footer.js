"use client";

import { useTranslations } from "next-intl";
export default function Footer() {
  const t = useTranslations("footer");
  return (
    <footer className="border-t border-[var(--line)] py-8">
      <div className="container flex flex-wrap items-center justify-between gap-3 text-sm text-[var(--muted)]">
        <p>{t("text")}</p>
        <div className="flex gap-5">
          <a className="text-inherit no-underline" href="#top">
            {t("top")} ↑
          </a>
          <a
            className="text-inherit no-underline"
            href="mailto:contact@al-mujrraha.com"
          >
            contact@al-mujrraha.com
          </a>
        </div>
      </div>
    </footer>
  );
}
