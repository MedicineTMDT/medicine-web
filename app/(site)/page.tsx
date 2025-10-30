import type { Metadata } from "next";
import { HomePageScreen } from "@/components/pages/home-page";

export const metadata: Metadata = {
  title: "Your Trusted Medical Information Source",
  description:
    "Search medications, check interactions, identify pills, and access reliable health information all in one trusted destination.",
};

export default function HomePage() {
  return <HomePageScreen />;
}
