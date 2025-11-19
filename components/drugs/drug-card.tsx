import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import type { Drug } from "@/lib/mockData";

type DrugCardProps = {
  drug: Drug;
  href: string;
  index?: number;
};

export function DrugCard({ drug, href, index = 0 }: DrugCardProps) {
  return (
    <Card className="group h-full border-none bg-white/95 shadow-card ring-1 ring-border/20 backdrop-blur-sm transition hover:-translate-y-1 hover:ring-primary/40 dark:bg-secondary/70">
      <CardHeader className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
            {drug.category}
          </span>
          {drug.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className={cn(
                "rounded-full px-2.5 py-1 text-[11px] font-semibold",
                index % 2 === 0
                  ? "bg-[var(--muted)]/60 text-secondary"
                  : "bg-accent/15 text-secondary"
              )}
            >
              {tag}
            </span>
          ))}
        </div>
        <CardTitle className="text-xl text-secondary dark:text-white">
          {drug.name}
        </CardTitle>
        <CardDescription className="text-secondary/80 dark:text-muted-foreground">
          {drug.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm text-muted-foreground">
          <p className="font-semibold text-secondary dark:text-white/80">Typical dosage</p>
          <p className="mt-1">{drug.dosage}</p>
        </div>
        <div className="flex flex-wrap gap-2 text-xs text-secondary/70 dark:text-white/70">
          {drug.compounds.map((compound) => (
            <span
              key={compound}
              className="rounded-full bg-[var(--muted)]/60 px-3 py-1 font-semibold dark:bg-white/10"
            >
              {compound}
            </span>
          ))}
        </div>
        <Button variant="ghost" className="group/item inline-flex items-center gap-2 px-0" asChild>
          <Link href={href}>
            View details
            <ArrowRight className="h-4 w-4 transition group-hover/item:translate-x-1" aria-hidden />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
