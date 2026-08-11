"use client";

import { ArrowUpRight, CheckCircle2 } from "lucide-react";
import { useTranslations } from "next-intl";

export default function Hero() {
  const t = useTranslations("hero");
  return (
    <section
      id="home"
      className="grid-pattern overflow-hidden border-b border-[var(--line)]"
    >
      <div className="container grid min-h-[680px] items-center gap-12 py-20 lg:grid-cols-[1.05fr_.95fr]">
        <div>
          <p className="eyebrow">{t("eyebrow")}</p>
          <h1 className="mt-4 max-w-2xl text-3xl font-black leading-[1.02] tracking-[-.065em] sm:text-3xl lg:text-6xl">
            <span className="inline-block text-[0.94em] leading-none">{t("titleA")}</span>{" "}
            <span className="inline-block text-blue-500 text-[1.02em] leading-none">{t("titleB")}</span>
            <br />
            <span className="inline-block leading-none">{t("titleC")}</span>
          </h1>
          <p className="mt-7 max-w-xl text-lg leading-8 text-[var(--muted)]">
            {t("copy")}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a className="button-primary" href="#contact">
              {t("start")} <ArrowUpRight size={18} />
            </a>
            <a className="button-secondary" href="#services">
              {t("explore")}
            </a>
          </div>
          <div className="mt-12 flex flex-wrap gap-x-7 gap-y-3 text-sm font-bold text-[var(--muted)]">
            <span className="flex items-center gap-2">
              <CheckCircle2 size={17} className="text-blue-500" /> {t("first")}
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle2 size={17} className="text-blue-500" /> {t("second")}
            </span>
          </div>
        </div>
        
        <div className="relative mx-auto w-full max-w-[540px]">
          <div className="absolute -inset-12 rounded-full bg-blue-500/15 blur-3xl" />
          <div className="relative overflow-hidden rounded-[2rem] border border-[var(--line)] bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.2),_transparent_30%),linear-gradient(135deg,_var(--card),_color-mix(in_srgb,var(--card)_88%,black_12%))] p-4 shadow-2xl shadow-blue-950/20">
            <div className="flex items-center justify-between rounded-2xl border border-[var(--line)] bg-[color:color-mix(in_srgb,var(--surface)_80%,transparent)] px-4 py-3">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-rose-500" />
                <span className="h-3 w-3 rounded-full bg-amber-400" />
                <span className="h-3 w-3 rounded-full bg-emerald-500" />
              </div>
              <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-600">
                ● {t("live")}
              </span>
            </div>

            <div className="mt-4 rounded-[1.4rem] border border-blue-500/20 bg-slate-950 p-4 text-sm text-slate-200 shadow-inner shadow-blue-950/40">
              <div className="mb-3 flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
                  /workspace/app
                </span>
                <span className="rounded-full border border-blue-500/20 bg-blue-500/10 px-2.5 py-1 text-[11px] font-semibold text-blue-300">
                  {t("dashboard")}
                </span>
              </div>

              <div className="space-y-2 font-mono">
                <p className="text-cyan-300">$ npm run deploy</p>
                <p className="text-slate-400">// {t("performance")}</p>
                <p className="text-emerald-300">✓ Build completed</p>
                <p className="text-emerald-300">✓ 87% faster response</p>
                <p className="text-slate-400">// {t("automations")}</p>
                <p className="text-cyan-300">const automations = 34</p>
                <p className="text-slate-400">// {t("uptime")}</p>
                <p className="text-cyan-300">const uptime = "99.9%"</p>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-3">
                  <p className="text-[11px] uppercase tracking-[0.25em] text-slate-500">
                    {t("performance")}
                  </p>
                  <p className="mt-2 text-2xl font-black text-white">+87%</p>
                </div>
                <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-3">
                  <p className="text-[11px] uppercase tracking-[0.25em] text-slate-500">
                    {t("uptime")}
                  </p>
                  <p className="mt-2 text-2xl font-black text-white">99.9%</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
