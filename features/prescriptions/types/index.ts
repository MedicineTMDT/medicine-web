import type { ApiResponse } from "@/features/auth/types";
import { z } from "zod";

// ============================================
// Enums matching backend constants
// ============================================

export const DosageUnit = {
  MG: "MG",
  MCG: "MCG",
  G: "G",
  IU: "IU",
  ML: "ML",
  PERCENT: "PERCENT",
} as const;

export type DosageUnit = (typeof DosageUnit)[keyof typeof DosageUnit];

export const MedicineForm = {
  TABLET: "TABLET",
  POWDER: "POWDER",
  VIAL: "VIAL",
  SYRUP: "SYRUP",
  TUBE: "TUBE",
  BOTTLE: "BOTTLE",
} as const;

export type MedicineForm = (typeof MedicineForm)[keyof typeof MedicineForm];

export const Usage = {
  ORAL: "ORAL",
  SUBLINGUAL: "SUBLINGUAL",
  CHEW: "CHEW",
  TOPICAL: "TOPICAL",
  EYE_DROPS: "EYE_DROPS",
  EAR_DROPS: "EAR_DROPS",
  NASAL_DROPS: "NASAL_DROPS",
  IM: "IM",
  IV: "IV",
  SC: "SC",
  RECTAL: "RECTAL",
  VAGINAL: "VAGINAL",
} as const;

export type Usage = (typeof Usage)[keyof typeof Usage];

export const Note = {
  BEFORE_MEAL: "BEFORE_MEAL",
  AFTER_MEAL: "AFTER_MEAL",
  WITH_MEAL: "WITH_MEAL",
  WITH_WATER: "WITH_WATER",
  AVOID_ALCOHOL: "AVOID_ALCOHOL",
  AVOID_DAIRY: "AVOID_DAIRY",
} as const;

export type Note = (typeof Note)[keyof typeof Note];

export const Timing = {
  MORNING: "MORNING",
  NOON: "NOON",
  AFTERNOON: "AFTERNOON",
  EVENING: "EVENING",
  BEDTIME: "BEDTIME",
} as const;

export type Timing = (typeof Timing)[keyof typeof Timing];

// ============================================
// Display labels for enums (Vietnamese)
// ============================================

export const DosageUnitLabels: Record<DosageUnit, string> = {
  MG: "mg (milligram)",
  MCG: "mcg (microgram)",
  G: "g (gram)",
  IU: "IU (đơn vị quốc tế)",
  ML: "ml (milliliter)",
  PERCENT: "% (phần trăm)",
};

export const MedicineFormLabels: Record<MedicineForm, string> = {
  TABLET: "Viên",
  POWDER: "Gói",
  VIAL: "Ống",
  SYRUP: "Lọ",
  TUBE: "Tuýp",
  BOTTLE: "Chai",
};

export const UsageLabels: Record<Usage, string> = {
  ORAL: "Uống",
  SUBLINGUAL: "Ngậm",
  CHEW: "Nhai",
  TOPICAL: "Bôi",
  EYE_DROPS: "Nhỏ mắt",
  EAR_DROPS: "Nhỏ tai",
  NASAL_DROPS: "Nhỏ mũi",
  IM: "Tiêm bắp",
  IV: "Tiêm tĩnh mạch",
  SC: "Tiêm dưới da",
  RECTAL: "Đặt hậu môn",
  VAGINAL: "Đặt âm đạo",
};

export const NoteLabels: Record<Note, string> = {
  BEFORE_MEAL: "Trước ăn",
  AFTER_MEAL: "Sau ăn",
  WITH_MEAL: "Trong bữa ăn",
  WITH_WATER: "Uống với nhiều nước",
  AVOID_ALCOHOL: "Tránh rượu bia",
  AVOID_DAIRY: "Tránh sữa",
};

export const TimingLabels: Record<Timing, string> = {
  MORNING: "Sáng",
  NOON: "Trưa",
  AFTERNOON: "Chiều",
  EVENING: "Tối",
  BEDTIME: "Trước ngủ",
};

// ============================================
// Request Types
// ============================================

export interface MedicationSchedule {
  timing: Timing;
  quantity: number;
}

