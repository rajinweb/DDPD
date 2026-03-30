"use client";

import type { ReactNode } from "react";
import { formatPercent } from "@/lib/formatters";
import type { PortfolioInsightDatum, PortfolioInsights as PortfolioInsightsData } from "@/lib/types";
import { cn } from "@/lib/utils";
import { DATA_CHIP, EYEBROW_TEXT, SURFACE_PANEL } from "@/lib/uiClasses";

type PortfolioInsightsProps = {
  insights: PortfolioInsightsData;
};

type InsightCardProps = {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
};

function InsightCard({ eyebrow, title, description, children }: InsightCardProps) {
  return (
    <article className={cn(SURFACE_PANEL, "rounded-md p-5 sm:p-6")}>
      <p className={EYEBROW_TEXT}>{eyebrow}</p>
      <h3 className="mt-2 text-xl font-semibold tracking-tight text-ink">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-copy">{description}</p>
      <div className="mt-6">{children}</div>
    </article>
  );
}

function EmptyState({ label }: { label: string }) {
  return (
    <div className="rounded-md border border-dashed border-stroke bg-surface-muted p-6 text-sm text-copy">
      {label}
    </div>
  );
}

function DistributionLegend({ items }: { items: PortfolioInsightDatum[] }) {
  return (
    <ul className="grid gap-3 sm:grid-cols-2">
      {items.map((item) => (
        <li key={item.label} className="flex items-start justify-between gap-3 rounded-md bg-surface-muted p-3">
          <div className="flex min-w-0 items-center gap-3">
            <span className="mt-0.5 h-3 w-3 shrink-0 rounded-full" style={{ backgroundColor: item.color }} aria-hidden="true" />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-ink">{item.label}</p>
              <p className="text-xs text-copy">{formatPercent(item.percentage)} of visible programs</p>
            </div>
          </div>
          <span className="text-sm font-semibold text-ink">{item.value}</span>
        </li>
      ))}
    </ul>
  );
}

function PhaseDistribution({ items }: { items: PortfolioInsightDatum[] }) {
  if (items.length === 0) {
    return <EmptyState label="Apply broader filters to see how programs are distributed across the development phases." />;
  }

  return (
    <div className="space-y-6">
      <div
        className="flex h-5 overflow-hidden rounded-md bg-surface-muted"
        role="img"
        aria-label="Phase distribution across filtered programs"
      >
        {items.map((item) => (
          <div
            key={item.label}
            className="h-full transition-all duration-300"
            style={{ width: `${item.percentage}%`, backgroundColor: item.color }}
            aria-hidden="true"
          />
        ))}
      </div>
      <DistributionLegend items={items} />
    </div>
  );
}

function TherapeuticAreaDistribution({ items }: { items: PortfolioInsightDatum[] }) {
  if (items.length === 0) {
    return <EmptyState label="Therapeutic area concentration will appear here once matching programs are in scope." />;
  }

  return (
    <ul className="space-y-4">
      {items.map((item) => (
        <li key={item.label}>
          <div className="flex items-end justify-between gap-3">
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-ink">{item.label}</p>
              <p className="text-xs text-copy">{item.value} programs</p>
            </div>
            <span className="text-sm font-semibold text-ink">{formatPercent(item.percentage)}</span>
          </div>
          <div className="mt-2 h-2.5 overflow-hidden rounded-md bg-surface-muted" aria-hidden="true">
            <div
              className="h-full rounded-md transition-all duration-300"
              style={{ width: `${item.percentage}%`, backgroundColor: item.color }}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}

function RiskDistribution({
  items,
  enrollmentCompletionRate,
  averageStudiesPerProgram,
}: {
  items: PortfolioInsightDatum[];
  enrollmentCompletionRate: number;
  averageStudiesPerProgram: number;
}) {
  if (items.length === 0) {
    return <EmptyState label="Risk composition becomes available when the current portfolio lens includes programs." />;
  }

  const radius = 46;
  const circumference = 2 * Math.PI * radius;
  const segments = items.reduce<{
    accumulatedLength: number;
    items: Array<PortfolioInsightDatum & { dashArray: string; dashOffset: number }>;
  }>(
    (state, item) => {
      const segmentLength = (item.percentage / 100) * circumference;

      return {
        accumulatedLength: state.accumulatedLength + segmentLength,
        items: [
          ...state.items,
          {
            ...item,
            dashArray: `${segmentLength} ${circumference - segmentLength}`,
            dashOffset: -state.accumulatedLength,
          },
        ],
      };
    },
    {
      accumulatedLength: 0,
      items: [],
    },
  ).items;

  const highRiskCount = items.find((item) => item.label === "High")?.value ?? 0;

  return (
    <div className="grid gap-6 lg:grid-cols-[150px_minmax(0,1fr)] lg:items-center">
      <div className="mx-auto flex h-[150px] w-[150px] items-center justify-center">
        <svg viewBox="0 0 120 120" className="h-full w-full" role="img" aria-label="Risk distribution donut chart">
          <circle cx="60" cy="60" r={radius} fill="none" stroke="rgba(148, 163, 184, 0.18)" strokeWidth="16" />
          {segments.map((segment) => (
            <circle
              key={segment.label}
              cx="60"
              cy="60"
              r={radius}
              fill="none"
              stroke={segment.color}
              strokeWidth="16"
              strokeLinecap="butt"
              strokeDasharray={segment.dashArray}
              strokeDashoffset={segment.dashOffset}
              transform="rotate(-90 60 60)"
            />
          ))}
          <text x="60" y="54" textAnchor="middle" className="fill-ink" style={{ fontSize: 18, fontWeight: 600 }}>
            {highRiskCount}
          </text>
          <text
            x="60"
            y="72"
            textAnchor="middle"
            className="fill-muted-foreground"
            style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase" }}
          >
            High Risk
          </text>
        </svg>
      </div>

      <div className="space-y-4">
        <DistributionLegend items={items} />
        <div className="flex flex-wrap gap-3">
          <span className={cn(DATA_CHIP, "text-sm font-semibold")}>
            {formatPercent(enrollmentCompletionRate)} enrollment to target
          </span>
          <span className={cn(DATA_CHIP, "text-sm font-semibold")}>
            {averageStudiesPerProgram.toFixed(1)} studies per program
          </span>
        </div>
      </div>
    </div>
  );
}

export default function PortfolioInsights({ insights }: PortfolioInsightsProps) {
  return (
    <section className="grid gap-4 xl:grid-cols-[1.2fr_1fr_1fr]">
      <InsightCard
        eyebrow="Phase Mix"
        title="Pipeline balance across the current portfolio lens"
        description="This view shows where visible programs sit in the development lifecycle, helping managers spot stage concentration and downstream bottlenecks."
      >
        <PhaseDistribution items={insights.phaseDistribution} />
      </InsightCard>

      <InsightCard
        eyebrow="Therapeutic Areas"
        title="Concentration by clinical focus"
        description="The therapeutic-area ranking highlights where the filtered pipeline is most concentrated so portfolio discussions stay grounded in mix, not just volume."
      >
        <TherapeuticAreaDistribution items={insights.therapeuticAreaDistribution} />
      </InsightCard>

      <InsightCard
        eyebrow="Risk Posture"
        title="Risk composition and execution load"
        description="A compact view of portfolio risk, paired with enrollment completion and study density, to surface whether operational complexity is rising with the current slice."
      >
        <RiskDistribution
          items={insights.riskDistribution}
          enrollmentCompletionRate={insights.enrollmentCompletionRate}
          averageStudiesPerProgram={insights.averageStudiesPerProgram}
        />
      </InsightCard>
    </section>
  );
}
