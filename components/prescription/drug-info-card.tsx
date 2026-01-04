"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useDrug } from "@/features/drugs";
import { AlertTriangle, ExternalLink, Info, Loader2, Pill } from "lucide-react";
import Link from "next/link";

interface DrugInfoCardProps {
  drugId: string;
  drugName: string;
}

// Helper to extract section content by slug
function getSectionContent(contents: any[], slug: string): string | null {
  const section = contents?.find((s: any) => s.slug === slug);
  if (!section?.content) return null;
  
  // Flatten content array to string
  const flattenContent = (content: any[]): string => {
    return content
      .map((item: any) => {
        if (typeof item === 'string') return item;
        if (Array.isArray(item)) return flattenContent(item);
        return '';
      })
      .filter(Boolean)
      .join(' ');
  };
  
  return flattenContent(section.content);
}

export function DrugInfoCard({ drugId, drugName }: DrugInfoCardProps) {
  const { data, isLoading, error } = useDrug(parseInt(drugId));
  
  // Handle both wrapped and direct response
  const rawData = data as any;
  const drug = rawData?.result || rawData;

  if (isLoading) {
    return (
      <Card className="border-none bg-white/90 shadow-sm ring-1 ring-border/10 backdrop-blur-sm dark:bg-secondary/50">
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  if (error || !drug) {
    return (
      <Card className="border-none bg-white/90 shadow-sm ring-1 ring-border/10 backdrop-blur-sm dark:bg-secondary/50">
        <CardContent className="py-4">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Pill className="h-5 w-5" />
            <span className="font-medium">{drugName}</span>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Không thể tải thông tin thuốc
          </p>
        </CardContent>
      </Card>
    );
  }

  // Extract info from contents array
  const contents = drug.info?.contents || [];
  const contraindications = getSectionContent(contents, 'chong-chi-dinh');
  const sideEffects = getSectionContent(contents, 'tac-dung-phu');
  const interactions = getSectionContent(contents, 'tuong-tac');
  const dosage = getSectionContent(contents, 'huong-dan-su-dung') || getSectionContent(contents, 'lieu-dung');
  const cautions = getSectionContent(contents, 'bao-quan-su-dung');
  const usage = getSectionContent(contents, 'cong-dung');

  // Get metadata
  const metadata = drug.metadata || {};

  return (
    <Card className="border-none bg-white/90 shadow-sm ring-1 ring-border/10 backdrop-blur-sm dark:bg-secondary/50 overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex items-start gap-3">
          {drug.image && drug.image[0] && (
            <img
              src={drug.image[0]}
              alt={drug.name}
              className="h-16 w-16 rounded-lg object-cover border"
            />
          )}
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg text-secondary dark:text-white truncate">
              {drug.name}
            </CardTitle>
            {drug.ingredient && drug.ingredient.length > 0 && (
              <p className="text-xs text-muted-foreground mt-1">
                <span className="font-medium">Hoạt chất:</span> {drug.ingredient.join(', ')}
              </p>
            )}
            {metadata['Dạng bào chế'] && (
              <p className="text-xs text-muted-foreground">
                <span className="font-medium">Dạng:</span> {metadata['Dạng bào chế']}
              </p>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 pt-2">
        {/* Usage/Indication */}
        {usage && (
          <div className="rounded-lg border border-primary/30 bg-primary/5 p-3">
            <div className="flex items-center gap-2 text-primary">
              <Pill className="h-4 w-4" />
              <span className="text-sm font-semibold">Công dụng</span>
            </div>
            <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
              {usage}
            </p>
          </div>
        )}

        {/* Contraindications */}
        {contraindications && (
          <div className="rounded-lg border border-red-500/30 bg-red-500/5 p-3">
            <div className="flex items-center gap-2 text-red-700 dark:text-red-400">
              <AlertTriangle className="h-4 w-4" />
              <span className="text-sm font-semibold">Chống chỉ định</span>
            </div>
            <p className="mt-1 text-sm text-muted-foreground line-clamp-4">
              {contraindications}
            </p>
          </div>
        )}

        {/* Side Effects */}
        {sideEffects && (
          <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-3">
            <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400">
              <AlertTriangle className="h-4 w-4" />
              <span className="text-sm font-semibold">Tác dụng phụ</span>
            </div>
            <p className="mt-1 text-sm text-muted-foreground line-clamp-4">
              {sideEffects}
            </p>
          </div>
        )}

        {/* Interactions */}
        {interactions && (
          <div className="rounded-lg border border-orange-500/30 bg-orange-500/5 p-3">
            <div className="flex items-center gap-2 text-orange-700 dark:text-orange-400">
              <AlertTriangle className="h-4 w-4" />
              <span className="text-sm font-semibold">Tương tác thuốc</span>
            </div>
            <p className="mt-1 text-sm text-muted-foreground line-clamp-4">
              {interactions}
            </p>
          </div>
        )}

        {/* Cautions */}
        {cautions && (
          <div className="rounded-lg border border-border/50 bg-muted/30 p-3">
            <div className="flex items-center gap-2 text-secondary dark:text-white">
              <Info className="h-4 w-4" />
              <span className="text-sm font-semibold">Lưu ý</span>
            </div>
            <p className="mt-1 text-sm text-muted-foreground line-clamp-4">
              {cautions}
            </p>
          </div>
        )}

        {/* Document Link */}
        {drug.document && (
          <Link
            href={drug.document}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-xs text-primary hover:underline"
          >
            <ExternalLink className="h-3 w-3" />
            Xem hướng dẫn sử dụng đầy đủ
          </Link>
        )}

        {/* No info available */}
        {!usage && !contraindications && !sideEffects && !interactions && !cautions && (
          <p className="text-sm text-muted-foreground text-center py-2">
            Chưa có thông tin chi tiết
          </p>
        )}
      </CardContent>
    </Card>
  );
}