export interface IntakeRequest {
  drugName: string;
  drugId: string;
  total: number;
  unit: DosageUnit;
  quantitative: number;
  medicineForm: MedicineForm;
  usage: Usage;
  timingList: MedicationSchedule[];
  noteList: Note[];
}

export interface CreatePrescriptionRequest {
  name: string;
  description: string;
  userId?: string; // Optional - patient ID
  patientEmailAddress?: string; // Optional - patient email for notification
  startDate: string; // ISO date format: YYYY-MM-DD
  message: string;
  diagnosisNote: string;
  info: Record<string, unknown>;
  intakes: IntakeRequest[];
  image?: string;
}

// ============================================
// Response Types
// ============================================

export interface Intake {
  id: string;
  time: string;
  status: boolean;
  info: Array<Record<string, unknown>>;
}

export interface Prescription {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  message: string;
  diagnosisNote: string;
  info: Record<string, unknown>;
  intakes: Intake[];
}

export interface PrescriptionProjection {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
}

export interface DrugInteractionDetail {
  mucDoNghiemTrong: string;
  hauQuaCuaTuongTac: string;
  coCheTuongTac: string;
  xuTriTuongTac: string;
  matchedFromSelected?: boolean;
}

export interface PrescriptionInfo {
  info: Array<Record<string, Record<string, unknown>>>;
  drugInteractionResponseList: DrugInteractionDetail[];
}

// ============================================
// Pageable Types
// ============================================

export interface Pageable {
  page: number;
  size: number;
  sort?: string[];
}

export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

// ============================================
// API Response Types
// ============================================

export type PrescriptionApiResponse = ApiResponse<Prescription>;
export type PrescriptionListApiResponse = ApiResponse<Page<PrescriptionProjection>>;
export type PrescriptionInfoApiResponse = ApiResponse<PrescriptionInfo>;
export type IntakeApiResponse = ApiResponse<Intake>;

// ============================================
// Form Validation Schemas
// ============================================

export const medicationScheduleSchema = z.object({
  timing: z.enum(["MORNING", "NOON", "AFTERNOON", "EVENING", "BEDTIME"]),
  quantity: z.coerce.number().min(1, "Số lượng phải lớn hơn 0"),
});

export const intakeRequestSchema = z.object({
  drugName: z.string().min(1, "Tên thuốc là bắt buộc"),
  drugId: z.string().min(1, "Vui lòng chọn thuốc"),
  total: z.coerce.number().min(1, "Tổng số lượng phải lớn hơn 0"),
  unit: z.enum(["MG", "MCG", "G", "IU", "ML", "PERCENT"]),
  quantitative: z.coerce.number().min(1, "Định lượng phải lớn hơn 0"),
  medicineForm: z.enum(["TABLET", "POWDER", "VIAL", "SYRUP", "TUBE", "BOTTLE"]),
  usage: z.enum([
    "ORAL",
    "SUBLINGUAL",
    "CHEW",
    "TOPICAL",
    "EYE_DROPS",
    "EAR_DROPS",
    "NASAL_DROPS",
    "IM",
    "IV",
    "SC",
    "RECTAL",
    "VAGINAL",
  ]),
  timingList: z.array(medicationScheduleSchema).min(1, "Cần ít nhất một lịch uống"),
  noteList: z.array(z.enum(["BEFORE_MEAL", "AFTER_MEAL", "WITH_MEAL", "WITH_WATER", "AVOID_ALCOHOL", "AVOID_DAIRY"])),
});

export const createPrescriptionSchema = z.object({
  name: z.string().min(2, "Tên đơn thuốc phải có ít nhất 2 ký tự"),
  description: z.string().optional().default(""),
  userId: z.string().optional().default(""), // Optional - patient ID
  patientEmailAddress: z.string().email("Email không hợp lệ").optional().or(z.literal("")), // Optional - patient email
  startDate: z.string().min(1, "Ngày bắt đầu là bắt buộc"),
  message: z.string().optional().default(""),
  diagnosisNote: z.string().optional().default(""),
  info: z.record(z.unknown()).optional().default({}),
  intakes: z.array(intakeRequestSchema).optional().default([]), // Allow empty - validated separately
  image: z.string().optional(),
});

export type CreatePrescriptionFormValues = z.infer<typeof createPrescriptionSchema>;
export type IntakeRequestFormValues = z.infer<typeof intakeRequestSchema>;
