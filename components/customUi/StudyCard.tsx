import type { Study } from "@/lib/types";
import { formatNumber, formatShortDate } from "@/lib/formatters";
import { cn } from "@/lib/utils";
import { DATA_CHIP, EYEBROW_TEXT, FIELD_LABEL_TEXT, SURFACE_PANEL } from "@/lib/uiClasses";
import Badge from "@/components/customUi/Badge";
import PhasePill, { getMetadataColor } from "@/components/customUi/PhasePill";
import ProgressBar, { getEnrollmentProgressColor } from "@/components/customUi/ProgressBar";
import { Building2, CalendarDays, Target, Users, type LucideIcon } from "lucide-react";

type StudyMetric = {
  icon: LucideIcon;
  label: string;
  value: string;
  iconClassName: string;
};

export default function StudyCard({ study }: { study: Study }) {
  const enrollmentPercent = Math.min(100, Math.round((study.enrolled / Math.max(study.target, 1)) * 100));
  const enrollmentBarColor = getEnrollmentProgressColor(enrollmentPercent);
  const metrics: StudyMetric[] = [
    {
      icon: Building2,
      label: "Sites",
      value: formatNumber(study.sites),
      iconClassName: "text-brand-teal",
    },
    {
      icon: Users,
      label: "Enrollment",
      value: `${formatNumber(study.enrolled)} / ${formatNumber(study.target)}`,
      iconClassName: "text-brand-sky",
    },
    {
      icon: CalendarDays,
      label: "Start",
      value: formatShortDate(study.startDate),
      iconClassName: "text-brand-amber",
    },
    {
      icon: Target,
      label: "Closeout",
      value: formatShortDate(study.endDate),
      iconClassName: "text-brand-rose",
    },
  ];

  return (
    <article className={cn(SURFACE_PANEL, "rounded-md p-4")}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="grid min-w-0 gap-1.5">
          <span className={EYEBROW_TEXT}>Connected Study</span>
          <h3 className="text-lg font-semibold tracking-tight text-ink">{study.title}</h3>
          <p className="text-sm leading-6 text-copy">
            {study.nctId} · {study.indication}
          </p>
        </div>
      <div className="flex flex-wrap gap-2">
        <PhasePill phase={study.phase} />
        <span className={cn(DATA_CHIP, "text-sm font-semibold")}>{study.primaryEndpoint} primary endpoint</span>
      </div>
        <Badge label={study.status} color={getMetadataColor(study.status)} />
      </div>

     

      <div className="mt-4 grid gap-3 lg:grid-cols-[minmax(0,1.2fr)_minmax(260px,0.8fr)]">
        <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
          {metrics.map((metric) => {
            const Icon = metric.icon;

            return (
              <div key={metric.label} className="rounded-md bg-surface-muted px-3 py-3">
                <div className="flex items-start gap-2.5">
                  <Icon size={16} className={cn("mt-0.5 shrink-0", metric.iconClassName)} />
                  <div className="min-w-0">
                    <p className={FIELD_LABEL_TEXT}>{metric.label}</p>
                    <p className="mt-1 truncate text-sm font-semibold text-ink">{metric.value}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="rounded-md border border-stroke bg-surface-muted px-3 py-3">
          <div className="flex items-start justify-between gap-4 text-sm text-copy">
            <div className="min-w-0">
              <p className={FIELD_LABEL_TEXT}>Enrollment Progress</p>
              <p className="mt-1 text-sm font-semibold text-ink">
                {formatNumber(study.enrolled)} of {formatNumber(study.target)} patients recruited
              </p>
            </div>
            <p className="shrink-0 text-base font-semibold text-ink">{enrollmentPercent}%</p>
          </div>
          <div className="mt-2">
            <ProgressBar value={study.enrolled} max={study.target} color={enrollmentBarColor} />
          </div>
        </div>
      </div>
    </article>
  );
}
