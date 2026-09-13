import {
  Blocks,
  BrainCircuit,
  BriefcaseBusiness,
  Building2,
  CloudCog,
  Code2,
  Cpu,
  Database,
  Factory,
  Globe2,
  HeartPulse,
  Layers3,
  LockKeyhole,
  PackageCheck,
  PanelsTopLeft,
  Rocket,
  ShieldCheck,
  ShoppingCart,
  Smartphone,
  Workflow,
} from "lucide-react";

export const services = [
  {
    slug: "erp-odoo",
    title: "ERP & Odoo Engineering",
    titleAr: "هندسة أنظمة ERP و Odoo",
    short:
      "Finance, operations, HR, inventory, manufacturing and approvals in one connected business system.",
    shortAr:
      "إدارة المالية والعمليات والموارد البشرية والمخزون والتصنيع والموافقات ضمن نظام أعمال متكامل.",
    icon: Database,
    kicker: "Enterprise operations",
    kickerAr: "عمليات المؤسسات",
    hero: "Make ERP feel like it was designed for your business.",
    heroAr: "اجعل نظام ERP يعمل بالطريقة التي تناسب أعمالك.",
    description:
      "We design, implement and extend Odoo around real business workflows, including migration, custom modules, integrations and ongoing support.",
    descriptionAr:
      "نقوم بتصميم وتنفيذ وتطوير Odoo وفقاً لسير العمل الحقيقي للمؤسسة، بما يشمل ترحيل البيانات والوحدات المخصصة والتكاملات والدعم المستمر.",
    features: [
      "Odoo implementation",
      "Custom modules",
      "Accounting & finance",
      "Inventory & procurement",
      "HR & payroll",
      "API integrations",
    ],
    featuresAr: [
      "تنفيذ نظام Odoo",
      "تطوير وحدات مخصصة",
      "المحاسبة والمالية",
      "المخزون والمشتريات",
      "الموارد البشرية والرواتب",
      "تكامل واجهات API",
    ],
    outcomes: [
      "One source of operational truth",
      "Fewer manual processes",
      "Faster approvals",
      "Cleaner reporting",
    ],
    outcomesAr: [
      "مصدر موحد للبيانات التشغيلية",
      "تقليل العمليات اليدوية",
      "تسريع إجراءات الموافقة",
      "تقارير أكثر وضوحاً",
    ],
  },

  {
    // Keep existing slug so current URLs do not break
    slug: "flutter-apps",
    title: "Mobile Development",
    titleAr: "تطوير تطبيقات الجوال",
    short:
      "Modern Android and iOS applications built with scalable cross-platform technologies.",
    shortAr:
      "تطبيقات حديثة لنظامي Android وiOS باستخدام تقنيات متعددة المنصات وقابلة للتوسع.",
    icon: Smartphone,
    kicker: "Mobile applications",
    kickerAr: "تطبيقات الجوال",
    hero: "Mobile apps built for real users and real business workflows.",
    heroAr:
      "تطبيقات جوال مصممة للمستخدمين الحقيقيين وعمليات الأعمال الفعلية.",
    description:
      "We develop production-ready mobile applications for customers, field teams and internal operations using modern mobile technologies and secure backend integrations.",
    descriptionAr:
      "نطور تطبيقات جوال جاهزة للإنتاج للعملاء والفرق الميدانية والعمليات الداخلية باستخدام تقنيات حديثة وتكاملات آمنة مع الأنظمة الخلفية.",
    features: [
      "React Native",
      "Flutter",
      "Android & iOS",
      "Cross-platform apps",
      "API integration",
      "Push notifications",
      "Secure authentication",
      "Mobile UI/UX",
    ],
    featuresAr: [
      "React Native",
      "Flutter",
      "Android و iOS",
      "تطبيقات متعددة المنصات",
      "تكامل واجهات API",
      "الإشعارات الفورية",
      "المصادقة الآمنة",
      "تصميم وتجربة مستخدم للجوال",
    ],
    outcomes: [
      "Better mobile experience",
      "Faster operational workflows",
      "Lower cross-platform cost",
      "Reliable application performance",
    ],
    outcomesAr: [
      "تجربة أفضل على الجوال",
      "سير عمل أسرع",
      "خفض تكلفة تطوير المنصات المتعددة",
      "أداء أكثر استقراراً للتطبيقات",
    ],
  },

  {
    slug: "web-platforms",
    title: "Web Development",
    titleAr: "تطوير الويب",
    short:
      "Modern websites, portals, dashboards and web applications using leading frontend and backend technologies.",
    shortAr:
      "مواقع وبوابات ولوحات تحكم وتطبيقات ويب حديثة باستخدام أحدث تقنيات الواجهة الأمامية والخلفية.",
    icon: PanelsTopLeft,
    kicker: "Web engineering",
    kickerAr: "هندسة الويب",
    hero:
      "Modern web development for websites, platforms and scalable digital products.",
    heroAr:
      "تطوير ويب حديث للمواقع والمنصات والمنتجات الرقمية القابلة للتوسع.",
    description:
      "We build websites, portals, dashboards, SaaS products and enterprise web platforms using modern frontend, backend and database technologies.",
    descriptionAr:
      "نقوم ببناء المواقع والبوابات ولوحات التحكم ومنتجات SaaS ومنصات الويب للمؤسسات باستخدام تقنيات حديثة للواجهة الأمامية والخلفية وقواعد البيانات.",
    features: [
      "HTML5 & CSS3",
      "JavaScript & TypeScript",
      "React.js",
      "Next.js",
      "Vue.js & Angular",
      "Node.js",
      "Express.js",
      "NestJS",
      "PHP",
      "Laravel",
      "Python",
      "Django & FastAPI",
    ],
    featuresAr: [
      "HTML5 و CSS3",
      "JavaScript و TypeScript",
      "React.js",
      "Next.js",
      "Vue.js و Angular",
      "Node.js",
      "Express.js",
      "NestJS",
      "PHP",
      "Laravel",
      "Python",
      "Django و FastAPI",
    ],
    outcomes: [
      "Modern scalable web applications",
      "Fast and responsive experiences",
      "Maintainable software architecture",
      "Strong online business presence",
    ],
    outcomesAr: [
      "تطبيقات ويب حديثة وقابلة للتوسع",
      "تجارب سريعة ومتجاوبة",
      "بنية برمجية سهلة الصيانة",
      "حضور رقمي أقوى للأعمال",
    ],
  },

  {
    slug: "ai-automation",
    title: "AI & Automation",
    titleAr: "الذكاء الاصطناعي والأتمتة",
    short:
      "AI assistants, intelligent search and workflow automation integrated directly into business operations.",
    shortAr:
      "مساعدات ذكاء اصطناعي وبحث ذكي وأتمتة لسير العمل مدمجة مباشرة في عمليات المؤسسة.",
    icon: BrainCircuit,
    kicker: "Applied AI",
    kickerAr: "الذكاء الاصطناعي التطبيقي",
    hero: "Put AI inside the workflow — not beside it.",
    heroAr:
      "ادمج الذكاء الاصطناعي داخل سير العمل، وليس بجانبه.",
    description:
      "We combine language models, enterprise data, retrieval and business rules to create AI systems that help teams perform real work.",
    descriptionAr:
      "نجمع بين نماذج اللغة وبيانات المؤسسة وأنظمة الاسترجاع وقواعد العمل لبناء حلول ذكاء اصطناعي تساعد الفرق على تنفيذ الأعمال الفعلية.",
    features: [
      "RAG assistants",
      "AI copilots",
      "Document intelligence",
      "Semantic search",
      "Workflow agents",
      "Process automation",
    ],
    featuresAr: [
      "مساعدات RAG",
      "مساعدات الذكاء الاصطناعي",
      "ذكاء المستندات",
      "البحث الدلالي",
      "وكلاء سير العمل",
      "أتمتة العمليات",
    ],
    outcomes: [
      "Faster access to knowledge",
      "Less repetitive work",
      "More consistent decisions",
      "Controlled automation",
    ],
    outcomesAr: [
      "وصول أسرع إلى المعرفة",
      "تقليل الأعمال المتكررة",
      "قرارات أكثر اتساقاً",
      "أتمتة أكثر تحكماً",
    ],
  },

  {
    slug: "cybersecurity",
    title: "Cybersecurity",
    titleAr: "الأمن السيبراني",
    short:
      "Security engineering for applications, APIs, ERP systems, identities and cloud infrastructure.",
    shortAr:
      "حلول أمنية للتطبيقات وواجهات API وأنظمة ERP والهوية والبنية التحتية السحابية.",
    icon: ShieldCheck,
    kicker: "Secure delivery",
    kickerAr: "تسليم آمن",
    hero: "Secure the software your operation depends on.",
    heroAr:
      "احمِ البرمجيات والأنظمة التي تعتمد عليها عمليات مؤسستك.",
    description:
      "We integrate security controls across applications, identities, APIs, infrastructure and ERP access to reduce operational risk.",
    descriptionAr:
      "ندمج ضوابط الأمن في التطبيقات والهوية وواجهات API والبنية التحتية وصلاحيات ERP لتقليل المخاطر التشغيلية.",
    features: [
      "Security reviews",
      "IAM & RBAC",
      "API hardening",
      "Application security",
      "Cloud security",
      "ERP access controls",
      "Monitoring",
      "Security remediation",
    ],
    featuresAr: [
      "المراجعات الأمنية",
      "إدارة الهوية والصلاحيات",
      "حماية واجهات API",
      "أمن التطبيقات",
      "أمن السحابة",
      "ضوابط الوصول إلى ERP",
      "المراقبة الأمنية",
      "معالجة الثغرات",
    ],
    outcomes: [
      "Reduced attack surface",
      "Better access control",
      "Safer deployments",
      "Improved security visibility",
    ],
    outcomesAr: [
      "تقليل سطح الهجوم",
      "تحسين التحكم في الصلاحيات",
      "عمليات نشر أكثر أماناً",
      "رؤية أمنية أفضل",
    ],
  },

  {
    slug: "cloud-devops",
    title: "Cloud & DevOps",
    titleAr: "الحوسبة السحابية وDevOps",
    short:
      "Cloud infrastructure, containers, CI/CD pipelines, monitoring and deployment automation.",
    shortAr:
      "بنية تحتية سحابية وحاويات وخطوط CI/CD ومراقبة وأتمتة لعمليات النشر.",
    icon: CloudCog,
    kicker: "Platform engineering",
    kickerAr: "هندسة المنصات",
    hero:
      "Ship software with confidence, observability and repeatability.",
    heroAr:
      "أطلق البرمجيات بثقة مع مراقبة واضحة وعمليات قابلة للتكرار.",
    description:
      "We build cloud environments and DevOps pipelines that make deployments safer, infrastructure easier to manage and systems easier to monitor.",
    descriptionAr:
      "نبني البيئات السحابية وخطوط DevOps التي تجعل النشر أكثر أماناً والبنية التحتية أسهل في الإدارة والأنظمة أسهل في المراقبة.",
    features: [
      "Docker",
      "CI/CD",
      "AWS cloud",
      "Deployment automation",
      "Observability",
      "Backups",
      "Infrastructure automation",
    ],
    featuresAr: [
      "Docker",
      "CI/CD",
      "سحابة AWS",
      "أتمتة النشر",
      "المراقبة التشغيلية",
      "النسخ الاحتياطي",
      "أتمتة البنية التحتية",
    ],
    outcomes: [
      "Predictable releases",
      "Lower deployment risk",
      "Faster recovery",
      "Better infrastructure visibility",
    ],
    outcomesAr: [
      "إصدارات أكثر استقراراً",
      "تقليل مخاطر النشر",
      "استعادة أسرع",
      "رؤية أفضل للبنية التحتية",
    ],
  },
];
// Keep existing industries export
export const industries = [
  {
    title: "Retail & Commerce",
    titleAr: "التجزئة والتجارة",
    icon: ShoppingCart,
    copy: "Connected inventory, POS, commerce, loyalty and analytics for modern retail operations.",
    copyAr: "ربط المخزون ونقاط البيع والتجارة وبرامج الولاء والتحليلات ضمن عمليات تجزئة حديثة.",
    tags: ["ERP", "eCommerce", "POS", "Analytics"],
    tagsAr: ["ERP", "التجارة الإلكترونية", "نقاط البيع", "التحليلات"],
  },
  {
    title: "Manufacturing",
    titleAr: "التصنيع",
    icon: Factory,
    copy: "Planning, production, maintenance, quality and material flow connected across the operation.",
    copyAr: "ربط التخطيط والإنتاج والصيانة والجودة وتدفق المواد عبر العمليات الصناعية.",
    tags: ["ERP", "Production", "Inventory", "Automation"],
    tagsAr: ["ERP", "الإنتاج", "المخزون", "الأتمتة"],
  },
  {
    title: "Healthcare",
    titleAr: "الرعاية الصحية",
    icon: HeartPulse,
    copy: "Secure portals, workflows, scheduling and operational systems designed for healthcare environments.",
    copyAr: "بوابات آمنة وسير عمل وجدولة وأنظمة تشغيلية مصممة لبيئات الرعاية الصحية.",
    tags: ["Portals", "Workflows", "Security", "Analytics"],
    tagsAr: ["البوابات", "سير العمل", "الأمن", "التحليلات"],
  },
  {
    title: "Logistics",
    titleAr: "الخدمات اللوجستية",
    icon: PackageCheck,
    copy: "Fleet, warehouse, route, customer and delivery operations connected through one digital workflow.",
    copyAr: "ربط الأسطول والمستودعات والمسارات والعملاء وعمليات التسليم ضمن سير عمل رقمي موحد.",
    tags: ["Fleet", "Warehouse", "Tracking", "Automation"],
    tagsAr: ["الأسطول", "المستودعات", "التتبع", "الأتمتة"],
  },
  {
    title: "Professional Services",
    titleAr: "الخدمات المهنية",
    icon: BriefcaseBusiness,
    copy: "Projects, time, billing, CRM and delivery visibility for service-based organizations.",
    copyAr: "إدارة المشاريع والوقت والفوترة والعملاء ومتابعة التنفيذ للمؤسسات الخدمية.",
    tags: ["Projects", "CRM", "Billing", "Reporting"],
    tagsAr: ["المشاريع", "CRM", "الفوترة", "التقارير"],
  },
  {
    title: "Enterprise",
    titleAr: "المؤسسات",
    icon: Building2,
    copy: "Integrated ERP, identity, portals, data and automation for complex enterprise operations.",
    copyAr: "تكامل ERP والهوية والبوابات والبيانات والأتمتة للعمليات المؤسسية المعقدة.",
    tags: ["ERP", "Identity", "Data", "Automation"],
    tagsAr: ["ERP", "الهوية", "البيانات", "الأتمتة"],
  },
];

