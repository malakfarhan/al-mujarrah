"use client";

import { useEffect, useMemo, useState, type Dispatch, type ReactNode, type SetStateAction } from "react";
import { Eye, Loader2, Pencil, Plus, Search, Star, Trash2, X } from "lucide-react";

import AdminLoader from "@/components/admin/AdminLoader";
import { useLanguage } from "@/components/shared/LanguageProvider";

import {
  createPortfolio,
  deletePortfolio,
  getPortfolio,
  getPortfolioItem,
  updatePortfolio,
  type Portfolio,
  type PortfolioImageInput,
} from "@/lib/api/portfolio";

import { uploadPortfolioImage } from "@/lib/api/uploads";


type PortfolioForm = {
  title: string;
  titleAr: string;
  slug: string;

  shortDescription: string;
  shortDescriptionAr: string;

  content: string;
  contentAr: string;

  client: string;
  clientAr: string;

  industry: string;
  industryAr: string;

  service: string;
  serviceAr: string;

  technologies: string;
  technologiesAr: string;

  coverImage: string;

  isFeatured: boolean;
  isPublished: boolean;
  sortOrder: string;

  metaTitle: string;
  metaTitleAr: string;

  metaDescription: string;
  metaDescriptionAr: string;

  images: PortfolioImageInput[];
};

function emptyForm(): PortfolioForm {
  return {
    title: "",
    titleAr: "",
    slug: "",

    shortDescription: "",
    shortDescriptionAr: "",

    content: "",
    contentAr: "",

    client: "",
    clientAr: "",

    industry: "",
    industryAr: "",

    service: "",
    serviceAr: "",

    technologies: "",
    technologiesAr: "",

    coverImage: "",

    isFeatured: false,
    isPublished: false,
    sortOrder: "0",

    metaTitle: "",
    metaTitleAr: "",

    metaDescription: "",
    metaDescriptionAr: "",

    images: [],
  };
}

