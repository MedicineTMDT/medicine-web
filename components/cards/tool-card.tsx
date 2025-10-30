import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export type ToolCardProps = {
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
  accent?: string;
  delay?: number;
};

export function ToolCard({
  title,
  description,
  href,
  icon: Icon,
  accent = "from-primary/12 to-accent/12",
  delay = 0,
}: ToolCardProps) {
  return (
    <motion.article
      className="h-full"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay }}
    >
      <Card className="group h-full border-none bg-white/90 shadow-card ring-1 ring-border/40 backdrop-blur-sm transition-all hover:-translate-y-1 hover:ring-primary/40 dark:bg-secondary/60">
        <CardHeader className="space-y-4">
          <span
            className={cn(
              "inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-b text-primary shadow-sm",
              accent
            )}
          >
            <Icon className="h-6 w-6" aria-hidden />
          </span>
          <CardTitle className="text-xl dark:text-white">{title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <p className="text-sm text-secondary/80 dark:text-muted-foreground">
            {description}
          </p>
          <Link
            href={href}
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary transition hover:gap-3"
          >
            Launch Tool
            <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
          </Link>
        </CardContent>
      </Card>
    </motion.article>
  );
}
