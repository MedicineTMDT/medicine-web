import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CheckCircle2, Pill, ShieldCheck } from "lucide-react";
import { DrugDetailTabs } from "@/components/drugs-info/drug-detail-tabs";
import { DrugInfoCard } from "@/components/drugs-info/drug-card";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { drugInfoList, type DrugInfo } from "@/lib/mockData";

type DrugDetailPageProps = {
  params: { id: string };
};

const lookup: Record<string, DrugInfo> = Object.fromEntries(drugInfoList.map((d) => [d.id, d]));

export function generateStaticParams() {
  return drugInfoList.map((drug) => ({ id: drug.id }));
}

export function generateMetadata({ params }: DrugDetailPageProps): Metadata {
  const drug = lookup[params.id];
  if (!drug) return {};
  return {
    title: `${drug.name} details`,
    description: drug.description,
  };
}

export default function DrugInfoDetailPage({ params }: DrugDetailPageProps) {
  const drug = lookup[params.id];
  if (!drug) {
    notFound();
  }

  const related = (drug.relatedIds ?? [])
    .map((id) => lookup[id])
    .filter(Boolean)
    .slice(0, 4) as DrugInfo[];

  return (
    <div className="container pb-24 pt-10 space-y-10">
      <div className="flex items-center gap-3 text-sm text-muted-foreground">
        <Link href="/drugs-info" className="inline-flex items-center gap-2 font-semibold text-primary">
          <ArrowLeft className="h-4 w-4" aria-hidden />
          Back to Drug Info
        </Link>
        <span aria-hidden>•</span>
        <span>{drug.category}</span>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <Card className="border-none bg-white/95 shadow-card ring-1 ring-border/15 backdrop-blur-sm dark:bg-secondary/70">
          <CardHeader className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Pill className="h-6 w-6" aria-hidden />
              </span>
              <div>
                <CardTitle className="text-3xl text-secondary dark:text-white">{drug.name}</CardTitle>
                <CardDescription className="text-secondary/80 dark:text-muted-foreground">
                  {drug.genericName ?? drug.name}
                </CardDescription>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
                {drug.category}
              </span>
              {drug.fdaApproved ? (
                <span className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-500/30 dark:text-emerald-200">
                  <ShieldCheck className="h-4 w-4" aria-hidden />
                  FDA Approved
                </span>
              ) : null}
              {drug.quickFacts.map((fact) => (
                <span
                  key={fact}
                  className="rounded-full bg-[var(--muted)]/60 px-3 py-1 text-[11px] font-semibold text-secondary dark:bg-white/10 dark:text-white/80"
                >
                  {fact}
                </span>
              ))}
            </div>
          </CardHeader>
          <CardContent className="space-y-6 text-sm text-secondary/85 dark:text-muted-foreground">
            <p>{drug.description}</p>
            <Separator />
            <div className="space-y-3">
              <h3 className="text-base font-semibold text-secondary dark:text-white">Compounds</h3>
              <div className="flex flex-wrap gap-2">
                {drug.compounds.map((compound) => (
                  <span
                    key={compound}
                    className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary"
                  >
                    {compound}
                  </span>
                ))}
              </div>
            </div>
            <div className="space-y-3">
              <h3 className="text-base font-semibold text-secondary dark:text-white">Tabs</h3>
              <DrugDetailTabs
                content={{
                  overview: drug.overview,
                  dosage: drug.dosage,
                  sideEffects: drug.sideEffects,
                  interactions: drug.interactions,
                  warnings: drug.warnings,
                }}
              />
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="border-none bg-white/95 shadow-card ring-1 ring-border/15 backdrop-blur-sm dark:bg-secondary/70">
            <CardHeader>
              <CardTitle className="text-xl text-secondary dark:text-white">Quick facts</CardTitle>
              <CardDescription className="text-secondary/80 dark:text-muted-foreground">
                Safety highlights to review with patients.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-secondary/80 dark:text-muted-foreground">
              <ul className="space-y-2">
                {drug.warnings.slice(0, 4).map((warning) => (
                  <li
                    key={warning}
                    className="flex items-start gap-2 rounded-xl bg-amber-500/10 px-3 py-2 text-amber-800 dark:bg-amber-500/20 dark:text-amber-100"
                  >
                    <CheckCircle2 className="mt-0.5 h-4 w-4" aria-hidden />
                    <span>{warning}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="border-none bg-white/95 shadow-card ring-1 ring-border/15 backdrop-blur-sm dark:bg-secondary/70">
            <CardHeader>
              <CardTitle className="text-xl text-secondary dark:text-white">Related drugs</CardTitle>
              <CardDescription className="text-secondary/80 dark:text-muted-foreground">
                Explore similar or complementary therapies.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {related.length ? (
                <div className="grid gap-4">
                  {related.map((item, index) => (
                    <DrugInfoCard key={item.id} drug={item} href={`/drugs-info/${item.id}`} index={index} />
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No related drugs listed.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
