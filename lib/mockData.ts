import type { LucideIcon } from "lucide-react";
import {
  Activity,
  Brain,
  ClipboardCheck,
  Droplets,
  FlaskConical,
  HeartPulse,
  Microscope,
  NotebookPen,
  Pill,
  PillBottle,
  ScrollText,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  Syringe,
  TestTubes,
  Thermometer,
  UserSearch,
} from "lucide-react";

export type Category = {
  title: string;
  description: string;
  href: string;
  cta: string;
  icon: LucideIcon;
  accent?: string;
};

export type NewsItem = {
  title: string;
  description: string;
  href: string;
  tag: string;
  timestamp: string;
  image: string;
};

export type ToolItem = {
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
  gradient?: string;
};

export const categories: Category[] = [
  {
    title: "Top Medications",
    description:
      "Most prescribed and researched medications with clinical guidance and patient tips.",
    href: "/drugs",
    cta: "Browse →",
    icon: Pill,
    accent: "from-[#D8F2FF] via-[#F0FAFF] to-[#E0F6FF]",
  },
  {
    title: "Health Conditions",
    description:
      "Evidence-based summaries covering symptoms, diagnostics, and treatment pathways.",
    href: "/supplements",
    cta: "Explore →",
    icon: HeartPulse,
    accent: "from-[#E6EBFF] via-[#EEF1FF] to-[#F5F8FF]",
  },
  {
    title: "Drug Interactions",
    description:
      "Check for medication conflicts, contraindications, and clinical monitoring guidance.",
    href: "/interactions",
    cta: "Check →",
    icon: Microscope,
    accent: "from-[#FFE7EE] via-[#FFF3F6] to-[#FFEFF3]",
  },
  {
    title: "Health Guides",
    description:
      "Expert-written guides to support treatment adherence and lifestyle recommendations.",
    href: "/guides",
    cta: "Read →",
    icon: ClipboardCheck,
    accent: "from-[#E8FFF5] via-[#F2FFF9] to-[#ECFFF7]",
  },
];

export const news: NewsItem[] = [
  {
    title: "New Breakthrough in Cancer Treatment Shows Promise",
    description:
      "Researchers have identified a targeted therapy that significantly improves remission rates in aggressive solid tumors.",
    href: "/news/breakthrough-cancer-treatment",
    tag: "Research",
    timestamp: "2 hours ago",
    image:
      "https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "FDA Approves New Diabetes Medication",
    description:
      "A once-weekly injection for type 2 diabetes has received approval after demonstrating durable glucose control.",
    href: "/news/fda-approves-diabetes-medication",
    tag: "Healthcare",
    timestamp: "5 hours ago",
    image:
      "https://images.unsplash.com/photo-1631549916768-4119b2e5f926?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Important Drug Recall Notice Issued",
    description:
      "The FDA has issued a recall for specific blood pressure medications due to potential contamination concerns.",
    href: "/news/drug-recall-notice",
    tag: "Drug Safety",
    timestamp: "1 day ago",
    image:
      "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?auto=format&fit=crop&w=1200&q=80",
  },
];

export const tools: ToolItem[] = [
  {
    title: "Pill Identifier",
    description:
      "Identify medications by color, shape, and imprint codes with detailed references.",
    href: "/pill-identifier",
    icon: Pill,
    gradient: "from-[#D7E8FF] via-[#E8F3FF] to-[#F1F8FF]",
  },
  {
    title: "Interaction Checker",
    description:
      "Quickly evaluate potential interactions between prescription and OTC medications.",
    href: "/interactions",
    icon: ShieldCheck,
    gradient: "from-[#DAFFF3] via-[#E8FFF8] to-[#F2FFFA]",
  },
  {
    title: "Dosage Calculator",
    description:
      "Calculate weight-based or renal-adjusted medication dosages with clinical safeguards.",
    href: "/dosage-calculator",
    icon: Syringe,
    gradient: "from-[#FFEBD8] via-[#FFF2E6] to-[#FFF6EE]",
  },
  {
    title: "Lab Reference Ranges",
    description:
      "Search age-specific and condition-specific laboratory reference ranges instantly.",
    href: "/tools/lab-reference",
    icon: TestTubes,
    gradient: "from-[#EAE6FF] via-[#F4F2FF] to-[#F8F6FF]",
  },
  {
    title: "Immunization Schedules",
    description:
      "Stay updated with CDC-recommended immunization schedules tailored for each age group.",
    href: "/tools/immunization-schedules",
    icon: Activity,
    gradient: "from-[#E6FFF2] via-[#F1FFF8] to-[#F5FFF9]",
  },
  {
    title: "Symptom Checker",
    description:
      "Assess symptoms with evidence-backed decision trees and next-step guidance.",
    href: "/tools/symptom-checker",
    icon: Brain,
    gradient: "from-[#FFE8F1] via-[#FFF0F6] to-[#FFF5F9]",
  },
];

