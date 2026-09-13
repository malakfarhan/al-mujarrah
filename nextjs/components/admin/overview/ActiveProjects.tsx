"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

import { useLanguage } from "@/components/shared/LanguageProvider";
import {
  getProjects,
  type Project,
} from "@/lib/api/projects";

export default function ActiveProjects() {
  const { isArabic } = useLanguage();

  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        setProjects(await getProjects());
      } catch (error) {
        console.error("Active projects error:", error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const activeProjects = useMemo(
    () =>
      projects
        .filter((project) => project.status === "active")
        .sort((a, b) => b.id - a.id)
        .slice(0, 4),
    [projects],
  );

  if (loading) {
    return (
      <div className="h-[330px] animate-pulse rounded-3xl border border-slate-200 bg-white" />
    );
  }

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-base font-semibold text-ink">
          {isArabic ? "المشاريع النشطة" : "Active projects"}
        </h3>

        <Link
          href="/admin/projects"
          className="text-[10px] font-bold text-teal-deep hover:underline"
        >
          {isArabic ? "عرض الكل" : "View all"}
        </Link>
      </div>

      <div className="mt-4 grid gap-5">
        {activeProjects.map((project) => {
          const title =
            isArabic && project.titleAr
              ? project.titleAr
              : project.title;

          const client =
            isArabic && project.clientNameAr
              ? project.clientNameAr
              : project.clientName;

          const initials = project.title
            .split(" ")
            .filter(Boolean)
            .slice(0, 2)
            .map((word) => word[0])
            .join("")
            .toUpperCase();

          return (
            <div key={project.id}>
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#10294c] text-[9px] font-black text-[#8fe6d6]">
                  {initials || "PR"}
                </span>

                <div className="min-w-0">
                  <strong className="block truncate text-sm text-ink">
                    {title}
                  </strong>

                  <small className="text-[10px] text-slate-400">
                    {client}
                  </small>
                </div>

                <b className="ms-auto shrink-0 text-xs text-ink">
                  {project.progress}%
                </b>
              </div>

              <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
                <span
                  className="block h-full rounded-full bg-gradient-to-r from-teal to-blue"
                  style={{
                    width: `${Math.min(100, project.progress)}%`,
                  }}
                />
              </div>
            </div>
          );
        })}

        {!activeProjects.length && (
          <div className="grid min-h-[180px] place-items-center text-center text-sm text-slate-400">
            {isArabic
              ? "لا توجد مشاريع نشطة حالياً."
              : "No active projects at the moment."}
          </div>
        )}
      </div>
    </div>
  );
}