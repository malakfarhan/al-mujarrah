"use client";

import {
  useEffect,
  useMemo,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";
import { Eye, Pencil, Plus, Search, Trash2, X } from "lucide-react";

import AdminLoader from "@/components/admin/AdminLoader";
import { useLanguage } from "@/components/shared/LanguageProvider";

import {
  createProject,
  deleteProject,
  getProject,
  getProjects,
  updateProject,
  type CreateProjectInput,
  type Project,
  type ProjectPriority,
  type ProjectStatus,
  type UpdateProjectInput,
} from "@/lib/api/projects";

import {
  getQuotations,
  type Quotation,
} from "@/lib/api/quotations";

const statuses: ProjectStatus[] = [
  "planning",
  "active",
  "on_hold",
  "completed",
  "cancelled",
];

const priorities: ProjectPriority[] = [
  "low",
  "medium",
  "high",
  "urgent",
];

type ProjectForm = {
  quotationId: string;

  clientName: string;
  clientNameAr: string;

  company: string;
  companyAr: string;

  title: string;
  titleAr: string;

  description: string;
  descriptionAr: string;

  status: ProjectStatus;
  priority: ProjectPriority;
  progress: string;

  budget: string;
  currency: string;

  startDate: string;
  dueDate: string;

  notes: string;
  notesAr: string;
};

function emptyForm(): ProjectForm {
  return {
    quotationId: "",

    clientName: "",
    clientNameAr: "",

    company: "",
    companyAr: "",

    title: "",
    titleAr: "",

    description: "",
    descriptionAr: "",

    status: "planning",
    priority: "medium",
    progress: "0",

    budget: "",
    currency: "SAR",

    startDate: "",
    dueDate: "",

    notes: "",
    notesAr: "",
  };
}

export default function ProjectsPage() {
  const { isArabic } = useLanguage();

  const [projects, setProjects] = useState<Project[]>([]);
  const [quotations, setQuotations] = useState<Quotation[]>([]);

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

  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [deletingProject, setDeletingProject] = useState<Project | null>(null);

  const [createForm, setCreateForm] = useState<ProjectForm>(emptyForm());
  const [editForm, setEditForm] = useState<ProjectForm>(emptyForm());

  const [error, setError] = useState("");

  const t = isArabic
    ? {
        delivery: "التسليم",
        projects: "المشاريع",
        subtitle: "متابعة تقدم المشاريع والقيمة والمواعيد الرئيسية.",
        newProject: "مشروع جديد",
        search: "البحث عن مشروع أو عميل أو شركة...",
        allStatuses: "جميع الحالات",
        noProjects: "لم يتم العثور على مشاريع.",
        project: "مشروع",
        projectsCount: "مشاريع",
        budget: "الميزانية",
        due: "الاستحقاق",
        priority: "الأولوية",
        start: "البدء",
        progress: "التقدم",
        view: "عرض",
        edit: "تعديل",
        delete: "حذف",
        createTitle: "مشروع جديد",
        createSubtitle: "إنشاء المشروع يدوياً أو من عرض سعر مقبول.",
        editTitle: "تعديل المشروع",
        viewTitle: "تفاصيل المشروع",
        viewSubtitle: "معلومات تنفيذ المشروع.",
        create: "إنشاء المشروع",
        creating: "جارٍ الإنشاء...",
        save: "حفظ التغييرات",
        saving: "جارٍ الحفظ...",
        cancel: "إلغاء",
        deleteTitle: "حذف المشروع",
        deleteQuestion: "هل تريد حذف",
        deleteWarning: "لا يمكن التراجع عن هذا الإجراء.",
        deleteProject: "حذف المشروع",
        deleting: "جارٍ الحذف...",
        loading: "جارٍ تحميل المشاريع",
        loadingSub: "جارٍ جلب بيانات المشاريع...",
        loadingProject: "جارٍ تحميل المشروع",
        loadingProjectSub: "جارٍ جلب تفاصيل المشروع...",
      }
    : {
        delivery: "Delivery",
        projects: "Projects",
        subtitle: "Track delivery progress, commercial value and key dates.",
        newProject: "New Project",
        search: "Search project, client, company...",
        allStatuses: "All statuses",
        noProjects: "No projects found.",
        project: "project",
        projectsCount: "projects",
        budget: "Budget",
        due: "Due",
        priority: "Priority",
        start: "Start",
        progress: "Progress",
        view: "View",
        edit: "Edit",
        delete: "Delete",
        createTitle: "New project",
        createSubtitle: "Create manually or from an accepted quotation.",
        editTitle: "Edit project",
        viewTitle: "Project details",
        viewSubtitle: "Project delivery information.",
        create: "Create Project",
        creating: "Creating...",
        save: "Save Changes",
        saving: "Saving...",
        cancel: "Cancel",
        deleteTitle: "Delete project",
        deleteQuestion: "Delete",
        deleteWarning: "This action cannot be undone.",
        deleteProject: "Delete Project",
        deleting: "Deleting...",
        loading: "Loading projects",
        loadingSub: "Fetching active project data...",
        loadingProject: "Loading project",
        loadingProjectSub: "Fetching project details...",
      };

  useEffect(() => {
    async function loadData() {
      try {
        const [projectData, quotationData] = await Promise.all([
          getProjects(),
          getQuotations(),
        ]);

        setProjects(projectData);
        setQuotations(quotationData);
      } catch (error) {
        console.error(error);
        setError(
          isArabic ? "تعذر تحميل المشاريع." : "Unable to load projects.",
        );
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  // Accepted quotations that have not already been converted.
  const availableQuotations = useMemo(() => {
    const usedQuotationIds = new Set(
      projects
        .map((project) => project.quotationId)
        .filter((id): id is number => Boolean(id)),
    );

    return quotations.filter(
      (quotation) =>
        quotation.status === "accepted" &&
        !usedQuotationIds.has(quotation.id),
    );
  }, [quotations, projects]);

  const filteredProjects = useMemo(() => {
    const query = search.trim().toLowerCase();

    return projects
      .filter((project) => {
        const client = isArabic
          ? project.clientNameAr || ""
          : project.clientName;

        const company = isArabic
          ? project.companyAr || ""
          : project.company || "";

        const title = isArabic
          ? project.titleAr || ""
          : project.title;

        const matchesSearch =
          !query ||
          project.projectNo.toLowerCase().includes(query) ||
          client.toLowerCase().includes(query) ||
          company.toLowerCase().includes(query) ||
          title.toLowerCase().includes(query);

        const matchesStatus =
          statusFilter === "all" ||
          project.status === statusFilter;

        return matchesSearch && matchesStatus;
      })
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() -
          new Date(a.createdAt).getTime(),
      );
  }, [projects, search, statusFilter, isArabic]);

  function openCreate() {
    setCreateForm(emptyForm());
    setError("");
    setCreateOpen(true);
  }

  // Auto-fill both English and Arabic fields from accepted quotation.
  function handleQuotationChange(value: string) {
    const quotation = quotations.find(
      (item) => item.id === Number(value),
    );

    if (!quotation) {
      setCreateForm((current) => ({
        ...current,
        quotationId: "",
      }));

      return;
    }

    setCreateForm((current) => ({
      ...current,
      quotationId: String(quotation.id),

      clientName: quotation.customerName,
      clientNameAr: quotation.customerNameAr || "",

      company: quotation.company || "",
      companyAr: quotation.companyAr || "",

      title: quotation.title,
      titleAr: quotation.titleAr || "",

      description: quotation.description || "",
      descriptionAr: quotation.descriptionAr || "",

      budget: String(quotation.totalAmount),
      currency: quotation.currency,
    }));
  }

  async function handleCreate() {
    setError("");

    if (!createForm.clientName.trim()) {
      setError(
        isArabic
          ? "اسم العميل باللغة الإنجليزية مطلوب."
          : "Client name is required.",
      );
      return;
    }

    if (!createForm.title.trim()) {
      setError(
        isArabic
          ? "عنوان المشروع باللغة الإنجليزية مطلوب."
          : "Project title is required.",
      );
      return;
    }

    setSaving(true);

    try {
      const payload: CreateProjectInput = {
        clientName: createForm.clientName.trim(),
        clientNameAr: createForm.clientNameAr.trim() || undefined,

        company: createForm.company.trim() || undefined,
        companyAr: createForm.companyAr.trim() || undefined,

        title: createForm.title.trim(),
        titleAr: createForm.titleAr.trim() || undefined,

        description: createForm.description.trim() || undefined,
        descriptionAr: createForm.descriptionAr.trim() || undefined,

        status: createForm.status,
        priority: createForm.priority,
        progress:
          createForm.status === "completed"
            ? 100
            : Number(createForm.progress) || 0,

        budget: Number(createForm.budget) || 0,
        currency: createForm.currency,

        startDate: dateToIso(createForm.startDate),
        dueDate: dateToIso(createForm.dueDate),

        notes: createForm.notes.trim() || undefined,
        notesAr: createForm.notesAr.trim() || undefined,
      };

      if (createForm.quotationId) {
        payload.quotationId = Number(createForm.quotationId);
      }

      const newProject = await createProject(payload);

      setProjects((current) => [
        newProject,
        ...current,
      ]);

      setCreateOpen(false);
      setCreateForm(emptyForm());
    } catch (error) {
      console.error(error);

      setError(
        error instanceof Error
          ? error.message
          : isArabic
            ? "تعذر إنشاء المشروع."
            : "Unable to create project.",
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleView(id: number) {
    setViewOpen(true);
    setViewLoading(true);
    setSelectedProject(null);
    setError("");

    try {
      const project = await getProject(id);
      setSelectedProject(project);
    } catch (error) {
      console.error(error);

      setError(
        isArabic
          ? "تعذر تحميل المشروع."
          : "Unable to load project.",
      );

      setViewOpen(false);
    } finally {
      setViewLoading(false);
    }
  }

  async function handleEdit(id: number) {
    setError("");

    try {
      const project = await getProject(id);

      setSelectedProject(project);

      setEditForm({
        quotationId: project.quotationId
          ? String(project.quotationId)
          : "",

        clientName: project.clientName,
        clientNameAr: project.clientNameAr || "",

        company: project.company || "",
        companyAr: project.companyAr || "",

        title: project.title,
        titleAr: project.titleAr || "",

        description: project.description || "",
        descriptionAr: project.descriptionAr || "",

        status: project.status,
        priority: project.priority,
        progress: String(project.progress),

        budget: String(project.budget),
        currency: project.currency,

        startDate: dateInputValue(project.startDate),
        dueDate: dateInputValue(project.dueDate),

        notes: project.notes || "",
        notesAr: project.notesAr || "",
      });

      setEditOpen(true);
    } catch (error) {
      console.error(error);

      setError(
        isArabic
          ? "تعذر تحميل المشروع."
          : "Unable to load project.",
      );
    }
  }

  async function handleUpdate() {
    if (!selectedProject) return;

    setError("");

    if (!editForm.clientName.trim()) {
      setError(
        isArabic
          ? "اسم العميل باللغة الإنجليزية مطلوب."
          : "Client name is required.",
      );
      return;
    }

    if (!editForm.title.trim()) {
      setError(
        isArabic
          ? "عنوان المشروع باللغة الإنجليزية مطلوب."
          : "Project title is required.",
      );
      return;
    }

    setSaving(true);

    try {
      const payload: UpdateProjectInput = {
        clientName: editForm.clientName.trim(),
        clientNameAr: editForm.clientNameAr.trim(),

        company: editForm.company.trim(),
        companyAr: editForm.companyAr.trim(),

        title: editForm.title.trim(),
        titleAr: editForm.titleAr.trim(),

        description: editForm.description.trim(),
        descriptionAr: editForm.descriptionAr.trim(),

        status: editForm.status,
        priority: editForm.priority,

        progress:
          editForm.status === "completed"
            ? 100
            : Number(editForm.progress) || 0,

        budget: Number(editForm.budget) || 0,
        currency: editForm.currency,

        notes: editForm.notes.trim(),
        notesAr: editForm.notesAr.trim(),
      };

      const startDate = dateToIso(editForm.startDate);
      const dueDate = dateToIso(editForm.dueDate);

      if (startDate) payload.startDate = startDate;
      if (dueDate) payload.dueDate = dueDate;

      const updated = await updateProject(
        selectedProject.id,
        payload,
      );

      setProjects((current) =>
        current.map((project) =>
          project.id === updated.id
            ? updated
            : project,
        ),
      );

      setSelectedProject(updated);
      setEditOpen(false);
    } catch (error) {
      console.error(error);

      setError(
        error instanceof Error
          ? error.message
          : isArabic
            ? "تعذر تحديث المشروع."
            : "Unable to update project.",
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleStatus(
    project: Project,
    status: ProjectStatus,
  ) {
    setError("");

    try {
      const updated = await updateProject(
        project.id,
        { status },
      );

      setProjects((current) =>
        current.map((item) =>
          item.id === project.id
            ? updated
            : item,
        ),
      );

      if (selectedProject?.id === project.id) {
        setSelectedProject(updated);
      }
    } catch (error) {
      console.error(error);

      setError(
        isArabic
          ? "تعذر تحديث حالة المشروع."
          : "Unable to update project status.",
      );
    }
  }

  function openDelete(project: Project) {
    setDeletingProject(project);
    setError("");
    setDeleteOpen(true);
  }

  async function handleDelete() {
    if (!deletingProject) return;

    setDeleting(true);
    setError("");

    try {
      await deleteProject(deletingProject.id);

      setProjects((current) =>
        current.filter(
          (project) =>
            project.id !== deletingProject.id,
        ),
      );

      setDeleteOpen(false);
      setDeletingProject(null);
    } catch (error) {
      console.error(error);

      setError(
        error instanceof Error
          ? error.message
          : isArabic
            ? "تعذر حذف المشروع."
            : "Unable to delete project.",
      );
    } finally {
      setDeleting(false);
    }
  }

  if (loading) {
    return (
      <AdminLoader
        text={t.loading}
        subtext={t.loadingSub}
      />
    );
  }

  return (
    <div dir={isArabic ? "rtl" : "ltr"}>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <span className="text-[10px] font-black uppercase tracking-[.14em] text-teal-deep">
            {t.delivery}
          </span>

          <h1 className="mt-1 font-display text-4xl font-semibold text-ink">
            {t.projects}
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            {t.subtitle}
          </p>
        </div>

        <button
          onClick={openCreate}
          className="inline-flex h-[44px] items-center justify-center gap-2 rounded-xl bg-ink px-5 text-xs font-black text-white transition hover:opacity-90"
        >
          <Plus size={16} />
          {t.newProject}
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
            className={`h-[44px] w-full rounded-xl border border-slate-200 bg-white text-sm outline-none focus:border-teal-deep ${
              isArabic
                ? "pl-4 pr-10 text-right"
                : "pl-10 pr-4"
            }`}
          />
        </div>

        <select
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
          className="h-[44px] rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-teal-deep"
        >
          <option value="all">
            {t.allStatuses}
          </option>

          {statuses.map((status) => (
            <option
              key={status}
              value={status}
            >
              {formatStatus(status, isArabic)}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-3 text-xs font-bold text-slate-400">
        {filteredProjects.length}{" "}
        {filteredProjects.length === 1
          ? t.project
          : t.projectsCount}
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filteredProjects.map((project) => {
          const title = isArabic
            ? project.titleAr || "—"
            : project.title;

          const client = isArabic
            ? project.clientNameAr || "—"
            : project.clientName;

          const company = isArabic
            ? project.companyAr || ""
            : project.company || "";

          return (
            <div
              key={project.id}
              className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-[#10294c] text-[10px] font-black text-[#8fe6d6]">
                  {getInitials(title)}
                </span>

                <select
                  value={project.status}
                  onChange={(event) =>
                    handleStatus(
                      project,
                      event.target.value as ProjectStatus,
                    )
                  }
                  className={`rounded-xl border px-3 py-2 text-[10px] font-black outline-none ${statusClass(
                    project.status,
                  )}`}
                >
                  {statuses.map((status) => (
                    <option
                      key={status}
                      value={status}
                    >
                      {formatStatus(status, isArabic)}
                    </option>
                  ))}
                </select>
              </div>

              <h3 className="mt-5 font-display text-xl font-semibold text-ink">
                {title}
              </h3>

              <p className="mt-1 text-xs text-slate-400">
                {client}
                {company ? ` • ${company}` : ""}
              </p>

              <p
                dir="ltr"
                className={`mt-2 text-[10px] font-bold text-slate-400 ${
                  isArabic ? "text-right" : ""
                }`}
              >
                {project.projectNo}
              </p>

              <div className="mt-5 grid grid-cols-2 gap-3 rounded-2xl bg-slate-50 p-4">
                <div>
                  <small className="text-[9px] uppercase tracking-[.1em] text-slate-400">
                    {t.budget}
                  </small>

                  <strong
                    dir="ltr"
                    className="mt-1 block text-sm text-ink"
                  >
                    {formatMoney(
                      project.budget,
                      project.currency,
                    )}
                  </strong>
                </div>

                <div>
                  <small className="text-[9px] uppercase tracking-[.1em] text-slate-400">
                    {t.due}
                  </small>

                  <strong className="mt-1 block text-sm text-ink">
                    {project.dueDate
                      ? formatDate(
                          project.dueDate,
                          isArabic,
                        )
                      : "—"}
                  </strong>
                </div>

                <div>
                  <small className="text-[9px] uppercase tracking-[.1em] text-slate-400">
                    {t.priority}
                  </small>

                  <strong className="mt-1 block text-sm text-ink">
                    {formatPriority(
                      project.priority,
                      isArabic,
                    )}
                  </strong>
                </div>

                <div>
                  <small className="text-[9px] uppercase tracking-[.1em] text-slate-400">
                    {t.start}
                  </small>

                  <strong className="mt-1 block text-sm text-ink">
                    {project.startDate
                      ? formatDate(
                          project.startDate,
                          isArabic,
                        )
                      : "—"}
                  </strong>
                </div>
              </div>

              <div className="mt-5 flex justify-between text-[10px]">
                <span className="text-slate-400">
                  {t.progress}
                </span>

                <strong
                  dir="ltr"
                  className="text-ink"
                >
                  {project.progress}%
                </strong>
              </div>

              <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
                <span
                  className="block h-full rounded-full bg-gradient-to-r from-teal to-blue"
                  style={{
                    width: `${project.progress}%`,
                  }}
                />
              </div>

              <div className="mt-5 flex gap-2 border-t border-slate-100 pt-4">
                <button
                  onClick={() => handleView(project.id)}
                  className="grid h-9 w-9 place-items-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50"
                  title={t.view}
                >
                  <Eye size={15} />
                </button>

                <button
                  onClick={() => handleEdit(project.id)}
                  className="grid h-9 w-9 place-items-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50"
                  title={t.edit}
                >
                  <Pencil size={15} />
                </button>

                <button
                  onClick={() => openDelete(project)}
                  className="grid h-9 w-9 place-items-center rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50"
                  title={t.delete}
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          );
        })}

        {filteredProjects.length === 0 && (
          <div className="col-span-full rounded-3xl border border-slate-200 bg-white p-12 text-center text-sm text-slate-400">
            {t.noProjects}
          </div>
        )}
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
          <ProjectFormFields
            form={createForm}
            setForm={setCreateForm}
            quotations={availableQuotations}
            onQuotationChange={handleQuotationChange}
            allowQuotation
            isArabic={isArabic}
          />

          {error && <ErrorBox message={error} />}

          <Actions
            saving={saving}
            cancelText={t.cancel}
            saveText={t.create}
            savingText={t.creating}
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
          title={t.viewTitle}
          subtitle={t.viewSubtitle}
          onClose={() => {
            setViewOpen(false);
            setSelectedProject(null);
          }}
        >
          {viewLoading ? (
            <AdminLoader
              text={t.loadingProject}
              subtext={t.loadingProjectSub}
            />
          ) : (
            selectedProject && (
              <ProjectDetails
                project={selectedProject}
                isArabic={isArabic}
              />
            )
          )}
        </Modal>
      )}

      {editOpen && selectedProject && (
        <Modal
          title={t.editTitle}
          subtitle={selectedProject.projectNo}
          onClose={() => {
            setEditOpen(false);
            setError("");
          }}
        >
          <ProjectFormFields
            form={editForm}
            setForm={setEditForm}
            quotations={[]}
            onQuotationChange={() => {}}
            allowQuotation={false}
            isArabic={isArabic}
          />

          {error && <ErrorBox message={error} />}

          <Actions
            saving={saving}
            cancelText={t.cancel}
            saveText={t.save}
            savingText={t.saving}
            onCancel={() => {
              setEditOpen(false);
              setError("");
            }}
            onSave={handleUpdate}
          />
        </Modal>
      )}

      {deleteOpen && deletingProject && (
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

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  {t.deleteQuestion}{" "}
                  <strong className="text-ink">
                    {deletingProject.projectNo}
                  </strong>
                  ? {t.deleteWarning}
                </p>
              </div>

              <button
                onClick={() => {
                  setDeleteOpen(false);
                  setDeletingProject(null);
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
                  setDeletingProject(null);
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
                {deleting
                  ? t.deleting
                  : t.deleteProject}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ProjectFormFields({
  form,
  setForm,
  quotations,
  onQuotationChange,
  allowQuotation,
  isArabic,
}: {
  form: ProjectForm;
  setForm: Dispatch<SetStateAction<ProjectForm>>;
  quotations: Quotation[];
  onQuotationChange: (value: string) => void;
  allowQuotation: boolean;
  isArabic: boolean;
}) {
  return (
    <div className="mt-6 space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        {allowQuotation && (
          <div className="sm:col-span-2">
            <Field
              label={
                isArabic
                  ? "عرض السعر المقبول"
                  : "Accepted Quotation"
              }
            >
              <select
                value={form.quotationId}
                onChange={(event) =>
                  onQuotationChange(
                    event.target.value,
                  )
                }
                className={inputClass}
              >
                <option value="">
                  {isArabic
                    ? "إنشاء المشروع يدوياً"
                    : "Create manually"}
                </option>

                {quotations.map((quotation) => {
                  const customer = isArabic
                    ? quotation.customerNameAr || "—"
                    : quotation.customerName;

                  return (
                    <option
                      key={quotation.id}
                      value={quotation.id}
                    >
                      {quotation.quotationNo} — {customer}
                    </option>
                  );
                })}
              </select>
            </Field>
          </div>
        )}

        <Field label="Client Name (English) *">
          <input
            value={form.clientName}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                clientName: event.target.value,
              }))
            }
            className={inputClass}
            placeholder="Client name"
          />
        </Field>

        <Field label="اسم العميل (العربية)">
          <input
            dir="rtl"
            value={form.clientNameAr}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                clientNameAr: event.target.value,
              }))
            }
            className={`${inputClass} text-right`}
            placeholder="اسم العميل"
          />
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

        <Field label="Project Title (English) *">
          <input
            value={form.title}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                title: event.target.value,
              }))
            }
            className={inputClass}
            placeholder="Project title"
          />
        </Field>

        <Field label="عنوان المشروع (العربية)">
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
            placeholder="عنوان المشروع"
          />
        </Field>

        <Field label={isArabic ? "الحالة" : "Status"}>
          <select
            value={form.status}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                status:
                  event.target
                    .value as ProjectStatus,
                progress:
                  event.target.value ===
                  "completed"
                    ? "100"
                    : current.progress,
              }))
            }
            className={inputClass}
          >
            {statuses.map((status) => (
              <option
                key={status}
                value={status}
              >
                {formatStatus(status, isArabic)}
              </option>
            ))}
          </select>
        </Field>

        <Field label={isArabic ? "الأولوية" : "Priority"}>
          <select
            value={form.priority}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                priority:
                  event.target
                    .value as ProjectPriority,
              }))
            }
            className={inputClass}
          >
            {priorities.map((priority) => (
              <option
                key={priority}
                value={priority}
              >
                {formatPriority(
                  priority,
                  isArabic,
                )}
              </option>
            ))}
          </select>
        </Field>

        <Field label={isArabic ? "التقدم (%)" : "Progress (%)"}>
          <input
            type="number"
            min="0"
            max="100"
            value={form.progress}
            disabled={
              form.status === "completed"
            }
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                progress: event.target.value,
              }))
            }
            className={inputClass}
          />
        </Field>

        <Field label={isArabic ? "الميزانية" : "Budget"}>
          <input
            type="number"
            min="0"
            step="0.01"
            value={form.budget}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                budget: event.target.value,
              }))
            }
            className={inputClass}
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
            <option value="SAR">SAR — &#x20C1;</option>
            <option value="USD">USD — $</option>
            <option value="AED">AED — د.إ</option>
          </select>
        </Field>

        <Field label={isArabic ? "تاريخ البدء" : "Start Date"}>
          <input
            type="date"
            value={form.startDate}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                startDate: event.target.value,
              }))
            }
            className={inputClass}
          />
        </Field>

        <Field label={isArabic ? "تاريخ الاستحقاق" : "Due Date"}>
          <input
            type="date"
            value={form.dueDate}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                dueDate: event.target.value,
              }))
            }
            className={inputClass}
          />
        </Field>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Description (English)">
          <textarea
            rows={3}
            value={form.description}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                description: event.target.value,
              }))
            }
            className={`${inputClass} min-h-[100px] py-3`}
            placeholder="Project description..."
          />
        </Field>

        <Field label="الوصف (العربية)">
          <textarea
            dir="rtl"
            rows={3}
            value={form.descriptionAr}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                descriptionAr: event.target.value,
              }))
            }
            className={`${inputClass} min-h-[100px] py-3 text-right`}
            placeholder="وصف المشروع..."
          />
        </Field>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Notes (English)">
          <textarea
            rows={3}
            value={form.notes}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                notes: event.target.value,
              }))
            }
            className={`${inputClass} min-h-[90px] py-3`}
            placeholder="Project notes..."
          />
        </Field>

        <Field label="ملاحظات (العربية)">
          <textarea
            dir="rtl"
            rows={3}
            value={form.notesAr}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                notesAr: event.target.value,
              }))
            }
            className={`${inputClass} min-h-[90px] py-3 text-right`}
            placeholder="ملاحظات المشروع..."
          />
        </Field>
      </div>
    </div>
  );
}

