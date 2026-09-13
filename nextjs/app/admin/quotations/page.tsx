"use client";

import {
  useEffect,
  useMemo,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";
import {
  Download,
  Eye,
  Loader2,
  Pencil,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";

import AdminLoader from "@/components/admin/AdminLoader";
import { useLanguage } from "@/components/shared/LanguageProvider";
import {
  createQuotation,
  deleteQuotation,
  downloadQuotationPdf,
  getQuotation,
  getQuotations,
  updateQuotation,
  type CreateQuotationInput,
  type Quotation,
  type QuotationStatus,
  type UpdateQuotationInput,
} from "@/lib/api/quotations";
import { getLeads, type Lead } from "@/lib/api/leads";

const statuses: QuotationStatus[] = [
  "draft",
  "sent",
  "accepted",
  "rejected",
  "expired",
];

type FormItem = {
  description: string;
  descriptionAr: string;
  quantity: string;
  unitPrice: string;
};

type QuotationFormState = {
  leadId: string;
  customerName: string;
  customerNameAr: string;
  customerEmail: string;
  company: string;
  companyAr: string;
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  currency: string;
  discountRate: string;
  taxRate: string;
  validUntil: string;
  notes: string;
  notesAr: string;
  status: QuotationStatus;
  items: FormItem[];
};

function emptyForm(): QuotationFormState {
  return {
    leadId: "",
    customerName: "",
    customerNameAr: "",
    customerEmail: "",
    company: "",
    companyAr: "",
    title: "",
    titleAr: "",
    description: "",
    descriptionAr: "",
    currency: "SAR",
    discountRate: "0",
    taxRate: "15",
    validUntil: "",
    notes: "",
    notesAr: "",
    status: "draft",
    items: [
      {
        description: "",
        descriptionAr: "",
        quantity: "1",
        unitPrice: "",
      },
    ],
  };
}

export default function QuotationsPage() {
  const { isArabic } = useLanguage();

  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [viewLoading, setViewLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [createOpen, setCreateOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedQuotation, setSelectedQuotation] = useState<Quotation | null>(
    null,
  );
  const [deletingQuotation, setDeletingQuotation] =
    useState<Quotation | null>(null);
  const [createForm, setCreateForm] =
    useState<QuotationFormState>(emptyForm());
  const [editForm, setEditForm] =
    useState<QuotationFormState>(emptyForm());
  const [error, setError] = useState("");
  const [downloadingPdfKey, setDownloadingPdfKey] =
    useState<string | null>(null);

    const [updatingStatusId, setUpdatingStatusId] = useState<number | null>(null);

  const t = isArabic
    ? {
        management: "الإدارة",
        quotations: "عروض الأسعار",
        subtitle: "إنشاء وإدارة عروض الأسعار.",
        newQuotation: "عرض سعر جديد",
        search: "البحث في عروض الأسعار...",
        allStatuses: "جميع الحالات",
        quotation: "عرض السعر",
        client: "العميل",
        project: "المشروع",
        amount: "المبلغ",
        status: "الحالة",
        validUntil: "صالح حتى",
        action: "الإجراءات",
        noResults: "لم يتم العثور على عروض أسعار.",
        quotationCount: "عرض سعر",
        view: "عرض",
        edit: "تعديل",
        delete: "حذف",
        pdf: "تحميل PDF",
        createTitle: "عرض سعر جديد",
        createSubtitle: "أدخل بيانات عرض السعر باللغتين",
        editTitle: "تعديل عرض السعر",
        detailsTitle: "تفاصيل عرض السعر",
        cancel: "إلغاء",
        create: "إنشاء عرض السعر",
        creating: "جارٍ الإنشاء...",
        save: "حفظ التغييرات",
        saving: "جارٍ الحفظ...",
        deleteTitle: "حذف عرض السعر",
        deleteQuestion: "هل تريد حذف عرض السعر",
        deleting: "جارٍ الحذف...",
        loading: "جارٍ تحميل عروض الأسعار",
        loadingSub: "جارٍ جلب أحدث عروض الأسعار...",
        loadingDetails: "جارٍ تحميل عرض السعر",
        loadingDetailsSub: "جارٍ جلب تفاصيل عرض السعر...",
      }
    : {
        management: "Management",
        quotations: "Quotations",
        subtitle: "Create and manage quotations.",
        newQuotation: "New Quotation",
        search: "Search quotations...",
        allStatuses: "All statuses",
        quotation: "Quotation",
        client: "Client",
        project: "Project",
        amount: "Amount",
        status: "Status",
        validUntil: "Valid Until",
        action: "Action",
        noResults: "No quotations found.",
        quotationCount: "quotation",
        view: "View",
        edit: "Edit",
        delete: "Delete",
        pdf: "Download PDF",
        createTitle: "New quotation",
        createSubtitle: "Enter English and Arabic quotation data",
        editTitle: "Edit quotation",
        detailsTitle: "Quotation details",
        cancel: "Cancel",
        create: "Create Quotation",
        creating: "Creating...",
        save: "Save Changes",
        saving: "Saving...",
        deleteTitle: "Delete quotation",
        deleteQuestion: "Delete quotation",
        deleting: "Deleting...",
        loading: "Loading quotations",
        loadingSub: "Fetching latest quotations...",
        loadingDetails: "Loading quotation",
        loadingDetailsSub: "Fetching quotation details...",
      };

  useEffect(() => {
    async function loadData() {
      try {
        const [quotationData, leadData] = await Promise.all([
          getQuotations(),
          getLeads(),
        ]);

        setQuotations(quotationData);
        setLeads(leadData);
      } catch (error) {
        console.error(error);
        setError("Unable to load quotations.");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const filteredQuotations = useMemo(() => {
    const query = search.trim().toLowerCase();

    return quotations
      .filter((quotation) => {
        const customer = isArabic
          ? quotation.customerNameAr || ""
          : quotation.customerName;

        const company = isArabic
          ? quotation.companyAr || ""
          : quotation.company || "";

        const title = isArabic ? quotation.titleAr || "" : quotation.title;

        const matchesSearch =
          !query ||
          quotation.quotationNo.toLowerCase().includes(query) ||
          customer.toLowerCase().includes(query) ||
          company.toLowerCase().includes(query) ||
          title.toLowerCase().includes(query) ||
          quotation.customerEmail?.toLowerCase().includes(query);

        const matchesStatus =
          statusFilter === "all" || quotation.status === statusFilter;

        return matchesSearch && matchesStatus;
      })
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
  }, [quotations, search, statusFilter, isArabic]);

  function openCreate() {
    setCreateForm(emptyForm());
    setError("");
    setCreateOpen(true);
  }

  function handleCreateLeadChange(value: string) {
    const lead = leads.find((item) => item.id === Number(value));

    if (!lead) {
      setCreateForm((current) => ({ ...current, leadId: "" }));
      return;
    }

    setCreateForm((current) => ({
      ...current,
      leadId: String(lead.id),
      customerName: lead.name,
      customerEmail: lead.email,
      company: lead.company || "",
      title: current.title || lead.service || "",
      description: current.description || lead.message || "",
    }));
  }

  async function handleCreate() {
    setError("");

    if (!createForm.customerName.trim()) {
      setError(
        isArabic
          ? "اسم العميل باللغة الإنجليزية مطلوب."
          : "Customer name is required.",
      );
      return;
    }

    if (!createForm.title.trim()) {
      setError(
        isArabic
          ? "عنوان عرض السعر باللغة الإنجليزية مطلوب."
          : "Quotation title is required.",
      );
      return;
    }

    const invalidItem = createForm.items.some(
      (item) =>
        !item.description.trim() ||
        Number(item.quantity) <= 0 ||
        Number(item.unitPrice) < 0 ||
        item.unitPrice === "",
    );

    if (invalidItem) {
      setError(
        isArabic
          ? "يرجى إكمال جميع عناصر عرض السعر بشكل صحيح."
          : "Please complete all quotation items correctly.",
      );
      return;
    }

    setSaving(true);

    try {
      const payload: CreateQuotationInput = {
        customerName: createForm.customerName.trim(),
        customerNameAr: createForm.customerNameAr.trim() || undefined,
        customerEmail: createForm.customerEmail.trim() || undefined,
        company: createForm.company.trim() || undefined,
        companyAr: createForm.companyAr.trim() || undefined,
        title: createForm.title.trim(),
        titleAr: createForm.titleAr.trim() || undefined,
        description: createForm.description.trim() || undefined,
        descriptionAr: createForm.descriptionAr.trim() || undefined,
        currency: createForm.currency,
        discountRate: Number(createForm.discountRate) || 0,
        taxRate: Number(createForm.taxRate) || 0,
        validUntil: dateToIso(createForm.validUntil),
        notes: createForm.notes.trim() || undefined,
        notesAr: createForm.notesAr.trim() || undefined,
        items: createForm.items.map((item) => ({
          description: item.description.trim(),
          descriptionAr: item.descriptionAr.trim() || undefined,
          quantity: Number(item.quantity),
          unitPrice: Number(item.unitPrice),
        })),
      };

      if (createForm.leadId) {
        payload.leadId = Number(createForm.leadId);
      }

      const newQuotation = await createQuotation(payload);

      setQuotations((current) => [newQuotation, ...current]);
      setCreateOpen(false);
      setCreateForm(emptyForm());
    } catch (error) {
      console.error(error);
      setError(
        error instanceof Error
          ? error.message
          : isArabic
            ? "تعذر إنشاء عرض السعر."
            : "Unable to create quotation.",
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleView(id: number) {
    setSelectedQuotation(null);
    setViewLoading(true);
    setViewOpen(true);
    setError("");

    try {
      setSelectedQuotation(await getQuotation(id));
    } catch (error) {
      console.error(error);
      setError(
        isArabic ? "تعذر تحميل عرض السعر." : "Unable to load quotation.",
      );
      setViewOpen(false);
    } finally {
      setViewLoading(false);
    }
  }

  async function handleEdit(id: number) {
    setSaving(false);
    setError("");

    try {
      const quotation = await getQuotation(id);

      setSelectedQuotation(quotation);

      setEditForm({
        leadId: quotation.leadId ? String(quotation.leadId) : "",
        customerName: quotation.customerName,
        customerNameAr: quotation.customerNameAr || "",
        customerEmail: quotation.customerEmail || "",
        company: quotation.company || "",
        companyAr: quotation.companyAr || "",
        title: quotation.title,
        titleAr: quotation.titleAr || "",
        description: quotation.description || "",
        descriptionAr: quotation.descriptionAr || "",
        currency: quotation.currency || "SAR",
        discountRate: String(quotation.discountRate ?? 0),
        taxRate: String(quotation.taxRate ?? 0),
        validUntil: dateInputValue(quotation.validUntil),
        notes: quotation.notes || "",
        notesAr: quotation.notesAr || "",
        status: quotation.status,
        items: quotation.items?.length
          ? quotation.items.map((item) => ({
              description: item.description,
              descriptionAr: item.descriptionAr || "",
              quantity: String(item.quantity),
              unitPrice: String(item.unitPrice),
            }))
          : [
              {
                description: "",
                descriptionAr: "",
                quantity: "1",
                unitPrice: "",
              },
            ],
      });

      setEditOpen(true);
    } catch (error) {
      console.error(error);
      setError(
        isArabic ? "تعذر تحميل عرض السعر." : "Unable to load quotation.",
      );
    }
  }

  function handleEditLeadChange(value: string) {
    const lead = leads.find((item) => item.id === Number(value));

    if (!lead) {
      setEditForm((current) => ({ ...current, leadId: "" }));
      return;
    }

    setEditForm((current) => ({
      ...current,
      leadId: String(lead.id),
      customerName: lead.name,
      customerEmail: lead.email,
      company: lead.company || "",
    }));
  }

  async function handleUpdate() {
    if (!selectedQuotation) return;

    setError("");

    if (!editForm.customerName.trim()) {
      setError(
        isArabic
          ? "اسم العميل باللغة الإنجليزية مطلوب."
          : "Customer name is required.",
      );
      return;
    }

    if (!editForm.title.trim()) {
      setError(
        isArabic
          ? "عنوان عرض السعر باللغة الإنجليزية مطلوب."
          : "Quotation title is required.",
      );
      return;
    }

    const invalidItem = editForm.items.some(
      (item) =>
        !item.description.trim() ||
        Number(item.quantity) <= 0 ||
        Number(item.unitPrice) < 0 ||
        item.unitPrice === "",
    );

    if (invalidItem) {
      setError(
        isArabic
          ? "يرجى إكمال جميع عناصر عرض السعر بشكل صحيح."
          : "Please complete all quotation items correctly.",
      );
      return;
    }

    setSaving(true);

    try {
      const payload: UpdateQuotationInput = {
        customerName: editForm.customerName.trim(),
        customerNameAr: editForm.customerNameAr.trim(),
        customerEmail: editForm.customerEmail.trim(),
        company: editForm.company.trim(),
        companyAr: editForm.companyAr.trim(),
        title: editForm.title.trim(),
        titleAr: editForm.titleAr.trim(),
        description: editForm.description.trim(),
        descriptionAr: editForm.descriptionAr.trim(),
        currency: editForm.currency,
        discountRate: Number(editForm.discountRate) || 0,
        taxRate: Number(editForm.taxRate) || 0,
        status: editForm.status,
        notes: editForm.notes.trim(),
        notesAr: editForm.notesAr.trim(),
        items: editForm.items.map((item) => ({
          description: item.description.trim(),
          descriptionAr: item.descriptionAr.trim(),
          quantity: Number(item.quantity),
          unitPrice: Number(item.unitPrice),
        })),
      };

      if (editForm.leadId) {
        payload.leadId = Number(editForm.leadId);
      }

      const validUntil = dateToIso(editForm.validUntil);

      if (validUntil) {
        payload.validUntil = validUntil;
      }

      const updated = await updateQuotation(selectedQuotation.id, payload);

      setQuotations((current) =>
        current.map((quotation) =>
          quotation.id === updated.id ? updated : quotation,
        ),
      );

      setSelectedQuotation(updated);
      setEditOpen(false);
    } catch (error) {
      console.error(error);
      setError(
        error instanceof Error
          ? error.message
          : isArabic
            ? "تعذر تحديث عرض السعر."
            : "Unable to update quotation.",
      );
    } finally {
      setSaving(false);
    }
  }

// Update quotation status with loading feedback
async function handleStatus(
  quotation: Quotation,
  status: QuotationStatus,
) {
  setUpdatingStatusId(quotation.id);
  setError("");

  try {
    const updated = await updateQuotation(quotation.id, { status });

    setQuotations((current) =>
      current.map((item) =>
        item.id === quotation.id ? updated : item,
      ),
    );

    if (selectedQuotation?.id === quotation.id) {
      setSelectedQuotation(updated);
    }
  } catch (error) {
    console.error(error);
    setError(
      isArabic
        ? "تعذر تحديث حالة عرض السعر."
        : "Unable to update quotation status.",
    );
  } finally {
    setUpdatingStatusId(null);
  }
}

  function openDelete(quotation: Quotation) {
    setDeletingQuotation(quotation);
    setDeleteOpen(true);
    setError("");
  }

  async function handleDelete() {
    if (!deletingQuotation) return;

    setDeleting(true);
    setError("");

    try {
      await deleteQuotation(deletingQuotation.id);

      setQuotations((current) =>
        current.filter(
          (quotation) => quotation.id !== deletingQuotation.id,
        ),
      );

      setDeleteOpen(false);
      setDeletingQuotation(null);
    } catch (error) {
      console.error(error);
      setError(
        error instanceof Error
          ? error.message
          : isArabic
            ? "تعذر حذف عرض السعر."
            : "Unable to delete quotation.",
      );
    } finally {
      setDeleting(false);
    }
  }

  async function handleDownloadPdf(quotation: Quotation) {
    setError("");

    const lang = isArabic ? "ar" : "en";
    const key = `${quotation.id}-${lang}`;

    setDownloadingPdfKey(key);

    try {
      await downloadQuotationPdf(
        quotation.id,
        quotation.quotationNo,
        lang,
      );
    } catch (error) {
      console.error(error);
      setError(
        isArabic
          ? "تعذر تحميل ملف PDF."
          : "Unable to download quotation PDF.",
      );
    } finally {
      setDownloadingPdfKey(null);
    }
  }

  if (loading) {
    return <AdminLoader text={t.loading} subtext={t.loadingSub} />;
  }

  return (
    <div dir={isArabic ? "rtl" : "ltr"}>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <span className="text-[10px] font-black uppercase tracking-[.14em] text-teal-deep">
            {t.management}
          </span>

          <h1 className="mt-1 font-display text-4xl font-semibold text-ink">
            {t.quotations}
          </h1>

          <p className="mt-1 text-sm text-slate-500">{t.subtitle}</p>
        </div>

        <button
          onClick={openCreate}
          className="inline-flex h-[44px] items-center justify-center gap-2 rounded-xl bg-ink px-5 text-xs font-black text-white transition hover:opacity-90"
        >
          <Plus size={16} />
          {t.newQuotation}
        </button>
      </div>

      {error && !createOpen && !editOpen && !deleteOpen && (
        <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-bold text-rose-600">
          {error}
        </div>
      )}

      <div className="mb-4 grid gap-3 md:grid-cols-[1fr_200px]">
        <div className="relative">
          <Search
            size={16}
            className={`absolute top-1/2 -translate-y-1/2 text-slate-400 ${
              isArabic ? "right-3" : "left-3"
            }`}
          />

          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder={t.search}
            className={`h-[44px] w-full rounded-xl border border-slate-200 bg-white text-sm outline-none focus:border-teal-deep ${
              isArabic ? "pl-4 pr-10 text-right" : "pl-10 pr-4"
            }`}
          />
        </div>

        <select
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
          className="h-[44px] rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-teal-deep"
        >
          <option value="all">{t.allStatuses}</option>

          {statuses.map((status) => (
            <option key={status} value={status}>
              {formatStatus(status, isArabic)}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-3 text-xs font-bold text-slate-400">
        {filteredQuotations.length} {t.quotationCount}
      </div>

      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                {[
                  t.quotation,
                  t.client,
                  t.project,
                  t.amount,
                  t.status,
                  t.validUntil,
                  t.action,
                ].map((item) => (
                  <th
                    key={item}
                    className={`whitespace-nowrap border-b border-slate-200 px-4 py-3 text-[10px] font-black uppercase tracking-[.08em] text-slate-400 ${
                      isArabic ? "text-right" : "text-left"
                    }`}
                  >
                    {item}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {filteredQuotations.map((quotation) => {
                const customer = isArabic
                  ? quotation.customerNameAr || "—"
                  : quotation.customerName;

                const company = isArabic
                  ? quotation.companyAr || "—"
                  : quotation.company || "—";

                const project = isArabic
                  ? quotation.titleAr || "—"
                  : quotation.title;

                const hasDiscount = quotation.discountRate > 0;
                const originalTotal = calculateOriginalTotal(quotation);

                return (
                  <tr key={quotation.id}>
                    <td className="border-b border-slate-100 px-4 py-4">
                      <strong className="block text-sm text-ink">
                        {quotation.quotationNo}
                      </strong>

                      <span className="text-[10px] text-slate-400">
                        {formatDate(quotation.createdAt, isArabic)}
                      </span>
                    </td>

                    <td className="border-b border-slate-100 px-4 py-4">
                      <strong className="block text-sm text-ink">
                        {customer}
                      </strong>

                      <span className="mt-1 block text-[10px] text-slate-400">
                        {company}
                      </span>
                    </td>

                    <td className="border-b border-slate-100 px-4 py-4 text-sm text-slate-600">
                      {project}
                    </td>

                    <td className="whitespace-nowrap border-b border-slate-100 px-4 py-4">
                      {hasDiscount && (
                        <span
                          dir="ltr"
                          className="block text-xs text-slate-400 line-through"
                        >
                          {formatMoney(originalTotal, quotation.currency)}
                        </span>
                      )}

                      <strong dir="ltr" className="block text-sm text-ink">
                        {formatMoney(
                          quotation.totalAmount,
                          quotation.currency,
                        )}
                      </strong>

                      {hasDiscount && (
                        <span className="mt-1 block text-[10px] font-bold text-emerald-600">
                          {isArabic
                            ? `خصم ${quotation.discountRate}%`
                            : `${quotation.discountRate}% discount`}
                        </span>
                      )}
                    </td>

                      <td className="border-b border-slate-100 px-4 py-4">
                      <div className="flex items-center gap-2">
                        <select
                          value={quotation.status}
                          disabled={updatingStatusId !== null}
                          onChange={(event) =>
                            handleStatus(
                              quotation,
                              event.target.value as QuotationStatus,
                            )
                          }
                          className={`rounded-xl border px-3 py-2 text-xs font-bold outline-none disabled:cursor-wait disabled:opacity-60 ${statusClass(
                            quotation.status,
                          )}`}
                        >
                          {statuses.map((status) => (
                            <option key={status} value={status}>
                              {formatStatus(status, isArabic)}
                            </option>
                          ))}
                        </select>

                        {updatingStatusId === quotation.id && (
                          <span className="inline-flex items-center gap-1.5 whitespace-nowrap text-[10px] font-bold text-teal-deep">
                            <Loader2 size={14} className="animate-spin" />
                            {isArabic ? "جارٍ التحديث..." : "Updating..."}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="whitespace-nowrap border-b border-slate-100 px-4 py-4 text-sm text-slate-600">
                      {quotation.validUntil
                        ? formatDate(quotation.validUntil, isArabic)
                        : "—"}
                    </td>

                    <td className="border-b border-slate-100 px-4 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleDownloadPdf(quotation)}
                          disabled={
                            downloadingPdfKey ===
                            `${quotation.id}-${isArabic ? "ar" : "en"}`
                          }
                          className="inline-flex h-9 items-center gap-1 rounded-lg border border-emerald-200 px-2 text-[10px] font-black text-emerald-700 hover:bg-emerald-50 disabled:opacity-60"
                          title={t.pdf}
                        >
                          {downloadingPdfKey ===
                          `${quotation.id}-${isArabic ? "ar" : "en"}` ? (
                            <Loader2 size={14} className="animate-spin" />
                          ) : (
                            <Download size={14} />
                          )}

                          {isArabic ? "AR" : "EN"}
                        </button>

                        <button
                          onClick={() => handleView(quotation.id)}
                          className="grid h-9 w-9 place-items-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50"
                          title={t.view}
                        >
                          <Eye size={15} />
                        </button>

                        <button
                          onClick={() => handleEdit(quotation.id)}
                          className="grid h-9 w-9 place-items-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50"
                          title={t.edit}
                        >
                          <Pencil size={15} />
                        </button>

                        <button
                          onClick={() => openDelete(quotation)}
                          className="grid h-9 w-9 place-items-center rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50"
                          title={t.delete}
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filteredQuotations.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="p-12 text-center text-sm text-slate-400"
                  >
                    {t.noResults}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {createOpen && (
        <Modal
          title={t.createTitle}
          subtitle={t.createSubtitle}
          onClose={() => {
            setCreateOpen(false);
            setError("");
          }}
        >
          <QuotationForm
            form={createForm}
            setForm={setCreateForm}
            leads={leads}
            onLeadChange={handleCreateLeadChange}
            showStatus={false}
            isArabic={isArabic}
          />

          {error && <ErrorBox message={error} />}

          <ModalActions
            cancelLabel={t.cancel}
            saveLabel={t.create}
            savingLabel={t.creating}
            saving={saving}
            onCancel={() => {
              setCreateOpen(false);
              setError("");
            }}
            onSave={handleCreate}
          />
        </Modal>
      )}

      {viewOpen && (
        <Modal
          title={t.detailsTitle}
          subtitle={selectedQuotation?.quotationNo}
          onClose={() => {
            setViewOpen(false);
            setSelectedQuotation(null);
          }}
        >
          {viewLoading ? (
            <AdminLoader
              text={t.loadingDetails}
              subtext={t.loadingDetailsSub}
            />
          ) : (
            selectedQuotation && (
              <QuotationDetails
                quotation={selectedQuotation}
                isArabic={isArabic}
              />
            )
          )}
        </Modal>
      )}

      {editOpen && selectedQuotation && (
        <Modal
          title={t.editTitle}
          subtitle={selectedQuotation.quotationNo}
          onClose={() => {
            setEditOpen(false);
            setError("");
          }}
        >
          <QuotationForm
            form={editForm}
            setForm={setEditForm}
            leads={leads}
            onLeadChange={handleEditLeadChange}
            showStatus
            isArabic={isArabic}
          />

          {error && <ErrorBox message={error} />}

          <ModalActions
            cancelLabel={t.cancel}
            saveLabel={t.save}
            savingLabel={t.saving}
            saving={saving}
            onCancel={() => {
              setEditOpen(false);
              setError("");
            }}
            onSave={handleUpdate}
          />
        </Modal>
      )}

      {deleteOpen && deletingQuotation && (
        <div className="fixed inset-0 z-[120] grid place-items-center bg-black/50 p-4">
          <div className="w-full max-w-[460px] rounded-3xl bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="font-display text-2xl font-semibold text-ink">
                  {t.deleteTitle}
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  {t.deleteQuestion}{" "}
                  <strong className="text-ink">
                    {deletingQuotation.quotationNo}
                  </strong>
                  ?
                </p>
              </div>

              <button
                onClick={() => {
                  setDeleteOpen(false);
                  setDeletingQuotation(null);
                  setError("");
                }}
                className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-slate-100 text-slate-500"
              >
                <X size={17} />
              </button>
            </div>

            {error && <ErrorBox message={error} />}

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => {
                  setDeleteOpen(false);
                  setDeletingQuotation(null);
                  setError("");
                }}
                className="rounded-xl border border-slate-200 px-5 py-3 text-xs font-black text-slate-600"
              >
                {t.cancel}
              </button>

              <button
                onClick={handleDelete}
                disabled={deleting}
                className="rounded-xl bg-rose-600 px-5 py-3 text-xs font-black text-white disabled:opacity-60"
              >
                {deleting ? t.deleting : t.delete}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function QuotationForm({
  form,
  setForm,
  leads,
  onLeadChange,
  showStatus,
  isArabic,
}: {
  form: QuotationFormState;
  setForm: Dispatch<SetStateAction<QuotationFormState>>;
  leads: Lead[];
  onLeadChange: (value: string) => void;
  showStatus: boolean;
  isArabic: boolean;
}) {
  const subtotal = form.items.reduce(
    (total, item) =>
      total +
      (Number(item.quantity) || 0) * (Number(item.unitPrice) || 0),
    0,
  );

  const discountRate = Number(form.discountRate) || 0;
  const discountAmount = subtotal * (discountRate / 100);
  const taxableAmount = subtotal - discountAmount;

  const vatRate = Number(form.taxRate) || 0;
  const vatAmount = taxableAmount * (vatRate / 100);
  const grandTotal = taxableAmount + vatAmount;

  const originalTotal = subtotal + subtotal * (vatRate / 100);

  function updateItem(
    index: number,
    field: keyof FormItem,
    value: string,
  ) {
    setForm((current) => ({
      ...current,
      items: current.items.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [field]: value } : item,
      ),
    }));
  }

  function addItem() {
    setForm((current) => ({
      ...current,
      items: [
        ...current.items,
        {
          description: "",
          descriptionAr: "",
          quantity: "1",
          unitPrice: "",
        },
      ],
    }));
  }

  function removeItem(index: number) {
    setForm((current) => {
      if (current.items.length === 1) return current;

      return {
        ...current,
        items: current.items.filter(
          (_, itemIndex) => itemIndex !== index,
        ),
      };
    });
  }

  return (
    <div className="mt-6 space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label={isArabic ? "العميل المحتمل" : "Source Lead"}>
          <select
            value={form.leadId}
            onChange={(event) => onLeadChange(event.target.value)}
            className={inputClass}
          >
            <option value="">
              {isArabic ? "بدون عميل محتمل" : "No linked lead"}
            </option>

            {leads.map((lead) => (
              <option key={lead.id} value={lead.id}>
                {lead.name}
                {lead.company ? ` — ${lead.company}` : ""}
              </option>
            ))}
          </select>
        </Field>

        {showStatus && (
          <Field label={isArabic ? "الحالة" : "Status"}>
            <select
              value={form.status}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  status: event.target.value as QuotationStatus,
                }))
              }
              className={inputClass}
            >
              {statuses.map((status) => (
                <option key={status} value={status}>
                  {formatStatus(status, isArabic)}
                </option>
              ))}
            </select>
          </Field>
        )}

        <Field label="Customer Name (English) *">
          <input
            value={form.customerName}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                customerName: event.target.value,
              }))
            }
            className={inputClass}
            placeholder="Customer name"
          />
        </Field>

        <Field label="اسم العميل (العربية)">
          <input
            dir="rtl"
            value={form.customerNameAr}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                customerNameAr: event.target.value,
              }))
            }
            className={`${inputClass} text-right`}
            placeholder="اسم العميل"
          />
        </Field>

        <Field
          label={isArabic ? "البريد الإلكتروني" : "Customer Email"}
        >
          <input
            type="email"
            value={form.customerEmail}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                customerEmail: event.target.value,
              }))
            }
            className={inputClass}
            placeholder="customer@example.com"
          />
        </Field>

        <Field label={isArabic ? "العملة" : "Currency"}>
          <select
            value={form.currency}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                currency: event.target.value,
              }))
            }
            className={inputClass}
          >
            <option value="SAR">SAR — ر.س</option>
            <option value="USD">USD — $</option>
            <option value="AED">AED — د.إ</option>
          </select>
        </Field>

        <Field label="Company (English)">
          <input
            value={form.company}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                company: event.target.value,
              }))
            }
            className={inputClass}
            placeholder="Company name"
          />
        </Field>

        <Field label="اسم الشركة (العربية)">
          <input
            dir="rtl"
            value={form.companyAr}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                companyAr: event.target.value,
              }))
            }
            className={`${inputClass} text-right`}
            placeholder="اسم الشركة"
          />
        </Field>

        <Field label="Quotation Title (English) *">
          <input
            value={form.title}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                title: event.target.value,
              }))
            }
            className={inputClass}
            placeholder="Website Development"
          />
        </Field>

        <Field label="عنوان العرض (العربية)">
          <input
            dir="rtl"
            value={form.titleAr}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                titleAr: event.target.value,
              }))
            }
            className={`${inputClass} text-right`}
            placeholder="تطوير الموقع الإلكتروني"
          />
        </Field>

        <Field label={isArabic ? "الخصم (%)" : "Discount (%)"}>
          <input
            type="number"
            min="0"
            max="100"
            step="0.01"
            value={form.discountRate}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                discountRate: event.target.value,
              }))
            }
            className={inputClass}
            placeholder="0"
          />
        </Field>

        <Field
          label={
            isArabic ? "ضريبة القيمة المضافة (%)" : "VAT (%)"
          }
        >
          <input
            type="number"
            min="0"
            step="0.01"
            value={form.taxRate}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                taxRate: event.target.value,
              }))
            }
            className={inputClass}
            placeholder="15"
          />
        </Field>

        <Field label={isArabic ? "صالح حتى" : "Valid Until"}>
          <input
            type="date"
            value={form.validUntil}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                validUntil: event.target.value,
              }))
            }
            className={inputClass}
          />
        </Field>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Description (English)">
          <textarea
            value={form.description}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                description: event.target.value,
              }))
            }
            rows={4}
            className={`${inputClass} min-h-[110px] py-3`}
            placeholder="Quotation description..."
          />
        </Field>

        <Field label="الوصف (العربية)">
          <textarea
            dir="rtl"
            value={form.descriptionAr}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                descriptionAr: event.target.value,
              }))
            }
            rows={4}
            className={`${inputClass} min-h-[110px] py-3 text-right`}
            placeholder="وصف عرض السعر..."
          />
        </Field>
      </div>

      <div>
        <div className="mb-3 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-black text-ink">
              {isArabic ? "عناصر عرض السعر" : "Quotation Items"}
            </h3>

            <p className="mt-1 text-xs text-slate-400">
              {isArabic
                ? "أضف وصف الخدمة باللغة الإنجليزية والعربية."
                : "Add English and Arabic service descriptions."}
            </p>
          </div>

          <button
            type="button"
            onClick={addItem}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-xs font-black text-slate-600 hover:bg-slate-50"
          >
            <Plus size={14} />
            {isArabic ? "إضافة عنصر" : "Add Item"}
          </button>
        </div>

        <div className="space-y-3">
          {form.items.map((item, index) => {
            const amount =
              (Number(item.quantity) || 0) *
              (Number(item.unitPrice) || 0);

            return (
              <div
                key={index}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
              >
                <div className="grid gap-3 md:grid-cols-2">
                  <input
                    value={item.description}
                    onChange={(event) =>
                      updateItem(
                        index,
                        "description",
                        event.target.value,
                      )
                    }
                    className={inputClass}
                    placeholder="Item / service in English"
                  />

                  <input
                    dir="rtl"
                    value={item.descriptionAr}
                    onChange={(event) =>
                      updateItem(
                        index,
                        "descriptionAr",
                        event.target.value,
                      )
                    }
                    className={`${inputClass} text-right`}
                    placeholder="الخدمة باللغة العربية"
                  />
                </div>

                <div className="mt-3 grid gap-3 md:grid-cols-[110px_150px_1fr_40px]">
                  <input
                    type="number"
                    min="0.01"
                    step="0.01"
                    value={item.quantity}
                    onChange={(event) =>
                      updateItem(index, "quantity", event.target.value)
                    }
                    className={inputClass}
                    placeholder={isArabic ? "الكمية" : "Qty"}
                  />

                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={item.unitPrice}
                    onChange={(event) =>
                      updateItem(index, "unitPrice", event.target.value)
                    }
                    className={inputClass}
                    placeholder={isArabic ? "سعر الوحدة" : "Unit price"}
                  />

                  <div
                    dir="ltr"
                    className="flex h-[44px] items-center rounded-xl border border-slate-200 bg-white px-3 text-sm font-bold text-ink"
                  >
                    {formatMoney(amount, form.currency)}
                  </div>

                  <button
                    type="button"
                    onClick={() => removeItem(index)}
                    disabled={form.items.length === 1}
                    className="grid h-[44px] w-[40px] place-items-center rounded-xl text-rose-500 hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="ms-auto w-full max-w-[380px] rounded-2xl border border-slate-200 bg-slate-50 p-5">
        <SummaryRow
          label={isArabic ? "المجموع الفرعي" : "Subtotal"}
          value={formatMoney(subtotal, form.currency)}
        />

        {discountRate > 0 && (
          <SummaryRow
            label={
              isArabic
                ? `الخصم (${discountRate}%)`
                : `Discount (${discountRate}%)`
            }
            value={`- ${formatMoney(discountAmount, form.currency)}`}
          />
        )}

        <SummaryRow
          label={
            isArabic
              ? `ضريبة القيمة المضافة (${vatRate}%)`
              : `VAT (${vatRate}%)`
          }
          value={formatMoney(vatAmount, form.currency)}
        />

        <div className="my-3 border-t border-slate-200" />

        {discountRate > 0 && (
          <div className="flex items-center justify-between gap-4 py-1">
            <span className="text-xs text-slate-400">
              {isArabic ? "السعر الأصلي" : "Original Price"}
            </span>

            <span
              dir="ltr"
              className="text-sm font-bold text-slate-400 line-through"
            >
              {formatMoney(originalTotal, form.currency)}
            </span>
          </div>
        )}

        <SummaryRow
          label={isArabic ? "الإجمالي النهائي" : "Grand Total"}
          value={formatMoney(grandTotal, form.currency)}
          strong
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Notes (English)">
          <textarea
            value={form.notes}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                notes: event.target.value,
              }))
            }
            rows={3}
            className={`${inputClass} min-h-[90px] py-3`}
            placeholder="Payment terms or additional notes..."
          />
        </Field>

        <Field label="ملاحظات (العربية)">
          <textarea
            dir="rtl"
            value={form.notesAr}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                notesAr: event.target.value,
              }))
            }
            rows={3}
            className={`${inputClass} min-h-[90px] py-3 text-right`}
            placeholder="شروط الدفع أو ملاحظات إضافية..."
          />
        </Field>
      </div>
    </div>
  );
}