export default function PortfolioPage() {
  const { isArabic } = useLanguage();

  const [items, setItems] = useState<Portfolio[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [viewLoading, setViewLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [publishFilter, setPublishFilter] = useState("all");

  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const [selectedItem, setSelectedItem] = useState<Portfolio | null>(null);
  const [deletingItem, setDeletingItem] = useState<Portfolio | null>(null);

  const [createForm, setCreateForm] = useState<PortfolioForm>(emptyForm());
  const [editForm, setEditForm] = useState<PortfolioForm>(emptyForm());

  const [updatingPublishId, setUpdatingPublishId] = useState<number | null>(null);

  const [error, setError] = useState("");

  const t = isArabic
    ? {
        section: "محتوى الموقع",
        title: "معرض الأعمال",
        subtitle: "إدارة المشاريع ودراسات الحالة المعروضة على الموقع.",
        newItem: "إضافة عمل",
        search: "البحث بالعنوان أو العميل أو الخدمة...",
        all: "الكل",
        published: "منشور",
        draft: "مسودة",
        featured: "مميز",
        publish: "نشر",
        unpublish: "إلغاء النشر",
        noCover: "لا توجد صورة غلاف",
        noDescription: "لا يوجد وصف مختصر.",
        noItems: "لم يتم العثور على أعمال.",
        createTitle: "إضافة عمل جديد",
        editTitle: "تعديل العمل",
        detailsTitle: "تفاصيل العمل",
        create: "إنشاء",
        creating: "جارٍ الإنشاء...",
        save: "حفظ التغييرات",
        saving: "جارٍ الحفظ...",
        cancel: "إلغاء",
        delete: "حذف",
        deleting: "جارٍ الحذف...",
        deleteTitle: "حذف العمل",
        deleteQuestion: "هل تريد حذف",
        loading: "جارٍ تحميل معرض الأعمال",
        loadingSub: "جارٍ جلب مشاريع الموقع...",
        loadingItem: "جارٍ تحميل التفاصيل",
        loadingItemSub: "جارٍ جلب دراسة الحالة...",
      }
    : {
        section: "Website Content",
        title: "Portfolio",
        subtitle: "Manage projects and case studies shown on the public website.",
        newItem: "New Portfolio",
        search: "Search title, client, service...",
        all: "All items",
        published: "Published",
        draft: "Draft",
        featured: "Featured",
        publish: "Publish",
        unpublish: "Unpublish",
        noCover: "No cover image",
        noDescription: "No short description.",
        noItems: "No portfolio items found.",
        createTitle: "New portfolio item",
        editTitle: "Edit portfolio",
        detailsTitle: "Portfolio details",
        create: "Create Portfolio",
        creating: "Creating...",
        save: "Save Changes",
        saving: "Saving...",
        cancel: "Cancel",
        delete: "Delete",
        deleting: "Deleting...",
        deleteTitle: "Delete portfolio",
        deleteQuestion: "Delete",
        loading: "Loading portfolio",
        loadingSub: "Fetching public showcase projects...",
        loadingItem: "Loading portfolio",
        loadingItemSub: "Fetching case study...",
      };

  useEffect(() => {
    async function loadPortfolio() {
      try {
        const data = await getPortfolio();
        setItems(data);
      } catch (error) {
        console.error(error);
        setError("Unable to load portfolio.");
      } finally {
        setLoading(false);
      }
    }

    loadPortfolio();
  }, []);

  const filteredItems = useMemo(() => {
    const query = search.trim().toLowerCase();

    return items.filter((item) => {
      const title = isArabic ? item.titleAr || "" : item.title;
      const client = isArabic ? item.clientAr || "" : item.client || "";
      const industry = isArabic ? item.industryAr || "" : item.industry || "";
      const service = isArabic ? item.serviceAr || "" : item.service || "";

      const matchesSearch =
        !query ||
        title.toLowerCase().includes(query) ||
        item.slug.toLowerCase().includes(query) ||
        client.toLowerCase().includes(query) ||
        industry.toLowerCase().includes(query) ||
        service.toLowerCase().includes(query);

      const matchesPublish =
        publishFilter === "all" ||
        (publishFilter === "published" && item.isPublished) ||
        (publishFilter === "draft" && !item.isPublished);

      return matchesSearch && matchesPublish;
    });
  }, [items, search, publishFilter, isArabic]);

  function openCreate() {
    setCreateForm(emptyForm());
    setError("");
    setCreateOpen(true);
  }

  function handleCreateTitle(value: string) {
    setCreateForm((current) => ({
      ...current,
      title: value,
      slug: current.slug || makeSlug(value),
    }));
  }

  async function handleCreate() {
    setError("");

    if (!createForm.title.trim()) {
      setError("Portfolio title is required.");
      return;
    }

    if (!createForm.slug.trim()) {
      setError("Slug is required.");
      return;
    }

    setSaving(true);

    try {
      const created = await createPortfolio({
        title: createForm.title.trim(),
        titleAr: createForm.titleAr.trim() || undefined,
        slug: createForm.slug.trim(),

        shortDescription: createForm.shortDescription.trim() || undefined,
        shortDescriptionAr: createForm.shortDescriptionAr.trim() || undefined,

        content: createForm.content.trim() || undefined,
        contentAr: createForm.contentAr.trim() || undefined,

        client: createForm.client.trim() || undefined,
        clientAr: createForm.clientAr.trim() || undefined,

        industry: createForm.industry.trim() || undefined,
        industryAr: createForm.industryAr.trim() || undefined,

        service: createForm.service.trim() || undefined,
        serviceAr: createForm.serviceAr.trim() || undefined,

        technologies: createForm.technologies.trim() || undefined,
        technologiesAr: createForm.technologiesAr.trim() || undefined,

        coverImage: createForm.coverImage.trim() || undefined,

        isFeatured: createForm.isFeatured,
        isPublished: createForm.isPublished,
        sortOrder: Number(createForm.sortOrder) || 0,

        metaTitle: createForm.metaTitle.trim() || undefined,
        metaTitleAr: createForm.metaTitleAr.trim() || undefined,

        metaDescription: createForm.metaDescription.trim() || undefined,
        metaDescriptionAr: createForm.metaDescriptionAr.trim() || undefined,

        images: createForm.images,
      });

      setItems((current) => [created, ...current]);
      setCreateOpen(false);
      setCreateForm(emptyForm());
    } catch (error) {
      console.error(error);
      setError(error instanceof Error ? error.message : "Unable to create portfolio item.");
    } finally {
      setSaving(false);
    }
  }

  async function handleView(id: number) {
    setViewOpen(true);
    setViewLoading(true);
    setSelectedItem(null);

    try {
      const item = await getPortfolioItem(id);
      setSelectedItem(item);
    } catch (error) {
      console.error(error);
      setViewOpen(false);
      setError("Unable to load portfolio item.");
    } finally {
      setViewLoading(false);
    }
  }

  async function handleEdit(id: number) {
    setError("");

    try {
      const item = await getPortfolioItem(id);

      setSelectedItem(item);

      setEditForm({
        title: item.title,
        titleAr: item.titleAr || "",
        slug: item.slug,

        shortDescription: item.shortDescription || "",
        shortDescriptionAr: item.shortDescriptionAr || "",

        content: item.content || "",
        contentAr: item.contentAr || "",

        client: item.client || "",
        clientAr: item.clientAr || "",

        industry: item.industry || "",
        industryAr: item.industryAr || "",

        service: item.service || "",
        serviceAr: item.serviceAr || "",

        technologies: item.technologies || "",
        technologiesAr: item.technologiesAr || "",

        coverImage: item.coverImage || "",

        isFeatured: item.isFeatured,
        isPublished: item.isPublished,
        sortOrder: String(item.sortOrder),

        metaTitle: item.metaTitle || "",
        metaTitleAr: item.metaTitleAr || "",

        metaDescription: item.metaDescription || "",
        metaDescriptionAr: item.metaDescriptionAr || "",

        images:
          item.images?.map((image) => ({
            imageUrl: image.imageUrl,
            caption: image.caption || "",
            captionAr: image.captionAr || "",
            sortOrder: image.sortOrder,
          })) || [],
      });

      setEditOpen(true);
    } catch (error) {
      console.error(error);
      setError("Unable to load portfolio item.");
    }
  }

  async function handleUpdate() {
    if (!selectedItem) return;

    setError("");

    if (!editForm.title.trim()) {
      setError("Portfolio title is required.");
      return;
    }

    if (!editForm.slug.trim()) {
      setError("Slug is required.");
      return;
    }

    setSaving(true);

    try {
      const updated = await updatePortfolio(selectedItem.id, {
        title: editForm.title.trim(),
        titleAr: editForm.titleAr.trim(),
        slug: editForm.slug.trim(),

        shortDescription: editForm.shortDescription.trim(),
        shortDescriptionAr: editForm.shortDescriptionAr.trim(),

        content: editForm.content.trim(),
        contentAr: editForm.contentAr.trim(),

        client: editForm.client.trim(),
        clientAr: editForm.clientAr.trim(),

        industry: editForm.industry.trim(),
        industryAr: editForm.industryAr.trim(),

        service: editForm.service.trim(),
        serviceAr: editForm.serviceAr.trim(),

        technologies: editForm.technologies.trim(),
        technologiesAr: editForm.technologiesAr.trim(),

        coverImage: editForm.coverImage.trim(),

        isFeatured: editForm.isFeatured,
        isPublished: editForm.isPublished,
        sortOrder: Number(editForm.sortOrder) || 0,

        metaTitle: editForm.metaTitle.trim(),
        metaTitleAr: editForm.metaTitleAr.trim(),

        metaDescription: editForm.metaDescription.trim(),
        metaDescriptionAr: editForm.metaDescriptionAr.trim(),

        images: editForm.images,
      });

      setItems((current) =>
        current.map((item) => (item.id === updated.id ? updated : item)),
      );

      setSelectedItem(updated);
      setEditOpen(false);
    } catch (error) {
      console.error(error);
      setError(error instanceof Error ? error.message : "Unable to update portfolio item.");
    } finally {
      setSaving(false);
    }
  }

  // Publish/unpublish with loading feedback
async function togglePublish(item: Portfolio) {
  setUpdatingPublishId(item.id);
  setError("");

  try {
    const updated = await updatePortfolio(item.id, {
      isPublished: !item.isPublished,
    });

    setItems((current) =>
      current.map((currentItem) =>
        currentItem.id === updated.id ? updated : currentItem,
      ),
    );
  } catch (error) {
    console.error(error);
    setError(
      isArabic
        ? "تعذر تغيير حالة النشر."
        : "Unable to change publish status.",
    );
  } finally {
    setUpdatingPublishId(null);
  }
}

  function openDelete(item: Portfolio) {
    setDeletingItem(item);
    setDeleteOpen(true);
    setError("");
  }

  async function handleDelete() {
    if (!deletingItem) return;

    setDeleting(true);

    try {
      await deletePortfolio(deletingItem.id);

      setItems((current) =>
        current.filter((item) => item.id !== deletingItem.id),
      );

      setDeleteOpen(false);
      setDeletingItem(null);
    } catch (error) {
      console.error(error);
      setError(error instanceof Error ? error.message : "Unable to delete portfolio item.");
    } finally {
      setDeleting(false);
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
            {t.section}
          </span>

          <h1 className="mt-1 font-display text-4xl font-semibold text-ink">
            {t.title}
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            {t.subtitle}
          </p>
        </div>

        <button
          onClick={openCreate}
          className="inline-flex h-[44px] items-center justify-center gap-2 rounded-xl bg-ink px-5 text-xs font-black text-white"
        >
          <Plus size={16} />
          {t.newItem}
        </button>
      </div>

      {error && !createOpen && !editOpen && !deleteOpen && (
        <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-bold text-rose-600">
          {error}
        </div>
      )}

      <div className="mb-5 grid gap-3 md:grid-cols-[1fr_200px]">
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
            className={`${inputClass} ${isArabic ? "pr-10 text-right" : "pl-10"}`}
          />
        </div>

        <select
          value={publishFilter}
          onChange={(event) => setPublishFilter(event.target.value)}
          className={inputClass}
        >
          <option value="all">{t.all}</option>
          <option value="published">{t.published}</option>
          <option value="draft">{t.draft}</option>
        </select>
      </div>

      <div className="mb-3 text-xs font-bold text-slate-400">
        {filteredItems.length} {isArabic ? "عنصر" : `portfolio item${filteredItems.length !== 1 ? "s" : ""}`}
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filteredItems.map((item) => {
          const title = isArabic ? item.titleAr || "—" : item.title;
          const service = isArabic ? item.serviceAr || "—" : item.service || "Portfolio";
          const client = isArabic ? item.clientAr || "—" : item.client || "—";
          const industry = isArabic ? item.industryAr || "" : item.industry || "";
          const description = isArabic
            ? item.shortDescriptionAr || t.noDescription
            : item.shortDescription || t.noDescription;

          return (
            <div
              key={item.id}
              className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm"
            >
              <div className="relative h-[180px] bg-slate-100">
                {item.coverImage ? (
                  <img
                    src={item.coverImage}
                    alt={title}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="grid h-full place-items-center text-xs font-bold text-slate-400">
                    {t.noCover}
                  </div>
                )}

                {item.isFeatured && (
                  <span
                    className={`absolute top-3 inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1.5 text-[9px] font-black text-amber-700 ${
                      isArabic ? "right-3" : "left-3"
                    }`}
                  >
                    <Star size={11} />
                    {t.featured}
                  </span>
                )}

                <span
                  className={`absolute top-3 rounded-full px-2.5 py-1.5 text-[9px] font-black ${
                    isArabic ? "left-3" : "right-3"
                  } ${
                    item.isPublished
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {item.isPublished ? t.published : t.draft}
                </span>
              </div>

              <div className="p-5">
                <p className="text-[10px] font-black uppercase tracking-[.1em] text-teal-deep">
                  {service}
                </p>

                <h3 className="mt-2 font-display text-xl font-semibold text-ink">
                  {title}
                </h3>

                <p className="mt-1 text-xs text-slate-400">
                  {client}
                  {industry ? ` • ${industry}` : ""}
                </p>

                <p className="mt-4 line-clamp-3 text-sm leading-6 text-slate-500">
                  {description}
                </p>

                <div className="mt-5 flex gap-2 border-t border-slate-100 pt-4">
                  {/*<button
                    onClick={() => togglePublish(item)}
                    className={`rounded-lg border px-3 py-2 text-[10px] font-black ${
                      item.isPublished
                        ? "border-amber-200 text-amber-700"
                        : "border-emerald-200 text-emerald-700"
                    }`}
                  >
                    {item.isPublished ? t.unpublish : t.publish}
                  </button>*/}
                  <button
                  onClick={() => togglePublish(item)}
                  disabled={updatingPublishId === item.id}
                  className={`inline-flex min-w-[100px] items-center justify-center gap-1.5 rounded-lg border px-3 py-2 text-[10px] font-black disabled:cursor-wait disabled:opacity-60 ${
                    item.isPublished
                      ? "border-amber-200 text-amber-700"
                      : "border-emerald-200 text-emerald-700"
                  }`}
                >
                  {updatingPublishId === item.id ? (
                    <>
                      <Loader2 size={13} className="animate-spin" />
                      {item.isPublished
                        ? isArabic
                          ? "جارٍ إلغاء النشر..."
                          : "Unpublishing..."
                        : isArabic
                          ? "جارٍ النشر..."
                          : "Publishing..."}
                    </>
                  ) : (
                    item.isPublished ? t.unpublish : t.publish
                  )}
                </button>

                  <button
                    onClick={() => handleView(item.id)}
                    className="grid h-9 w-9 place-items-center rounded-lg border border-slate-200 text-slate-600"
                  >
                    <Eye size={15} />
                  </button>

                  <button
                    onClick={() => handleEdit(item.id)}
                    className="grid h-9 w-9 place-items-center rounded-lg border border-slate-200 text-slate-600"
                  >
                    <Pencil size={15} />
                  </button>

                  <button
                    onClick={() => openDelete(item)}
                    className="grid h-9 w-9 place-items-center rounded-lg border border-rose-200 text-rose-600"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {filteredItems.length === 0 && (
          <div className="col-span-full rounded-3xl border border-slate-200 bg-white p-12 text-center text-sm text-slate-400">
            {t.noItems}
          </div>
        )}
      </div>

      {createOpen && (
        <Modal
          title={t.createTitle}
          onClose={() => {
            setCreateOpen(false);
            setError("");
          }}
        >
          <PortfolioFormFields
            form={createForm}
            setForm={setCreateForm}
            onTitleChange={handleCreateTitle}
            isArabic={isArabic}
          />

          {error && <ErrorBox message={error} />}

          <Actions
            saving={saving}
            label={t.create}
            loadingLabel={t.creating}
            cancelLabel={t.cancel}
            onCancel={() => {
              setCreateOpen(false);
              setError("");
            }}
            onSave={handleCreate}
          />
        </Modal>
      )}

      {editOpen && selectedItem && (
        <Modal
          title={t.editTitle}
          onClose={() => {
            setEditOpen(false);
            setError("");
          }}
        >
          <PortfolioFormFields
            form={editForm}
            setForm={setEditForm}
            isArabic={isArabic}
          />

          {error && <ErrorBox message={error} />}

          <Actions
            saving={saving}
            label={t.save}
            loadingLabel={t.saving}
            cancelLabel={t.cancel}
            onCancel={() => {
              setEditOpen(false);
              setError("");
            }}
            onSave={handleUpdate}
          />
        </Modal>
      )}

      {viewOpen && (
        <Modal
          title={t.detailsTitle}
          onClose={() => {
            setViewOpen(false);
            setSelectedItem(null);
          }}
        >
          {viewLoading ? (
            <AdminLoader text={t.loadingItem} subtext={t.loadingItemSub} />
          ) : (
            selectedItem && (
              <PortfolioDetails item={selectedItem} isArabic={isArabic} />
            )
          )}
        </Modal>
      )}

      {deleteOpen && deletingItem && (
        <div className="fixed inset-0 z-[120] grid place-items-center bg-black/50 p-4">
          <div
            dir={isArabic ? "rtl" : "ltr"}
            className="w-full max-w-[460px] rounded-3xl bg-white p-6 shadow-2xl"
          >
            <h2 className="font-display text-2xl font-semibold text-ink">
              {t.deleteTitle}
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              {t.deleteQuestion}{" "}
              <strong>
                {isArabic ? deletingItem.titleAr || "—" : deletingItem.title}
              </strong>
              ?
            </p>

            {error && <ErrorBox message={error} />}

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => {
                  setDeleteOpen(false);
                  setDeletingItem(null);
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

function PortfolioFormFields({
  form,
  setForm,
  onTitleChange,
  isArabic,
}: {
  form: PortfolioForm;
  setForm: Dispatch<SetStateAction<PortfolioForm>>;
  onTitleChange?: (value: string) => void;
  isArabic: boolean;
}) {
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const [galleryError, setGalleryError] = useState("");

  async function handleCoverUpload(file: File) {
    setUploadingImage(true);
    setUploadError("");

    try {
      const uploaded = await uploadPortfolioImage(file);

      setForm((current) => ({
        ...current,
        coverImage: uploaded.url,
      }));
    } catch (error) {
      console.error(error);
      setUploadError(error instanceof Error ? error.message : "Image upload failed");
    } finally {
      setUploadingImage(false);
    }
  }

  async function handleGalleryUpload(files: FileList) {
    const selectedFiles = Array.from(files);

    if (!selectedFiles.length) return;

    setUploadingGallery(true);
    setGalleryError("");

    try {
      const uploadedImages: PortfolioImageInput[] = [];

      for (let index = 0; index < selectedFiles.length; index++) {
        const uploaded = await uploadPortfolioImage(selectedFiles[index]);

        uploadedImages.push({
          imageUrl: uploaded.url,
          caption: "",
          captionAr: "",
          sortOrder: form.images.length + index,
        });
      }

      setForm((current) => ({
        ...current,
        images: [...current.images, ...uploadedImages],
      }));
    } catch (error) {
      console.error(error);
      setGalleryError(error instanceof Error ? error.message : "Gallery upload failed");
    } finally {
      setUploadingGallery(false);
    }
  }

  function removeGalleryImage(index: number) {
    setForm((current) => ({
      ...current,
      images: current.images
        .filter((_, imageIndex) => imageIndex !== index)
        .map((image, imageIndex) => ({
          ...image,
          sortOrder: imageIndex,
        })),
    }));
  }

  function updateGalleryCaption(
    index: number,
    field: "caption" | "captionAr",
    value: string,
  ) {
    setForm((current) => ({
      ...current,
      images: current.images.map((image, imageIndex) =>
        imageIndex === index
          ? {
              ...image,
              [field]: value,
            }
          : image,
      ),
    }));
  }

  return (
    <div className="mt-6 space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Title (English) *">
          <input
            value={form.title}
            onChange={(event) => {
              if (onTitleChange) {
                onTitleChange(event.target.value);
              } else {
                setForm((current) => ({
                  ...current,
                  title: event.target.value,
                }));
              }
            }}
            className={inputClass}
          />
        </Field>

        <Field label="العنوان (العربية)">
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
          />
        </Field>

        <Field label="Slug *">
          <input
            value={form.slug}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                slug: event.target.value,
              }))
            }
            className={inputClass}
          />
        </Field>

        <Field label={isArabic ? "ترتيب العرض" : "Sort Order"}>
          <input
            type="number"
            min="0"
            value={form.sortOrder}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                sortOrder: event.target.value,
              }))
            }
            className={inputClass}
          />
        </Field>

        <Field label="Client (English)">
          <input
            value={form.client}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                client: event.target.value,
              }))
            }
            className={inputClass}
          />
        </Field>

        <Field label="العميل (العربية)">
          <input
            dir="rtl"
            value={form.clientAr}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                clientAr: event.target.value,
              }))
            }
            className={`${inputClass} text-right`}
          />
        </Field>

        <Field label="Industry (English)">
          <input
            value={form.industry}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                industry: event.target.value,
              }))
            }
            className={inputClass}
          />
        </Field>

        <Field label="القطاع (العربية)">
          <input
            dir="rtl"
            value={form.industryAr}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                industryAr: event.target.value,
              }))
            }
            className={`${inputClass} text-right`}
          />
        </Field>

        <Field label="Service (English)">
          <input
            value={form.service}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                service: event.target.value,
              }))
            }
            className={inputClass}
          />
        </Field>

        <Field label="الخدمة (العربية)">
          <input
            dir="rtl"
            value={form.serviceAr}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                serviceAr: event.target.value,
              }))
            }
            className={`${inputClass} text-right`}
          />
        </Field>

        <Field label="Technologies (English)">
          <input
            value={form.technologies}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                technologies: event.target.value,
              }))
            }
            placeholder="Next.js, NestJS, Supabase"
            className={inputClass}
          />
        </Field>

        <Field label="التقنيات (العربية)">
          <input
            dir="rtl"
            value={form.technologiesAr}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                technologiesAr: event.target.value,
              }))
            }
            placeholder="نكست جي إس، نست جي إس، سوبابيس"
            className={`${inputClass} text-right`}
          />
        </Field>
      </div>

      <div className="sm:col-span-2">
        <Field label={isArabic ? "صورة الغلاف" : "Cover Image"}>
          <div className="space-y-3">
            <label
              className={`flex min-h-[110px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-5 py-6 text-center transition ${
                uploadingImage
                  ? "cursor-not-allowed border-slate-200 bg-slate-50"
                  : "border-slate-200 bg-slate-50 hover:border-teal-deep hover:bg-white"
              }`}
            >
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                disabled={uploadingImage}
                className="hidden"
                onChange={async (event) => {
                  const file = event.target.files?.[0];

                  if (!file) return;

                  await handleCoverUpload(file);
                  event.target.value = "";
                }}
              />

              {uploadingImage ? (
                <>
                  <div className="h-6 w-6 animate-spin rounded-full border-2 border-slate-300 border-t-teal-deep" />
                  <span className="mt-3 text-xs font-black text-teal-deep">
                    {isArabic ? "جارٍ رفع الصورة..." : "Uploading image..."}
                  </span>
                </>
              ) : (
                <>
                  <span className="text-sm font-black text-ink">
                    {isArabic ? "اختر صورة الغلاف" : "Choose Cover Image"}
                  </span>
                  <span className="mt-1 text-xs text-slate-400">
                    JPG, PNG or WEBP • Max 5 MB
                  </span>
                </>
              )}
            </label>

            {uploadError && (
              <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs font-bold text-rose-600">
                {uploadError}
              </div>
            )}

            {form.coverImage && (
              <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
                <img
                  src={form.coverImage}
                  alt="Portfolio cover preview"
                  className="h-[220px] w-full object-cover"
                />

                <button
                  type="button"
                  onClick={() =>
                    setForm((current) => ({
                      ...current,
                      coverImage: "",
                    }))
                  }
                  className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-white/90 text-rose-600 shadow"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            )}
          </div>
        </Field>
      </div>

      <div className="sm:col-span-2">
        <Field label={isArabic ? "صور المعرض" : "Gallery Images"}>
          <div className="space-y-4">
            <label
              className={`flex min-h-[110px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-5 py-6 text-center transition ${
                uploadingGallery
                  ? "cursor-not-allowed border-slate-200 bg-slate-50"
                  : "border-slate-200 bg-slate-50 hover:border-teal-deep hover:bg-white"
              }`}
            >
              <input
                type="file"
                multiple
                accept="image/jpeg,image/png,image/webp"
                disabled={uploadingGallery}
                className="hidden"
                onChange={async (event) => {
                  const files = event.target.files;

                  if (!files?.length) return;

                  await handleGalleryUpload(files);
                  event.target.value = "";
                }}
              />

              {uploadingGallery ? (
                <>
                  <div className="h-6 w-6 animate-spin rounded-full border-2 border-slate-300 border-t-teal-deep" />
                  <span className="mt-3 text-xs font-black text-teal-deep">
                    {isArabic ? "جارٍ رفع الصور..." : "Uploading gallery..."}
                  </span>
                </>
              ) : (
                <>
                  <span className="text-sm font-black text-ink">
                    {isArabic ? "اختر صور المعرض" : "Choose Gallery Images"}
                  </span>
                  <span className="mt-1 text-xs text-slate-400">
                    {isArabic
                      ? "يمكن اختيار عدة صور JPG أو PNG أو WEBP"
                      : "Select multiple JPG, PNG or WEBP images"}
                  </span>
                </>
              )}
            </label>

            {galleryError && (
              <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs font-bold text-rose-600">
                {galleryError}
              </div>
            )}

            {form.images.length > 0 && (
              <div className="grid gap-4 sm:grid-cols-2">
                {form.images.map((image, index) => (
                  <div
                    key={`${image.imageUrl}-${index}`}
                    className="overflow-hidden rounded-2xl border border-slate-200 bg-white"
                  >
                    <div className="relative">
                      <img
                        src={image.imageUrl}
                        alt={`Gallery image ${index + 1}`}
                        className="h-[180px] w-full object-cover"
                      />

                      <button
                        type="button"
                        onClick={() => removeGalleryImage(index)}
                        className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-white/90 text-rose-600 shadow"
                      >
                        <Trash2 size={15} />
                      </button>

                      <span className="absolute bottom-3 left-3 rounded-full bg-black/60 px-2.5 py-1 text-[10px] font-bold text-white">
                        {index + 1}
                      </span>
                    </div>

                    <div className="space-y-3 p-3">
                      <input
                        value={image.caption || ""}
                        onChange={(event) =>
                          updateGalleryCaption(index, "caption", event.target.value)
                        }
                        placeholder="Caption (English)"
                        className={inputClass}
                      />

                      <input
                        dir="rtl"
                        value={image.captionAr || ""}
                        onChange={(event) =>
                          updateGalleryCaption(index, "captionAr", event.target.value)
                        }
                        placeholder="التعليق (العربية)"
                        className={`${inputClass} text-right`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Field>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Short Description (English)">
          <textarea
            rows={3}
            value={form.shortDescription}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                shortDescription: event.target.value,
              }))
            }
            className={`${inputClass} min-h-[90px] py-3`}
          />
        </Field>

        <Field label="الوصف المختصر (العربية)">
          <textarea
            dir="rtl"
            rows={3}
            value={form.shortDescriptionAr}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                shortDescriptionAr: event.target.value,
              }))
            }
            className={`${inputClass} min-h-[90px] py-3 text-right`}
          />
        </Field>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Case Study Content (English)">
          <textarea
            rows={8}
            value={form.content}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                content: event.target.value,
              }))
            }
            className={`${inputClass} min-h-[200px] py-3`}
          />
        </Field>

        <Field label="محتوى دراسة الحالة (العربية)">
          <textarea
            dir="rtl"
            rows={8}
            value={form.contentAr}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                contentAr: event.target.value,
              }))
            }
            className={`${inputClass} min-h-[200px] py-3 text-right`}
          />
        </Field>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Field label="SEO Title (English)">
          <input
            value={form.metaTitle}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                metaTitle: event.target.value,
              }))
            }
            className={inputClass}
          />
        </Field>

        <Field label="عنوان SEO (العربية)">
          <input
            dir="rtl"
            value={form.metaTitleAr}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                metaTitleAr: event.target.value,
              }))
            }
            className={`${inputClass} text-right`}
          />
        </Field>

        <Field label="SEO Description (English)">
          <textarea
            rows={3}
            value={form.metaDescription}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                metaDescription: event.target.value,
              }))
            }
            className={`${inputClass} min-h-[90px] py-3`}
          />
        </Field>

        <Field label="وصف SEO (العربية)">
          <textarea
            dir="rtl"
            rows={3}
            value={form.metaDescriptionAr}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                metaDescriptionAr: event.target.value,
              }))
            }
            className={`${inputClass} min-h-[90px] py-3 text-right`}
          />
        </Field>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="flex items-center gap-3 rounded-xl border border-slate-200 p-4 text-sm font-bold text-slate-600">
          <input
            type="checkbox"
            checked={form.isFeatured}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                isFeatured: event.target.checked,
              }))
            }
          />
          {isArabic ? "مشروع مميز" : "Featured project"}
        </label>

        <label className="flex items-center gap-3 rounded-xl border border-slate-200 p-4 text-sm font-bold text-slate-600">
          <input
            type="checkbox"
            checked={form.isPublished}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                isPublished: event.target.checked,
              }))
            }
          />
          {isArabic ? "نشر على الموقع" : "Publish on website"}
        </label>
      </div>
    </div>
  );
}

function PortfolioDetails({
  item,
  isArabic,
}: {
  item: Portfolio;
  isArabic: boolean;
}) {
  const title = isArabic ? item.titleAr || "—" : item.title;
  const client = isArabic ? item.clientAr || "—" : item.client || "—";
  const industry = isArabic ? item.industryAr || "—" : item.industry || "—";
  const service = isArabic ? item.serviceAr || "—" : item.service || "—";
  const technologies = isArabic
    ? item.technologiesAr || "—"
    : item.technologies || "—";
  const shortDescription = isArabic
    ? item.shortDescriptionAr
    : item.shortDescription;
  const content = isArabic ? item.contentAr : item.content;

  return (
    <div dir={isArabic ? "rtl" : "ltr"} className="mt-6 space-y-4">
      {item.coverImage && (
        <div className="overflow-hidden rounded-2xl border border-slate-200">
          <img
            src={item.coverImage}
            alt={title}
            className="h-[260px] w-full object-cover"
          />
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <Detail label={isArabic ? "العنوان" : "Title"} value={title} />
        <Detail label="Slug" value={item.slug} />
        <Detail label={isArabic ? "العميل" : "Client"} value={client} />
        <Detail label={isArabic ? "القطاع" : "Industry"} value={industry} />
        <Detail label={isArabic ? "الخدمة" : "Service"} value={service} />
        <Detail label={isArabic ? "التقنيات" : "Technologies"} value={technologies} />
      </div>

      <Detail
        label={isArabic ? "الوصف المختصر" : "Short Description"}
        value={shortDescription}
      />

      <Detail
        label={isArabic ? "محتوى دراسة الحالة" : "Content"}
        value={content}
      />

      {item.images && item.images.length > 0 && (
        <div>
          <p className="mb-3 text-xs font-bold text-slate-600">
            {isArabic ? "المعرض" : "Gallery"}
          </p>

          <div className="grid gap-4 sm:grid-cols-2">
            {[...item.images]
              .sort((a, b) => a.sortOrder - b.sortOrder)
              .map((image) => {
                const caption = isArabic ? image.captionAr || "" : image.caption || "";

                return (
                  <div
                    key={image.id}
                    className="overflow-hidden rounded-2xl border border-slate-200 bg-white"
                  >
                    <img
                      src={image.imageUrl}
                      alt={caption || title}
                      className="h-[200px] w-full object-cover"
                    />

                    {caption && (
                      <div className="px-4 py-3 text-xs text-slate-500">
                        {caption}
                      </div>
                    )}
                  </div>
                );
              })}
          </div>
        </div>
      )}
    </div>
  );
}

function Modal({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-[110] overflow-y-auto bg-black/50 p-4">
      <div className="mx-auto my-8 w-full max-w-[900px] rounded-3xl bg-white p-7 shadow-2xl">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-2xl font-semibold text-ink">
            {title}
          </h2>

          <button
            onClick={onClose}
            className="grid h-9 w-9 place-items-center rounded-xl bg-slate-100 text-slate-500"
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
    <div className="block text-xs font-bold text-slate-600">
      <div>{label}</div>
      <div className="mt-2">{children}</div>
    </div>
  );
}

function Detail({
  label,
  value,
}: {
  label: string;
  value?: string | null;
}) {
  return (
    <div>
      <span className="text-xs font-bold text-slate-600">
        {label}
      </span>

      <div className="mt-2 whitespace-pre-wrap rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
        {value || "—"}
      </div>
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

function Actions({
  saving,
  label,
  loadingLabel,
  cancelLabel,
  onCancel,
  onSave,
}: {
  saving: boolean;
  label: string;
  loadingLabel: string;
  cancelLabel: string;
  onCancel: () => void;
  onSave: () => void;
}) {
  return (
    <div className="mt-7 flex justify-end gap-3 border-t border-slate-100 pt-5">
      <button
        onClick={onCancel}
        disabled={saving}
        className="rounded-xl border border-slate-200 px-5 py-3 text-xs font-black text-slate-600 disabled:opacity-60"
      >
        {cancelLabel}
      </button>

      <button
        onClick={onSave}
        disabled={saving}
        className="rounded-xl bg-ink px-5 py-3 text-xs font-black text-white disabled:opacity-60"
      >
        {saving ? loadingLabel : label}
      </button>
    </div>
  );
}

function makeSlug(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const inputClass =
  "h-[44px] w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none focus:border-teal-deep";