// Keep existing technology stack export
export const techStack = [
  { name: "HTML5", icon: Code2 },
  { name: "CSS3", icon: Code2 },
  { name: "JavaScript", icon: Code2 },
  { name: "TypeScript", icon: Code2 },

  { name: "React.js", icon: Blocks },
  { name: "Next.js", icon: Globe2 },
  { name: "React Native", icon: Smartphone },
  { name: "Vue.js", icon: Blocks },
  { name: "Angular", icon: Blocks },

  { name: "Node.js", icon: Cpu },
  { name: "Express.js", icon: Workflow },
  { name: "NestJS", icon: Blocks },

  { name: "PHP", icon: Code2 },
  { name: "Laravel", icon: Layers3 },

  { name: "Python", icon: Code2 },
  { name: "Django", icon: Workflow },
  { name: "FastAPI", icon: Workflow },

  { name: "Flutter", icon: Smartphone },

  { name: "PostgreSQL", icon: Database },
  { name: "MySQL", icon: Database },
  { name: "MongoDB", icon: Database },
  { name: "Redis", icon: Database },
  { name: "Prisma", icon: Layers3 },
];

// Old static portfolio data is still used by any pages not migrated yet
export const portfolio = [
  {
    title: "Unified Service Operations",
    type: "ERP + Portal",
    metric: "42% faster approvals",
    copy: "Integrated sales, workshop, inventory and finance into one operational workflow.",
  },
  {
    title: "Field Workforce App",
    type: "Flutter",
    metric: "3x faster reporting",
    copy: "Offline-first field application connected to ERP work orders and customer records.",
  },
  {
    title: "B2B Customer Platform",
    type: "Next.js",
    metric: "61% self-service",
    copy: "Secure customer portal for orders, invoices, tickets and account management.",
  },
  {
    title: "Enterprise Knowledge Copilot",
    type: "AI / RAG",
    metric: "70% search reduction",
    copy: "Permission-aware assistant across procedures, contracts and internal knowledge.",
  },
  {
    title: "Cloud Delivery Platform",
    type: "DevOps",
    metric: "Daily deployments",
    copy: "Containerized infrastructure with CI/CD, monitoring and staged releases.",
  },
  {
    title: "ERP Security Hardening",
    type: "Cybersecurity",
    metric: "Zero critical findings",
    copy: "Role redesign, API controls, environment hardening and audit visibility.",
  },
];

// Old static blog data remains temporarily for any component still importing it
export const posts = [
  {
    slug: "erp-before-automation",
    tag: "ERP",
    date: "Sep 02, 2026",
    title: "Why workflow clarity should come before ERP automation",
    excerpt: "Automation accelerates whatever process already exists. Start by making the process worth accelerating.",
  },
  {
    slug: "nextjs-enterprise",
    tag: "Web",
    date: "Aug 24, 2026",
    title: "What makes a Next.js platform enterprise-ready?",
    excerpt: "Performance matters, but governance, security, observability and maintainability matter just as much.",
  },
  {
    slug: "ai-operational-layer",
    tag: "AI",
    date: "Aug 11, 2026",
    title: "AI as an operational layer, not another chat window",
    excerpt: "The strongest AI products connect reasoning to data, permissions and actions inside existing workflows.",
  },
];