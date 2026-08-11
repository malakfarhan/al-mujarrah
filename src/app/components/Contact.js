"use client";

import { useState } from "react";
import {
  ArrowUpRight,
  CheckCircle2,
  Mail,
  MapPin,
  MessageCircle,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { messages } from "../../i18n/messages";
export default function Contact() {
  const t = useTranslations("contact");
  const locale = useLocale();
  const detailsT = locale === "ar" ? messages.contactDetails : messages.en.contactDetails;
  const [submitted, setSubmitted] = useState(false);
  const details = [
    {
      Icon: MessageCircle,
      label: t("whatsapp"),
      value: detailsT.whatsappValue,
      href: "https://wa.me/9661234567890",
    },
    {
      Icon: Mail,
      label: t("email"),
      value: detailsT.emailValue,
      href: "mailto:contact@al-mujrraha.com",
    },
    {
      Icon: MapPin,
      //label: locale === "ar" ? "العنوان" : "Address",
      //value: locale === "ar" ? "بريدة، القصيم، المملكة العربية السعودية" : "Buraydah, Al-Qassim, Saudi Arabia",
    },
  ];
  details[2].label = detailsT.addressLabel;
  details[2].value = detailsT.addressValue;

  function handleSubmit(event) {
    event.preventDefault();
    setSubmitted(true);
    event.currentTarget.reset();
  }

  return (
    <section id="contact" className="pb-24 pt-10">
      <div className="container">
        <div className="grid gap-5 lg:grid-cols-[0.85fr_1.15fr]">
          <div className="mb-5 max-w-2xl lg:col-span-2">
            <p className="eyebrow">{t("eyebrow")}</p>
            <h2 className="mt-3 text-4xl font-black tracking-[-0.05em] text-[var(--ink)] sm:text-5xl">
              {t("title")}
            </h2>
            <p className="mt-5 max-w-xl leading-8 text-[var(--muted)]">
              {t("copy")}
            </p>
          </div>
          <aside className="rounded-[2rem] border border-[var(--line)] bg-[var(--card)] p-6 sm:p-8">
            <div className="grid gap-3">
              {details.map(({ Icon, label, value, href }) => {
                const content = (
                  <>
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-blue-500/10 text-blue-500">
                      <Icon size={20} />
                    </span>
                    <span>
                      <span className="block text-xs font-bold text-[var(--muted)]">
                        {label}
                      </span>
                      <span className="mt-1 block text-sm font-black text-[var(--ink)]">
                        {value}
                      </span>
                    </span>
                  </>
                );
                return href ? (
                  <a
                    className="flex items-center gap-3 rounded-2xl p-2 transition hover:bg-blue-500/5"
                    href={href}
                    key={label}
                  >
                    {content}
                  </a>
                ) : (
                  <div
                    className="flex items-center gap-3 rounded-2xl p-2"
                    key={label}
                  >
                    {content}
                  </div>
                );
              })}
            </div>
          </aside>
          <form
            className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-violet-700 via-indigo-700 to-blue-700 p-6 text-white shadow-2xl shadow-indigo-950/35 sm:p-8"
            onSubmit={handleSubmit}
          >
            <div className="absolute -right-20 -top-16 h-56 w-56 rounded-full bg-fuchsia-400/25 blur-3xl" />
            <div className="absolute -bottom-20 left-10 h-48 w-48 rounded-full bg-cyan-300/20 blur-3xl" />
            <div className="relative">
              <div className="grid gap-3">
                <input
                  aria-label={t("name")}
                  className="w-full rounded-xl border border-white/15 bg-white px-4 py-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:ring-2 focus:ring-blue-200"
                  name="name"
                  placeholder={t("name")}
                  required
                  type="text"
                />
                <input
                  aria-label={t("emailField")}
                  className="w-full rounded-xl border border-white/15 bg-white px-4 py-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:ring-2 focus:ring-blue-200"
                  name="email"
                  placeholder={t("emailField")}
                  required
                  type="email"
                />
                <textarea
                  aria-label={t("message")}
                  className="w-full resize-none rounded-xl border border-white/15 bg-white px-4 py-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:ring-2 focus:ring-blue-200"
                  name="message"
                  placeholder={t("message")}
                  required
                  rows="3"
                />
                <button
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-3 text-sm font-black text-white transition hover:bg-slate-800"
                  type="submit"
                >
                  {t("send")} <ArrowUpRight size={17} />
                </button>
                {submitted && (
                  <p className="flex items-center gap-2 text-sm font-bold text-blue-100">
                    <CheckCircle2 size={17} /> {t("sent")}
                  </p>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
