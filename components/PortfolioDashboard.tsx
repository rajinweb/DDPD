"use client";

import { FlaskConical, LoaderCircle, RefreshCcw, Target, TriangleAlert } from "lucide-react";
import { usePortfolioSnapshot } from "@/hooks/usePortfolioData";
import type { PortfolioSnapshot } from "@/lib/types";
import { formatCompactNumber, formatNumber } from "@/lib/formatters";
import { cn } from "@/lib/utils";
import { DATA_CHIP, EYEBROW_TEXT, SURFACE_CARD, SURFACE_PANEL, BUTTON_SECONDARY } from "@/lib/uiClasses";
import Header from "@/components/Header";
import StatCard from "@/components/StatCard";
import ProgramTable from "@/components/ProgramTable";
import PortfolioFilters from "@/components/dashboard/PortfolioFilters";
import PortfolioInsights from "@/components/dashboard/PortfolioInsights";
import PaginationControls from "@/components/dashboard/PaginationControls";

type PortfolioDashboardProps = {
  snapshot: PortfolioSnapshot;
};

export default function PortfolioDashboard({ snapshot }: PortfolioDashboardProps) {
  const portfolioQuery = usePortfolioSnapshot(snapshot.filters, snapshot);
  const activeSnapshot = portfolioQuery.data ?? snapshot;
  const { filters, insights, meta, programs, summary } = activeSnapshot;

  return (
    <section className="flex flex-col gap-8" aria-busy={portfolioQuery.isFetching}>
      <Header />

      <section
        className="relative overflow-hidden rounded-md border border-white/10 p-8 text-white shadow-hero xl:col-span-3"
        style={{ backgroundImage: "linear-gradient(140deg, #0d2931 0%, #0d645b 62%, #1a7d68 100%)" }}
      >
        <div className="absolute -left-12 -top-10 h-56 w-56 rounded-full bg-white/10 blur-3xl" aria-hidden="true" />
        <div className="absolute -right-4 top-10 h-52 w-52 rounded-full bg-brand-amber/10 blur-3xl" aria-hidden="true" />

        <div className="relative">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight">Portfolio oversight built for clinical decision-making.</h1>
              <p className="text-base text-white/80">
                Browse every asset, filter the pipeline by phase and therapeutic area, and drill directly into study
                execution and milestone readiness. The app uses a deterministic mock API, cached client queries, and
                modular feature boundaries so it behaves like a real production front end without requiring live backend data.
              </p>
            </div>

            <div className="flex flex-wrap gap-3 absolute right-0 top-0">
              {portfolioQuery.isFetching ? (
                <span className={cn(DATA_CHIP, "border-white/15 bg-white/10 text-sm font-semibold text-white")}>
                  <RefreshCcw size={15} className="animate-spin" />
                  Syncing portfolio
                </span>
              ) : null}

              {portfolioQuery.isError ? (
                <button type="button" className={cn(BUTTON_SECONDARY, "border-white/15 bg-white/10 text-white")} onClick={() => void portfolioQuery.refetch()}>
                  <LoaderCircle size={15} />
                  Retry data load
                </button>
              ) : null}
            </div>
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            <div className="flex items-start gap-3 rounded-md border border-white/10 bg-white/10 p-5">
              <p className="text-3xl font-semibold tracking-tight">{meta.total}</p>
              <div className="leading-4 text-white/70">
                <p className={cn(EYEBROW_TEXT, "text-white/70")}>Visible Scope</p>
                Programs matching the current portfolio lens.
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-md border border-white/10 bg-white/10 p-5">
              <p className="text-3xl font-semibold tracking-tight">{summary.totalStudies}</p>
              <div className="leading-4 text-white/70">
                <p className={cn(EYEBROW_TEXT, "text-white/70")}>Connected Studies</p>
                Protocol records attached across the filtered portfolio.
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-md border border-white/10 bg-white/10 p-5">
              <p className="text-3xl font-semibold tracking-tight">{summary.upcomingMilestones}</p>
              <div className="leading-4 text-white/70">
                <p className={cn(EYEBROW_TEXT, "text-white/70")}>Upcoming Milestones</p>
                Near-term delivery points expected within the next 120 days.
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={cn(SURFACE_CARD, "rounded-md p-5 sm:p-6")}>
        <div className="flex-wrap items-end justify-between gap-4">
          <div>
            <p className={EYEBROW_TEXT}>Portfolio Controls</p>
            <h2 className="text-xl font-semibold text-ink">Filter, search, and rank the pipeline</h2>
          </div>
          <p className="text-sm text-copy">
            Filters sync to the URL so the entire view stays reproducible and shareable. React Query caches the
            result sets and keeps previous pages warm while the mock API responds in the background.
          </p>
        </div>

  
          <PortfolioFilters
            key={`${filters.q}:${filters.phase}:${filters.therapeuticArea}:${filters.riskLevel}:${filters.sortBy}:${filters.page}:${filters.limit}`}
            filters={filters}
          />
      
      </section>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
        <StatCard
          label="Total Programs"
          value={summary.totalPrograms}
          sub="Programs in the current result set"
          accent="#0D645B"
          className="border-0 rounded-none bg-[#0D645B]/10"
        />
        <StatCard
          label="Active Clinical"
          value={summary.activeClinicalPrograms}
          sub="Programs in Phases I-III"
          accent="#0E658E"
          className="border-0 rounded-none bg-[#0E658E]/10"
        />
        <StatCard
          label="Connected Studies"
          value={summary.totalStudies}
          sub="Protocols attached to the visible pipeline"
          accent="#4B599A"
          className="border-0 rounded-none bg-[#4B599A]/10"
        />
        <StatCard
          label="Enrolled Patients"
          value={formatCompactNumber(summary.enrolledPatients)}
          sub={`${formatNumber(summary.enrolledPatients)} total patients across studies`}
          accent="#C38328"
          className="border-0 rounded-none bg-[#C38328]/10"
        />
        <StatCard
          label="Regulatory Stage"
          value={summary.regulatoryPrograms}
          sub="Programs in NDA/BLA or approved status"
          accent="#5D7D2F"
          className="border-0 rounded-none bg-[#5D7D2F]/10"
        />
        <StatCard
          label="High Risk"
          value={summary.highRiskPrograms}
          sub="Assets needing portfolio attention"
          accent="#A2474D"
          className="border-0 rounded-none bg-[#A2474D]/10"
        />
      </div>

      <PortfolioInsights insights={insights} />


      <section className={cn(SURFACE_PANEL, "rounded-md p-5 sm:p-6")}>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className={EYEBROW_TEXT}>Programs</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-ink">All active assets in the portfolio</h2>
            <p className="mt-2 text-sm leading-6 text-copy">
              {meta.total === 0
                ? "No programs matched the current search and filter combination."
                : `Showing ${meta.startRow}-${meta.endRow} of ${meta.total} matched programs.`}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <span className={cn(DATA_CHIP, "text-sm font-semibold")}>
              <FlaskConical size={15} className="text-brand-teal" />
              {programs.length} records rendered
            </span>
            <span className={cn(DATA_CHIP, "text-sm font-semibold")}>
              <Target size={15} className="text-brand-amber" />
              {summary.upcomingMilestones} milestone checkpoints ahead
            </span>
            <span className={cn(DATA_CHIP, "text-sm font-semibold")}>
              <TriangleAlert size={15} className="text-brand-rose" />
              {summary.highRiskPrograms} high-risk assets
            </span>
          </div>
        </div>

        {portfolioQuery.isError ? (
          <div className="mt-6 rounded-md border border-brand-rose/25 bg-brand-rose/8 p-5 text-sm text-brand-rose" role="alert">
            <p className="font-semibold">Portfolio data could not be refreshed.</p>
            <p className="mt-1">{portfolioQuery.error.message}</p>
          </div>
        ) : null}

        <div className="mt-6">
          {programs.length > 0 ? (
            <ProgramTable programs={programs} />
          ) : (
            <div className="rounded-md border border-dashed border-stroke-strong bg-surface-muted p-10 text-center">
              <p className="text-xl font-semibold tracking-tight text-ink">No programs found</p>
              <p className="mt-2 text-sm leading-6 text-copy">
                Clear the current filters or broaden the search query to bring more portfolio records into view.
              </p>
            </div>
          )}
        </div>

        <PaginationControls filters={filters} meta={meta} />
      </section>
    </section>
  );
}
