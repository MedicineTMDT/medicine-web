"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { User, UserCheck } from "lucide-react";
import { useTranslation } from "@/components/i18n/translation-provider";

export type PrescriptionRole = "patient" | "pharmacist";

type RoleToggleProps = {
  value: PrescriptionRole;
  onChange: (role: PrescriptionRole) => void;
};

export function PrescriptionRoleToggle({ value, onChange }: RoleToggleProps) {
  const { t } = useTranslation();
  const options: { value: PrescriptionRole; label: string; icon: typeof User }[] = [
    { value: "patient", label: t("prescription.role.patient"), icon: User },
    { value: "pharmacist", label: t("prescription.role.pharmacist"), icon: UserCheck },
  ];

  return (
    <div className="flex items-center gap-2 rounded-full border border-[var(--glass-border)] bg-[var(--glass-bg)] p-2 shadow-glass backdrop-blur dark:border-white/10 dark:bg-white/5">
      {options.map((opt) => {
        const isActive = opt.value === value;
        const Icon = opt.icon;
        return (
          <Button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            variant={isActive ? "default" : "ghost"}
            className={cn(
              "gap-2 rounded-full px-4",
              isActive
                ? "bg-primary text-secondary hover:bg-primary/90"
                : "text-secondary dark:text-white"
            )}
            aria-pressed={isActive}
          >
            <Icon className="h-4 w-4" aria-hidden />
            {opt.label}
          </Button>
        );
      })}
    </div>
  );
}
