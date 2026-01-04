import type { DosageUnit, MedicineForm, Usage } from "../types";

/**
 * Result from parsing drug name for dosage information
 */
export interface ParsedDosage {
  amount: number | null;
  unit: DosageUnit | null;
}

/**
 * Auto-fill result from drug details
 */
export interface DrugAutoFillData {
  quantitative: number | null;
  unit: DosageUnit | null;
  medicineForm: MedicineForm | null;
  usage: Usage | null;
}

/**
 * Parse dosage information from drug name
 * Examples: "Latyz 100mg" → { amount: 100, unit: "MG" }
 *           "Panadol 500 mg" → { amount: 500, unit: "MG" }
 */
export function parseDosageFromName(drugName: string): ParsedDosage {
  // Match patterns like "100mg", "500 mg", "0.5g", "1000mcg", "50ml", "100iu"
  const match = drugName.match(/(\d+(?:\.\d+)?)\s*(mg|mcg|g|ml|iu)/i);
  
  if (!match) {
    return { amount: null, unit: null };
  }
  
  const amount = parseFloat(match[1]);
  const unitText = match[2].toUpperCase();
  
  const unitMap: Record<string, DosageUnit> = {
    "MG": "MG",
    "MCG": "MCG",
    "G": "G",
    "ML": "ML",
    "IU": "IU",
  };
  
  return {
    amount,
    unit: unitMap[unitText] || null,
  };
}

/**
 * Map Vietnamese "Dạng bào chế" text to MedicineForm enum
 * Uses "contains" matching for flexibility
 */
export function mapMedicineForm(dạngBàoChế: string | undefined): MedicineForm | null {
  if (!dạngBàoChế) return null;
  
  const text = dạngBàoChế.toLowerCase();
  
  // Check for tablet forms first (most common)
  if (text.includes("viên")) return "TABLET";
  
  // Powder forms
  if (text.includes("gói") || text.includes("bột") || text.includes("cốm")) return "POWDER";
  
  // Vial/injection forms
  if (text.includes("ống") || text.includes("tiêm") || text.includes("lọ tiêm")) return "VIAL";
  
  // Syrup/liquid forms
  if (text.includes("siro") || text.includes("dung dịch") || text.includes("hỗn dịch") || text.includes("sirô")) return "SYRUP";
  
  // Tube forms (topical)
  if (text.includes("tuýp") || text.includes("kem") || text.includes("gel") || text.includes("thuốc mỡ")) return "TUBE";
  
  // Bottle forms
  if (text.includes("chai") || text.includes("lọ")) return "BOTTLE";
  
  return null; // No match found
}

/**
 * Suggest default usage based on medicine form
 */
export function mapUsageFromForm(medicineForm: MedicineForm | null): Usage | null {
  if (!medicineForm) return null;
  
  const usageMap: Record<MedicineForm, Usage> = {
    "TABLET": "ORAL",
    "POWDER": "ORAL",
    "SYRUP": "ORAL",
    "BOTTLE": "ORAL",
    "TUBE": "TOPICAL",
    "VIAL": "IM", // Intramuscular injection as default
  };
  
  return usageMap[medicineForm] || null;
}

/**
 * Process drug details and return auto-fill data
 */
export function processdrugForAutoFill(
  drugName: string,
  metadata: Record<string, unknown> | undefined
): DrugAutoFillData {
  // Parse dosage from drug name
  const { amount, unit } = parseDosageFromName(drugName);
  
  // Get medicine form from metadata
  const dạngBàoChế = metadata?.["Dạng bào chế"] as string | undefined;
  const medicineForm = mapMedicineForm(dạngBàoChế);
  
  // Get default usage based on medicine form
  const usage = mapUsageFromForm(medicineForm);
  
  return {
    quantitative: amount,
    unit,
    medicineForm,
    usage,
  };
}
