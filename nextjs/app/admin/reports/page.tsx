"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";

import AdminLoader from "@/components/admin/AdminLoader";
import { useLanguage } from "@/components/shared/LanguageProvider";

import { getLeads, type Lead } from "@/lib/api/leads";
import { getQuotations, type Quotation } from "@/lib/api/quotations";
import { getProjects, type Project } from "@/lib/api/projects";

type DateRange = "all" | "30d" | "year";

type ReportRow = {
  label: string;
  value: number;
};

export default function ReportsPage() {
  const { isArabic } = useLanguage();

  const [leads, setLeads] = useState<Lead[]>([]);
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [dateRange, setDateRange] = useState<DateRange>("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const t = isArabic
    ? {
        section: "التحليلات",
        title: "التقارير والتحليلات",
        subtitle: "مؤشرات تجارية وتشغيلية حقيقية من بيانات الشركة.",
        allTime: "كل الفترات",
        last30: "آخر 30 يوماً",
        thisYear: "هذا العام",

        totalLeads: "إجمالي العملاء المحتملين",
        wonLeads: "العملاء المحولون",
        quotations: "عروض الأسعار",
        activeProjects: "المشاريع النشطة",

        leadWinRate: "معدل تحويل العملاء",
        avgProgress: "متوسط تقدم المشاريع",
        acceptedValue: "قيمة عروض الأسعار المقبولة",
        activeBudget: "ميزانية المشاريع النشطة",

        leadsByService: "العملاء حسب الخدمة",
        leadStatus: "حالات العملاء",
        quotationStatus: "حالات عروض الأسعار",
        projectStatus: "حالات المشاريع",

        leads: "عميل محتمل",
        quotationsLabel: "عرض سعر",
        projectsLabel: "مشروع",

        noData: "لا توجد بيانات لهذه الفترة.",
        unspecified: "غير محدد",
        loadError: "تعذر تحميل بيانات التقارير.",
      }
    : {
        section: "Analytics",
        title: "Reports & analytics",
        subtitle: "Live commercial and operational signals across the company.",
        allTime: "All time",
        last30: "Last 30 days",
        thisYear: "This year",

        totalLeads: "Total Leads",
        wonLeads: "Won Leads",
        quotations: "Quotations",
        activeProjects: "Active Projects",

        leadWinRate: "Lead Win Rate",
        avgProgress: "Average Project Progress",
        acceptedValue: "Accepted Quotation Value",
        activeBudget: "Active Project Budget",

        leadsByService: "Leads by Service",
        leadStatus: "Lead Status",
        quotationStatus: "Quotation Status",
        projectStatus: "Project Status",

        leads: "leads",
        quotationsLabel: "quotations",
        projectsLabel: "projects",

        noData: "No data available for this period.",
        unspecified: "Unspecified",
        loadError: "Unable to load report data.",
      };

  useEffect(() => {
    async function loadReports() {
      try {
        const [leadData, quotationData, projectData] = await Promise.all([
          getLeads(),
          getQuotations(),
          getProjects(),
        ]);

        setLeads(leadData);
        setQuotations(quotationData);
        setProjects(projectData);
      } catch (error) {
        console.error(error);
        setError(isArabic ? "تعذر تحميل بيانات التقارير." : "Unable to load report data.");
      } finally {
        setLoading(false);
      }
    }

    loadReports();
  }, []);

  const filteredLeads = useMemo(
    () => leads.filter((item) => matchesDateRange(item.createdAt, dateRange)),
    [leads, dateRange],
  );

  const filteredQuotations = useMemo(
    () => quotations.filter((item) => matchesDateRange(item.createdAt, dateRange)),
    [quotations, dateRange],
  );

  const filteredProjects = useMemo(
    () => projects.filter((item) => matchesDateRange(item.createdAt, dateRange)),
    [projects, dateRange],
  );

  const wonLeads = filteredLeads.filter((lead) => lead.status === "won");
  const acceptedQuotations = filteredQuotations.filter(
    (quotation) => quotation.status === "accepted",
  );
  const activeProjects = filteredProjects.filter(
    (project) => project.status === "active",
  );

  const leadWinRate = filteredLeads.length
    ? (wonLeads.length / filteredLeads.length) * 100
    : 0;

  const averageProgress = filteredProjects.length
    ? filteredProjects.reduce((total, project) => total + project.progress, 0) /
      filteredProjects.length
    : 0;

  const acceptedValues = useMemo(
    () =>
      sumMoneyByCurrency(
        acceptedQuotations,
        (item) => item.currency,
        (item) => item.totalAmount,
      ),
    [acceptedQuotations],
  );

  const activeBudgets = useMemo(
    () =>
      sumMoneyByCurrency(
        activeProjects,
        (item) => item.currency,
        (item) => item.budget,
      ),
    [activeProjects],
  );

  const leadServiceRows = useMemo(() => {
    const counts = new Map<string, number>();

    for (const lead of filteredLeads) {
      const rawService = lead.service?.trim() || t.unspecified;
      const label = translateService(rawService, isArabic);
      counts.set(label, (counts.get(label) || 0) + 1);
    }

    return [...counts.entries()]
      .map(([label, value]) => ({ label, value }))
      .sort((a, b) => b.value - a.value);
  }, [filteredLeads, isArabic, t.unspecified]);

  const leadStatusRows = useMemo(
    () =>
      makeStatusRows(
        filteredLeads,
        ["new", "contacted", "qualified", "won", "lost"],
        (item) => item.status,
        (status) => leadStatusLabel(status, isArabic),
      ),
    [filteredLeads, isArabic],
  );

  const quotationStatusRows = useMemo(
    () =>
      makeStatusRows(
        filteredQuotations,
        ["draft", "sent", "accepted", "rejected", "expired"],
        (item) => item.status,
        (status) => quotationStatusLabel(status, isArabic),
      ),
    [filteredQuotations, isArabic],
  );

  const projectStatusRows = useMemo(
    () =>
      makeStatusRows(
        filteredProjects,
        ["planning", "active", "on_hold", "completed", "cancelled"],
        (item) => item.status,
        (status) => projectStatusLabel(status, isArabic),
      ),
    [filteredProjects, isArabic],
  );

  if (loading) {
    return (
      <AdminLoader
        text={isArabic ? "جارٍ تحميل التقارير" : "Loading reports"}
        subtext={isArabic ? "جارٍ تحليل بيانات الشركة..." : "Analysing company data..."}
      />
    );
  }

  return (
    <div dir={isArabic ? "rtl" : "ltr"}>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <span className="text-[10px] font-black uppercase tracking-[.14em] text-teal-deep">
            {t.section}
          </span>

          <h1 className="mt-1 font-display text-4xl font-semibold text-ink">
            {t.title}
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            {t.subtitle}
          </p>
        </div>

        <select
          value={dateRange}
          onChange={(event) => setDateRange(event.target.value as DateRange)}
          className="h-[44px] min-w-[170px] rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none focus:border-teal-deep"
        >
          <option value="all">{t.allTime}</option>
          <option value="30d">{t.last30}</option>
          <option value="year">{t.thisYear}</option>
        </select>
      </div>

      {error && (
        <div className="mb-5 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-bold text-rose-600">
          {error}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label={t.totalLeads} value={filteredLeads.length} />
        <StatCard label={t.wonLeads} value={wonLeads.length} />
        <StatCard label={t.quotations} value={filteredQuotations.length} />
        <StatCard label={t.activeProjects} value={activeProjects.length} />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label={t.leadWinRate}
          value={`${formatNumber(leadWinRate)}%`}
          meta={`${wonLeads.length} / ${filteredLeads.length}`}
        />

        <StatCard
          label={t.avgProgress}
          value={`${formatNumber(averageProgress)}%`}
          meta={`${filteredProjects.length} ${t.projectsLabel}`}
        />

        <StatCard
          label={t.acceptedValue}
          value={<MoneyTotals totals={acceptedValues} />}
          meta={`${acceptedQuotations.length} ${t.quotationsLabel}`}
        />

        <StatCard
          label={t.activeBudget}
          value={<MoneyTotals totals={activeBudgets} />}
          meta={`${activeProjects.length} ${t.projectsLabel}`}
        />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <ReportCard
          title={t.leadsByService}
          meta={`${filteredLeads.length} ${t.leads}`}
          rows={leadServiceRows}
          emptyText={t.noData}
        />

        <ReportCard
          title={t.leadStatus}
          meta={`${filteredLeads.length} ${t.leads}`}
          rows={leadStatusRows}
          emptyText={t.noData}
        />

        <ReportCard
          title={t.quotationStatus}
          meta={`${filteredQuotations.length} ${t.quotationsLabel}`}
          rows={quotationStatusRows}
          emptyText={t.noData}
        />

        <ReportCard
          title={t.projectStatus}
          meta={`${filteredProjects.length} ${t.projectsLabel}`}
          rows={projectStatusRows}
          emptyText={t.noData}
        />
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  meta,
}: {
  label: string;
  value: ReactNode;
  meta?: string;
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <span className="text-[10px] font-black uppercase tracking-[.08em] text-slate-400">
        {label}
      </span>

      <div className="mt-3 font-display text-3xl font-semibold text-ink">
        {value}
      </div>

      {meta && (
        <div className="mt-2 text-[10px] font-bold text-slate-400">
          {meta}
        </div>
      )}
    </div>
  );
}

function ReportCard({
  title,
  meta,
  rows,
  emptyText,
}: {
  title: string;
  meta: string;
  rows: ReportRow[];
  emptyText: string;
}) {
  const total = rows.reduce((sum, row) => sum + row.value, 0);

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <h3 className="font-display text-base font-semibold text-ink">
          {title}
        </h3>

        <span className="whitespace-nowrap text-[10px] font-bold text-slate-400">
          {meta}
        </span>
      </div>

      {rows.length ? (
        <div className="mt-5 grid gap-5">
          {rows.map((row) => {
            const percentage = total ? (row.value / total) * 100 : 0;

            return (
              <div key={row.label}>
                <div className="flex justify-between gap-4 text-xs">
                  <span className="text-slate-500">
                    {row.label}
                  </span>

                  <strong className="text-ink">
                    {row.value}{" "}
                    <span className="text-[10px] text-slate-400">
                      ({formatNumber(percentage)}%)
                    </span>
                  </strong>
                </div>

                <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
                  <span
                    className="block h-full rounded-full bg-gradient-to-r from-teal to-blue"
                    style={{ width: `${Math.min(percentage, 100)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="mt-5 rounded-2xl bg-slate-50 px-4 py-8 text-center text-sm text-slate-400">
          {emptyText}
        </div>
      )}
    </div>
  );
}

function MoneyTotals({ totals }: { totals: Record<string, number> }) {
  const entries = Object.entries(totals).filter(([, value]) => value !== 0);

  if (!entries.length) {
    return <span dir="ltr">—</span>;
  }

  return (
    <div className="space-y-1">
      {entries.map(([currency, value]) => (
        <div key={currency} dir="ltr" className="whitespace-nowrap">
          {formatMoney(value, currency)}
        </div>
      ))}
    </div>
  );
}

function matchesDateRange(value: string, range: DateRange) {
  if (range === "all") return true;

  const date = new Date(value);
  const now = new Date();

  if (Number.isNaN(date.getTime())) return false;

  if (range === "30d") {
    const start = new Date(now);
    start.setDate(start.getDate() - 30);
    return date >= start && date <= now;
  }

  return date.getFullYear() === now.getFullYear();
}

function makeStatusRows<T>(
  items: T[],
  statuses: string[],
  getStatus: (item: T) => string,
  getLabel: (status: string) => string,
): ReportRow[] {
  return statuses
    .map((status) => ({
      label: getLabel(status),
      value: items.filter((item) => getStatus(item) === status).length,
    }))
    .filter((row) => row.value > 0);
}

function sumMoneyByCurrency<T>(
  items: T[],
  getCurrency: (item: T) => string,
  getAmount: (item: T) => number,
) {
  return items.reduce<Record<string, number>>((totals, item) => {
    const currency = getCurrency(item) || "SAR";
    totals[currency] = (totals[currency] || 0) + (Number(getAmount(item)) || 0);
    return totals;
  }, {});
}

function leadStatusLabel(status: string, isArabic: boolean) {
  const ar: Record<string, string> = {
    new: "جديد",
    contacted: "تم التواصل",
    qualified: "مؤهل",
    won: "تم التحويل",
    lost: "مفقود",
  };

  return isArabic ? ar[status] || status : formatValue(status);
}

function quotationStatusLabel(status: string, isArabic: boolean) {
  const ar: Record<string, string> = {
    draft: "مسودة",
    sent: "مرسل",
    accepted: "مقبول",
    rejected: "مرفوض",
    expired: "منتهي",
  };

  return isArabic ? ar[status] || status : formatValue(status);
}

function projectStatusLabel(status: string, isArabic: boolean) {
  const ar: Record<string, string> = {
    planning: "التخطيط",
    active: "نشط",
    on_hold: "معلق",
    completed: "مكتمل",
    cancelled: "ملغي",
  };

  return isArabic ? ar[status] || status : formatValue(status);
}

function translateService(service: string, isArabic: boolean) {
  if (!isArabic) return service;

  const labels: Record<string, string> = {
    "ERP & Odoo": "ERP و Odoo",
    "Web Platforms": "منصات الويب",
    "Mobile Apps": "تطبيقات الجوال",
    "AI Automation": "أتمتة الذكاء الاصطناعي",
    Security: "الأمن السيبراني",
  };

  return labels[service] || service;
}

function formatMoney(amount: number, currency: string) {
  const symbols: Record<string, string> = {
    SAR: "\u20C1",
    USD: "$",
    AED: "د.إ",
  };

  const value = new Intl.NumberFormat("en-US", {
    useGrouping: false,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(Number(amount) || 0);

  return `${symbols[currency] || currency} ${value}`;
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("en-US", {
    useGrouping: false,
    minimumFractionDigits: 0,
    maximumFractionDigits: 1,
  }).format(Number(value) || 0);
}

function formatValue(value: string) {
  return value
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}