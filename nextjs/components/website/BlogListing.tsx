"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";

import PageHero from "@/components/shared/PageHero";
import Reveal from "@/components/shared/Reveal";
import CTA from "@/components/shared/CTA";
import Container from "@/components/shared/Container";
import { useLanguage } from "@/components/shared/LanguageProvider";
import { getPublicBlogs, type Blog } from "@/lib/api/blog";

export default function BlogListing() {
  const { isArabic } = useLanguage();

  const [posts, setPosts] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadPosts() {
      try {
        setLoading(true);
        setError("");

        // Public API returns published blog posts only
        const data = await getPublicBlogs();
        setPosts(data);
      } catch (error) {
        console.error("Blog load error:", error);

        setError(
          isArabic
            ? "تعذر تحميل المقالات حالياً."
            : "Unable to load blog posts.",
        );
      } finally {
        setLoading(false);
      }
    }

    loadPosts();
  }, [isArabic]);

  function formatDate(value: string | null | undefined) {
    if (!value) return "";

    return new Intl.DateTimeFormat(
      isArabic ? "ar-SA" : "en-GB",
      {
        year: "numeric",
        month: "short",
        day: "2-digit",
      },
    ).format(new Date(value));
  }

  return (
    <main dir={isArabic ? "rtl" : "ltr"}>
      <PageHero
        kicker={isArabic ? "الأخبار والرؤى" : "News & insights"}
        title={
          isArabic
            ? "أفكار لبناء أنظمة تعمل بكفاءة في بيئات العمل الحقيقية."
            : "Ideas for building systems that survive real operations."
        }
        copy={
          isArabic
            ? "رؤى عملية حول أنظمة ERP وهندسة البرمجيات والذكاء الاصطناعي والأمن والعمليات الرقمية."
            : "Practical thinking on ERP, software engineering, AI, security and digital operations."
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
                  className="h-[520px] animate-pulse rounded-[27px] border border-slate-200 bg-slate-100"
                />
              ))}
            </div>
          ) : (
            <div className="grid items-stretch gap-4 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post, index) => {
                const title = isArabic
                  ? post.titleAr || "بدون عنوان"
                  : post.title;

                const excerpt = isArabic
                  ? post.excerptAr || ""
                  : post.excerpt || "";

                const category = isArabic
                  ? post.categoryAr || ""
                  : post.category || "";

                return (
                  <Reveal
                    key={post.id}
                    delay={(index % 3) * 70}
                  >
                    <Link
                      href={`/blog/${post.slug}`}
                      className="block h-full"
                    >
                      {/* Fixed height keeps every blog card equal */}
                      <article className="group flex h-[520px] flex-col overflow-hidden rounded-[27px] border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1.5 hover:shadow-card">
                        {/* Fixed image area */}
                        <div className="relative h-[210px] shrink-0 overflow-hidden bg-[radial-gradient(circle_at_68%_38%,rgba(49,210,181,.25),transparent_21%),radial-gradient(circle_at_35%_65%,rgba(93,140,255,.25),transparent_26%),linear-gradient(145deg,#07111f,#102d4d)]">
                          {post.coverImage ? (
                            <>
                              <Image
                                src={post.coverImage}
                                alt={title}
                                fill
                                className="object-cover transition duration-500 group-hover:scale-105"
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                              />

                              <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
                            </>
                          ) : (
                            <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(255,255,255,.13)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.13)_1px,transparent_1px)] [background-size:34px_34px]" />
                          )}

                          {category && (
                            <span className="absolute left-6 top-6 rounded-full border border-white/15 bg-[#07111f99] px-3 py-2 text-[9px] font-black uppercase tracking-[.12em] text-[#74e4d0] backdrop-blur-lg rtl:left-auto rtl:right-6">
                              {category}
                            </span>
                          )}
                        </div>

                        <div className="flex min-h-0 flex-1 flex-col p-6">
                          <div className="flex h-[20px] shrink-0 gap-3 text-[9px] font-black uppercase tracking-[.1em] text-[#738196]">
                            {category && <span>{category}</span>}

                            <span>
                              {formatDate(
                                post.publishedAt || post.createdAt,
                              )}
                            </span>
                          </div>

                          {/* Fixed title space */}
                          <div className="mt-4 h-[64px] shrink-0">
                            <h2 className="line-clamp-2 font-display text-[24px] font-semibold leading-[1.15] tracking-[-.035em] text-ink rtl:font-arabic rtl:tracking-normal">
                              {title}
                            </h2>
                          </div>

                          {/* Fixed excerpt space */}
                          <div className="mt-3 h-[84px] shrink-0">
                            {excerpt && (
                              <p className="line-clamp-3 text-sm leading-7 text-muted">
                                {excerpt}
                              </p>
                            )}
                          </div>

                          <span className="mt-auto inline-flex items-center gap-2 pt-5 text-xs font-extrabold text-teal-deep transition group-hover:gap-3">
                            {isArabic ? "اقرأ المقال" : "Read insight"}

                            {isArabic ? (
                              <ArrowLeft size={14} />
                            ) : (
                              <ArrowRight size={14} />
                            )}
                          </span>
                        </div>
                      </article>
                    </Link>
                  </Reveal>
                );
              })}
            </div>
          )}

          {!loading && !error && posts.length === 0 && (
            <div className="py-20 text-center">
              <h2 className="font-display text-2xl font-semibold text-ink">
                {isArabic
                  ? "لا توجد مقالات منشورة حالياً."
                  : "No published articles yet."}
              </h2>
            </div>
          )}
        </Container>
      </section>

      <CTA />
    </main>
  );
}