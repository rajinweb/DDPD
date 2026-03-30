import type { Milestone } from "@/lib/types";
import { formatShortDate } from "@/lib/formatters";
import { cn } from "@/lib/utils";
import { EYEBROW_TEXT, FIELD_LABEL_TEXT, SURFACE_PANEL } from "@/lib/uiClasses";
import { getMetadataColor } from "@/components/customUi/PhasePill";
import Badge from "@/components/customUi/Badge";
import { CheckCircle2 } from "lucide-react";

export default function MilestoneRow({ milestone, isLast }: { milestone: Milestone, isLast: boolean }) {
  const color = getMetadataColor(milestone.status);
  const hasVariance = milestone.date !== milestone.plannedDate;

  return (
    <div className="grid gap-4 sm:grid-cols-12">
      <div className="relative flex min-h-full justify-center sm:col-span-1">
        <span
          className="z-10 inline-flex h-10 w-10 items-center justify-center rounded-full"
          style={{
            background: color.bg,
            color: color.text,
            boxShadow: "0 0 0 6px var(--surface-raised)",
          }}
        >
          <CheckCircle2 size={14} />
        </span>
        {!isLast ? <span className="absolute top-10 w-px bg-stroke-strong" style={{ height: "calc(100% - 1rem)" }} /> : null}
      </div>

      <div className={cn(SURFACE_PANEL, "rounded-md p-5 sm:col-span-11")}>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className={EYEBROW_TEXT}>Milestone</p>
            <h3 className="mt-2 text-xl font-semibold tracking-tight text-ink">{milestone.name}</h3>
            {hasVariance && (
              <p className="mt-2 text-sm font-medium text-brand-rose">
                Planned for {formatShortDate(milestone.plannedDate)}
              </p>
            )}
          </div>
          <Badge label={milestone.status} color={color} />
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div className="rounded-md bg-surface-muted p-4">
            <p className={FIELD_LABEL_TEXT}>Current Date</p>
            <p className="mt-1 text-base font-semibold text-ink">{formatShortDate(milestone.date)}</p>
          </div>
          <div className="rounded-md bg-surface-muted p-4">
            <p className={FIELD_LABEL_TEXT}>Planned Baseline</p>
            <p className="mt-1 text-base font-semibold text-ink">{formatShortDate(milestone.plannedDate)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
