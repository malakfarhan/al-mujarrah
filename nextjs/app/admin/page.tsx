"use client";

import { useLanguage } from "@/components/shared/LanguageProvider";
import OverviewStats from "@/components/admin/overview/OverviewStats";
import RevenueChart from "@/components/admin/overview/RevenueChart";
import SalesPipeline from "@/components/admin/overview/SalesPipeline";
import ActiveProjects from "@/components/admin/overview/ActiveProjects";
import RecentActivity from "@/components/admin/overview/RecentActivity";

export default function Dashboard() {
  const { isArabic } = useLanguage();

  return (
    <div dir={isArabic ? "rtl" : "ltr"}>
      <span className="text-[10px] font-black uppercase tracking-[.14em] text-teal-deep">
        {isArabic ? "نظرة عامة" : "Overview"}
      </span>

      <h1 className="mt-1 font-display text-4xl font-semibold text-ink">
        {isArabic ? "نظرة عامة على لوحة التحكم" : "Dashboard overview"}
      </h1>

      <p className="mt-2 text-sm text-slate-500">
        {isArabic
          ? "متابعة المبيعات والمشاريع والمحتوى والأنشطة الأخيرة."
          : "Track sales, projects, content and recent system activity."}
      </p>

      <div className="mt-6">
        <OverviewStats />
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[1.25fr_.75fr]">
        <RevenueChart />
        <SalesPipeline />
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-2">
        <ActiveProjects />
        <RecentActivity />
      </div>
    </div>
  );
}