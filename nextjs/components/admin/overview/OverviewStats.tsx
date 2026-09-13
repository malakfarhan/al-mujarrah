"use client";

import { useEffect, useState } from "react";
import {
  BarChart3,
  BookOpenText,
  BriefcaseBusiness,
  FileCheck2,
  FileText,
  Images,
  Users,
} from "lucide-react";

import { useLanguage } from "@/components/shared/LanguageProvider";
import { API_URL } from "@/lib/api/client";
import { getLeads, type Lead } from "@/lib/api/leads";
import {
  getQuotations,
  type Quotation,
} from "@/lib/api/quotations";
import {
  getProjects,
  type Project,
} from "@/lib/api/projects";

type PublishableItem = {
  isPublished: boolean;
};

async function getAdminList<T>(path: string): Promise<T[]> {
  const response = await fetch(`${API_URL}${path}`, {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error(`Failed to load ${path}`);
  }

  return response.json();
}

export default function OverviewStats() {
  const { isArabic } = useLanguage();

  const [leads, setLeads] = useState<Lead[]>([]);
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [portfolio, setPortfolio] = useState<PublishableItem[]>([]);
  const [blogs, setBlogs] = useState<PublishableItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [
          leadsData,
          quotationData,
          projectData,
          portfolioData,
          blogData,
        ] = await Promise.all([
          getLeads(),
          getQuotations(),
          getProjects(),
          getAdminList<PublishableItem>("/portfolio"),
          getAdminList<PublishableItem>("/blog"),
        ]);

        setLeads(leadsData);
        setQuotations(quotationData);
        setProjects(projectData);
        setPortfolio(portfolioData);
        setBlogs(blogData);
      } catch (error) {
        console.error("Dashboard stats error:", error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const wonLeads = leads.filter((lead) => lead.status === "won").length;
  const acceptedQuotes = quotations.filter(
    (quotation) => quotation.status === "accepted",
  ).length;
  const activeProjects = projects.filter(
    (project) => project.status === "active",
  );
  const publishedPortfolio = portfolio.filter(
    (item) => item.isPublished,
  ).length;
  const publishedBlogs = blogs.filter(
    (item) => item.isPublished,
  ).length;

  const averageProgress = activeProjects.length
    ? Math.round(
        activeProjects.reduce(
          (total, project) => total + project.progress,
          0,
        ) / activeProjects.length,
      )
    : 0;

  const winRate = leads.length
    ? Math.round((wonLeads / leads.length) * 100)
    : 0;

  const stats = [
    {
      label: isArabic ? "إجمالي العملاء المحتملين" : "Total Leads",
      value: leads.length,
      note: isArabic ? `${wonLeads} ناجح` : `${wonLeads} won`,
      icon: Users,
    },
    {
      label: isArabic ? "عروض الأسعار" : "Quotations",
      value: quotations.length,
      note: isArabic
        ? `${acceptedQuotes} مقبول`
        : `${acceptedQuotes} accepted`,
      icon: FileText,
    },
    {
      label: isArabic ? "المشاريع النشطة" : "Active Projects",
      value: activeProjects.length,
      note: isArabic
        ? `${averageProgress}% متوسط الإنجاز`
        : `${averageProgress}% avg progress`,
      icon: BriefcaseBusiness,
    },
    {
      label: isArabic ? "معدل نجاح العملاء" : "Lead Win Rate",
      value: `${winRate}%`,
      note: isArabic
        ? `${wonLeads} من ${leads.length}`
        : `${wonLeads} of ${leads.length}`,
      icon: BarChart3,
    },
    {
      label: isArabic ? "أعمال منشورة" : "Published Portfolio",
      value: publishedPortfolio,
      note: isArabic
        ? `${portfolio.length} إجمالي`
        : `${portfolio.length} total`,
      icon: Images,
    },
    {
      label: isArabic ? "مقالات منشورة" : "Published Blog Posts",
      value: publishedBlogs,
      note: isArabic
        ? `${blogs.length} إجمالي`
        : `${blogs.length} total`,
      icon: BookOpenText,
    },
  ];

  if (loading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="h-[138px] animate-pulse rounded-3xl border border-slate-200 bg-white"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {stats.map(({ label, value, note, icon: Icon }) => (
        <div
          key={label}
          className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">
              {label}
            </span>

            <span className="grid h-9 w-9 place-items-center rounded-xl bg-[#edf9f6] text-teal-deep">
              <Icon size={17} />
            </span>
          </div>

          <strong className="mt-5 block font-display text-3xl tracking-[-.04em] text-ink">
            {value}
          </strong>

          <small className="mt-2 block text-[10px] font-black text-teal-deep">
            {note}
          </small>
        </div>
      ))}
    </div>
  );
}