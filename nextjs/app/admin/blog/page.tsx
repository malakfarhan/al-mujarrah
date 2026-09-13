"use client";

import { useEffect, useMemo, useState, type Dispatch, type ReactNode, type SetStateAction } from "react";
import { Eye, Pencil, Plus, Search, Star, Trash2, X } from "lucide-react";

import AdminLoader from "@/components/admin/AdminLoader";
import { useLanguage } from "@/components/shared/LanguageProvider";
import { uploadPortfolioImage } from "@/lib/api/uploads";

import {
  createBlog,
  deleteBlog,
  getBlog,
  getBlogs,
  updateBlog,
  type Blog,
  type CreateBlogInput,
} from "@/lib/api/blog";

type BlogForm = {
  title: string;
  titleAr: string;
  slug: string;
  excerpt: string;
  excerptAr: string;
  content: string;
  contentAr: string;
  category: string;
  categoryAr: string;
  coverImage: string;
  isFeatured: boolean;
  isPublished: boolean;
  metaTitle: string;
  metaTitleAr: string;
  metaDescription: string;
  metaDescriptionAr: string;
};

function emptyForm(): BlogForm {
  return {
    title: "",
    titleAr: "",
    slug: "",
    excerpt: "",
    excerptAr: "",
    content: "",
    contentAr: "",
    category: "",
    categoryAr: "",
    coverImage: "",
    isFeatured: false,
    isPublished: false,
    metaTitle: "",
    metaTitleAr: "",
    metaDescription: "",
    metaDescriptionAr: "",
  };
}

