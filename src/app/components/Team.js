"use client";

import { ArrowUpRight, Code2, Lightbulb, ShieldCheck } from "lucide-react";
import { useLocale } from "next-intl";

const team = [
  {
    initials: "MG",
    name: "Mohamed El-Gohary",
    nameAr: "محمد الجوهري",
    role: "Founder & Chief Executive Officer",
    roleAr: "المؤسس والرئيس التنفيذي",
    Icon: Lightbulb,
    color: "from-amber-400 to-orange-600",
  },
  {
    initials: "SA",
    name: "Salma Al-Rashid",
    nameAr: "سلمى الراشد",
    role: "Chief Operations Officer",
    roleAr: "الرئيس التنفيذي للعمليات",
    Icon: ShieldCheck,
    color: "from-fuchsia-500 to-violet-700",
  },
  {
    initials: "AH",
    name: "Ali Hassan",
    nameAr: "علي حسن",
    role: "Head of Engineering",
    roleAr: "رئيس قسم الهندسة",
    Icon: Code2,
    color: "from-cyan-400 to-blue-600",
  },
];

export default function Team() {
  const locale = useLocale();
  const isArabic = locale === "ar";

  return (
    <section id="team" className="py-24">
      <div className="container">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <div>
            <p className="eyebrow">{isArabic ? "فريقنا" : "Our team"}</p>
            <h2 className="section-heading">
              {isArabic
                ? "خبرة متخصصة، وفريق يعمل كشريك حقيقي."
                : "Specialists who work like true partners."}
            </h2>
          </div>
          <p className="section-copy">
            {isArabic
              ? "نجمع بين الاستراتيجية والتصميم والهندسة لنحوّل طموحك الرقمي إلى واقع فعّال."
              : "We bring strategy, design and engineering together to turn your digital ambition into a durable advantage."}
          </p>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {team.map(({ Icon, color, initials, name, nameAr, role, roleAr }) => (
            <article
              className="group overflow-hidden rounded-[2rem] border border-[var(--line)] bg-[var(--card)] transition duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-blue-950/10"
              key={name}
            >
              <div
                className={`relative flex h-44 items-end overflow-hidden bg-gradient-to-br ${color} p-6`}
              >
                <div className="absolute -right-8 -top-10 h-40 w-40 rounded-full border border-white/20" />
                <div className="absolute bottom-0 left-0 h-28 w-28 rounded-full bg-white/15 blur-2xl" />
                <div className="relative grid h-20 w-20 place-items-center rounded-[1.5rem] bg-white/95 text-2xl font-black text-slate-900 shadow-lg">
                  {initials}
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-black text-[var(--ink)]">
                      {isArabic ? nameAr : name}
                    </h3>
                    <p className="mt-2 text-sm font-bold text-[var(--muted)]">
                      {isArabic ? roleAr : role}
                    </p>
                  </div>
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-blue-500/10 text-blue-500 transition group-hover:bg-blue-500 group-hover:text-white">
                    <Icon size={18} />
                  </span>
                </div>
                <a
                  className="mt-7 inline-flex items-center gap-2 text-sm font-black text-blue-500 no-underline"
                  href="#contact"
                >
                  {isArabic ? "تواصل معنا" : "Work with us"}{" "}
                  <ArrowUpRight size={16} />
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
