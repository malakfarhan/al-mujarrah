"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";

import Container from "@/components/shared/Container";
import CTA from "@/components/shared/CTA";
import Reveal from "@/components/shared/Reveal";
import { useLanguage } from "@/components/shared/LanguageProvider";
import { getPublicBlog, type Blog } from "@/lib/api/blog";

export default function BlogDetail({
  slug,
}: {
  slug: string;
}) {
  const { isArabic } = useLanguage();

  const [post, setPost] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadPost() {
      try {
        setLoading(true);
        setError("");

        const data = await getPublicBlog(slug);
        setPost(data);
      } catch (error) {
        console.error("Blog detail error:", error);

        setError(
          isArabic
            ? "تعذر تحميل المقال."
            : "Unable to load this article.",
        );
      } finally {
        setLoading(false);
      }
    }

    loadPost();
  }, [slug, isArabic]);

  function formatDate(value: string | null | undefined) {
    if (!value) return "";

    return new Intl.DateTimeFormat(
      isArabic ? "ar-SA" : "en-GB",
      {
        year: "numeric",
        month: "long",
        day: "2-digit",
      },
    ).format(new Date(value));
  }

  if (loading) {
    return (
      <main className="bg-white">
        <Container className="py-28">
          <div className="h-[560px] animate-pulse rounded-[32px] bg-slate-100" />
        </Container>
      </main>
    );
  }

  if (error || !post) {
    return (
      <main
        className="bg-white"
        dir={isArabic ? "rtl" : "ltr"}
      >
        <Container className="py-28 text-center">
          <h1 className="font-display text-4xl font-semibold text-ink">
            {isArabic
              ? "المقال غير متوفر"
              : "Article not available"}
          </h1>

          <p className="mt-3 text-sm text-slate-500">
            {error}
          </p>

          <Link
            href="/blog"
            className="mt-7 inline-flex items-center gap-2 rounded-xl bg-ink px-5 py-3 text-xs font-black text-white"
          >
            {isArabic ? (
              <ArrowRight size={15} />
            ) : (
              <ArrowLeft size={15} />
            )}

            {isArabic
              ? "العودة إلى المقالات"
              : "Back to insights"}
          </Link>
        </Container>
      </main>
    );
  }

  const title = isArabic
    ? post.titleAr || post.title
    : post.title;

  const excerpt = isArabic
    ? post.excerptAr || ""
    : post.excerpt || "";

  const content = isArabic
    ? post.contentAr || ""
    : post.content || "";

  const category = isArabic
    ? post.categoryAr || ""
    : post.category || "";

  const date = post.publishedAt || post.createdAt;

  return (
    <main
      className="bg-white"
      dir={isArabic ? "rtl" : "ltr"}
    >
      <section className="border-b border-slate-200 bg-[#f6f8fb] py-20 md:py-28">
        <Container>
          <Reveal>
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-xs font-black text-teal-deep"
            >
              {isArabic ? (
                <ArrowRight size={15} />
              ) : (
                <ArrowLeft size={15} />
              )}

              {isArabic
                ? "العودة إلى المقالات"
                : "Back to insights"}
            </Link>

            <div className="mt-10 flex flex-wrap items-center gap-3 text-[10px] font-black uppercase tracking-[.12em] text-slate-400">
              {category && (
                <span className="rounded-full border border-slate-200 bg-white px-3 py-2 text-teal-deep">
                  {category}
                </span>
              )}

              <span>{formatDate(date)}</span>
            </div>

            <h1 className="mt-5 max-w-5xl font-display text-5xl font-semibold leading-[1.05] tracking-[-.05em] text-ink md:text-7xl rtl:font-arabic rtl:tracking-normal">
              {title}
            </h1>

            {excerpt && (
              <p className="mt-6 max-w-3xl text-base leading-8 text-slate-500 md:text-lg">
                {excerpt}
              </p>
            )}
          </Reveal>
        </Container>
      </section>

      {post.coverImage && (
        <section className="bg-white py-10 md:py-16">
          <Container>
            <Reveal>
              <div className="relative min-h-[320px] overflow-hidden rounded-[32px] bg-slate-100 md:min-h-[620px]">
                <Image
                  src={post.coverImage}
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
        <Container className="max-w-4xl">
          <Reveal>
            {content ? (
              <article className="whitespace-pre-line text-[16px] leading-9 text-slate-700">
                {content}
              </article>
            ) : (
              <p className="text-sm text-slate-400">
                {isArabic
                  ? "سيتم إضافة محتوى المقال قريباً."
                  : "Article content will be added soon."}
              </p>
            )}
          </Reveal>

          <div className="mt-14 border-t border-slate-200 pt-8">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-xs font-black text-teal-deep"
            >
              {isArabic ? (
                <ArrowRight size={15} />
              ) : (
                <ArrowLeft size={15} />
              )}

              {isArabic
                ? "عرض جميع المقالات"
                : "View all insights"}
            </Link>
          </div>
        </Container>
      </section>

      <CTA />
    </main>
  );
}