export default function BlogPage() {
  const { isArabic } = useLanguage();

  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [viewLoading, setViewLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);
  const [deletingBlog, setDeletingBlog] = useState<Blog | null>(null);

  const [createForm, setCreateForm] = useState<BlogForm>(emptyForm());
  const [editForm, setEditForm] = useState<BlogForm>(emptyForm());

  const [error, setError] = useState("");

  const t = isArabic
    ? {
        section: "المحتوى",
        title: "المقالات",
        subtitle: "إدارة مقالات الموقع وحالة النشر.",
        newPost: "مقال جديد",
        search: "البحث بالعنوان أو التصنيف...",
        all: "الكل",
        published: "منشور",
        draft: "مسودة",
        featured: "مميز",
        titleCol: "العنوان",
        category: "التصنيف",
        date: "التاريخ",
        status: "الحالة",
        actions: "الإجراءات",
        noPosts: "لا توجد مقالات.",
        publish: "نشر",
        unpublish: "إلغاء النشر",
        createTitle: "إضافة مقال",
        editTitle: "تعديل المقال",
        viewTitle: "تفاصيل المقال",
        create: "إنشاء المقال",
        creating: "جارٍ الإنشاء...",
        save: "حفظ التغييرات",
        saving: "جارٍ الحفظ...",
        cancel: "إلغاء",
        delete: "حذف",
        deleting: "جارٍ الحذف...",
        deleteTitle: "حذف المقال",
        deleteQuestion: "هل تريد حذف",
        loading: "جارٍ تحميل المقالات",
        loadingSub: "جارٍ جلب محتوى المدونة...",
      }
    : {
        section: "Content",
        title: "Blog posts",
        subtitle: "Manage website insights and publication status.",
        newPost: "New Post",
        search: "Search title or category...",
        all: "All posts",
        published: "Published",
        draft: "Draft",
        featured: "Featured",
        titleCol: "Title",
        category: "Category",
        date: "Date",
        status: "Status",
        actions: "Actions",
        noPosts: "No blog posts found.",
        publish: "Publish",
        unpublish: "Unpublish",
        createTitle: "New blog post",
        editTitle: "Edit blog post",
        viewTitle: "Blog details",
        create: "Create Post",
        creating: "Creating...",
        save: "Save Changes",
        saving: "Saving...",
        cancel: "Cancel",
        delete: "Delete",
        deleting: "Deleting...",
        deleteTitle: "Delete blog post",
        deleteQuestion: "Delete",
        loading: "Loading blog",
        loadingSub: "Fetching blog content...",
      };

  useEffect(() => {
    async function loadBlogs() {
      try {
        const data = await getBlogs();
        setBlogs(data);
      } catch (error) {
        console.error(error);
        setError("Unable to load blog posts.");
      } finally {
        setLoading(false);
      }
    }

    loadBlogs();
  }, []);

  const filteredBlogs = useMemo(() => {
    const query = search.trim().toLowerCase();

    return blogs
      .filter((blog) => {
        const title = isArabic ? blog.titleAr || "" : blog.title;
        const category = isArabic ? blog.categoryAr || "" : blog.category || "";

        const matchesSearch =
          !query ||
          title.toLowerCase().includes(query) ||
          category.toLowerCase().includes(query) ||
          blog.slug.toLowerCase().includes(query);

        const matchesStatus =
          statusFilter === "all" ||
          (statusFilter === "published" && blog.isPublished) ||
          (statusFilter === "draft" && !blog.isPublished);

        return matchesSearch && matchesStatus;
      })
      .sort(
        (a, b) =>
          new Date(b.publishedAt || b.createdAt).getTime() -
          new Date(a.publishedAt || a.createdAt).getTime(),
      );
  }, [blogs, search, statusFilter, isArabic]);

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
      setError("Blog title is required.");
      return;
    }

    if (!createForm.slug.trim()) {
      setError("Slug is required.");
      return;
    }

    setSaving(true);

    try {
      const payload: CreateBlogInput = {
        title: createForm.title.trim(),
        titleAr: createForm.titleAr.trim() || undefined,
        slug: createForm.slug.trim(),

        excerpt: createForm.excerpt.trim() || undefined,
        excerptAr: createForm.excerptAr.trim() || undefined,

        content: createForm.content.trim() || undefined,
        contentAr: createForm.contentAr.trim() || undefined,

        category: createForm.category.trim() || undefined,
        categoryAr: createForm.categoryAr.trim() || undefined,

        coverImage: createForm.coverImage.trim() || undefined,

        isFeatured: createForm.isFeatured,
        isPublished: createForm.isPublished,

        metaTitle: createForm.metaTitle.trim() || undefined,
        metaTitleAr: createForm.metaTitleAr.trim() || undefined,

        metaDescription: createForm.metaDescription.trim() || undefined,
        metaDescriptionAr: createForm.metaDescriptionAr.trim() || undefined,
      };

      const created = await createBlog(payload);

      setBlogs((current) => [created, ...current]);
      setCreateOpen(false);
      setCreateForm(emptyForm());
    } catch (error) {
      console.error(error);
      setError(error instanceof Error ? error.message : "Unable to create blog post.");
    } finally {
      setSaving(false);
    }
  }

  async function handleView(id: number) {
    setViewOpen(true);
    setViewLoading(true);
    setSelectedBlog(null);
    setError("");

    try {
      setSelectedBlog(await getBlog(id));
    } catch (error) {
      console.error(error);
      setError("Unable to load blog post.");
      setViewOpen(false);
    } finally {
      setViewLoading(false);
    }
  }

  async function handleEdit(id: number) {
    setError("");

    try {
      const blog = await getBlog(id);

      setSelectedBlog(blog);

      setEditForm({
        title: blog.title,
        titleAr: blog.titleAr || "",
        slug: blog.slug,

        excerpt: blog.excerpt || "",
        excerptAr: blog.excerptAr || "",

        content: blog.content || "",
        contentAr: blog.contentAr || "",

        category: blog.category || "",
        categoryAr: blog.categoryAr || "",

        coverImage: blog.coverImage || "",

        isFeatured: blog.isFeatured,
        isPublished: blog.isPublished,

        metaTitle: blog.metaTitle || "",
        metaTitleAr: blog.metaTitleAr || "",

        metaDescription: blog.metaDescription || "",
        metaDescriptionAr: blog.metaDescriptionAr || "",
      });

      setEditOpen(true);
    } catch (error) {
      console.error(error);
      setError("Unable to load blog post.");
    }
  }

  async function handleUpdate() {
    if (!selectedBlog) return;

    setError("");

    if (!editForm.title.trim()) {
      setError("Blog title is required.");
      return;
    }

    if (!editForm.slug.trim()) {
      setError("Slug is required.");
      return;
    }

    setSaving(true);

    try {
      const updated = await updateBlog(selectedBlog.id, {
        title: editForm.title.trim(),
        titleAr: editForm.titleAr.trim(),
        slug: editForm.slug.trim(),

        excerpt: editForm.excerpt.trim(),
        excerptAr: editForm.excerptAr.trim(),

        content: editForm.content.trim(),
        contentAr: editForm.contentAr.trim(),

        category: editForm.category.trim(),
        categoryAr: editForm.categoryAr.trim(),

        coverImage: editForm.coverImage.trim(),

        isFeatured: editForm.isFeatured,
        isPublished: editForm.isPublished,

        metaTitle: editForm.metaTitle.trim(),
        metaTitleAr: editForm.metaTitleAr.trim(),

        metaDescription: editForm.metaDescription.trim(),
        metaDescriptionAr: editForm.metaDescriptionAr.trim(),
      });

      setBlogs((current) =>
        current.map((blog) => (blog.id === updated.id ? updated : blog)),
      );

      setSelectedBlog(updated);
      setEditOpen(false);
    } catch (error) {
      console.error(error);
      setError(error instanceof Error ? error.message : "Unable to update blog post.");
    } finally {
      setSaving(false);
    }
  }

  async function togglePublish(blog: Blog) {
    setError("");

    try {
      const updated = await updateBlog(blog.id, {
        isPublished: !blog.isPublished,
      });

      setBlogs((current) =>
        current.map((item) => (item.id === updated.id ? updated : item)),
      );
    } catch (error) {
      console.error(error);
      setError("Unable to change publish status.");
    }
  }

  function openDelete(blog: Blog) {
    setDeletingBlog(blog);
    setError("");
    setDeleteOpen(true);
  }

  async function handleDelete() {
    if (!deletingBlog) return;

    setDeleting(true);
    setError("");

    try {
      await deleteBlog(deletingBlog.id);

      setBlogs((current) =>
        current.filter((blog) => blog.id !== deletingBlog.id),
      );

      setDeleteOpen(false);
      setDeletingBlog(null);
    } catch (error) {
      console.error(error);
      setError(error instanceof Error ? error.message : "Unable to delete blog post.");
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
          {t.newPost}
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
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
          className={inputClass}
        >
          <option value="all">{t.all}</option>
          <option value="published">{t.published}</option>
          <option value="draft">{t.draft}</option>
        </select>
      </div>

      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                {[t.titleCol, t.category, t.date, t.status, t.actions].map((item) => (
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
              {filteredBlogs.map((blog) => {
                const title = isArabic ? blog.titleAr || "—" : blog.title;
                const category = isArabic
                  ? blog.categoryAr || "—"
                  : blog.category || "—";

                return (
                  <tr key={blog.id}>
                    <td className="border-b border-slate-100 px-4 py-4">
                      <div className="flex items-center gap-3">
                        {blog.coverImage ? (
                          <img
                            src={blog.coverImage}
                            alt={title}
                            className="h-12 w-16 rounded-xl object-cover"
                          />
                        ) : (
                          <div className="h-12 w-16 rounded-xl bg-slate-100" />
                        )}

                        <div>
                          <strong className="block max-w-[340px] text-sm text-ink">
                            {title}
                          </strong>

                          <span className="mt-1 block text-[10px] text-slate-400">
                            {blog.slug}
                          </span>
                        </div>

                        {blog.isFeatured && (
                          <Star size={14} className="text-amber-500" />
                        )}
                      </div>
                    </td>

                    <td className="border-b border-slate-100 px-4 py-4 text-sm text-slate-600">
                      {category}
                    </td>

                    <td className="border-b border-slate-100 px-4 py-4 text-sm text-slate-600">
                      {formatDate(blog.publishedAt || blog.createdAt, isArabic)}
                    </td>

                    <td className="border-b border-slate-100 px-4 py-4">
                      <button
                        onClick={() => togglePublish(blog)}
                        className={`rounded-full px-2.5 py-1.5 text-[9px] font-black ${
                          blog.isPublished
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-amber-50 text-amber-700"
                        }`}
                      >
                        {blog.isPublished ? t.published : t.draft}
                      </button>
                    </td>

                    <td className="border-b border-slate-100 px-4 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleView(blog.id)}
                          className="grid h-9 w-9 place-items-center rounded-lg border border-slate-200 text-slate-600"
                        >
                          <Eye size={15} />
                        </button>

                        <button
                          onClick={() => handleEdit(blog.id)}
                          className="grid h-9 w-9 place-items-center rounded-lg border border-slate-200 text-slate-600"
                        >
                          <Pencil size={15} />
                        </button>

                        <button
                          onClick={() => openDelete(blog)}
                          className="grid h-9 w-9 place-items-center rounded-lg border border-rose-200 text-rose-600"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filteredBlogs.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-sm text-slate-400">
                    {t.noPosts}
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
          onClose={() => {
            setCreateOpen(false);
            setError("");
          }}
        >
          <BlogFormFields
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

      {editOpen && selectedBlog && (
        <Modal
          title={t.editTitle}
          onClose={() => {
            setEditOpen(false);
            setError("");
          }}
        >
          <BlogFormFields
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
          title={t.viewTitle}
          onClose={() => {
            setViewOpen(false);
            setSelectedBlog(null);
          }}
        >
          {viewLoading ? (
            <AdminLoader text={t.loading} subtext={t.loadingSub} />
          ) : (
            selectedBlog && (
              <BlogDetails blog={selectedBlog} isArabic={isArabic} />
            )
          )}
        </Modal>
      )}

      {deleteOpen && deletingBlog && (
        <div className="fixed inset-0 z-[120] grid place-items-center bg-black/50 p-4">
          <div
            dir={isArabic ? "rtl" : "ltr"}
            className="w-full max-w-[460px] rounded-3xl bg-white p-6 shadow-2xl"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="font-display text-2xl font-semibold text-ink">
                  {t.deleteTitle}
                </h2>

                <p className="mt-2 text-sm text-slate-500">
                  {t.deleteQuestion}{" "}
                  <strong className="text-ink">
                    {isArabic ? deletingBlog.titleAr || "—" : deletingBlog.title}
                  </strong>
                  ?
                </p>
              </div>

              <button
                onClick={() => {
                  setDeleteOpen(false);
                  setDeletingBlog(null);
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
                  setDeletingBlog(null);
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

function BlogFormFields({
  form,
  setForm,
  onTitleChange,
  isArabic,
}: {
  form: BlogForm;
  setForm: Dispatch<SetStateAction<BlogForm>>;
  onTitleChange?: (value: string) => void;
  isArabic: boolean;
}) {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  async function handleCoverUpload(file: File) {
    setUploading(true);
    setUploadError("");

    try {
      // Reuse current Supabase image uploader
      const uploaded = await uploadPortfolioImage(file);

      setForm((current) => ({
        ...current,
        coverImage: uploaded.url,
      }));
    } catch (error) {
      console.error(error);
      setUploadError(error instanceof Error ? error.message : "Image upload failed");
    } finally {
      setUploading(false);
    }
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
                setForm((current) => ({ ...current, title: event.target.value }));
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
              setForm((current) => ({ ...current, titleAr: event.target.value }))
            }
            className={`${inputClass} text-right`}
          />
        </Field>

        <Field label="Slug *">
          <input
            value={form.slug}
            onChange={(event) =>
              setForm((current) => ({ ...current, slug: event.target.value }))
            }
            className={inputClass}
          />
        </Field>

        <div />

        <Field label="Category (English)">
          <input
            value={form.category}
            onChange={(event) =>
              setForm((current) => ({ ...current, category: event.target.value }))
            }
            className={inputClass}
          />
        </Field>

        <Field label="التصنيف (العربية)">
          <input
            dir="rtl"
            value={form.categoryAr}
            onChange={(event) =>
              setForm((current) => ({ ...current, categoryAr: event.target.value }))
            }
            className={`${inputClass} text-right`}
          />
        </Field>
      </div>

      <Field label={isArabic ? "صورة الغلاف" : "Cover Image"}>
        <div className="space-y-3">
          <label className="flex min-h-[110px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 px-5 py-6 text-center hover:border-teal-deep">
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              disabled={uploading}
              className="hidden"
              onChange={async (event) => {
                const file = event.target.files?.[0];

                if (!file) return;

                await handleCoverUpload(file);
                event.target.value = "";
              }}
            />

            {uploading ? (
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

          {uploadError && <ErrorBox message={uploadError} />}

          {form.coverImage && (
            <div className="relative overflow-hidden rounded-2xl border border-slate-200">
              <img
                src={form.coverImage}
                alt="Blog cover"
                className="h-[240px] w-full object-cover"
              />

              <button
                type="button"
                onClick={() =>
                  setForm((current) => ({ ...current, coverImage: "" }))
                }
                className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-white/90 text-rose-600 shadow"
              >
                <Trash2 size={15} />
              </button>
            </div>
          )}
        </div>
      </Field>

      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Excerpt (English)">
          <textarea
            rows={4}
            value={form.excerpt}
            onChange={(event) =>
              setForm((current) => ({ ...current, excerpt: event.target.value }))
            }
            className={`${inputClass} min-h-[110px] py-3`}
          />
        </Field>

        <Field label="الملخص (العربية)">
          <textarea
            dir="rtl"
            rows={4}
            value={form.excerptAr}
            onChange={(event) =>
              setForm((current) => ({ ...current, excerptAr: event.target.value }))
            }
            className={`${inputClass} min-h-[110px] py-3 text-right`}
          />
        </Field>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Article Content (English)">
          <textarea
            rows={12}
            value={form.content}
            onChange={(event) =>
              setForm((current) => ({ ...current, content: event.target.value }))
            }
            className={`${inputClass} min-h-[300px] py-3`}
          />
        </Field>

        <Field label="محتوى المقال (العربية)">
          <textarea
            dir="rtl"
            rows={12}
            value={form.contentAr}
            onChange={(event) =>
              setForm((current) => ({ ...current, contentAr: event.target.value }))
            }
            className={`${inputClass} min-h-[300px] py-3 text-right`}
          />
        </Field>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Field label="SEO Title (English)">
          <input
            value={form.metaTitle}
            onChange={(event) =>
              setForm((current) => ({ ...current, metaTitle: event.target.value }))
            }
            className={inputClass}
          />
        </Field>

        <Field label="عنوان SEO (العربية)">
          <input
            dir="rtl"
            value={form.metaTitleAr}
            onChange={(event) =>
              setForm((current) => ({ ...current, metaTitleAr: event.target.value }))
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
          {isArabic ? "مقال مميز" : "Featured post"}
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

function BlogDetails({
  blog,
  isArabic,
}: {
  blog: Blog;
  isArabic: boolean;
}) {
  const title = isArabic ? blog.titleAr || "—" : blog.title;
  const category = isArabic ? blog.categoryAr || "—" : blog.category || "—";
  const excerpt = isArabic ? blog.excerptAr : blog.excerpt;
  const content = isArabic ? blog.contentAr : blog.content;

  return (
    <div dir={isArabic ? "rtl" : "ltr"} className="mt-6 space-y-4">
      {blog.coverImage && (
        <img
          src={blog.coverImage}
          alt={title}
          className="h-[280px] w-full rounded-2xl object-cover"
        />
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <Detail label={isArabic ? "العنوان" : "Title"} value={title} />
        <Detail label="Slug" value={blog.slug} />
        <Detail label={isArabic ? "التصنيف" : "Category"} value={category} />
        <Detail
          label={isArabic ? "الحالة" : "Status"}
          value={
            blog.isPublished
              ? isArabic
                ? "منشور"
                : "Published"
              : isArabic
                ? "مسودة"
                : "Draft"
          }
        />
      </div>

      <Detail label={isArabic ? "الملخص" : "Excerpt"} value={excerpt} />
      <Detail label={isArabic ? "المحتوى" : "Content"} value={content} />
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
      <div className="mx-auto my-8 w-full max-w-[950px] rounded-3xl bg-white p-7 shadow-2xl">
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
    <div className="text-xs font-bold text-slate-600">
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

      <div className="mt-2 whitespace-pre-wrap rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-7 text-slate-600">
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
        className="rounded-xl border border-slate-200 px-5 py-3 text-xs font-black text-slate-600"
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

function formatDate(value: string, isArabic: boolean) {
  return new Intl.DateTimeFormat(
    isArabic ? "ar-SA-u-ca-gregory-nu-latn" : "en-GB",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    },
  ).format(new Date(value));
}

const inputClass =
  "h-[44px] w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none focus:border-teal-deep";