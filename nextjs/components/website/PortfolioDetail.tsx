"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";

import Container from "@/components/shared/Container";
import CTA from "@/components/shared/CTA";
import Reveal from "@/components/shared/Reveal";
import { useLanguage } from "@/components/shared/LanguageProvider";
import { API_URL } from "@/lib/api/client";

type PortfolioImage = {
  id: number;
  imageUrl: string;
  caption: string | null;
  captionAr: string | null;
  sortOrder: number;
};

type PortfolioItem = {
  id: number;
  title: string;
  titleAr: string | null;
  slug: string;

  shortDescription: string | null;
  shortDescriptionAr: string | null;

  content: string | null;
  contentAr: string | null;

  client: string | null;
  clientAr: string | null;

  industry: string | null;
  industryAr: string | null;

  service: string | null;
  serviceAr: string | null;

  technologies: string | null;
  technologiesAr: string | null;

  coverImage: string | null;
  images: PortfolioImage[];
};

export default function PortfolioDetail({
  slug,
}: {
  slug: string;
}) {
  const { isArabic } = useLanguage();

  const [project, setProject] = useState<PortfolioItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadProject() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${API_URL}/portfolio/public/${encodeURIComponent(slug)}`,
        );

        if (!response.ok) {
          throw new Error("Portfolio project not found");
        }

        const data: PortfolioItem = await response.json();
        setProject(data);
      } catch (error) {
        console.error("Portfolio detail error:", error);

        setError(
          isArabic
            ? "تعذر تحميل المشروع."
            : "Unable to load this project.",
        );
      } finally {
        setLoading(false);
      }
    }

    loadProject();
  }, [slug, isArabic]);

  if (loading) {
    return (
      <main className="bg-white">
        <Container className="py-28">
          <div className="h-[500px] animate-pulse rounded-[32px] bg-slate-100" />
        </Container>
      </main>
    );
  }

  if (error || !project) {
    return (
      <main
        className="bg-white"
        dir={isArabic ? "rtl" : "ltr"}
      >
        <Container className="py-28 text-center">
          <h1 className="font-display text-4xl font-semibold text-ink">
            {isArabic
              ? "المشروع غير متوفر"
              : "Project not available"}
          </h1>

          <p className="mt-3 text-sm text-slate-500">
            {error}
          </p>

          <Link
            href="/portfolio"
            className="mt-7 inline-flex items-center gap-2 rounded-xl bg-ink px-5 py-3 text-xs font-black text-white"
          >
            {isArabic ? (
              <ArrowRight size={15} />
            ) : (
              <ArrowLeft size={15} />
            )}

            {isArabic
              ? "العودة إلى معرض الأعمال"
              : "Back to portfolio"}
          </Link>
        </Container>
      </main>
    );
  }

  const title =
    isArabic && project.titleAr
      ? project.titleAr
      : project.title;

  const shortDescription =
    isArabic && project.shortDescriptionAr
      ? project.shortDescriptionAr
      : project.shortDescription;

  const content =
    isArabic && project.contentAr
      ? project.contentAr
      : project.content;

  const client =
    isArabic && project.clientAr
      ? project.clientAr
      : project.client;

  const industry =
    isArabic && project.industryAr
      ? project.industryAr
      : project.industry;

  const service =
    isArabic && project.serviceAr
      ? project.serviceAr
      : project.service;

  const technologies =
    isArabic && project.technologiesAr
      ? project.technologiesAr
      : project.technologies;

  const sortedImages = [...(project.images || [])].sort(
    (a, b) => a.sortOrder - b.sortOrder,
  );

  return (
    <main
      className="bg-white"
      dir={isArabic ? "rtl" : "ltr"}
    >
      <section className="border-b border-slate-200 bg-[#f6f8fb] py-20 md:py-28">
        <Container>
          <Reveal>
            <Link
              href="/portfolio"
              className="inline-flex items-center gap-2 text-xs font-black text-teal-deep"
            >
              {isArabic ? (
                <ArrowRight size={15} />
              ) : (
                <ArrowLeft size={15} />
              )}

              {isArabic
                ? "العودة إلى معرض الأعمال"
                : "Back to portfolio"}
            </Link>

            {service && (
              <span className="mt-10 block text-[10px] font-black uppercase tracking-[.14em] text-teal-deep">
                {service}
              </span>
            )}

            <h1 className="mt-3 max-w-4xl font-display text-5xl font-semibold leading-[1.05] tracking-[-.05em] text-ink md:text-7xl rtl:font-arabic rtl:tracking-normal">
              {title}
            </h1>

            {shortDescription && (
              <p className="mt-6 max-w-3xl text-base leading-8 text-slate-500 md:text-lg">
                {shortDescription}
              </p>
            )}
          </Reveal>
        </Container>
      </section>

      {project.coverImage && (
        <section className="bg-white py-10 md:py-16">
          <Container>
            <Reveal>
              <div className="relative min-h-[320px] overflow-hidden rounded-[32px] bg-slate-100 md:min-h-[620px]">
                <Image
                  src={project.coverImage}
                  alt={title}
                  fill
                  priority
                  className="object-cover"
                  sizes="100vw"
                />
              </div>
            </Reveal>
          </Container>
        </section>
      )}

      <section className="py-16 md:py-24">
        <Container className="grid gap-12 lg:grid-cols-[.65fr_1.35fr]">
          <Reveal>
            <div className="rounded-[28px] border border-slate-200 bg-slate-50 p-6">
              <h2 className="font-display text-xl font-semibold text-ink">
                {isArabic
                  ? "معلومات المشروع"
                  : "Project information"}
              </h2>

              <div className="mt-6 grid gap-5">
                <DetailItem
                  label={isArabic ? "العميل" : "Client"}
                  value={client}
                />

                <DetailItem
                  label={isArabic ? "القطاع" : "Industry"}
                  value={industry}
                />

                <DetailItem
                  label={isArabic ? "الخدمة" : "Service"}
                  value={service}
                />

                <DetailItem
                  label={
                    isArabic
                      ? "التقنيات"
                      : "Technologies"
                  }
                  value={technologies}
                />
              </div>
            </div>
          </Reveal>

          <Reveal delay={80}>
            <div>
              <span className="text-[10px] font-black uppercase tracking-[.14em] text-teal-deep">
                {isArabic
                  ? "دراسة المشروع"
                  : "Project overview"}
              </span>

              <h2 className="mt-2 font-display text-3xl font-semibold tracking-[-.04em] text-ink md:text-4xl rtl:font-arabic rtl:tracking-normal">
                {isArabic
                  ? "التحدي والحل والنتائج"
                  : "Challenge, solution and delivery"}
              </h2>

              {content ? (
                <div className="mt-6 whitespace-pre-line text-[15px] leading-8 text-slate-600">
                  {content}
                </div>
              ) : (
                <p className="mt-6 text-sm text-slate-400">
                  {isArabic
                    ? "سيتم إضافة تفاصيل المشروع قريباً."
                    : "Project details will be added soon."}
                </p>
              )}
            </div>
          </Reveal>
        </Container>
      </section>

      {sortedImages.length > 0 && (
        <section className="bg-[#f6f8fb] py-20 md:py-28">
          <Container>
            <Reveal>
              <span className="text-[10px] font-black uppercase tracking-[.14em] text-teal-deep">
                {isArabic
                  ? "معرض المشروع"
                  : "Project gallery"}
              </span>

              <h2 className="mt-2 font-display text-4xl font-semibold tracking-[-.04em] text-ink rtl:font-arabic rtl:tracking-normal">
                {isArabic
                  ? "لقطات من المشروع"
                  : "Inside the project"}
              </h2>
            </Reveal>

            <div className="mt-10 grid gap-5 md:grid-cols-2">
              {sortedImages.map((image, index) => {
                const caption =
                  isArabic && image.captionAr
                    ? image.captionAr
                    : image.caption;

                return (
                  <Reveal
                    key={image.id}
                    delay={(index % 2) * 70}
                  >
                    <figure className="overflow-hidden rounded-[28px] border border-slate-200 bg-white">
                      <div className="relative h-[300px] md:h-[420px]">
                        <Image
                          src={image.imageUrl}
                          alt={
                            caption ||
                            `${title} ${index + 1}`
                          }
                          fill
                          className="object-cover transition duration-500 hover:scale-[1.02]"
                          sizes="(max-width: 768px) 100vw, 50vw"
                        />
                      </div>

                      {caption && (
                        <figcaption className="px-5 py-4 text-xs text-slate-500">
                          {caption}
                        </figcaption>
                      )}
                    </figure>
                  </Reveal>
                );
              })}
            </div>
          </Container>
        </section>
      )}

      <CTA />
    </main>
  );
}

function DetailItem({
  label,
  value,
}: {
  label: string;
  value: string | null;
}) {
  if (!value) {
    return null;
  }

  return (
    <div className="border-b border-slate-200 pb-5 last:border-0 last:pb-0">
      <span className="text-[9px] font-black uppercase tracking-[.12em] text-slate-400">
        {label}
      </span>

      <strong className="mt-1 block text-sm font-semibold text-ink">
        {value}
      </strong>
    </div>
  );
}