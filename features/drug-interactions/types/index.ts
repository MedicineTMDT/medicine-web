import type { ApiResponse } from "@/features/auth/types";

// ============================================
// Drug Interaction Types
// ============================================

export interface DrugInteraction {
  id: number;
  mucDoNghiemTrong: string;   // Severity level
  hauQuaCuaTuongTac: string;  // Consequence of interaction
  coCheTuongTac: string;      // Mechanism of interaction
  xuTriTuongTac: string;      // Treatment/management
  hoatChat1Name: string;      // Ingredient 1 name
  hoatChat2Name: string;      // Ingredient 2 name
}

// ============================================
// Merged Ingredient Types
// ============================================

export interface MergedIngredientResponse {
  id: number;
  name: string;
}

export interface DrugInteractionPageResponse {
  content: DrugInteraction[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  numberOfElements: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

// ============================================
// API Response Types
// ============================================

export type DrugInteractionApiResponse = ApiResponse<DrugInteraction>;
export type DrugInteractionListApiResponse = ApiResponse<DrugInteraction[]>;
export type DrugInteractionPagedApiResponse = ApiResponse<DrugInteractionPageResponse>;
export type MergedIngredientListApiResponse = MergedIngredientResponse[];

// ============================================
// Severity Mapping Helper
// ============================================

export type SeverityLevel = "contraindicated" | "conditional";

/**
 * Maps Vietnamese severity strings to normalized severity levels
 */
export function normalizeSeverity(mucDoNghiemTrong: string): SeverityLevel {
  const lower = mucDoNghiemTrong.toLowerCase().trim();
  
  // Check for conditional first (more specific)
  if (lower.includes("có điều kiện") || lower.includes("conditional")) {
    return "conditional";
  }
  
  // Default to contraindicated for everything else
  return "contraindicated";
}
