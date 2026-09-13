"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

import { useLanguage } from "@/components/shared/LanguageProvider";
import {
  getActivityLogs,
  type ActivityLog,
} from "@/lib/api/activity-logs";

export default function RecentActivity() {
  const { isArabic } = useLanguage();

  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        setLogs(await getActivityLogs());
      } catch (error) {
        console.error("Recent activity error:", error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const recent = useMemo(
    () =>
      [...logs]
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() -
            new Date(a.createdAt).getTime(),
        )
        .slice(0, 5),
    [logs],
  );

  const actions: Record<string, string> = {
    login: isArabic ? "تسجيل الدخول" : "Logged in",
    created: isArabic ? "إنشاء" : "Created",
    updated: isArabic ? "تحديث" : "Updated",
    status_changed: isArabic ? "تغيير الحالة" : "Status changed",
    deleted: isArabic ? "حذف" : "Deleted",
    published: isArabic ? "نشر" : "Published",
    unpublished: isArabic ? "إلغاء النشر" : "Unpublished",
  };

  const entities: Record<string, string> = {
    admin: isArabic ? "المسؤول" : "Admin",
    lead: isArabic ? "العميل المحتمل" : "Lead",
    quotation: isArabic ? "عرض السعر" : "Quotation",
    project: isArabic ? "المشروع" : "Project",
    portfolio: isArabic ? "معرض الأعمال" : "Portfolio",
    blog: isArabic ? "المدونة" : "Blog",
  };

  function relativeTime(value: string) {
    const date = new Date(value);
    const difference = date.getTime() - Date.now();
    const absolute = Math.abs(difference);

    const units: Array<{
      unit: Intl.RelativeTimeFormatUnit;
      milliseconds: number;
    }> = [
      { unit: "day", milliseconds: 86400000 },
      { unit: "hour", milliseconds: 3600000 },
      { unit: "minute", milliseconds: 60000 },
    ];

    const formatter = new Intl.RelativeTimeFormat(
      isArabic ? "ar-SA" : "en",
      { numeric: "auto" },
    );

    for (const item of units) {
      if (absolute >= item.milliseconds) {
        return formatter.format(
          Math.round(difference / item.milliseconds),
          item.unit,
        );
      }
    }

    return isArabic ? "الآن" : "just now";
  }

  if (loading) {
    return (
      <div className="h-[330px] animate-pulse rounded-3xl border border-slate-200 bg-white" />
    );
  }

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-base font-semibold text-ink">
          {isArabic ? "النشاط الأخير" : "Recent activity"}
        </h3>

        <Link
          href="/admin/activity-logs"
          className="text-[10px] font-bold text-teal-deep hover:underline"
        >
          {isArabic ? "عرض الكل" : "View all"}
        </Link>
      </div>

      <div className="mt-3 grid">
        {recent.map((log) => {
          const label =
            isArabic && log.entityLabelAr
              ? log.entityLabelAr
              : log.entityLabel;

          return (
            <div
              key={log.id}
              className="grid grid-cols-[10px_1fr_auto] gap-3 border-b border-slate-100 py-3 last:border-0"
            >
              <span className="mt-1 h-2 w-2 rounded-full bg-teal" />

              <div className="min-w-0">
                <strong className="block text-xs text-ink">
                  {actions[log.action] || log.action}{" "}
                  {entities[log.entityType] || log.entityType}
                </strong>

                <p className="mt-1 truncate text-[10px] text-slate-400">
                  {label ||
                    log.admin?.name ||
                    (isArabic ? "نشاط النظام" : "System activity")}
                </p>
              </div>

              <small className="whitespace-nowrap text-[9px] text-slate-400">
                {relativeTime(log.createdAt)}
              </small>
            </div>
          );
        })}

        {!recent.length && (
          <div className="grid min-h-[180px] place-items-center text-sm text-slate-400">
            {isArabic
              ? "لا توجد أنشطة حتى الآن."
              : "No activity recorded yet."}
          </div>
        )}
      </div>
    </div>
  );
}