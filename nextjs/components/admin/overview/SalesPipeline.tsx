"use client";

import { useEffect, useMemo, useState } from "react";

import { useLanguage } from "@/components/shared/LanguageProvider";
import { getLeads, type Lead } from "@/lib/api/leads";

const pipelineColors: Record<string, string> = {
  new: "#cbd5e1",
  contacted: "#5d8cff",
  qualified: "#31d2b5",
  won: "#10b981",
  lost: "#f87171",
};

export default function SalesPipeline() {
  const { isArabic } = useLanguage();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        setLeads(await getLeads());
      } catch (error) {
        console.error("Pipeline error:", error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const statusLabels: Record<string, string> = {
    new: isArabic ? "جديد" : "New",
    contacted: isArabic ? "تم التواصل" : "Contacted",
    qualified: isArabic ? "مؤهل" : "Qualified",
    won: isArabic ? "ناجح" : "Won",
    lost: isArabic ? "مفقود" : "Lost",
  };

  const items = useMemo(() => {
    return ["new", "contacted", "qualified", "won", "lost"].map(
      (status) => {
        const count = leads.filter(
          (lead) => lead.status === status,
        ).length;

        const percentage = leads.length
          ? Math.round((count / leads.length) * 100)
          : 0;

        return {
          status,
          count,
          percentage,
          color: pipelineColors[status],
        };
      },
    );
  }, [leads]);

  const chartBackground = useMemo(() => {
    if (!leads.length) return "#e2e8f0";

    let start = 0;

    const parts = items.map((item) => {
      const end = start + item.percentage;
      const part = `${item.color} ${start}% ${end}%`;
      start = end;
      return part;
    });

    return `conic-gradient(${parts.join(",")})`;
  }, [items, leads.length]);

  if (loading) {
    return (
      <div className="h-[385px] animate-pulse rounded-3xl border border-slate-200 bg-white" />
    );
  }

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-base font-semibold text-ink">
          {isArabic ? "مسار العملاء المحتملين" : "Sales pipeline"}
        </h3>

        <span className="text-[10px] font-bold text-slate-400">
          {leads.length} {isArabic ? "عميل" : "leads"}
        </span>
      </div>

      <div className="mt-7 flex flex-col items-center gap-7">
        <div
          className="relative h-40 w-40 rounded-full before:absolute before:inset-8 before:rounded-full before:bg-white"
          style={{ background: chartBackground }}
        >
          <span className="absolute inset-0 z-10 grid place-items-center text-center">
            <span>
              <strong className="block font-display text-3xl text-ink">
                {leads.length}
              </strong>

              <small className="text-[10px] text-slate-400">
                {isArabic ? "إجمالي العملاء" : "total leads"}
              </small>
            </span>
          </span>
        </div>

        <div className="grid w-full gap-3">
          {items.map((item) => (
            <div
              key={item.status}
              className="flex items-center gap-2 text-xs"
            >
              <i
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: item.color }}
              />

              <span className="text-slate-500">
                {statusLabels[item.status]}
              </span>

              <span className="ms-auto text-[10px] text-slate-400">
                {item.count}
              </span>

              <strong className="w-10 text-end text-ink">
                {item.percentage}%
              </strong>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}