function QuotationDetails({
  quotation,
  isArabic,
}: {
  quotation: Quotation;
  isArabic: boolean;
}) {
  const customer = isArabic
    ? quotation.customerNameAr || "—"
    : quotation.customerName;

  const company = isArabic
    ? quotation.companyAr || "—"
    : quotation.company || "—";

  const title = isArabic ? quotation.titleAr || "—" : quotation.title;

  const description = isArabic
    ? quotation.descriptionAr
    : quotation.description;

  const notes = isArabic ? quotation.notesAr : quotation.notes;
  const hasDiscount = quotation.discountRate > 0;
  const originalTotal = calculateOriginalTotal(quotation);

  return (
    <div className="mt-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <Detail
          label={isArabic ? "رقم عرض السعر" : "Quotation No."}
          value={quotation.quotationNo}
          rtl={isArabic}
        />

        <Detail
          label={isArabic ? "الحالة" : "Status"}
          value={formatStatus(quotation.status, isArabic)}
          rtl={isArabic}
        />

        <Detail
          label={isArabic ? "العميل" : "Customer"}
          value={customer}
          rtl={isArabic}
        />

        <Detail
          label={isArabic ? "البريد الإلكتروني" : "Email"}
          value={quotation.customerEmail}
          rtl={isArabic}
        />

        <Detail
          label={isArabic ? "الشركة" : "Company"}
          value={company}
          rtl={isArabic}
        />

        <Detail
          label={isArabic ? "العنوان" : "Title"}
          value={title}
          rtl={isArabic}
        />

        <Detail
          label={isArabic ? "تاريخ الإنشاء" : "Created"}
          value={formatDate(quotation.createdAt, isArabic)}
          rtl={isArabic}
        />

        <Detail
          label={isArabic ? "صالح حتى" : "Valid Until"}
          value={
            quotation.validUntil
              ? formatDate(quotation.validUntil, isArabic)
              : "—"
          }
          rtl={isArabic}
        />
      </div>

      {description && (
        <div className="mt-5">
          <TextBlock
            label={isArabic ? "الوصف" : "Description"}
            value={description}
            rtl={isArabic}
          />
        </div>
      )}

      <div className="mt-6">
        <h3 className="mb-3 text-sm font-black text-ink">
          {isArabic ? "العناصر" : "Items"}
        </h3>

        <div className="overflow-hidden rounded-2xl border border-slate-200">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  {[
                    isArabic ? "الوصف" : "Description",
                    isArabic ? "الكمية" : "Qty",
                    isArabic ? "سعر الوحدة" : "Unit Price",
                    isArabic ? "المبلغ" : "Amount",
                  ].map((item) => (
                    <th
                      key={item}
                      className={`border-b border-slate-200 bg-slate-50 px-4 py-3 text-[10px] font-black uppercase text-slate-400 ${
                        isArabic ? "text-right" : "text-left"
                      }`}
                    >
                      {item}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {quotation.items?.map((item) => (
                  <tr key={item.id}>
                    <td className="border-b border-slate-100 px-4 py-3 text-sm text-slate-600">
                      {isArabic
                        ? item.descriptionAr || "—"
                        : item.description}
                    </td>

                    <td className="border-b border-slate-100 px-4 py-3 text-sm text-slate-600">
                      {item.quantity}
                    </td>

                    <td
                      dir="ltr"
                      className="border-b border-slate-100 px-4 py-3 text-sm text-slate-600"
                    >
                      {formatMoney(
                        item.unitPrice,
                        quotation.currency,
                      )}
                    </td>

                    <td
                      dir="ltr"
                      className="border-b border-slate-100 px-4 py-3 text-sm font-bold text-ink"
                    >
                      {formatMoney(item.amount, quotation.currency)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="mt-5 ms-auto w-full max-w-[380px] rounded-2xl border border-slate-200 bg-slate-50 p-5">
        <SummaryRow
          label={isArabic ? "المجموع الفرعي" : "Subtotal"}
          value={formatMoney(
            quotation.subtotal,
            quotation.currency,
          )}
        />

        {hasDiscount && (
          <SummaryRow
            label={
              isArabic
                ? `الخصم (${quotation.discountRate}%)`
                : `Discount (${quotation.discountRate}%)`
            }
            value={`- ${formatMoney(
              quotation.discountAmount,
              quotation.currency,
            )}`}
          />
        )}

        <SummaryRow
          label={
            isArabic
              ? `ضريبة القيمة المضافة (${quotation.taxRate}%)`
              : `VAT (${quotation.taxRate}%)`
          }
          value={formatMoney(
            quotation.taxAmount,
            quotation.currency,
          )}
        />

        <div className="my-3 border-t border-slate-200" />

        {hasDiscount && (
          <div className="flex items-center justify-between gap-4 py-1">
            <span className="text-xs text-slate-400">
              {isArabic ? "السعر الأصلي" : "Original Price"}
            </span>

            <span
              dir="ltr"
              className="text-sm font-bold text-slate-400 line-through"
            >
              {formatMoney(originalTotal, quotation.currency)}
            </span>
          </div>
        )}

        <SummaryRow
          label={isArabic ? "الإجمالي النهائي" : "Grand Total"}
          value={formatMoney(
            quotation.totalAmount,
            quotation.currency,
          )}
          strong
        />
      </div>

      {notes && (
        <div className="mt-5">
          <TextBlock
            label={isArabic ? "ملاحظات" : "Notes"}
            value={notes}
            rtl={isArabic}
          />
        </div>
      )}
    </div>
  );
}

function Modal({
  title,
  subtitle,
  onClose,
  children,
}: {
  title: string;
  subtitle?: string;
  onClose: () => void;
  children: ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-[110] overflow-y-auto bg-black/50 p-4">
      <div className="mx-auto my-8 w-full max-w-[980px] rounded-3xl bg-white p-7 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="font-display text-2xl font-semibold text-ink">
              {title}
            </h2>

            {subtitle && (
              <p className="mt-1 text-sm text-slate-400">{subtitle}</p>
            )}
          </div>

          <button
            onClick={onClose}
            className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-slate-100 text-slate-500 hover:bg-slate-200"
          >
            <X size={17} />
          </button>
        </div>

        {children}
      </div>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="block text-xs font-bold text-slate-600">
      {label}
      <div className="mt-2">{children}</div>
    </label>
  );
}

function Detail({
  label,
  value,
  rtl = false,
}: {
  label: string;
  value?: string | null;
  rtl?: boolean;
}) {
  return (
    <div>
      <span className="text-xs font-bold text-slate-600">{label}</span>

      <div
        dir={rtl ? "rtl" : "ltr"}
        className={`mt-2 min-h-[44px] rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600 ${
          rtl ? "text-right" : ""
        }`}
      >
        {value || "—"}
      </div>
    </div>
  );
}

function TextBlock({
  label,
  value,
  rtl = false,
}: {
  label: string;
  value?: string | null;
  rtl?: boolean;
}) {
  return (
    <div>
      <span className="text-xs font-bold text-slate-600">{label}</span>

      <div
        dir={rtl ? "rtl" : "ltr"}
        className={`mt-2 min-h-[100px] whitespace-pre-wrap rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-600 ${
          rtl ? "text-right" : ""
        }`}
      >
        {value || "—"}
      </div>
    </div>
  );
}

function SummaryRow({
  label,
  value,
  strong = false,
}: {
  label: string;
  value: string;
  strong?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-1.5">
      <span
        className={
          strong
            ? "text-sm font-black text-ink"
            : "text-sm text-slate-500"
        }
      >
        {label}
      </span>

      <span
        dir="ltr"
        className={
          strong
            ? "text-base font-black text-ink"
            : "text-sm font-bold text-slate-700"
        }
      >
        {value}
      </span>
    </div>
  );
}

function ModalActions({
  cancelLabel,
  saveLabel,
  savingLabel,
  saving,
  onCancel,
  onSave,
}: {
  cancelLabel: string;
  saveLabel: string;
  savingLabel: string;
  saving: boolean;
  onCancel: () => void;
  onSave: () => void;
}) {
  return (
    <div className="mt-7 flex justify-end gap-3 border-t border-slate-100 pt-5">
      <button
        onClick={onCancel}
        disabled={saving}
        className="rounded-xl border border-slate-200 px-5 py-3 text-xs font-black text-slate-600 disabled:opacity-50"
      >
        {cancelLabel}
      </button>

      <button
        onClick={onSave}
        disabled={saving}
        className="rounded-xl bg-ink px-5 py-3 text-xs font-black text-white disabled:opacity-60"
      >
        {saving ? savingLabel : saveLabel}
      </button>
    </div>
  );
}

function ErrorBox({ message }: { message: string }) {
  return (
    <div className="mt-5 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-bold text-rose-600">
      {message}
    </div>
  );
}

function formatStatus(status: string, isArabic: boolean) {
  if (isArabic) {
    const labels: Record<string, string> = {
      draft: "مسودة",
      sent: "مرسل",
      accepted: "مقبول",
      rejected: "مرفوض",
      expired: "منتهي",
    };

    return labels[status] || status;
  }

  return status.charAt(0).toUpperCase() + status.slice(1);
}

function statusClass(status: QuotationStatus) {
  switch (status) {
    case "sent":
      return "border-blue-200 bg-blue-50 text-blue-700";
    case "accepted":
      return "border-emerald-200 bg-emerald-50 text-emerald-700";
    case "rejected":
      return "border-rose-200 bg-rose-50 text-rose-700";
    case "expired":
      return "border-slate-300 bg-slate-100 text-slate-600";
    default:
      return "border-amber-200 bg-amber-50 text-amber-700";
  }
}

function calculateOriginalTotal(quotation: Quotation) {
  return quotation.subtotal + quotation.subtotal * (quotation.taxRate / 100);
}

function formatMoney(amount: number, currency: string) {
  const symbols: Record<string, string> = {
   // SAR: "ر.س",
    SAR: "\u20C1",
    USD: "$",
    AED: "د.إ",
  };

  const symbol = symbols[currency] || currency;

  // Always Western digits: 12456, never ١٢٤٥٦
  const value = new Intl.NumberFormat("en-US", {
    useGrouping: false,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(Number(amount) || 0);

  return `${symbol} ${value}`;
}

function formatDate(value: string, isArabic = false) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString(isArabic ? "ar-SA" : "en-GB");
}

function dateInputValue(value?: string | null) {
  if (!value) return "";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toISOString().slice(0, 10);
}

function dateToIso(value: string) {
  if (!value) return undefined;

  return new Date(`${value}T23:59:59.000Z`).toISOString();
}

const inputClass =
  "h-[44px] w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none transition focus:border-teal-deep";