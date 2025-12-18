"use client";

import { ContentRenderer, type HeadingItem } from "@/components/content/content-renderer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCategoryDetail } from "@/features/drugs";
import { cn } from "@/lib/utils";
import { ArrowLeft, BookOpen, Calendar, Clock, List, Loader2 } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

export default function CategoryDetailPage() {
  const params = useParams();
  const categoryId = params.id ? Number(params.id) : undefined;
  const [headings, setHeadings] = useState<HeadingItem[]>([]);
  const [activeHeading, setActiveHeading] = useState<string | null>(null);
  
  const { data, isLoading, error } = useCategoryDetail(categoryId);
  const categoryDetail = data?.result;

  // Handle headings extracted from content
  const handleHeadingsExtracted = useCallback((extractedHeadings: HeadingItem[]) => {
    setHeadings(extractedHeadings);
  }, []);

  // Scroll spy - track active heading
  useEffect(() => {
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveHeading(entry.target.id);
          }
        });
      },
      { rootMargin: "-20% 0% -80% 0%" }
    );

    headings.forEach((heading) => {
      const element = document.getElementById(heading.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [headings]);

  // Smooth scroll to heading
  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
      setActiveHeading(id);
    }
  };

  if (isLoading) {
    return (
      <div className="container flex items-center justify-center py-24">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Đang tải nội dung...</p>
        </div>
      </div>
    );
  }

  if (error || !categoryDetail) {
    return (
      <div className="container py-24">
        <div className="rounded-2xl border border-dashed border-border/50 bg-white/50 p-12 text-center dark:bg-secondary/50">
          <BookOpen className="mx-auto h-12 w-12 text-muted-foreground" />
          <h2 className="mt-4 text-xl font-semibold text-secondary dark:text-white">
            Không tìm thấy danh mục
          </h2>
          <p className="mt-2 text-muted-foreground">
            Danh mục yêu cầu không tồn tại trong hệ thống.
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

  // Format dates
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="container space-y-8 pb-24 pt-10">
      {/* Breadcrumb */}
      <div className="flex items-center gap-3 text-sm text-muted-foreground">
        <Link
          href="/drugs-info"
          className="inline-flex items-center gap-2 font-semibold text-primary hover:underline"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          Quay lại
        </Link>
        <span aria-hidden>•</span>
        <span className="truncate">{categoryDetail.name}</span>
      </div>

      {/* Header Card */}
      <Card className="overflow-hidden border-none bg-gradient-to-br from-primary/5 via-white to-white shadow-lg ring-1 ring-border/40 dark:ring-white/20 dark:from-primary/10 dark:via-secondary dark:to-secondary">
        <CardHeader className="space-y-4 pb-6">
          <div className="flex items-start gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <BookOpen className="h-6 w-6" aria-hidden />
            </span>
            <div className="flex-1 space-y-2">
              <CardTitle className="text-2xl text-secondary dark:text-white md:text-3xl">
                {categoryDetail.name}
              </CardTitle>
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" />
                  Ngày tạo: {formatDate(categoryDetail.created)}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="h-4 w-4" />
                  Cập nhật: {formatDate(categoryDetail.update)}
                </span>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* 2-Column Grid Layout */}
      <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
        {/* Sidebar */}
        <div className="lg:sticky lg:top-4 lg:self-start">
          <div className="space-y-6">
            {/* Table of Contents */}
            {headings.length > 0 && (
              <Card className="border-none bg-white/95 shadow-card ring-1 ring-border/40 dark:ring-white/20 backdrop-blur-sm dark:bg-secondary/70">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-base text-secondary dark:text-white">
                    <List className="h-4 w-4" />
                    Mục lục
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <nav className="space-y-1">
                    {headings.map((heading) => (
                      <button
                        key={heading.id}
                        onClick={() => scrollToHeading(heading.id)}
                        className={cn(
                          "block w-full text-left rounded-lg px-3 py-2 text-sm transition hover:bg-primary/5",
                          heading.level === 3 ? "ml-4 text-xs" : "font-medium",
                          activeHeading === heading.id
                            ? "bg-primary/10 text-primary"
                            : "text-secondary/70 dark:text-muted-foreground hover:text-secondary dark:hover:text-white"
                        )}
                      >
                        {heading.text}
                      </button>
                    ))}
                  </nav>
                </CardContent>
              </Card>
            )}

            {/* Category Info */}
            <Card className="border-none bg-white/95 shadow-card ring-1 ring-border/40 dark:ring-white/20 backdrop-blur-sm dark:bg-secondary/70">
              <CardHeader className="pb-3">
                <CardTitle className="text-base text-secondary dark:text-white">
                  Thông tin danh mục
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm">
                  <dt className="font-medium text-secondary/60 dark:text-muted-foreground">ID</dt>
                  <dd className="mt-0.5 text-secondary dark:text-white">#{categoryDetail.id}</dd>
                </div>
                <div className="text-sm">
                  <dt className="font-medium text-secondary/60 dark:text-muted-foreground">Ngày tạo</dt>
                  <dd className="mt-0.5 text-secondary dark:text-white">
                    {formatDate(categoryDetail.created)}
                  </dd>
                </div>
                <div className="text-sm">
                  <dt className="font-medium text-secondary/60 dark:text-muted-foreground">Cập nhật lần cuối</dt>
                  <dd className="mt-0.5 text-secondary dark:text-white">
                    {formatDate(categoryDetail.update)}
                  </dd>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Main Content */}
        <Card className="border-none bg-white/95 shadow-card ring-1 ring-border/40 dark:ring-white/20 backdrop-blur-sm dark:bg-secondary/70">
          <CardContent className="py-8">
            <ContentRenderer 
              content={categoryDetail.content} 
              onHeadingsExtracted={handleHeadingsExtracted}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