export const featureHighlights = [
  {
    title: "Clinical Accuracy",
    description:
      "Reviewed by pharmacists and physicians with daily data refreshes from FDA and EMA resources.",
    icon: Stethoscope,
  },
  {
    title: "Personalized Experience",
    description:
      "Bookmark medications, set reminders, and tailor dashboards with patient or provider modes.",
    icon: PillBottle,
  },
  {
    title: "Decision Support",
    description:
      "Smart calculators, risk scores, and alerts designed to support confident clinical decisions.",
    icon: Droplets,
  },
];

export type SectionContent = {
  slug: string;
  title: string;
  description: string;
  heroImage: string;
  highlights: {
    title: string;
    description: string;
    icon: LucideIcon;
  }[];
  actions: {
    label: string;
    href: string;
  }[];
};

export const sectionContent: Record<string, SectionContent> = {
  drugs: {
    slug: "drugs",
    title: "Comprehensive Drug Information",
    description:
      "Detailed monographs with dosing, pharmacology, monitoring parameters, and patient counseling points.",
    heroImage:
      "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?auto=format&fit=crop&w=1600&q=80",
    highlights: [
      {
        title: "Clinical Dosing",
        description:
          "Adult, pediatric, renal, and hepatic dosing adjustments sourced from trusted formularies.",
        icon: Syringe,
      },
      {
        title: "Safety Monitoring",
        description:
          "Contraindications, black box warnings, and lab monitoring recommendations.",
        icon: ShieldCheck,
      },
      {
        title: "Pharmacology Insights",
        description:
          "Mechanisms of action, metabolism pathways, and half-life details.",
        icon: Microscope,
      },
    ],
    actions: [
      { label: "Browse Drug Classes", href: "/drugs/classes" },
      { label: "View Formulary Updates", href: "/drugs/updates" },
    ],
  },
  supplements: {
    slug: "supplements",
    title: "Integrative & Supplement Library",
    description:
      "Evidence-based guidance on herbal products, vitamins, and integrative therapies.",
    heroImage:
      "https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?auto=format&fit=crop&w=1600&q=80",
    highlights: [
      {
        title: "Research Summaries",
        description:
          "Clinical trial outcomes and interaction data with conventional therapies.",
        icon: FlaskConical,
      },
      {
        title: "Usage Guidance",
        description:
          "Dosing ranges, safety profiles, and counseling considerations.",
        icon: NotebookPen,
      },
      {
        title: "Quality Indicators",
        description: "Third-party certifications and manufacturing standards.",
        icon: Sparkles,
      },
    ],
    actions: [
      { label: "Explore Supplement Index", href: "/supplements/index" },
      {
        label: "Compare Herbal Interactions",
        href: "/supplements/interactions",
      },
    ],
  },
  interactions: {
    slug: "interactions",
    title: "Drug Interaction Intelligence",
    description:
      "Identify clinically significant interactions with severity ranking and management recommendations.",
    heroImage:
      "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=1600&q=80",
    highlights: [
      {
        title: "Severity Ratings",
        description:
          "Clear risk stratification across minor, moderate, and major interaction levels.",
        icon: Activity,
      },
      {
        title: "Management Steps",
        description:
          "Evidence-backed strategies including monitoring and alternative therapy options.",
        icon: ClipboardCheck,
      },
      {
        title: "Real-time Alerts",
        description:
          "Stay informed with updates from FDA and EMA safety communications.",
        icon: Thermometer,
      },
    ],
    actions: [
      { label: "Run an Interaction Check", href: "/interactions/check" },
      { label: "Browse Interaction Guides", href: "/interactions/guides" },
    ],
  },
  "pill-identifier": {
    slug: "pill-identifier",
    title: "Advanced Pill Identifier",
    description:
      "Identify unknown tablets and capsules using imprint, color, and shape filters.",
    heroImage:
      "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=1600&q=80",
    highlights: [
      {
        title: "Imprint Lookup",
        description:
          "Search thousands of FDA-approved imprints with optical character recognition.",
        icon: Pill,
      },
      {
        title: "Visual Matching",
        description:
          "High-resolution imagery and color grouping for confident identification.",
        icon: UserSearch,
      },
      {
        title: "Safety Alerts",
        description:
          "Automatic notifications for recalled or discontinued medications.",
        icon: ShieldCheck,
      },
    ],
    actions: [
      { label: "Start Identifying", href: "/pill-identifier/start" },
      { label: "View Recent Identifications", href: "/pill-identifier/latest" },
    ],
  },
  "dosage-calculator": {
    slug: "dosage-calculator",
    title: "Precision Dosage Calculator",
    description:
      "Calculate individualized dosing with renal, pediatric, and chemotherapy protocols.",
    heroImage:
      "https://images.unsplash.com/photo-1631549916768-4119b2e5f926?auto=format&fit=crop&w=1600&q=80",
    highlights: [
      {
        title: "Weight-based Dosing",
        description: "Accurate calculations with metric/imperial conversions.",
        icon: Droplets,
      },
      {
        title: "Renal Adjustments",
        description:
          "Built-in creatinine clearance and dialysis considerations.",
        icon: Syringe,
      },
      {
        title: "Regimen Templates",
        description:
          "Save protocols for chemotherapy and antimicrobial stewardship.",
        icon: NotebookPen,
      },
    ],
    actions: [
      { label: "Use Adult Calculator", href: "/dosage-calculator/adult" },
      { label: "Open Pediatric Module", href: "/dosage-calculator/pediatric" },
    ],
  },
  news: {
    slug: "news",
    title: "Medical Newsroom",
    description:
      "Curated healthcare news, regulatory updates, and peer-reviewed breakthroughs.",
    heroImage:
      "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?auto=format&fit=crop&w=1600&q=80",
    highlights: [
      {
        title: "Clinical Research",
        description: "Summaries of pivotal trials and guideline updates.",
        icon: Microscope,
      },
      {
        title: "Regulatory Alerts",
        description: "FDA, EMA, and WHO communications translated into action.",
        icon: ScrollText,
      },
      {
        title: "Expert Commentary",
        description:
          "Insights from clinicians on emerging therapies and trends.",
        icon: NotebookPen,
      },
    ],
    actions: [
      { label: "Read Latest Articles", href: "/news#latest" },
      { label: "Subscribe to Updates", href: "/news/subscribe" },
    ],
  },
  guides: {
    slug: "guides",
    title: "Clinical Guides & Resources",
    description:
      "Practical guides, checklists, and patient education built for clarity and impact.",
    heroImage:
      "https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&w=1600&q=80",
    highlights: [
      {
        title: "Care Pathways",
        description:
          "Step-by-step protocols for common acute and chronic conditions.",
        icon: ClipboardCheck,
      },
      {
        title: "Patient Handouts",
        description:
          "Plain-language resources to support shared decision-making.",
        icon: ScrollText,
      },
      {
        title: "Quality Metrics",
        description:
          "Tools aligned with clinical quality measures and accreditation.",
        icon: Sparkles,
      },
    ],
    actions: [
      { label: "Browse Featured Guides", href: "/guides/featured" },
      { label: "Download Worksheets", href: "/guides/resources" },
    ],
  },
  tools: {
    slug: "tools",
    title: "Clinical Tools & Calculators",
    description:
      "A suite of calculators, checklists, and identifiers designed for fast clinical workflows.",
    heroImage:
      "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1600&q=80",
    highlights: [
      {
        title: "Decision Support",
        description: "Evidence-based calculators for risk scoring and dosing.",
        icon: Droplets,
      },
      {
        title: "Workflow Ready",
        description:
          "Responsive, mobile-friendly tools for bedside and telehealth use.",
        icon: Activity,
      },
      {
        title: "Always Updated",
        description: "Versioned content with release notes on every update.",
        icon: Sparkles,
      },
    ],
    actions: [
      { label: "View All Tools", href: "/tools#catalog" },
      { label: "Suggest a Tool", href: "/tools/request" },
    ],
  },
};

export const sectionSlugs = Object.keys(sectionContent);
