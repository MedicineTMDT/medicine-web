"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCategoryDetail } from "@/features/drugs";
import { ArrowLeft, BookOpen, Calendar, Loader2 } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function CategoryDetailPage() {
  const params = useParams();
  const categoryId = params.id ? Number(params.id) : undefined;
  
  const { data, isLoading, error } = useCategoryDetail(categoryId);
  const categoryDetail = data?.result;

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
            <div className="flex-1">
              <CardTitle className="text-2xl text-secondary dark:text-white md:text-3xl">
                {categoryDetail.name}
              </CardTitle>
              <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" />
                  Cập nhật: {formatDate(categoryDetail.update)}
                </span>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Main Content */}
      <Card className="border-none bg-white/95 shadow-card ring-1 ring-border/40 dark:ring-white/20 backdrop-blur-sm dark:bg-secondary/70">
        <CardContent className="py-8">
          {categoryDetail.content ? (
            <div
              className="prose prose-slate dark:prose-invert max-w-none
                prose-headings:text-secondary dark:prose-headings:text-white
                prose-h2:text-xl prose-h2:font-bold prose-h2:mt-8 prose-h2:mb-4 prose-h2:border-b prose-h2:border-border/30 prose-h2:pb-2
                prose-h3:text-lg prose-h3:font-semibold prose-h3:mt-6 prose-h3:mb-3
                prose-p:text-secondary/80 dark:prose-p:text-muted-foreground prose-p:leading-relaxed
                prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                prose-img:rounded-xl prose-img:shadow-md prose-img:mx-auto
                prose-figure:my-6 prose-figcaption:text-center prose-figcaption:text-sm prose-figcaption:text-muted-foreground
                prose-ul:my-4 prose-li:text-secondary/80 dark:prose-li:text-muted-foreground
                prose-strong:text-secondary dark:prose-strong:text-white
                prose-blockquote:border-l-primary prose-blockquote:bg-primary/5 prose-blockquote:py-2 prose-blockquote:px-4 prose-blockquote:rounded-r-lg
              "
              dangerouslySetInnerHTML={{ __html: categoryDetail.content }}
            />
          ) : (
            <div className="py-12 text-center">
              <p className="text-muted-foreground">
                Chưa có nội dung cho danh mục này.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
