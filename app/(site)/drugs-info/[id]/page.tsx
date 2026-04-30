"use client";

import { DrugUpdateRequestDialog } from "@/components/drugs-info/drug-update-request-dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useDrug } from "@/features/drugs";
import { cn } from "@/lib/utils";
import { ArrowLeft, ExternalLink, FileText, Loader2, Pill } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";

// Types for the info structure
type ContentSection = {
  slug?: string;
  level: number;
  heading: string;
  content: (string | string[])[];
};

type DrugInfoData = {
  contents?: ContentSection[];
  table_of_content?: { level: number; title: string }[];
};

type MetadataType = Record<string, string | string[]>;

export default function DrugInfoDetailPage() {
  const params = useParams();
  const drugId = params.id ? Number(params.id) : undefined;
  const [activeSection, setActiveSection] = useState<string | null>(null);
  
  const { data, isLoading, error } = useDrug(drugId);
  const drug = data?.result;

  if (isLoading) {
    return (
      <div className="container flex items-center justify-center py-24">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Đang tải thông tin thuốc...</p>
        </div>
      </div>
    );
  }

  if (error || !drug) {
    return (
      <div className="container py-24">
        <div className="rounded-2xl border border-dashed border-border/50 bg-white/50 p-12 text-center dark:bg-secondary/50">
          <Pill className="mx-auto h-12 w-12 text-muted-foreground" />
          <h2 className="mt-4 text-xl font-semibold text-secondary dark:text-white">
            Không tìm thấy thuốc
          </h2>
          <p className="mt-2 text-muted-foreground">
            Thuốc yêu cầu không tồn tại trong hệ thống.
          </p>
          <Link
            href="/drugs-info"
            className="mt-4 inline-flex items-center gap-2 text-primary hover:underline"
          >
            <ArrowLeft className="h-4 w-4" />
            Quay lại danh sách thuốc
          </Link>
        </div>
      </div>
    );
  }

  const metadata = drug.metadata as MetadataType | undefined;
  const info = drug.info as DrugInfoData | undefined;
  const contents = info?.contents ?? [];
  const tableOfContent = info?.table_of_content ?? [];

  // Helper to render content items (can be strings or arrays of strings)
  const renderContentItem = (item: string | string[], index: number) => {
    if (Array.isArray(item)) {
      return (
        <ul key={index} className="ml-4 list-disc space-y-1">
          {item.map((subItem, subIndex) => (
            <li key={subIndex} className="text-secondary/80 dark:text-primary">
              {subItem}
            </li>
          ))}
        </ul>
      );
    }
    return (
      <p key={index} className="text-secondary/80 dark:text-primary">
        {item}
      </p>
    );
  };

  return (
    <div className="container space-y-8 pb-24 pt-10">
      {/* Breadcrumb */}
      <div className="flex items-center gap-3 text-sm text-muted-foreground">
        <Link href="/drugs-info" className="inline-flex items-center gap-2 font-semibold text-primary hover:underline">
          <ArrowLeft className="h-4 w-4" aria-hidden />
          Quay lại
        </Link>
        <span aria-hidden>•</span>
        <span className="truncate">{drug.name}</span>
      </div>

      {/* Header Card */}
      <Card className="overflow-hidden border-none bg-gradient-to-br from-primary/5 via-white to-white shadow-lg ring-1 ring-border/40 dark:ring-white/20 dark:from-primary/10 dark:via-secondary dark:to-secondary">
        <CardHeader className="space-y-4 pb-6">
          <div className="flex flex-col gap-6 md:flex-row md:items-start">
            {/* Drug Image */}
            {drug.image && drug.image.length > 0 && (
              <div className="relative h-32 w-32 shrink-0 overflow-hidden rounded-2xl bg-white shadow-md ring-1 ring-border/20">
                <Image
                  src={drug.image[0]}
                  alt={drug.name}
                  fill
                  className="object-contain p-2"
                  sizes="128px"
                />
              </div>
            )}
            
            {/* Drug Info */}
            <div className="flex-1 space-y-3">
              <div className="flex items-start gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Pill className="h-5 w-5" aria-hidden />
                </span>
                <div>
                  <CardTitle className="text-2xl text-secondary dark:text-white md:text-3xl">
                    {drug.name}
                  </CardTitle>
                  <CardDescription className="mt-1 text-secondary/70 dark:text-muted-foreground">
                    {drug.slug}
                  </CardDescription>
                </div>
              </div>

              {/* Ingredients */}
              {drug.ingredient && drug.ingredient.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {drug.ingredient.map((ing) => (
                    <span
                      key={ing}
                      className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary"
                    >
                      {ing}
                    </span>
                  ))}
                </div>
              )}

              {/* Document Link */}
              {drug.document && (
                <a
                  href={drug.document}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
                >
                  <FileText className="h-4 w-4" />
                  Xem hướng dẫn sử dụng (PDF)
                  <ExternalLink className="h-3 w-3" />
                </a>
              )}

              {/* Request to Update */}
              <div className="pt-1">
                <DrugUpdateRequestDialog drugName={drug.name} drugId={drugId!} />
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
        {/* Sidebar - Table of Contents & Metadata */}
        <div className="lg:sticky lg:top-4 lg:pr-2">
          <div className="space-y-6">
            {/* Table of Contents */}
            {tableOfContent.length > 0 && (
              <Card className="border-none bg-white/95 shadow-card ring-1 ring-border/40 dark:ring-white/20 backdrop-blur-sm dark:bg-secondary/70">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base text-secondary dark:text-white">Mục lục</CardTitle>
                </CardHeader>
                <CardContent>
                  <nav className="space-y-1">
                    {tableOfContent.map((item, index) => (
                      <a
                        key={index}
                        href={`#section-${index}`}
                        onClick={() => setActiveSection(`section-${index}`)}
                        className={cn(
                          "block rounded-lg px-3 py-2 text-sm transition hover:bg-primary/5",
                          item.level === 2 ? "ml-4 text-xs" : "font-medium",
                          activeSection === `section-${index}`
                            ? "bg-primary/10 text-primary"
                            : "text-secondary/70 dark:text-white"
                        )}
                      >
                        {item.title}
                      </a>
                    ))}
                  </nav>
                </CardContent>
              </Card>
            )}

            {/* Metadata */}
            {metadata && Object.keys(metadata).length > 0 && (
              <Card className="border-none bg-white/95 shadow-card ring-1 ring-border/40 dark:ring-white/20 backdrop-blur-sm dark:bg-secondary/70">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base text-secondary dark:text-white">Thông tin sản phẩm</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {Object.entries(metadata).map(([key, value]) => (
                    <div key={key} className="text-sm">
                      <dt className="font-medium text-secondary/60 dark:text-primary">{key}</dt>
                      <dd className="mt-0.5 text-secondary dark:text-white">
                        {Array.isArray(value) ? value.join(", ") : value}
                      </dd>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Images Gallery */}
            {drug.image && drug.image.length > 1 && (
              <Card className="border-none bg-white/95 shadow-card ring-1 ring-border/40 dark:ring-white/20 backdrop-blur-sm dark:bg-secondary/70">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base text-secondary dark:text-white">Hình ảnh</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-2">
                    {drug.image.map((img, index) => (
                      <div key={index} className="relative aspect-square overflow-hidden rounded-lg bg-white ring-1 ring-border/20">
                        <Image
                          src={img}
                          alt={`${drug.name} - ${index + 1}`}
                          fill
                          className="object-contain p-1"
                          sizes="100px"
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-6">
          {contents.map((section, index) => (
            <Card
              key={index}
              id={`section-${index}`}
              className="scroll-mt-4 border-none bg-white/95 shadow-card ring-1 ring-border/40 dark:ring-white/20 backdrop-blur-sm dark:bg-secondary/70"
            >
              <CardHeader className="pb-3">
                <CardTitle
                  className={cn(
                    "text-secondary dark:text-white",
                    section.level === 1 ? "text-xl" : "text-lg"
                  )}
                >
                  {section.heading}
                </CardTitle>
              </CardHeader>
              {section.content.length > 0 && (
                <CardContent className="space-y-3 text-sm">
                  {section.content.map((item, itemIndex) => renderContentItem(item, itemIndex))}
                </CardContent>
              )}
            </Card>
          ))}

          {contents.length === 0 && (
            <Card className="border-none bg-white/95 shadow-card ring-1 ring-border/40 dark:ring-white/20 backdrop-blur-sm dark:bg-secondary/70">
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">
                  Chưa có thông tin chi tiết cho thuốc này.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
