"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  BarChart3,
  Bell,
  BookOpenText,
  LogOut,
  BriefcaseBusiness,
  ChevronLeft,
  FileText,
  Headphones,
  History,
  Languages,
  LayoutDashboard,
  Menu,
  Search,
  Settings,
  Users,
  X,
  ShieldCheck,
} from "lucide-react";

import { useLanguage } from "@/components/shared/LanguageProvider";
import { getCurrentAdmin, logoutAdmin } from "@/lib/api/auth";
import AdminLoader from "@/components/admin/AdminLoader";

const links = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/leads", label: "Leads", icon: Users },
  { href: "/admin/quotations", label: "Quotations", icon: FileText },
  { href: "/admin/projects", label: "Projects", icon: BriefcaseBusiness },
  { href: "/admin/portfolio", label: "Portfolio", icon: BriefcaseBusiness },
  { href: "/admin/blog", label: "Blog", icon: BookOpenText },
  // { href: "/admin/support", label: "Support", icon: Headphones },
  { href: "/admin/reports", label: "Reports", icon: BarChart3 },

  // Admin activity history
  { href: "/admin/activity-logs", label: "Activity Logs", icon: History },

  { href: "/admin/roles", label: "Roles", icon: ShieldCheck },
  { href: "/admin/admins", label: "Admin Users", icon: Users },
];

export default function AdminShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { isArabic, toggleLanguage } = useLanguage();

  const [mobile, setMobile] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  const authChecked = useRef(false);

  useEffect(() => {
    let active = true;

    if (pathname === "/admin/login") {
      setCheckingAuth(false);
      return;
    }

    // Session already checked once
    if (authChecked.current) {
      setCheckingAuth(false);
      return;
    }

    authChecked.current = true;

    async function checkAuth() {
      setCheckingAuth(true);

      try {
        const session = await getCurrentAdmin();

        if (!session) {
          router.replace("/admin/login");
          return;
        }

        if (active) {
          setCheckingAuth(false);
        }
      } catch {
        router.replace("/admin/login");
      }
    }

    checkAuth();

    return () => {
      active = false;
    };
  }, [pathname, router]);

  // Login page has no admin sidebar/header
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  if (checkingAuth) {
    return (
      <div className="grid min-h-screen place-items-center bg-[#eef2f6]">
        <AdminLoader
          text="Checking session"
          subtext="Verifying your admin access..."
        />
      </div>
    );
  }

  async function handleLogout() {
    await logoutAdmin();

    router.replace("/admin/login");
    router.refresh();
  }

  // Mobile sidebar closes to the correct side
  const sidebarTransform = mobile
    ? "translate-x-0"
    : isArabic
      ? "translate-x-full lg:translate-x-0"
      : "-translate-x-full lg:translate-x-0";

  return (
    <div
      dir={isArabic ? "rtl" : "ltr"}
      className="min-h-screen bg-[#eef2f6] lg:flex"
    >
      <aside
        className={`fixed inset-y-0 z-50 flex w-[260px] shrink-0 flex-col bg-[#07111f] p-4 text-white transition-transform duration-300 ${
          isArabic
            ? "right-0 lg:right-auto"
            : "left-0 lg:left-auto"
        } ${sidebarTransform} lg:sticky lg:top-0 lg:h-screen`}
      >
        <div className="flex items-center gap-3 px-2 py-2">
          <span className="grid h-10 w-10 place-items-center rounded-[13px] bg-gradient-to-br from-teal to-blue font-display font-black text-ink">
            A
          </span>

          <span className="font-display text-lg font-bold">
            almajrah.
          </span>

          <button
            onClick={() => setMobile(false)}
            className="ms-auto grid h-9 w-9 place-items-center rounded-lg bg-white/[.06] lg:hidden"
          >
            <X size={18} />
          </button>
        </div>

        <span className="mb-2 mt-7 px-3 text-[9px] font-black uppercase tracking-[.14em] text-[#60758b]">
          Workspace
        </span>

        <nav className="grid gap-1">
          {links.map(({ href, label, icon: Icon }) => {
            const active =
              href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(href);

            return (
              <Link
                key={href}
                href={href}
                onClick={() => setMobile(false)}
                className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-bold transition ${
                  active
                    ? "bg-white/[.09] text-white"
                    : "text-[#8ea3b7] hover:bg-white/[.05] hover:text-white"
                }`}
              >
                <Icon size={18} />
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto grid gap-1 pt-6">
          <button className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-bold text-[#8ea3b7] hover:bg-white/[.05] hover:text-white">
            <Settings size={18} />
            Settings
          </button>

          <button
            onClick={handleLogout}
            className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-bold text-[#8ea3b7] hover:bg-white/[.05] hover:text-white"
          >
            <LogOut size={18} />
            Logout
          </button>

          <Link
            href="/"
            className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-bold text-[#8ea3b7] hover:bg-white/[.05] hover:text-white"
          >
            <ChevronLeft
              size={18}
              className={isArabic ? "rotate-180" : ""}
            />
            Back to website
          </Link>
        </div>
      </aside>

      {mobile && (
        <button
          aria-label="Close sidebar"
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={() => setMobile(false)}
        />
      )}

      <section className="min-w-0 flex-1">
        <header className="sticky top-0 z-30 flex h-[72px] items-center border-b border-slate-200 bg-white/90 px-4 backdrop-blur-xl md:px-6">
          <button
            onClick={() => setMobile(true)}
            className="me-3 grid h-10 w-10 place-items-center rounded-xl border border-slate-200 lg:hidden"
          >
            <Menu size={19} />
          </button>

          <div className="relative w-full max-w-[380px]">
            <Search
              className={`absolute top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 ${
                isArabic ? "right-3" : "left-3"
              }`}
            />

            <input
              placeholder={
                isArabic
                  ? "ابحث في لوحة التحكم..."
                  : "Search dashboard..."
              }
              className={`w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 text-sm outline-none focus:border-teal-deep ${
                isArabic
                  ? "pl-3 pr-9 text-right"
                  : "pl-9 pr-3"
              }`}
            />
          </div>

          <div className="ms-auto flex items-center gap-2">
            <button
              onClick={toggleLanguage}
              className="inline-flex h-10 items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-2.5 text-xs font-black"
            >
              <Languages size={15} />
              {isArabic ? "EN" : "ع"}
            </button>

            <button className="grid h-10 w-10 place-items-center rounded-xl border border-slate-200 bg-white">
              <Bell size={17} />
            </button>
          </div>
        </header>

        <main className="p-4 md:p-6 xl:p-8">
          {children}
        </main>
      </section>
    </div>
  );
}