import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function sanitizeAiAnalysis(text?: string | null): string {
  if (!text) return "";

  const normalized = text.trim();
  const relevanceSectionPattern =
    /(?:\n|^)\s*(?:#+\s*)?Đánh giá mức độ liên quan của <CONTEXT> đối với <PRESCRIPTION_DATA>:[\s\S]*$/i;

  return normalized.replace(relevanceSectionPattern, "").trim();
}
