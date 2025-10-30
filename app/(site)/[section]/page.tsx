import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SectionPageScreen } from "@/components/pages/section-page";
import { sectionContent, sectionSlugs } from "@/lib/mockData";

type SectionPageProps = {
  params: {
    section: string;
  };
};

export function generateStaticParams() {
  return sectionSlugs.map((slug) => ({ section: slug }));
}

export function generateMetadata({ params }: SectionPageProps): Metadata {
  const content = sectionContent[params.section];
  if (!content) {
    return {};
  }

  return {
    title: content.title,
    description: content.description,
  };
}

export default function SectionPage({ params }: SectionPageProps) {
  const content = sectionContent[params.section];

  if (!content) {
    notFound();
  }

  const showNews = params.section === "news";
  const showTools = params.section === "tools";

  return (
    <SectionPageScreen
      slug={content.slug}
      showNews={showNews}
      showTools={showTools}
    />
  );
}
