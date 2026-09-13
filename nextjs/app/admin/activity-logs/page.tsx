'use client';

import { useEffect, useMemo, useState } from 'react';

import AdminLoader from '@/components/admin/AdminLoader';
import { useLanguage } from '@/components/shared/LanguageProvider';
import {
  ActivityLog,
  getActivityLogs,
} from '@/lib/api/activity-logs';

const PAGE_SIZE = 14;

export default function ActivityLogsPage() {
  const { isArabic } = useLanguage();

  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [search, setSearch] = useState('');
  const [actionFilter, setActionFilter] = useState('all');
  const [entityFilter, setEntityFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const t = isArabic
    ? {
        title: 'سجل النشاط',
        subtitle: 'متابعة أنشطة المسؤولين والتغييرات داخل النظام',
        search: 'بحث في السجل...',
        allActions: 'جميع الإجراءات',
        allEntities: 'جميع الأقسام',
        activity: 'النشاط',
        item: 'العنصر',
        admin: 'المسؤول',
        ip: 'عنوان IP',
        date: 'التاريخ',
        system: 'النظام',
        noLogs: 'لا توجد أنشطة مطابقة',
        loadError: 'تعذر تحميل سجل النشاط',
        previous: 'السابق',
        next: 'التالي',
        page: 'صفحة',
        of: 'من',
        showing: 'عرض',
        records: 'سجل',
      }
    : {
        title: 'Activity Logs',
        subtitle: 'Track administrator activity and system changes',
        search: 'Search activity...',
        allActions: 'All actions',
        allEntities: 'All entities',
        activity: 'Activity',
        item: 'Item',
        admin: 'Admin',
        ip: 'IP Address',
        date: 'Date',
        system: 'System',
        noLogs: 'No matching activity found',
        loadError: 'Failed to load activity logs',
        previous: 'Previous',
        next: 'Next',
        page: 'Page',
        of: 'of',
        showing: 'Showing',
        records: 'records',
      };

  useEffect(() => {
    async function loadLogs() {
      try {
        setLoading(true);
        setError('');

        const data = await getActivityLogs();
        setLogs(data);
      } catch {
        setError(
          isArabic
            ? 'تعذر تحميل سجل النشاط'
            : 'Failed to load activity logs',
        );
      } finally {
        setLoading(false);
      }
    }

    loadLogs();
  }, [isArabic]);

  // Reset pagination whenever search/filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [search, actionFilter, entityFilter]);

  const actionLabels: Record<string, string> = {
    login: isArabic ? 'تسجيل الدخول' : 'Logged in',
    created: isArabic ? 'إنشاء' : 'Created',
    updated: isArabic ? 'تحديث' : 'Updated',
    status_changed: isArabic ? 'تغيير الحالة' : 'Status changed',
    deleted: isArabic ? 'حذف' : 'Deleted',
    published: isArabic ? 'نشر' : 'Published',
    unpublished: isArabic ? 'إلغاء النشر' : 'Unpublished',
  };

  const entityLabels: Record<string, string> = {
    admin: isArabic ? 'مسؤول' : 'Admin',
    lead: isArabic ? 'عميل محتمل' : 'Lead',
    quotation: isArabic ? 'عرض سعر' : 'Quotation',
    project: isArabic ? 'مشروع' : 'Project',
    portfolio: isArabic ? 'معرض الأعمال' : 'Portfolio',
    blog: isArabic ? 'المدونة' : 'Blog',
  };

  // Always keep latest activity on top
  const sortedLogs = useMemo(() => {
    return [...logs].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() -
        new Date(a.createdAt).getTime(),
    );
  }, [logs]);

  const actions = useMemo(
    () =>
      Array.from(
        new Set(sortedLogs.map((log) => log.action)),
      ).sort(),
    [sortedLogs],
  );

  const entities = useMemo(
    () =>
      Array.from(
        new Set(sortedLogs.map((log) => log.entityType)),
      ).sort(),
    [sortedLogs],
  );

  const filteredLogs = useMemo(() => {
    const term = search.trim().toLowerCase();

    return sortedLogs.filter((log) => {
      if (
        actionFilter !== 'all' &&
        log.action !== actionFilter
      ) {
        return false;
      }

      if (
        entityFilter !== 'all' &&
        log.entityType !== entityFilter
      ) {
        return false;
      }

      if (!term) {
        return true;
      }

      const values = [
        log.action,
        log.entityType,
        log.entityLabel,
        log.entityLabelAr,
        log.admin?.name,
        log.admin?.email,
        log.ipAddress,
      ];

      return values.some((value) =>
        value?.toLowerCase().includes(term),
      );
    });
  }, [
    sortedLogs,
    search,
    actionFilter,
    entityFilter,
  ]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredLogs.length / PAGE_SIZE),
  );

  // Keep current page valid if records are removed
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const paginatedLogs = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredLogs.slice(start, start + PAGE_SIZE);
  }, [filteredLogs, currentPage]);

  const startRecord =
    filteredLogs.length === 0
      ? 0
      : (currentPage - 1) * PAGE_SIZE + 1;

  const endRecord = Math.min(
    currentPage * PAGE_SIZE,
    filteredLogs.length,
  );

  function getItemLabel(log: ActivityLog) {
    if (isArabic && log.entityLabelAr) {
      return log.entityLabelAr;
    }

    return (
      log.entityLabel ||
      `#${log.entityId ?? log.id}`
    );
  }

  function formatDate(value: string) {
    return new Intl.DateTimeFormat(
      isArabic ? 'ar-SA' : 'en-GB',
      {
        year: 'numeric',
        month: 'short',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      },
    ).format(new Date(value));
  }

  function getVisiblePages() {
    const pages: number[] = [];
    const start = Math.max(1, currentPage - 2);
    const end = Math.min(totalPages, currentPage + 2);

    for (let page = start; page <= end; page++) {
      pages.push(page);
    }

    return pages;
  }

  if (loading) {
    return <AdminLoader />;
  }

  return (
    <div
      className="space-y-6"
      dir={isArabic ? 'rtl' : 'ltr'}
    >
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          {t.title}
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          {t.subtitle}
        </p>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="grid gap-3 md:grid-cols-3">
        <input
          type="text"
          value={search}
          onChange={(event) =>
            setSearch(event.target.value)
          }
          placeholder={t.search}
          className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-slate-400"
        />

        <select
          value={actionFilter}
          onChange={(event) =>
            setActionFilter(event.target.value)
          }
          className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-slate-400"
        >
          <option value="all">
            {t.allActions}
          </option>

          {actions.map((action) => (
            <option
              key={action}
              value={action}
            >
              {actionLabels[action] || action}
            </option>
          ))}
        </select>

        <select
          value={entityFilter}
          onChange={(event) =>
            setEntityFilter(event.target.value)
          }
          className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-slate-400"
        >
          <option value="all">
            {t.allEntities}
          </option>

          {entities.map((entity) => (
            <option
              key={entity}
              value={entity}
            >
              {entityLabels[entity] || entity}
            </option>
          ))}
        </select>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="px-5 py-3 text-start font-semibold">
                  {t.activity}
                </th>

                <th className="px-5 py-3 text-start font-semibold">
                  {t.item}
                </th>

                <th className="px-5 py-3 text-start font-semibold">
                  {t.admin}
                </th>

                <th className="px-5 py-3 text-start font-semibold">
                  {t.ip}
                </th>

                <th className="px-5 py-3 text-start font-semibold">
                  {t.date}
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {paginatedLogs.map((log) => (
                <tr
                  key={log.id}
                  className="hover:bg-slate-50"
                >
                  <td className="px-5 py-4">
                    <div className="font-medium text-slate-900">
                      {actionLabels[log.action] ||
                        log.action}
                    </div>

                    <div className="mt-1 text-xs text-slate-500">
                      {entityLabels[
                        log.entityType
                      ] || log.entityType}
                    </div>
                  </td>

                  <td className="px-5 py-4 text-slate-700">
                    {getItemLabel(log)}
                  </td>

                  <td className="px-5 py-4">
                    {log.admin ? (
                      <>
                        <div className="font-medium text-slate-900">
                          {log.admin.name}
                        </div>

                        <div className="mt-1 text-xs text-slate-500">
                          {log.admin.email}
                        </div>
                      </>
                    ) : (
                      <span className="text-slate-500">
                        {t.system}
                      </span>
                    )}
                  </td>

                  <td className="px-5 py-4 text-slate-600">
                    {log.ipAddress || '—'}
                  </td>

                  <td className="whitespace-nowrap px-5 py-4 text-slate-600">
                    {formatDate(log.createdAt)}
                  </td>
                </tr>
              ))}

              {!paginatedLogs.length && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-5 py-12 text-center text-slate-500"
                  >
                    {t.noLogs}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {filteredLogs.length > 0 && (
          <div className="flex flex-col gap-3 border-t border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm text-slate-500">
              {t.showing}{' '}
              <span className="font-medium text-slate-700">
                {startRecord}-{endRecord}
              </span>{' '}
              {t.of}{' '}
              <span className="font-medium text-slate-700">
                {filteredLogs.length}
              </span>{' '}
              {t.records}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={currentPage === 1}
                onClick={() =>
                  setCurrentPage((page) =>
                    Math.max(1, page - 1),
                  )
                }
                className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {t.previous}
              </button>

              {getVisiblePages().map((page) => (
                <button
                  key={page}
                  type="button"
                  onClick={() =>
                    setCurrentPage(page)
                  }
                  className={`h-9 min-w-9 rounded-lg px-3 text-sm font-medium ${
                    currentPage === page
                      ? 'bg-slate-900 text-white'
                      : 'border border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {page}
                </button>
              ))}

              <button
                type="button"
                disabled={
                  currentPage === totalPages
                }
                onClick={() =>
                  setCurrentPage((page) =>
                    Math.min(
                      totalPages,
                      page + 1,
                    ),
                  )
                }
                className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {t.next}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}