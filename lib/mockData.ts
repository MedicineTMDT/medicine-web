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
  image?: string;
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
    cta: "Browse",
    icon: Pill,
    accent: "from-[#D8F2FF] via-[#F0FAFF] to-[#E0F6FF]",
  },
  {
    title: "Health Conditions",
    description:
      "Evidence-based summaries covering symptoms, diagnostics, and treatment pathways.",
    href: "/supplements",
    cta: "Explore",
    icon: HeartPulse,
    accent: "from-[#E6EBFF] via-[#EEF1FF] to-[#F5F8FF]",
  },
  {
    title: "Drug Interactions",
    description:
      "Check for medication conflicts, contraindications, and clinical monitoring guidance.",
    href: "/interactions",
    cta: "Check",
    icon: Microscope,
    accent: "from-[#FFE7EE] via-[#FFF3F6] to-[#FFEFF3]",
  },
  {
    title: "Health Guides",
    description:
      "Expert-written guides to support treatment adherence and lifestyle recommendations.",
    href: "/guides",
    cta: "Read",
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

export type Drug = {
  name: string;
  slug: string;
  category: string;
  tags: string[];
  description: string;
  compounds: string[];
  dosage: string;
  sideEffects: string[];
};

export const drugTags = [
  "Antibiotics",
  "Pain Killers",
  "Cardiology",
  "Endocrine",
  "FDA Approved",
  "OTC",
  "Prescription",
  "Anti-coagulant",
  "Gastro",
];

export const drugs: Drug[] = [
  {
    name: "Amoxicillin",
    slug: "amoxicillin",
    category: "Antibiotics",
    tags: ["Antibiotics", "FDA Approved", "Prescription"],
    description:
      "Broad-spectrum penicillin antibiotic used for respiratory, ear, and skin infections.",
    compounds: ["Amoxicillin trihydrate"],
    dosage: "500 mg every 8 hours or 875 mg every 12 hours",
    sideEffects: ["Nausea", "Rash", "Diarrhea"],
  },
  {
    name: "Aspirin",
    slug: "aspirin",
    category: "Pain Killers",
    tags: ["Pain Killers", "OTC", "Anti-coagulant"],
    description:
      "Analgesic and antiplatelet agent used for pain, fever, and cardiovascular prevention.",
    compounds: ["Acetylsalicylic acid"],
    dosage:
      "81 mg once daily for cardioprotection; 325-650 mg every 4-6 hours for pain",
    sideEffects: ["Gastric upset", "Bruising", "Tinnitus at high dose"],
  },
  {
    name: "Ibuprofen",
    slug: "ibuprofen",
    category: "Pain Killers",
    tags: ["Pain Killers", "OTC", "FDA Approved"],
    description:
      "NSAID for mild to moderate pain, dysmenorrhea, and inflammatory conditions.",
    compounds: ["Ibuprofen"],
    dosage: "200-400 mg every 6-8 hours; max 1200 mg/day OTC",
    sideEffects: ["GI upset", "Dizziness", "Fluid retention"],
  },
  {
    name: "Warfarin",
    slug: "warfarin",
    category: "Cardiology",
    tags: ["Anti-coagulant", "Prescription"],
    description:
      "Vitamin K antagonist anticoagulant used for venous thromboembolism and atrial fibrillation stroke prevention.",
    compounds: ["Warfarin sodium"],
    dosage: "Individualized to INR goal (typically 2.0-3.0)",
    sideEffects: ["Bleeding", "Skin necrosis (rare)", "Purple toe syndrome"],
  },
  {
    name: "Metformin",
    slug: "metformin",
    category: "Endocrine",
    tags: ["Endocrine", "Prescription", "FDA Approved"],
    description:
      "First-line biguanide for type 2 diabetes mellitus improving insulin sensitivity.",
    compounds: ["Metformin hydrochloride"],
    dosage: "500-1000 mg twice daily with meals; max 2000 mg/day",
    sideEffects: ["GI upset", "B12 deficiency", "Rare lactic acidosis"],
  },
  {
    name: "Atorvastatin",
    slug: "atorvastatin",
    category: "Cardiology",
    tags: ["Cardiology", "Prescription", "FDA Approved"],
    description:
      "High-intensity statin for hyperlipidemia and ASCVD risk reduction.",
    compounds: ["Atorvastatin calcium"],
    dosage: "10-80 mg once daily",
    sideEffects: ["Myalgia", "Elevated LFTs", "Headache"],
  },
  {
    name: "Lisinopril",
    slug: "lisinopril",
    category: "Cardiology",
    tags: ["Cardiology", "Prescription"],
    description:
      "ACE inhibitor for hypertension, heart failure, and post-MI ventricular remodeling.",
    compounds: ["Lisinopril"],
    dosage: "10-40 mg once daily",
    sideEffects: ["Cough", "Hyperkalemia", "Dizziness"],
  },
  {
    name: "Omeprazole",
    slug: "omeprazole",
    category: "Gastro",
    tags: ["Gastro", "OTC", "FDA Approved"],
    description:
      "Proton pump inhibitor for GERD, peptic ulcer disease, and erosive esophagitis.",
    compounds: ["Omeprazole"],
    dosage: "20-40 mg once daily before meals",
    sideEffects: ["Headache", "Abdominal pain", "B12 deficiency (long-term)"],
  },
];

export type DrugInteraction = {
  pair: [string, string];
  severity: "Severe" | "Moderate" | "Minor" | "None";
  description: string;
};

export const drugInteractions: DrugInteraction[] = [
  {
    pair: ["aspirin", "warfarin"],
    severity: "Severe",
    description:
      "Combined antiplatelet and anticoagulant effect increases major bleeding risk; avoid or use only with close INR and bleeding monitoring.",
  },
  {
    pair: ["ibuprofen", "warfarin"],
    severity: "Moderate",
    description:
      "NSAID-related platelet inhibition and GI irritation may increase bleeding risk with warfarin.",
  },
  {
    pair: ["ibuprofen", "lisinopril"],
    severity: "Minor",
    description:
      "NSAIDs can blunt antihypertensive effect and impact renal perfusion; monitor blood pressure and renal function with prolonged use.",
  },
  {
    pair: ["aspirin", "ibuprofen"],
    severity: "Moderate",
    description:
      "Ibuprofen may interfere with aspirin’s antiplatelet effect; separate dosing or avoid chronic combination.",
  },
  {
    pair: ["metformin", "omeprazole"],
    severity: "None",
    description:
      "No clinically significant interaction identified. Continue routine monitoring.",
  },
  {
    pair: ["atorvastatin", "amoxicillin"],
    severity: "None",
    description:
      "No meaningful interaction; monitor for unexpected adverse effects.",
  },
  {
    pair: ["atorvastatin", "warfarin"],
    severity: "Moderate",
    description:
      "Statins may modestly affect INR; monitor INR more frequently after initiation or dose change.",
  },
];

export type Prescription = {
  id: string;
  patientName: string;
  date: string;
  items: {
    drugSlug: string;
    quantity: number;
    schedule: string;
  }[];
};

export const mockPrescriptions: Prescription[] = [
  {
    id: "rx-1001",
    patientName: "Jane Doe",
    date: "2025-10-01",
    items: [
      {
        drugSlug: "metformin",
        quantity: 60,
        schedule: "500 mg twice daily with meals",
      },
      {
        drugSlug: "atorvastatin",
        quantity: 30,
        schedule: "40 mg once nightly",
      },
    ],
  },
  {
    id: "rx-1002",
    patientName: "Alex Johnson",
    date: "2025-10-05",
    items: [
      { drugSlug: "lisinopril", quantity: 30, schedule: "20 mg once daily" },
      { drugSlug: "aspirin", quantity: 30, schedule: "81 mg once daily" },
    ],
  },
];

// =========================
// Extended data for new feature pages
// =========================

export type DrugInfo = {
  id: string;
  name: string;
  genericName?: string;
  category: string;
  description: string;
  compounds: string[];
  fdaApproved: boolean;
  tags: string[];
  quickFacts: string[];
  overview: string;
  dosage: string;
  sideEffects: string[];
  interactions: string[];
  warnings: string[];
  relatedIds?: string[];
  image?: string;
};

export const drugInfoTags = [
  "Antibiotics",
  "Pain Relief",
  "Heart Health",
  "Endocrine",
  "Mental Health",
  "Respiratory",
  "Gastro",
  "FDA Approved",
  "Anticoagulant",
  "Vitamins",
];

// UPDATED drugInfoList with verified, working Unsplash images
export const drugInfoList: DrugInfo[] = [
  {
    id: "amoxicillin",
    name: "Amoxicillin",
    genericName: "Amoxicillin",
    category: "Antibiotics",
    description:
      "Broad-spectrum penicillin used for respiratory, ear, and skin infections.",
    compounds: ["Amoxicillin trihydrate"],
    fdaApproved: true,
    tags: ["Antibiotics", "FDA Approved"],
    quickFacts: ["Oral", "Bacterial", "Renal adjust"],
    overview:
      "Amoxicillin is a penicillin-class antibiotic with coverage against many Gram-positive and some Gram-negative bacteria. Often combined with clavulanate for beta-lactamase coverage.",
    dosage:
      "500 mg every 8 hours or 875 mg every 12 hours; adjust in renal impairment.",
    sideEffects: [
      "Nausea",
      "Rash",
      "Diarrhea",
      "Rare hypersensitivity reactions",
    ],
    interactions: [
      "May decrease efficacy of oral contraceptives",
      "Can increase INR with warfarin",
    ],
    warnings: [
      "Check allergy history for penicillins",
      "Adjust dose in renal dysfunction",
    ],
    relatedIds: ["azithromycin", "doxycycline"],
    image:
      "https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=1200&q=80",
  },
  {
    id: "azithromycin",
    name: "Azithromycin",
    genericName: "Azithromycin",
    category: "Antibiotics",
    description:
      "Macrolide antibiotic for respiratory and skin infections with once-daily dosing.",
    compounds: ["Azithromycin dihydrate"],
    fdaApproved: true,
    tags: ["Antibiotics", "FDA Approved"],
    quickFacts: ["Oral/IV", "QT risk", "Long half-life"],
    overview:
      "Azithromycin is a macrolide with activity against atypical pathogens and common respiratory bacteria.",
    dosage:
      "500 mg on day 1, then 250 mg daily on days 2-5 or 500 mg daily for 3 days.",
    sideEffects: ["GI upset", "QT prolongation risk", "Headache"],
    interactions: [
      "Additive QT prolongation with antiarrhythmics",
      "May increase cyclosporine levels",
    ],
    warnings: [
      "Use caution in cardiac arrhythmias",
      "Separate from aluminum/magnesium antacids",
    ],
    relatedIds: ["amoxicillin", "ciprofloxacin"],
    image:
      "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=1200&q=80",
  },
  {
    id: "ciprofloxacin",
    name: "Ciprofloxacin",
    genericName: "Ciprofloxacin",
    category: "Antibiotics",
    description:
      "Fluoroquinolone for urinary and GI infections with broad Gram-negative coverage.",
    compounds: ["Ciprofloxacin hydrochloride"],
    fdaApproved: true,
    tags: ["Antibiotics", "FDA Approved"],
    quickFacts: ["Oral/IV", "QT risk", "Chelation"],
    overview:
      "Ciprofloxacin inhibits DNA gyrase/topoisomerase IV, active against many Gram-negative pathogens including Pseudomonas.",
    dosage: "250-750 mg every 12 hours; adjust in renal impairment.",
    sideEffects: ["Tendinopathy risk", "Photosensitivity", "Dizziness"],
    interactions: [
      "Chelated by cations (avoid with antacids)",
      "Additive QT prolongation",
    ],
    warnings: [
      "Avoid in myasthenia gravis",
      "Monitor tendinopathy, especially with steroids",
    ],
    relatedIds: ["azithromycin", "doxycycline"],
    image:
      "https://images.unsplash.com/photo-1628771065518-0d82f1938462?w=1200&q=80",
  },
  {
    id: "doxycycline",
    name: "Doxycycline",
    genericName: "Doxycycline",
    category: "Antibiotics",
    description:
      "Tetracycline-class antibiotic for skin, respiratory, and tick-borne infections.",
    compounds: ["Doxycycline hyclate"],
    fdaApproved: true,
    tags: ["Antibiotics", "FDA Approved"],
    quickFacts: ["Oral/IV", "Photosensitivity", "No renal adjust"],
    overview:
      "Doxycycline inhibits bacterial protein synthesis; used for atypicals, skin infections, and vector-borne illnesses such as Lyme disease.",
    dosage: "100 mg every 12 hours; no renal adjustment needed.",
    sideEffects: ["Photosensitivity", "GI upset", "Esophageal irritation"],
    interactions: [
      "Chelated by calcium/iron/magnesium",
      "May increase warfarin effect",
    ],
    warnings: [
      "Avoid lying down after dosing",
      "Not preferred in pregnancy unless benefits outweigh risks",
    ],
    relatedIds: ["amoxicillin", "ciprofloxacin"],
    image:
      "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=1200&q=80",
  },
  {
    id: "metformin",
    name: "Metformin",
    genericName: "Metformin",
    category: "Endocrine",
    description:
      "First-line biguanide for type 2 diabetes improving insulin sensitivity.",
    compounds: ["Metformin hydrochloride"],
    fdaApproved: true,
    tags: ["Endocrine", "FDA Approved"],
    quickFacts: ["Oral", "Renal adjust", "Weight-neutral"],
    overview:
      "Metformin reduces hepatic gluconeogenesis and improves peripheral glucose uptake.",
    dosage:
      "500-1000 mg twice daily with meals; max 2000 mg/day; titrate to GI tolerance.",
    sideEffects: ["GI upset", "B12 deficiency", "Rare lactic acidosis"],
    interactions: [
      "Cationic drugs may compete for renal elimination",
      "Alcohol may raise lactic acidosis risk",
    ],
    warnings: [
      "Avoid in severe renal/hepatic impairment",
      "Hold around iodinated contrast if eGFR <45",
    ],
    relatedIds: ["glipizide", "insulin-glargine"],
    image:
      "https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=1200&q=80",
  },
  {
    id: "glipizide",
    name: "Glipizide",
    genericName: "Glipizide",
    category: "Endocrine",
    description:
      "Sulfonylurea that stimulates pancreatic insulin release for type 2 diabetes.",
    compounds: ["Glipizide"],
    fdaApproved: true,
    tags: ["Endocrine", "FDA Approved"],
    quickFacts: ["Oral", "Hypoglycemia risk", "Weight gain"],
    overview:
      "Glipizide enhances insulin secretion; best taken 30 minutes before meals for optimal effect.",
    dosage: "5-20 mg daily divided; max 40 mg/day.",
    sideEffects: ["Hypoglycemia", "Weight gain", "Dizziness"],
    interactions: [
      "Additive hypoglycemia with insulin",
      "Effect may be reduced by steroids",
    ],
    warnings: [
      "Use cautiously in elderly or renal impairment",
      "Ensure consistent meals to avoid lows",
    ],
    relatedIds: ["metformin", "insulin-glargine"],
    image:
      "https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=1200&q=80",
  },
  {
    id: "insulin-glargine",
    name: "Insulin Glargine",
    category: "Endocrine",
    description:
      "Long-acting basal insulin for diabetes mellitus with 24-hour coverage.",
    compounds: ["Insulin glargine"],
    fdaApproved: true,
    tags: ["Endocrine", "FDA Approved"],
    quickFacts: ["Subcutaneous", "Hypoglycemia", "Basal"],
    overview:
      "Insulin glargine provides steady basal insulin levels; do not mix with other insulins.",
    dosage:
      "Individualized; often 10 units daily to start, titrate to fasting glucose targets.",
    sideEffects: ["Hypoglycemia", "Injection site reactions", "Weight gain"],
    interactions: [
      "Additive glucose lowering with sulfonylureas",
      "Beta-blockers may mask hypoglycemia",
    ],
    warnings: [
      "Rotate sites to avoid lipodystrophy",
      "Educate on hypoglycemia recognition",
    ],
    relatedIds: ["metformin", "glipizide"],
    image:
      "https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=1200&q=80",
  },
  {
    id: "lisinopril",
    name: "Lisinopril",
    category: "Heart Health",
    description:
      "ACE inhibitor for hypertension, heart failure, and post-MI remodeling.",
    compounds: ["Lisinopril"],
    fdaApproved: true,
    tags: ["Heart Health", "FDA Approved"],
    quickFacts: ["Oral", "Renal adjust", "Dry cough"],
    overview:
      "Lisinopril blocks angiotensin-converting enzyme, reducing afterload and proteinuria.",
    dosage: "10-40 mg once daily; adjust in renal impairment.",
    sideEffects: ["Cough", "Hyperkalemia", "Dizziness"],
    interactions: [
      "Additive potassium with spironolactone",
      "NSAIDs may blunt effect",
    ],
    warnings: ["Avoid in pregnancy", "Monitor renal function and potassium"],
    relatedIds: ["losartan", "amlodipine"],
    image:
      "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=1200&q=80",
  },
  {
    id: "losartan",
    name: "Losartan",
    category: "Heart Health",
    description:
      "Angiotensin receptor blocker for hypertension and kidney protection in diabetes.",
    compounds: ["Losartan potassium"],
    fdaApproved: true,
    tags: ["Heart Health", "FDA Approved"],
    quickFacts: ["Oral", "Renal adjust", "Potassium"],
    overview:
      "Losartan blocks angiotensin II receptor, lowering blood pressure and reducing proteinuria.",
    dosage: "25-100 mg daily divided once or twice.",
    sideEffects: ["Dizziness", "Hyperkalemia", "Fatigue"],
    interactions: [
      "Additive potassium with supplements",
      "NSAIDs may blunt control",
    ],
    warnings: ["Avoid in pregnancy", "Monitor renal function after initiation"],
    relatedIds: ["lisinopril", "amlodipine"],
    image:
      "https://images.unsplash.com/photo-1585435557343-3b092031a831?w=1200&q=80",
  },
  {
    id: "amlodipine",
    name: "Amlodipine",
    category: "Heart Health",
    description:
      "Dihydropyridine calcium channel blocker for hypertension and angina.",
    compounds: ["Amlodipine besylate"],
    fdaApproved: true,
    tags: ["Heart Health", "FDA Approved"],
    quickFacts: ["Oral", "Once daily", "Edema risk"],
    overview:
      "Amlodipine causes peripheral vasodilation; effective for isolated systolic hypertension.",
    dosage: "5-10 mg once daily.",
    sideEffects: ["Peripheral edema", "Flushing", "Headache"],
    interactions: [
      "Additive hypotension with other antihypertensives",
      "Grapefruit may raise levels",
    ],
    warnings: [
      "Monitor for edema",
      "Use caution in heart failure with reduced EF",
    ],
    relatedIds: ["lisinopril", "losartan"],
    image:
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1200&q=80",
  },
  {
    id: "atorvastatin",
    name: "Atorvastatin",
    category: "Heart Health",
    description:
      "High-intensity statin for dyslipidemia and ASCVD risk reduction.",
    compounds: ["Atorvastatin calcium"],
    fdaApproved: true,
    tags: ["Heart Health", "FDA Approved"],
    quickFacts: ["Oral", "CYP3A4", "Myalgia"],
    overview:
      "Atorvastatin inhibits HMG-CoA reductase, lowering LDL and modestly raising HDL.",
    dosage: "10-80 mg once daily; high intensity at 40-80 mg.",
    sideEffects: ["Myalgia", "Elevated LFTs", "Headache"],
    interactions: [
      "Avoid strong CYP3A4 inhibitors",
      "Grapefruit increases levels",
    ],
    warnings: [
      "Check baseline LFTs",
      "Stop and evaluate with severe muscle pain",
    ],
    relatedIds: ["rosuvastatin", "lisinopril"],
    image:
      "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=1200&q=80",
  },
  {
    id: "rosuvastatin",
    name: "Rosuvastatin",
    category: "Heart Health",
    description:
      "High-potency statin with fewer CYP interactions, used for LDL lowering.",
    compounds: ["Rosuvastatin calcium"],
    fdaApproved: true,
    tags: ["Heart Health", "FDA Approved"],
    quickFacts: ["Oral", "Hydrophilic", "Myalgia"],
    overview:
      "Rosuvastatin is metabolized minimally by CYP, preferred when avoiding 3A4 interactions.",
    dosage:
      "5-40 mg once daily; consider renal dose adjustment at higher doses.",
    sideEffects: ["Myalgia", "Headache", "Mild GI upset"],
    interactions: [
      "Ciclosporin raises levels",
      "Separate from antacids by 2 hours",
    ],
    warnings: [
      "Monitor CK if symptomatic",
      "Adjust in renal impairment for high doses",
    ],
    relatedIds: ["atorvastatin", "lisinopril"],
    image:
      "https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?w=1200&q=80",
  },
  {
    id: "aspirin",
    name: "Aspirin",
    category: "Pain Relief",
    description:
      "Analgesic and antiplatelet agent used for pain and cardiovascular prevention.",
    compounds: ["Acetylsalicylic acid"],
    fdaApproved: true,
    tags: ["Pain Relief", "Anticoagulant", "FDA Approved"],
    quickFacts: ["OTC", "Antiplatelet", "GI risk"],
    overview:
      "Aspirin irreversibly inhibits COX-1/2, reducing platelet aggregation and inflammation.",
    dosage:
      "81 mg daily for cardioprotection; 325-650 mg every 4-6 hours for pain (max 4 g/day).",
    sideEffects: ["GI upset", "Bruising", "Tinnitus at high dose"],
    interactions: [
      "Bleeding risk with anticoagulants",
      "Ibuprofen may blunt antiplatelet effect",
    ],
    warnings: [
      "Avoid in children with viral illness (Reye)",
      "Use gastric protection if high GI risk",
    ],
    relatedIds: ["clopidogrel", "ibuprofen"],
    image:
      "https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=1200&q=80",
  },
  {
    id: "clopidogrel",
    name: "Clopidogrel",
    category: "Heart Health",
    description: "P2Y12 inhibitor antiplatelet for ACS and stent maintenance.",
    compounds: ["Clopidogrel bisulfate"],
    fdaApproved: true,
    tags: ["Heart Health", "Anticoagulant", "FDA Approved"],
    quickFacts: ["Oral", "Prodrug", "Bleeding"],
    overview:
      "Clopidogrel inhibits platelet P2Y12 ADP receptor; requires CYP2C19 activation.",
    dosage: "75 mg once daily after 300-600 mg loading (per indication).",
    sideEffects: ["Bleeding", "Bruising", "Rare TTP"],
    interactions: [
      "Omeprazole may reduce activation",
      "Additive bleeding with NSAIDs/anticoagulants",
    ],
    warnings: ["Assess CYP2C19 inhibitors", "Stop before surgery per protocol"],
    relatedIds: ["aspirin", "atorvastatin"],
    image:
      "https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=1200&q=80",
  },
  {
    id: "warfarin",
    name: "Warfarin",
    category: "Heart Health",
    description: "Vitamin K antagonist anticoagulant requiring INR monitoring.",
    compounds: ["Warfarin sodium"],
    fdaApproved: true,
    tags: ["Anticoagulant", "Heart Health", "FDA Approved"],
    quickFacts: ["Oral", "INR target", "Many interactions"],
    overview:
      "Warfarin inhibits vitamin K-dependent clotting factors; narrow therapeutic index.",
    dosage: "Individualized to INR (2.0-3.0 common).",
    sideEffects: ["Bleeding", "Skin necrosis (rare)", "Purple toe syndrome"],
    interactions: [
      "Many CYP2C9/3A4 interactions",
      "Additive bleeding with antiplatelets/NSAIDs",
    ],
    warnings: [
      "Maintain consistent vitamin K intake",
      "Monitor INR closely with changes",
    ],
    relatedIds: ["apixaban", "clopidogrel"],
    image:
      "https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=1200&q=80",
  },
  {
    id: "apixaban",
    name: "Apixaban",
    category: "Heart Health",
    description:
      "Direct oral anticoagulant (Factor Xa inhibitor) for AFib and VTE.",
    compounds: ["Apixaban"],
    fdaApproved: true,
    tags: ["Anticoagulant", "Heart Health", "FDA Approved"],
    quickFacts: ["Oral", "No INR", "Renal/hepatic adjust"],
    overview:
      "Apixaban selectively inhibits Factor Xa, offering fixed dosing and no routine lab monitoring.",
    dosage:
      "5 mg twice daily; reduce to 2.5 mg BID in select renal/age/weight scenarios.",
    sideEffects: ["Bleeding", "Bruising", "Anemia"],
    interactions: [
      "CYP3A4/P-gp inhibitors increase levels",
      "Additive bleeding with antiplatelets/NSAIDs",
    ],
    warnings: [
      "Hold before procedures per guidelines",
      "Adjust in renal impairment per label",
    ],
    relatedIds: ["warfarin", "aspirin"],
    image:
      "https://images.unsplash.com/photo-1628771065518-0d82f1938462?w=1200&q=80",
  },
  {
    id: "ibuprofen",
    name: "Ibuprofen",
    category: "Pain Relief",
    description: "NSAID for mild to moderate pain and inflammation.",
    compounds: ["Ibuprofen"],
    fdaApproved: true,
    tags: ["Pain Relief", "OTC", "FDA Approved"],
    quickFacts: ["OTC", "Food helps GI", "Renal caution"],
    overview:
      "Ibuprofen inhibits COX-1/2, reducing prostaglandins and inflammation.",
    dosage: "200-400 mg every 6-8 hours (max 1200 mg/day OTC).",
    sideEffects: ["GI upset", "Dizziness", "Fluid retention"],
    interactions: [
      "May blunt aspirin antiplatelet effect",
      "Additive bleeding with anticoagulants",
    ],
    warnings: [
      "Avoid in late pregnancy",
      "Use lowest effective dose, shortest duration",
    ],
    relatedIds: ["naproxen", "aspirin"],
    image:
      "https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=1200&q=80",
  },
  {
    id: "naproxen",
    name: "Naproxen",
    category: "Pain Relief",
    description: "Longer-acting NSAID for pain and inflammation.",
    compounds: ["Naproxen sodium"],
    fdaApproved: true,
    tags: ["Pain Relief", "OTC", "FDA Approved"],
    quickFacts: ["OTC", "BID dosing", "GI risk"],
    overview:
      "Naproxen provides anti-inflammatory and analgesic effects with twice daily dosing.",
    dosage: "220-440 mg every 12 hours OTC; higher Rx doses per indication.",
    sideEffects: ["GI upset", "Drowsiness", "Fluid retention"],
    interactions: [
      "Additive bleeding with anticoagulants",
      "May worsen blood pressure control with ACEi",
    ],
    warnings: ["Avoid in late pregnancy", "Consider PPI if high GI risk"],
    relatedIds: ["ibuprofen", "aspirin"],
    image:
      "https://images.unsplash.com/photo-1509099836639-18ba1795216d?w=1200&q=80",
  },
  {
    id: "omeprazole",
    name: "Omeprazole",
    category: "Gastro",
    description: "Proton pump inhibitor for GERD and ulcer management.",
    compounds: ["Omeprazole"],
    fdaApproved: true,
    tags: ["Gastro", "FDA Approved"],
    quickFacts: ["OTC/Rx", "Take before meals", "CYP2C19"],
    overview:
      "Omeprazole irreversibly blocks proton pumps to reduce gastric acid production.",
    dosage: "20-40 mg once daily before meals.",
    sideEffects: [
      "Headache",
      "Abdominal pain",
      "B12 deficiency with long term",
    ],
    interactions: [
      "May lower clopidogrel activation",
      "Reduces absorption of drugs needing acid",
    ],
    warnings: ["Use lowest effective dose", "Monitor with long-term therapy"],
    relatedIds: ["pantoprazole", "clopidogrel"],
    image:
      "https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=1200&q=80",
  },
  {
    id: "pantoprazole",
    name: "Pantoprazole",
    category: "Gastro",
    description: "Proton pump inhibitor with fewer CYP interactions.",
    compounds: ["Pantoprazole sodium"],
    fdaApproved: true,
    tags: ["Gastro", "FDA Approved"],
    quickFacts: ["Oral/IV", "Acid suppression", "Daily"],
    overview:
      "Pantoprazole decreases gastric acid with minimal CYP2C19 interaction compared to omeprazole.",
    dosage: "40 mg once daily",
    sideEffects: ["Headache", "GI upset", "Long-term nutrient deficiencies"],
    interactions: [
      "May reduce absorption of atazanavir",
      "Minimal effect on clopidogrel",
    ],
    warnings: [
      "Reassess need periodically",
      "Risk of C. difficile with prolonged use",
    ],
    relatedIds: ["omeprazole", "sertraline"],
    image:
      "https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?w=1200&q=80",
  },
  {
    id: "sertraline",
    name: "Sertraline",
    category: "Mental Health",
    description: "SSRI antidepressant for depression and anxiety disorders.",
    compounds: ["Sertraline hydrochloride"],
    fdaApproved: true,
    tags: ["Mental Health", "FDA Approved"],
    quickFacts: ["Oral", "SSRI", "Once daily"],
    overview:
      "Sertraline selectively inhibits serotonin reuptake, improving mood and anxiety symptoms.",
    dosage: "50-200 mg once daily; start low to minimize GI effects.",
    sideEffects: ["Nausea", "Sleep changes", "Sexual dysfunction"],
    interactions: [
      "Serotonergic drugs increase serotonin syndrome risk",
      "May enhance bleeding with NSAIDs",
    ],
    warnings: [
      "Taper to avoid withdrawal",
      "Monitor for mood changes early in therapy",
    ],
    relatedIds: ["escitalopram", "omeprazole"],
    image:
      "https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?w=1200&q=80",
  },
  {
    id: "escitalopram",
    name: "Escitalopram",
    category: "Mental Health",
    description: "SSRI antidepressant with favorable side effect profile.",
    compounds: ["Escitalopram oxalate"],
    fdaApproved: true,
    tags: ["Mental Health", "FDA Approved"],
    quickFacts: ["Oral", "SSRI", "QT risk"],
    overview:
      "Escitalopram increases synaptic serotonin; often well tolerated.",
    dosage: "10-20 mg once daily; consider lower starting dose in elderly.",
    sideEffects: ["Nausea", "Headache", "Sexual dysfunction"],
    interactions: [
      "Additive QT prolongation with antiarrhythmics",
      "Serotonergic load with triptans/MAOIs",
    ],
    warnings: ["Avoid abrupt stop", "Monitor QT in high-risk patients"],
    relatedIds: ["sertraline", "omeprazole"],
    image:
      "https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=1200&q=80",
  },
  {
    id: "albuterol",
    name: "Albuterol",
    category: "Respiratory",
    description: "Short-acting beta-agonist for acute bronchospasm relief.",
    compounds: ["Albuterol sulfate"],
    fdaApproved: true,
    tags: ["Respiratory", "FDA Approved"],
    quickFacts: ["Inhaled", "Rescue", "Tremor"],
    overview:
      "Albuterol relaxes bronchial smooth muscle for quick relief of wheeze and dyspnea.",
    dosage:
      "2 puffs every 4-6 hours as needed; via inhaler or nebulizer solutions.",
    sideEffects: ["Tremor", "Tachycardia", "Nervousness"],
    interactions: [
      "Additive tachycardia with stimulants",
      "May cause hypokalemia with diuretics",
    ],
    warnings: [
      "Monitor overuse as marker of poor control",
      "Prime and use spacer when appropriate",
    ],
    relatedIds: ["fluticasone"],
    image:
      "https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=1200&q=80",
  },
  {
    id: "fluticasone",
    name: "Fluticasone",
    category: "Respiratory",
    description:
      "Inhaled corticosteroid for asthma control and allergic rhinitis.",
    compounds: ["Fluticasone propionate"],
    fdaApproved: true,
    tags: ["Respiratory", "FDA Approved"],
    quickFacts: ["Inhaled", "Controller", "Rinse mouth"],
    overview:
      "Fluticasone reduces airway inflammation; cornerstone of persistent asthma management.",
    dosage: "Inhaled: 100-500 mcg twice daily depending on device/strength.",
    sideEffects: ["Oral thrush", "Hoarseness", "Cough"],
    interactions: [
      "Ritonavir may markedly increase levels",
      "Additive immunosuppression with systemic steroids",
    ],
    warnings: ["Rinse mouth after use", "Monitor growth in pediatrics"],
    relatedIds: ["albuterol"],
    image:
      "https://images.unsplash.com/photo-1585435557343-3b092031a831?w=1200&q=80",
  },
];

export type DrugInteractionRule = {
  drugs: string[];
  severity: "mild" | "moderate" | "severe";
  effect: string;
  recommendation: string;
  mechanism?: string;
  notes?: string;
};

export const drugInteractionRules: DrugInteractionRule[] = [
  {
    drugs: ["aspirin", "warfarin"],
    severity: "severe",
    effect: "Bleeding risk",
    recommendation:
      "Avoid routine combination; if necessary, monitor INR and bleeding closely.",
    mechanism: "Additive antiplatelet and anticoagulant activity.",
  },
  {
    drugs: ["ibuprofen", "warfarin"],
    severity: "moderate",
    effect: "Bleeding risk",
    recommendation:
      "Use alternative analgesic; if used, monitor INR and signs of bleeding.",
    mechanism: "Platelet inhibition and gastric injury.",
  },
  {
    drugs: ["naproxen", "warfarin"],
    severity: "severe",
    effect: "Bleeding risk",
    recommendation: "Avoid combination; choose non-NSAID analgesic.",
    mechanism: "COX-1 inhibition and anticoagulation.",
  },
  {
    drugs: ["clopidogrel", "omeprazole"],
    severity: "moderate",
    effect: "Reduced antiplatelet effect",
    recommendation:
      "Prefer pantoprazole if PPI needed; monitor for thrombotic events.",
    mechanism: "CYP2C19 inhibition may reduce clopidogrel activation.",
  },
  {
    drugs: ["clopidogrel", "pantoprazole"],
    severity: "mild",
    effect: "Minimal interaction",
    recommendation: "Generally safe; monitor if high thrombotic risk.",
  },
  {
    drugs: ["warfarin", "amoxicillin"],
    severity: "moderate",
    effect: "INR increase",
    recommendation: "Monitor INR within 3-5 days of start.",
    mechanism: "Altered gut flora and reduced vitamin K.",
  },
  {
    drugs: ["warfarin", "doxycycline"],
    severity: "moderate",
    effect: "INR increase",
    recommendation: "Check INR after initiation.",
    mechanism: "Protein binding displacement and flora alteration.",
  },
  {
    drugs: ["warfarin", "azithromycin"],
    severity: "moderate",
    effect: "INR increase",
    recommendation: "Monitor INR; consider dose adjustment.",
    mechanism: "Reduced metabolism and flora change.",
  },
  {
    drugs: ["warfarin", "ciprofloxacin"],
    severity: "severe",
    effect: "INR increase",
    recommendation: "Avoid or monitor INR closely.",
    mechanism: "CYP inhibition and flora alteration.",
  },
  {
    drugs: ["apixaban", "aspirin"],
    severity: "moderate",
    effect: "Bleeding risk",
    recommendation: "Use lowest aspirin dose; counsel on bleeding signs.",
  },
  {
    drugs: ["apixaban", "ibuprofen"],
    severity: "moderate",
    effect: "Bleeding risk",
    recommendation: "Prefer acetaminophen; avoid chronic NSAID use.",
  },
  {
    drugs: ["apixaban", "clopidogrel"],
    severity: "severe",
    effect: "High bleeding risk",
    recommendation:
      "Reserve dual therapy for clear indications with close monitoring.",
  },
  {
    drugs: ["aspirin", "ibuprofen"],
    severity: "moderate",
    effect: "Loss of antiplatelet effect",
    recommendation:
      "Dose ibuprofen 30 minutes after or 8 hours before aspirin.",
  },
  {
    drugs: ["aspirin", "naproxen"],
    severity: "moderate",
    effect: "Bleeding risk",
    recommendation: "Use gastroprotection; monitor for bleeding.",
  },
  {
    drugs: ["ibuprofen", "lisinopril"],
    severity: "mild",
    effect: "Reduced antihypertensive effect",
    recommendation:
      "Monitor blood pressure and renal function with prolonged use.",
  },
  {
    drugs: ["naproxen", "losartan"],
    severity: "mild",
    effect: "Reduced antihypertensive effect",
    recommendation: "Monitor blood pressure; ensure hydration.",
  },
  {
    drugs: ["ibuprofen", "metformin"],
    severity: "mild",
    effect: "Renal function impact",
    recommendation: "Monitor renal function in dehydration or CKD.",
  },
  {
    drugs: ["naproxen", "metformin"],
    severity: "mild",
    effect: "Renal function impact",
    recommendation: "Monitor renal function if prolonged use.",
  },
  {
    drugs: ["atorvastatin", "azithromycin"],
    severity: "mild",
    effect: "Increased statin levels",
    recommendation: "Monitor for myalgia; keep dose lowest effective.",
  },
  {
    drugs: ["atorvastatin", "warfarin"],
    severity: "moderate",
    effect: "INR increase",
    recommendation: "Monitor INR when starting or changing statin.",
  },
  {
    drugs: ["rosuvastatin", "warfarin"],
    severity: "moderate",
    effect: "INR increase",
    recommendation: "Monitor INR periodically.",
  },
  {
    drugs: ["lisinopril", "spironolactone"],
    severity: "moderate",
    effect: "Hyperkalemia",
    recommendation:
      "Monitor potassium/renal function within 1 week of changes.",
  },
  {
    drugs: ["losartan", "spironolactone"],
    severity: "moderate",
    effect: "Hyperkalemia",
    recommendation: "Check potassium frequently.",
  },
  {
    drugs: ["lisinopril", "potassium-chloride"],
    severity: "moderate",
    effect: "Hyperkalemia",
    recommendation: "Avoid unless necessary; monitor closely.",
  },
  {
    drugs: ["losartan", "potassium-chloride"],
    severity: "moderate",
    effect: "Hyperkalemia",
    recommendation: "Avoid combination or monitor potassium.",
  },
  {
    drugs: ["metformin", "alcohol"],
    severity: "moderate",
    effect: "Lactic acidosis risk",
    recommendation: "Limit alcohol; counsel on symptoms.",
  },
  {
    drugs: ["glipizide", "insulin-glargine"],
    severity: "moderate",
    effect: "Hypoglycemia",
    recommendation: "Monitor glucose; adjust doses if lows occur.",
  },
  {
    drugs: ["glipizide", "metformin"],
    severity: "mild",
    effect: "Additive glucose lowering",
    recommendation: "Monitor for hypoglycemia during titration.",
  },
  {
    drugs: ["insulin-glargine", "beta-blocker"],
    severity: "mild",
    effect: "Masked hypoglycemia",
    recommendation: "Educate on non-adrenergic hypoglycemia signs.",
  },
  {
    drugs: ["sertraline", "escitalopram"],
    severity: "severe",
    effect: "Serotonin syndrome risk",
    recommendation: "Avoid dual SSRI therapy.",
  },
  {
    drugs: ["sertraline", "triptan"],
    severity: "moderate",
    effect: "Serotonin syndrome risk",
    recommendation: "Monitor; counsel on agitation, tremor.",
  },
  {
    drugs: ["sertraline", "ibuprofen"],
    severity: "moderate",
    effect: "Bleeding risk",
    recommendation: "Limit NSAID duration; consider PPI protection.",
  },
  {
    drugs: ["escitalopram", "ibuprofen"],
    severity: "moderate",
    effect: "Bleeding risk",
    recommendation: "Use lowest NSAID dose; watch for bruising.",
  },
  {
    drugs: ["escitalopram", "ondansetron"],
    severity: "moderate",
    effect: "QT prolongation",
    recommendation: "Avoid in high-risk QT patients; monitor if combined.",
  },
  {
    drugs: ["azithromycin", "escitalopram"],
    severity: "moderate",
    effect: "QT prolongation",
    recommendation: "Assess QT risk; consider alternative antibiotic.",
  },
  {
    drugs: ["ciprofloxacin", "escitalopram"],
    severity: "moderate",
    effect: "QT prolongation",
    recommendation: "Avoid in high-risk; monitor ECG if needed.",
  },
  {
    drugs: ["ciprofloxacin", "calcium-carbonate"],
    severity: "mild",
    effect: "Reduced absorption",
    recommendation: "Separate by at least 2 hours before or 6 hours after.",
  },
  {
    drugs: ["doxycycline", "calcium-carbonate"],
    severity: "mild",
    effect: "Reduced absorption",
    recommendation: "Separate doses by several hours.",
  },
  {
    drugs: ["azithromycin", "antacid"],
    severity: "mild",
    effect: "Reduced absorption",
    recommendation: "Separate from aluminum/magnesium antacids.",
  },
  {
    drugs: ["omeprazole", "ketoconazole"],
    severity: "moderate",
    effect: "Reduced antifungal absorption",
    recommendation:
      "Avoid combo or monitor response; consider acidic beverage.",
  },
  {
    drugs: ["pantoprazole", "rilpivirine"],
    severity: "severe",
    effect: "Reduced antiretroviral levels",
    recommendation: "Avoid coadministration.",
  },
  {
    drugs: ["albuterol", "pseudoephedrine"],
    severity: "mild",
    effect: "Additive tachycardia",
    recommendation: "Monitor heart rate; use lowest effective doses.",
  },
  {
    drugs: ["albuterol", "propranolol"],
    severity: "moderate",
    effect: "Reduced bronchodilation",
    recommendation:
      "Avoid non-selective beta-blockers in asthma; use cardioselective if required.",
  },
  {
    drugs: ["fluticasone", "ritonavir"],
    severity: "severe",
    effect: "Steroid excess",
    recommendation:
      "Avoid combo; use alternative inhaled steroid with less interaction.",
  },
  {
    drugs: ["sertraline", "linezolid"],
    severity: "severe",
    effect: "Serotonin syndrome",
    recommendation: "Avoid; if necessary, hold SSRI and monitor closely.",
  },
  {
    drugs: ["escitalopram", "tramadol"],
    severity: "moderate",
    effect: "Serotonin syndrome risk",
    recommendation: "Use lowest tramadol dose; monitor.",
  },
  {
    drugs: ["omeprazole", "iron"],
    severity: "mild",
    effect: "Reduced iron absorption",
    recommendation: "Consider timing or vitamin C to enhance absorption.",
  },
  {
    drugs: ["pantoprazole", "erlotinib"],
    severity: "severe",
    effect: "Reduced TKI exposure",
    recommendation: "Avoid PPIs; consider H2 blocker with spacing.",
  },
  {
    drugs: ["atorvastatin", "grapefruit-juice"],
    severity: "moderate",
    effect: "Statin level increase",
    recommendation: "Limit grapefruit intake; monitor for myalgia.",
  },
  {
    drugs: ["losartan", "aliskiren"],
    severity: "severe",
    effect: "Hyperkalemia/renal risk",
    recommendation: "Avoid dual RAAS blockade.",
  },
  {
    drugs: ["amlodipine", "simvastatin"],
    severity: "moderate",
    effect: "Increased simvastatin levels",
    recommendation: "Limit simvastatin to 20 mg when combined.",
  },
  {
    drugs: ["metformin", "contrast-dye"],
    severity: "severe",
    effect: "Lactic acidosis risk",
    recommendation: "Hold metformin around contrast exposure if eGFR <45.",
  },
  {
    drugs: ["atorvastatin", "clarithromycin"],
    severity: "severe",
    effect: "Statin toxicity",
    recommendation:
      "Avoid strong CYP3A4 inhibitors; choose pravastatin/rosuvastatin or hold statin.",
  },
  {
    drugs: ["omeprazole", "erlotinib"],
    severity: "severe",
    effect: "Reduced TKI exposure",
    recommendation:
      "Avoid PPIs; consider alternative acid suppression strategy.",
  },
];

export type PrescriptionRecord = {
  id: string;
  patientId: string;
  pharmacistName: string;
  createdAt: string;
  status: "active" | "completed" | "expired";
  drugs: Array<{
    drugId: string;
    quantity: number;
    dosage: string;
    schedule: string;
  }>;
  interactions?: DrugInteractionRule[];
};

export const prescriptionRecords: PrescriptionRecord[] = [
  // ... (your prescription records remain unchanged)
  {
    id: "RX-201",
    patientId: "PT-01",
    pharmacistName: "Dr. Lane Carter",
    createdAt: "2025-10-05",
    status: "active",
    drugs: [
      {
        drugId: "metformin",
        quantity: 60,
        dosage: "1000 mg",
        schedule: "Twice daily",
      },
      {
        drugId: "atorvastatin",
        quantity: 30,
        dosage: "40 mg",
        schedule: "Once daily",
      },
    ],
  },
  {
    id: "RX-202",
    patientId: "PT-02",
    pharmacistName: "Dr. Lane Carter",
    createdAt: "2025-10-06",
    status: "completed",
    drugs: [
      {
        drugId: "lisinopril",
        quantity: 30,
        dosage: "20 mg",
        schedule: "Once daily",
      },
      {
        drugId: "aspirin",
        quantity: 30,
        dosage: "81 mg",
        schedule: "Once daily",
      },
    ],
    interactions: [drugInteractionRules[0]],
  },
  // ... rest of your prescription records (unchanged)
];

// ... all the rest of your data (auth users, sign-in audit, waitlist, etc.) remains exactly the same

export type AuthUserProfile = {
  id: string;
  name: string;
  email: string;
  role: "clinician" | "pharmacist" | "researcher" | "student";
  organization: string;
  lastActive: string;
  status: "active" | "invited" | "suspended";
  methods: Array<"email" | "google" | "sso">;
};

export const mockAuthUsers: AuthUserProfile[] = [
  {
    id: "usr-401",
    name: "Dr. Olivia Chen",
    email: "olivia.chen@harborsidecardio.com",
    role: "clinician",
    organization: "Harborside Cardiology",
    lastActive: "2025-10-14T08:25:00Z",
    status: "active",
    methods: ["email", "google"],
  },
  {
    id: "usr-402",
    name: "Marcus Silva",
    email: "marcus.silva@northstatepharma.com",
    role: "pharmacist",
    organization: "NorthState Pharmacy Network",
    lastActive: "2025-10-12T22:10:00Z",
    status: "active",
    methods: ["email", "sso"],
  },
  {
    id: "usr-403",
    name: "Aisha Patel",
    email: "apatel@midtownresearch.org",
    role: "researcher",
    organization: "Midtown Research Institute",
    lastActive: "2025-10-09T14:45:00Z",
    status: "invited",
    methods: ["google"],
  },
  {
    id: "usr-404",
    name: "Leo Simmons",
    email: "l.simmons@residentcare.edu",
    role: "student",
    organization: "ResidentCare University",
    lastActive: "2025-10-05T18:32:00Z",
    status: "active",
    methods: ["email"],
  },
];

export type SignInAuditEntry = {
  id: string;
  userId: string;
  timestamp: string;
  device: string;
  location: string;
  method: "email" | "google" | "sso";
  status: "success" | "failure";
  ip: string;
};

export const signInAuditLog: SignInAuditEntry[] = [
  {
    id: "audit-9001",
    userId: "usr-401",
    timestamp: "2025-10-14T08:22:31Z",
    device: "Safari • macOS",
    location: "San Francisco, CA",
    method: "google",
    status: "success",
    ip: "64.23.19.201",
  },
  {
    id: "audit-9002",
    userId: "usr-402",
    timestamp: "2025-10-13T12:04:07Z",
    device: "Edge • Windows",
    location: "Chicago, IL",
    method: "sso",
    status: "success",
    ip: "198.51.100.84",
  },
  {
    id: "audit-9003",
    userId: "usr-403",
    timestamp: "2025-10-11T21:17:52Z",
    device: "Chrome • Windows",
    location: "New York, NY",
    method: "google",
    status: "failure",
    ip: "203.0.113.19",
  },
  {
    id: "audit-9004",
    userId: "usr-404",
    timestamp: "2025-10-10T07:55:14Z",
    device: "Mobile Safari • iOS",
    location: "Austin, TX",
    method: "email",
    status: "success",
    ip: "172.16.8.45",
  },
];

export type SignUpInterest = {
  id: string;
  name: string;
  email: string;
  organization: string;
  role: string;
  requestedAt: string;
  focus: "clinic" | "hospital" | "academic" | "startup";
  notes?: string;
};

export const signUpWaitlist: SignUpInterest[] = [
  {
    id: "wait-01",
    name: "Cassandra Moore",
    email: "cassandra.moore@lakesideclinic.org",
    organization: "Lakeside Family Clinic",
    role: "Nurse Practitioner",
    requestedAt: "2025-10-12T15:22:00Z",
    focus: "clinic",
    notes: "Interested in patient-friendly medication summaries.",
  },
  {
    id: "wait-02",
    name: "Dr. Ethan Li",
    email: "ethan.li@synergymedical.io",
    organization: "Synergy Medical Group",
    role: "CMO",
    requestedAt: "2025-10-11T09:10:00Z",
    focus: "startup",
    notes: "Wants custom calculators embedded into EMR workflow.",
  },
  {
    id: "wait-03",
    name: "Maya Ortiz",
    email: "maya.ortiz@metrohealth.edu",
    organization: "MetroHealth University",
    role: "Program Director",
    requestedAt: "2025-10-09T18:05:00Z",
    focus: "academic",
  },
  {
    id: "wait-04",
    name: "Jordan Kelley",
    email: "jkelley@evergreenhospital.com",
    organization: "Evergreen Hospital",
    role: "Clinical Informatics Lead",
    requestedAt: "2025-10-08T13:48:00Z",
    focus: "hospital",
    notes: "Needs multi-site SSO dashboard and audit exports.",
  },
];
