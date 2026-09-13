"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import Container from "@/components/shared/Container";
import CTA from "@/components/shared/CTA";
import PageHero from "@/components/shared/PageHero";
import Reveal from "@/components/shared/Reveal";
import { useLanguage } from "@/components/shared/LanguageProvider";
import { API_URL } from "@/lib/api/client";

type PortfolioItem = {
  id: number;
  title: string;
  titleAr: string | null;
  slug: string;
  shortDescription: string | null;
  shortDescriptionAr: string | null;
  client: string | null;
  clientAr: string | null;
  industry: string | null;
  industryAr: string | null;
  service: string | null;
  serviceAr: string | null;
  technologies: string | null;
  technologiesAr: string | null;
  coverImage: string | null;
  isPublished: boolean;
};

export default function PortfolioListing() {
  const { isArabic } = useLanguage();

  const [projects, setProjects] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadPortfolio() {
      try {
        setLoading(true);
        setError("");

        // Load published portfolio projects
        const response = await fetch(`${API_URL}/portfolio/public`);

        if (!response.ok) {
          throw new Error("Unable to load portfolio");
        }

        const data: PortfolioItem[] = await response.json();
        setProjects(data);
      } catch (error) {
        console.error("Portfolio load error:", error);

        setError(
          isArabic
            ? "تعذر تحميل المشاريع حالياً."
            : "Unable to load portfolio projects.",
        );
      } finally {
        setLoading(false);
      }
    }

    loadPortfolio();
  }, [isArabic]);

  return (
    <main dir={isArabic ? "rtl" : "ltr"}>
      <PageHero
        kicker={isArabic ? "أعمال مختارة" : "Selected work"}
        title={
          isArabic
            ? "مشاريع تحقق قيمة حقيقية للأعمال."
            : "Projects that deliver real business value."
        }
        copy={
          isArabic
            ? "مجموعة مختارة من مشاريع التحول الرقمي والمنصات والأنظمة والأتمتة والحلول التقنية."
            : "A representative mix of ERP transformation, digital products, automation and secure platform engineering."
        }
      />

      <section className="bg-white py-20 md:py-[118px]">
        <Container>
          {error && (
            <div className="mb-8 rounded-2xl border border-rose-200 bg-rose-50 px-5 py-4 text-sm text-rose-600">
              {error}
            </div>
          )}

          {loading ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="h-[600px] w-full animate-pulse rounded-[28px] border border-slate-200 bg-slate-100"
                />
              ))}
            </div>
          ) : (
            <div className="grid items-stretch gap-4 md:grid-cols-2 lg:grid-cols-3">
              {projects.map((project, index) => {
                const title =
                  isArabic && project.titleAr
                    ? project.titleAr
                    : project.title;

                const description =
                  isArabic && project.shortDescriptionAr
                    ? project.shortDescriptionAr
                    : project.shortDescription;

                const service =
                  isArabic && project.serviceAr
                    ? project.serviceAr
                    : project.service;

                const client =
                  isArabic && project.clientAr
                    ? project.clientAr
                    : project.client;

                const technologies =
                  isArabic && project.technologiesAr
                    ? project.technologiesAr
                    : project.technologies;

                return (
                  <Reveal key={project.id} delay={(index % 3) * 70}>
                    <div className="h-full w-full">
                      <Link
                        href={`/portfolio/${project.slug}`}
                        className="block h-full w-full"
                      >
                        {/* Fixed card size keeps every portfolio card equal */}
                        <article className="group flex h-[600px] w-full flex-col overflow-hidden rounded-[28px] border border-slate-200 bg-slate-50 transition duration-300 hover:-translate-y-1 hover:shadow-card">
                          {/* Fixed image area on every card */}
                          <div className="relative h-[180px] w-full shrink-0 overflow-hidden bg-slate-200">
                            {project.coverImage ? (
                              <>
                                <Image
                                  src={project.coverImage}
                                  alt={title}
                                  fill
                                  className="object-cover transition duration-500 group-hover:scale-105"
                                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                />

                                <div className="absolute inset-0 bg-gradient-to-t from-black/35 to-transparent" />
                              </>
                            ) : (
                              <div className="h-full w-full bg-gradient-to-br from-slate-100 to-slate-200" />
                            )}
                          </div>

                          <div className="flex min-h-0 flex-1 flex-col p-7">
                            <div className="flex h-[54px] shrink-0 items-start justify-between gap-3">
                              <span className="font-display text-5xl font-semibold leading-none tracking-[-.06em] text-slate-200">
                                {String(index + 1).padStart(2, "0")}
                              </span>

                              {service && (
                                <span className="max-w-[170px] truncate rounded-full border border-slate-200 bg-white px-3 py-2 text-[10px] font-extrabold uppercase tracking-[.08em] text-teal-deep">
                                  {service}
                                </span>
                              )}
                            </div>

                            {/* Fixed title space */}
                            <div className="mt-6 h-[68px] shrink-0">
                              <h2 className="line-clamp-2 font-display text-[28px] font-semibold leading-[1.15] tracking-[-.04em] text-ink rtl:font-arabic rtl:tracking-normal">
                                {title}
                              </h2>
                            </div>

                            {/* Fixed description space */}
                            <div className="mt-3 h-[82px] shrink-0">
                              {description && (
                                <p className="line-clamp-3 text-sm leading-7 text-muted">
                                  {description}
                                </p>
                              )}
                            </div>

                            {/* Always stays aligned at bottom */}
                            <div className="mt-auto rounded-[18px] border border-slate-200 bg-white p-4">
                              <span className="text-[9px] font-extrabold uppercase tracking-[.12em] text-[#8b98a8]">
                                {isArabic ? "العميل" : "Client"}
                              </span>

                              <strong className="mt-1 block truncate font-display text-lg text-ink">
                                {client ||
                                  (isArabic
                                    ? "مشروع خاص"
                                    : "Private project")}
                              </strong>

                              <div className="mt-2 h-[16px]">
                                {technologies && (
                                  <p className="truncate text-[10px] text-slate-400">
                                    {technologies}
                                  </p>
                                )}
                              </div>

                              <div className="mt-4 flex gap-1.5">
                                <span className="h-1 flex-[1.2] rounded bg-teal" />
                                <span className="h-1 flex-1 rounded bg-blue" />
                                <span className="h-1 flex-[.7] rounded bg-violet" />
                                <span className="h-1 flex-[.5] rounded bg-slate-200" />
                              </div>
                            </div>
                          </div>
                        </article>
                      </Link>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          )}

          {!loading && !error && projects.length === 0 && (
            <div className="py-20 text-center">
              <h2 className="font-display text-2xl font-semibold text-ink">
                {isArabic
                  ? "لا توجد مشاريع منشورة حالياً."
                  : "No published projects yet."}
              </h2>
            </div>
          )}
        </Container>
      </section>

      <CTA />
    </main>
  );
}