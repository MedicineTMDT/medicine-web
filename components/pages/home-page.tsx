"use client";

import { useTranslation } from "@/components/i18n/translation-provider";
import {
    CtaSection,
    FeaturesSection,
    HeroSection,
    HowItWorksSection,
    ServicesSection,
    StatsSection,
} from "@/components/sections";

export function HomePageScreen() {
  const { language } = useTranslation();
  
  return (
    <div className="relative" key={language}>
      {/* Hero Section */}
      <HeroSection />

      {/* Features Section - Why Choose Us */}
      <FeaturesSection />

      {/* Services Section - Our Products */}
      <ServicesSection />

      {/* Statistics Section - Trust Indicators */}
      <StatsSection />

      {/* How It Works Section */}
      <HowItWorksSection />

      {/* Call to Action Section */}
      <CtaSection />
    </div>
  );
}
