import type { Metadata } from "next";
import { DrugsInfoPageScreen } from "@/components/pages/drugs-info-page";

export const metadata: Metadata = {
  title: "Drug Info",
  description: "Search and explore medications, compounds, and categories with filters and autocomplete.",
};

export default function DrugsInfoPage() {
  return <DrugsInfoPageScreen />;
}
