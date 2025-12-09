"use client";

import { Button } from "@/components/ui/button";
import { Language, useTranslation } from "@/components/i18n/translation-provider";
import { Languages } from "lucide-react";

const LANGUAGE_OPTIONS: { code: Language; short: string; labelKey: string }[] = [
  { code: "en", short: "EN", labelKey: "language.english" },
  { code: "vi", short: "VI", labelKey: "language.vietnamese" },
];

export function LanguageToggle() {
  const { language, setLanguage, t } = useTranslation();

  return (
    <div className="flex items-center gap-2 rounded-full border border-[var(--glass-border)] bg-[var(--glass-bg)] px-2 py-1 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5">
      <Languages className="h-4 w-4 text-muted-foreground" aria-hidden />
      <span className="sr-only">{t("language.label")}</span>
      <div className="flex gap-1">
        {LANGUAGE_OPTIONS.map((option) => {
          const isActive = option.code === language;
          return (
            <Button
              key={option.code}
              type="button"
              size="sm"
              variant={isActive ? "default" : "ghost"}
              className="h-8 rounded-full px-3 text-xs font-semibold"
              aria-pressed={isActive}
              onClick={() => setLanguage(option.code)}
            >
              {t(option.labelKey, { fallback: option.short })}
            </Button>
          );
        })}
      </div>
    </div>
  );
}
