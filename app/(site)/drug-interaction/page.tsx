import type { Metadata } from "next";
import { DrugInteractionPageScreen } from "@/components/pages/drug-interaction-page";

export const metadata: Metadata = {
  title: "Drug Interaction Checker",
  description: "Add multiple drugs and run severity-based interaction checks with detailed recommendations.",
};

export default function DrugInteractionPage() {
  return <DrugInteractionPageScreen />;
}