function ProjectDetails({
  project,
  isArabic,
}: {
  project: Project;
  isArabic: boolean;
}) {
  const client = isArabic
    ? project.clientNameAr || "—"
    : project.clientName;

  const company = isArabic
    ? project.companyAr || "—"
    : project.company || "—";

  const title = isArabic
    ? project.titleAr || "—"
    : project.title;

  const description = isArabic
    ? project.descriptionAr
    : project.description;

  const notes = isArabic
    ? project.notesAr
    : project.notes;

  return (
    <div
      dir={isArabic ? "rtl" : "ltr"}
      className="mt-6 grid gap-4 sm:grid-cols-2"
    >
      <Detail
        label={
          isArabic
            ? "رقم المشروع"
            : "Project No."
        }
        value={project.projectNo}
      />

      <Detail
        label={
          isArabic
            ? "العميل"
            : "Client"
        }
        value={client}
      />

      <Detail
        label={
          isArabic
            ? "الشركة"
            : "Company"
        }
        value={company}
      />

      <Detail
        label={
          isArabic
            ? "المشروع"
            : "Project"
        }
        value={title}
      />

      <Detail
        label={
          isArabic
            ? "الحالة"
            : "Status"
        }
        value={formatStatus(
          project.status,
          isArabic,
        )}
      />

      <Detail
        label={
          isArabic
            ? "الأولوية"
            : "Priority"
        }
        value={formatPriority(
          project.priority,
          isArabic,
        )}
      />

      <Detail
        label={
          isArabic
            ? "التقدم"
            : "Progress"
        }
        value={`${project.progress}%`}
        ltr
      />

      <Detail
        label={
          isArabic
            ? "الميزانية"
            : "Budget"
        }
        value={formatMoney(
          project.budget,
          project.currency,
        )}
        ltr
      />

      <Detail
        label={
          isArabic
            ? "تاريخ البدء"
            : "Start Date"
        }
        value={
          project.startDate
            ? formatDate(
                project.startDate,
                isArabic,
              )
            : "—"
        }
      />

      <Detail
        label={
          isArabic
            ? "تاريخ الاستحقاق"
            : "Due Date"
        }
        value={
          project.dueDate
            ? formatDate(
                project.dueDate,
                isArabic,
              )
            : "—"
        }
      />

      <div className="sm:col-span-2">
        <Detail
          label={
            isArabic
              ? "الوصف"
              : "Description"
          }
          value={description}
        />
      </div>

      <div className="sm:col-span-2">
        <Detail
          label={
            isArabic
              ? "ملاحظات"
              : "Notes"
          }
          value={notes}
        />
      </div>
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
      <div className="mx-auto my-8 w-full max-w-[900px] rounded-3xl bg-white p-7 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="font-display text-2xl font-semibold text-ink">
              {title}
            </h2>

            {subtitle && (
              <p className="mt-1 text-sm text-slate-400">
                {subtitle}
              </p>
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
      <div className="mt-2">
        {children}
      </div>
    </label>
  );
}

function Detail({
  label,
  value,
  ltr = false,
}: {
  label: string;
  value?: string | null;
  ltr?: boolean;
}) {
  return (
    <div>
      <span className="text-xs font-bold text-slate-600">
        {label}
      </span>

      <div
        dir={ltr ? "ltr" : undefined}
        className="mt-2 min-h-[44px] whitespace-pre-wrap rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600"
      >
        {value || "—"}
      </div>
    </div>
  );
}

function ErrorBox({
  message,
}: {
  message: string;
}) {
  return (
    <div className="mt-5 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-bold text-rose-600">
      {message}
    </div>
  );
}

function Actions({
  saving,
  cancelText,
  saveText,
  savingText,
  onCancel,
  onSave,
}: {
  saving: boolean;
  cancelText: string;
  saveText: string;
  savingText: string;
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
        {cancelText}
      </button>

      <button
        onClick={onSave}
        disabled={saving}
        className="rounded-xl bg-ink px-5 py-3 text-xs font-black text-white disabled:opacity-60"
      >
        {saving
          ? savingText
          : saveText}
      </button>
    </div>
  );
}

function formatStatus(
  status: ProjectStatus,
  isArabic: boolean,
) {
  if (isArabic) {
    const labels: Record<ProjectStatus, string> = {
      planning: "التخطيط",
      active: "نشط",
      on_hold: "معلق",
      completed: "مكتمل",
      cancelled: "ملغي",
    };

    return labels[status];
  }

  return formatValue(status);
}

function formatPriority(
  priority: ProjectPriority,
  isArabic: boolean,
) {
  if (isArabic) {
    const labels: Record<ProjectPriority, string> = {
      low: "منخفضة",
      medium: "متوسطة",
      high: "عالية",
      urgent: "عاجلة",
    };

    return labels[priority];
  }

  return formatValue(priority);
}

function statusClass(status: ProjectStatus) {
  switch (status) {
    case "active":
      return "border-blue-200 bg-blue-50 text-blue-700";

    case "completed":
      return "border-emerald-200 bg-emerald-50 text-emerald-700";

    case "on_hold":
      return "border-amber-200 bg-amber-50 text-amber-700";

    case "cancelled":
      return "border-rose-200 bg-rose-50 text-rose-700";

    default:
      return "border-slate-200 bg-slate-50 text-slate-700";
  }
}

function formatValue(value: string) {
  return value
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letter) =>
      letter.toUpperCase(),
    );
}

function getInitials(value: string) {
  if (!value || value === "—") {
    return "PR";
  }

  return value
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((item) => item[0])
    .join("")
    .toUpperCase();
}

function formatMoney(
  amount: number,
  currency: string,
) {
  const symbols: Record<string, string> = {
    SAR: "\u20C1",
    USD: "$",
    AED: "د.إ",
  };

  const symbol =
    symbols[currency] || currency;

  // Keep Western digits in both English and Arabic mode.
  const value =
    new Intl.NumberFormat("en-US", {
      useGrouping: false,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(Number(amount) || 0);

  return `${symbol} ${value}`;
}

function formatDate(
  value: string,
  isArabic = false,
) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat(
    isArabic
      ? "ar-SA-u-ca-gregory-nu-latn"
      : "en-GB",
    {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    },
  ).format(date);
}

function dateInputValue(
  value?: string | null,
) {
  if (!value) return "";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date
    .toISOString()
    .slice(0, 10);
}

function dateToIso(value: string) {
  if (!value) return undefined;

  return new Date(
    `${value}T00:00:00.000Z`,
  ).toISOString();
}

const inputClass =
  "h-[44px] w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none transition focus:border-teal-deep";