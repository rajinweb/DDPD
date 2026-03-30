"use client";

import Link from "next/link";
import { FlaskConical, House } from "lucide-react";
import { ROLE_OPTIONS } from "@/lib/programs";
import { cn } from "@/lib/utils";
import { usePortfolioSessionStore } from "@/lib/stores/portfolio-session";
import type { UserRole } from "@/lib/types";
import { BUTTON_TERTIARY, EYEBROW_TEXT, FIELD_LABEL_TEXT } from "@/lib/uiClasses";
import SelectField from "@/components/customUi/SelectField";

type HeaderProps = {
  backHref?: string;
};

export default function Header({ backHref }: HeaderProps) {
  const hasHydrated = usePortfolioSessionStore((state) => state.hasHydrated);
  const role = usePortfolioSessionStore((state) => state.role);
  const setRole = usePortfolioSessionStore((state) => state.setRole);
  const resolvedRole = hasHydrated ? role : "reviewer";

  return (
    <header>
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <FlaskConical size={50} className="text-brand-teal" />
          <div>
            <p className={cn(EYEBROW_TEXT, "tracking-normal")}>Clinical R&amp;D Operating System</p>
            <p className="text-xl font-semibold leading-5 tracking-tight text-ink">
              Drug Development Portfolio Dashboard
            </p>
            <p className="text-sm text-copy">
              Production-style front end with mocked APIs, cached server-state, and scalable portfolio exploration.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end sm:justify-end">
                {backHref ? (
            <Link href={backHref} className={cn(BUTTON_TERTIARY,'font-normal')}>
              <House size={16} />
              Portfolio Home
            </Link>
          ) : null}         
          <div className="grid gap-2">
            <span className={FIELD_LABEL_TEXT}>Simulated Access Role</span>
            <SelectField
              ariaLabel="Simulated access role"
              value={resolvedRole}
              options={ROLE_OPTIONS}
              onValueChange={(value) => setRole(value as UserRole)}
              className="h-11"
            />
          </div>
        </div>
      </div>
    </header>
  );
}
