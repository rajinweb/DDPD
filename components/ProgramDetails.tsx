"use client";

import { useEffect, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import * as Tabs from "@radix-ui/react-tabs";
import { Edit3, RefreshCcw, Target, Users, Workflow } from "lucide-react";
import { useProgramDetails, useUpdateProgramMetadata } from "@/hooks/usePortfolioData";
import { PRIORITY_OPTIONS, RISK_LEVEL_OPTIONS } from "@/lib/programs";
import { usePortfolioSessionStore } from "@/lib/stores/portfolio-session";
import { formatBudgetMillions, formatNumber, formatPercent, formatShortDate } from "@/lib/formatters";
import type { Program, ProgramMetadata } from "@/lib/types";
import { cn } from "@/lib/utils";
import {
  BUTTON_PRIMARY,
  BUTTON_SECONDARY,
  DATA_CHIP,
  DEFINITION_DESC,
  DEFINITION_LIST,
  DEFINITION_TERM,
  EYEBROW_TEXT,
  FIELD_INPUT,
  FIELD_LABEL_TEXT,
  SURFACE_PANEL,
} from "@/lib/uiClasses";
import Header from "@/components/Header";
import StatCard from "@/components/StatCard";
import Badge from "@/components/customUi/Badge";
import MilestoneRow from "@/components/customUi/MilestoneRow";
import PhasePill, { getMetadataColor } from "@/components/customUi/PhasePill";
import SelectField from "@/components/customUi/SelectField";
import StudyCard from "@/components/customUi/StudyCard";

type ProgramDetailsProps = {
  program: Program;
};

function pickEditableMetadata(program: Program): ProgramMetadata {
  return {
    indication: program.indication,
    lead: program.lead,
    riskLevel: program.riskLevel,
    priority: program.priority,
  };
}

export default function ProgramDetails({ program }: ProgramDetailsProps) {
  const hasHydrated = usePortfolioSessionStore((state) => state.hasHydrated);
  const role = usePortfolioSessionStore((state) => state.role);
  const resolvedRole = hasHydrated ? role : "reviewer";
  const canEdit = resolvedRole === "manager";
  const programQuery = useProgramDetails(program.id, program);
  const updateMetadataMutation = useUpdateProgramMetadata(program.id, resolvedRole);
  const {
    error: metadataMutationError,
    isPending: isSavingMetadata,
    mutateAsync: mutateMetadata,
    reset: resetMetadataMutation,
  } = updateMetadataMutation;
  const currentProgram = programQuery.data ?? program;
  const [draft, setDraft] = useState<ProgramMetadata>(() => pickEditableMetadata(program));
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const saveError = metadataMutationError instanceof Error ? metadataMutationError.message : null;
  const portfolioStatus =
    currentProgram.phase === "Approved" ? "Completed" : currentProgram.phase === "NDA/BLA" ? "Regulatory" : "Active";

  useEffect(() => {
    setDraft(pickEditableMetadata(currentProgram));
  }, [currentProgram]);

  useEffect(() => {
    if (!isDialogOpen) {
      return;
    }

    resetMetadataMutation();
    setDraft(pickEditableMetadata(currentProgram));
  }, [currentProgram, isDialogOpen, resetMetadataMutation]);

  const enrollmentPercent = Math.round((currentProgram.enrolled / Math.max(currentProgram.target, 1)) * 100);
  const activeStudies = currentProgram.studies.filter((study) => study.status === "ongoing").length;
  const totalSites = currentProgram.studies.reduce((sum, study) => sum + study.sites, 0);
  const completedMilestones = currentProgram.milestones.filter((milestone) => milestone.status === "completed").length;
  const milestonePercent = Math.round((completedMilestones / Math.max(currentProgram.milestones.length, 1)) * 100);
  const budgetBurnPercent = Math.round((currentProgram.budgetUsed / Math.max(currentProgram.budget, 1)) * 100);

  async function handleSave() {
    await mutateMetadata({
      metadata: draft,
    });
    setIsDialogOpen(false);
  }

  return (
    <section className="flex flex-col gap-8" aria-busy={programQuery.isFetching || isSavingMetadata}>
      <Header backHref="/" />

      <div className="grid gap-6 xl:grid-cols-5">
        <section
          className="relative overflow-hidden rounded-md border border-white/10 p-7 text-white shadow-hero sm:p-8 xl:col-span-3"
          style={{ backgroundImage: "linear-gradient(145deg, #0d2931 0%, #0d645b 58%, #1a7d68 100%)" }}
        >
          <div className="absolute -right-7 -top-9 h-60 w-60 rounded-full bg-white/10 blur-3xl" aria-hidden="true" />

          <div className="relative">
            <div className="flex flex-wrap items-start justify-between gap-6">
              <div className="max-w-3xl">
                <p className={cn(EYEBROW_TEXT, "text-white/70")}>
                  {currentProgram.code} · {currentProgram.therapeuticArea}
                </p>
                <h1 className="mt-2 text-4xl font-semibold tracking-tight sm:text-5xl">{currentProgram.name}</h1>
                <p className="mt-0 text-base leading-7 text-white/80">{currentProgram.description}</p>

                <div className="mt-2 flex flex-wrap gap-2">
                  <PhasePill phase={currentProgram.phase} />
                  <Badge label={portfolioStatus} color={getMetadataColor(portfolioStatus)} />
                  <Badge label={`Risk ${currentProgram.riskLevel}`} color={getMetadataColor(currentProgram.riskLevel)} />
                  {currentProgram.partner ? (
                    <span className={cn(DATA_CHIP, "border-white/15 bg-white/10 text-white")}>
                      Partnered with {currentProgram.partner}
                    </span>
                  ) : null}
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-end gap-3 absolute right-0">              
                {programQuery.isFetching ? (
                  <span className={cn(DATA_CHIP, "border-white/15 bg-white/10 text-white")}>
                    <RefreshCcw size={15} className="animate-spin" />
                    Syncing mock API
                  </span>
                ) : null}

                {canEdit ? (
                  <Dialog.Root open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <Dialog.Trigger asChild>
                      <button type="button" className={cn(BUTTON_PRIMARY, "bg-black/50")}>
                        <Edit3 size={16} />
                        Edit metadata
                      </button>
                    </Dialog.Trigger>

                    <Dialog.Portal>
                      <Dialog.Overlay className="fixed inset-0 z-40 bg-ink/45 backdrop-blur-sm" />
                      <Dialog.Content
                        className="fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-md border border-stroke-strong bg-surface-raised p-6 shadow-modal focus:outline-none"
                        style={{ width: "min(640px, calc(100vw - 2rem))", maxHeight: "calc(100vh - 2rem)" }}
                      >
                        <div className="grid gap-2 text-left">
                          <Dialog.Title className="text-2xl font-semibold tracking-tight text-ink">
                            Edit program metadata
                          </Dialog.Title>
                          <Dialog.Description className="text-sm leading-6 text-copy">
                            This front end simulates role-based authorization. Portfolio managers can edit indication,
                            lead, risk level, and priority while execution data remains read-only.
                          </Dialog.Description>
                        </div>

                        <form
                          className="mt-6 grid gap-4"
                          onSubmit={(event) => {
                            event.preventDefault();
                            void handleSave();
                          }}
                        >
                          <label className="grid gap-2">
                            <span className={FIELD_LABEL_TEXT}>Indication</span>
                            <input
                              className={cn(FIELD_INPUT, "h-14")}
                              value={draft.indication}
                              onChange={(event) => setDraft({ ...draft, indication: event.target.value })}
                            />
                          </label>

                          <div className="grid gap-4 sm:grid-cols-2">
                            <label className="grid gap-2">
                              <span className={FIELD_LABEL_TEXT}>Program Lead</span>
                              <input
                                className={cn(FIELD_INPUT, "h-14")}
                                value={draft.lead}
                                onChange={(event) => setDraft({ ...draft, lead: event.target.value })}
                              />
                            </label>

                            <div className="grid gap-2">
                              <span className={FIELD_LABEL_TEXT}>Risk Level</span>
                              <SelectField
                                ariaLabel="Risk Level"
                                value={draft.riskLevel}
                                options={RISK_LEVEL_OPTIONS}
                                onValueChange={(value) =>
                                  setDraft({
                                    ...draft,
                                    riskLevel: value as ProgramMetadata["riskLevel"],
                                  })
                                }
                              />
                            </div>
                          </div>

                          <div className="grid gap-2">
                            <span className={FIELD_LABEL_TEXT}>Priority Designation</span>
                            <SelectField
                              ariaLabel="Priority Designation"
                              value={draft.priority}
                              options={PRIORITY_OPTIONS}
                              onValueChange={(value) => setDraft({ ...draft, priority: value })}
                            />
                          </div>

                          {saveError ? (
                            <div className="rounded-md border border-brand-rose/30 bg-brand-rose/10 p-4 text-sm font-medium text-brand-rose">
                              {saveError}
                            </div>
                          ) : null}

                          <div className="mt-2 flex flex-wrap justify-end gap-3">
                            <Dialog.Close asChild>
                              <button type="button" className={BUTTON_SECONDARY} disabled={isSavingMetadata}>
                                Cancel
                              </button>
                            </Dialog.Close>
                            <button type="submit" className={BUTTON_PRIMARY} disabled={isSavingMetadata}>
                              {isSavingMetadata ? "Saving..." : "Save changes"}
                            </button>
                          </div>
                        </form>
                      </Dialog.Content>
                    </Dialog.Portal>
                  </Dialog.Root>
                ) : (
                  <span className={cn(DATA_CHIP, "border-white/15 bg-white/10 text-white")}>Read-only view</span>
                )}
              </div>
            </div>

            {programQuery.isError ? (
              <div className="mt-6 rounded-md border border-white/15 bg-white/10 p-4 text-sm text-white/85" role="alert">
                The latest detail refresh failed. Showing the last known program snapshot.
              </div>
            ) : null}

            <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <div className="rounded-md border border-white/10 bg-white/10 p-5">
                <p className={cn(EYEBROW_TEXT, "text-white/70")}>Enrollment</p>
                <p className="mt-3 text-3xl font-semibold tracking-tight">{enrollmentPercent}%</p>
                <p className="mt-2 text-sm text-white/70">
                  {formatNumber(currentProgram.enrolled)} of {formatNumber(currentProgram.target)} patients enrolled.
                </p>
              </div>
              <div className="rounded-md border border-white/10 bg-white/10 p-5">
                <p className={cn(EYEBROW_TEXT, "text-white/70")}>Budget Burn</p>
                <p className="mt-3 text-3xl font-semibold tracking-tight">{budgetBurnPercent}%</p>
                <p className="mt-2 text-sm text-white/70">
                  {formatBudgetMillions(currentProgram.budgetUsed)} spent of {formatBudgetMillions(currentProgram.budget)}.
                </p>
              </div>
              <div className="rounded-md border border-white/10 bg-white/10 p-5">
                <p className={cn(EYEBROW_TEXT, "text-white/70")}>Active Studies</p>
                <p className="mt-3 text-3xl font-semibold tracking-tight">{activeStudies}</p>
                <p className="mt-2 text-sm text-white/70">{formatNumber(totalSites)} clinical sites in network.</p>
              </div>
              <div className="rounded-md border border-white/10 bg-white/10 p-5">
                <p className={cn(EYEBROW_TEXT, "text-white/70")}>Milestones</p>
                <p className="mt-3 text-3xl font-semibold tracking-tight">{milestonePercent}%</p>
                <p className="mt-2 text-sm text-white/70">
                  {completedMilestones} of {currentProgram.milestones.length} milestones delivered.
                </p>
              </div>
            </div>
          </div>
        </section>

        <div className="grid gap-6 xl:col-span-2">
          <section className={cn(SURFACE_PANEL, "rounded-md p-6")}>
            <p className={EYEBROW_TEXT}>Program Profile</p>
            <dl className={cn(DEFINITION_LIST, "mt-6 sm:grid-cols-2")}>
              <div>
                <dt className={DEFINITION_TERM}>Mechanism</dt>
                <dd className={DEFINITION_DESC}>{currentProgram.mechanism}</dd>
              </div>
              <div>
                <dt className={DEFINITION_TERM}>Modality</dt>
                <dd className={DEFINITION_DESC}>{currentProgram.modality}</dd>
              </div>
              <div>
                <dt className={DEFINITION_TERM}>Route</dt>
                <dd className={DEFINITION_DESC}>{currentProgram.route}</dd>
              </div>
              <div>
                <dt className={DEFINITION_TERM}>Lead</dt>
                <dd className={DEFINITION_DESC}>{currentProgram.lead}</dd>
              </div>
              <div>
                <dt className={DEFINITION_TERM}>Priority</dt>
                <dd className={DEFINITION_DESC}>{currentProgram.priority}</dd>
              </div>
              <div>
                <dt className={DEFINITION_TERM}>Partner</dt>
                <dd className={DEFINITION_DESC}>{currentProgram.partner ?? "Unpartnered"}</dd>
              </div>
              <div>
                <dt className={DEFINITION_TERM}>NDA / BLA</dt>
                <dd className={DEFINITION_DESC}>{currentProgram.nda ?? "Not yet filed"}</dd>
              </div>
              <div>
                <dt className={DEFINITION_TERM}>Last Updated</dt>
                <dd className={DEFINITION_DESC}>{formatShortDate(currentProgram.lastUpdated)}</dd>
              </div>
            </dl>
          </section>
        </div>
      </div>

      <section className={cn(SURFACE_PANEL, "rounded-md p-6")}>
        <div className="flex flex-col">
          <div className="mb-4">
            <p className={EYEBROW_TEXT}>Program Overview</p>
            <h2 className="text-xl font-semibold tracking-tight text-ink">Portfolio narrative and delivery context</h2>
            <p className="text-sm text-copy">{currentProgram.description}</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:col-span-2">
            <div className="grid grid-cols-2 gap-2">
              <div className="rounded-md bg-surface-muted p-5">
                <p className={FIELD_LABEL_TEXT}>Start Date</p>
                <p className="mt-2 text-lg font-semibold text-ink">{formatShortDate(currentProgram.startDate)}</p>
              </div>
              <div className="rounded-md bg-surface-muted p-5">
                <p className={FIELD_LABEL_TEXT}>Projected Completion</p>
                <p className="mt-2 text-lg font-semibold text-ink">
                  {formatShortDate(currentProgram.projectedCompletion)}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="rounded-md bg-surface-muted p-5">
                <p className={FIELD_LABEL_TEXT}>Indication</p>
                <p className="mt-2 text-lg font-semibold text-ink">{currentProgram.indication}</p>
              </div>
              <div className="rounded-md bg-surface-muted p-5">
                <p className={FIELD_LABEL_TEXT}>Tags</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {currentProgram.tags.map((tag) => (
                    <span key={tag} className={cn(DATA_CHIP, "text-sm font-semibold")}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label="Budget"
            value={formatBudgetMillions(currentProgram.budget)}
            sub={`${formatBudgetMillions(currentProgram.budgetUsed)} spent to date`}
            accent="#5D7D2F"
            className="border-0 rounded-none bg-[#5D7D2F]/10"
          />
          <StatCard
            label="Enrollment"
            value={`${formatNumber(currentProgram.enrolled)}/${formatNumber(currentProgram.target)}`}
            sub={`${enrollmentPercent}% of target recruitment`}
            accent="#0E658E"
            className="border-0 rounded-none bg-[#0E658E]/10"
          />
          <StatCard
            label="Studies"
            value={currentProgram.studies.length}
            sub={`${activeStudies} actively enrolling studies`}
            accent="#4B599A"
            className="border-0 rounded-none bg-[#4B599A]/10"
          />
          <StatCard
            label="Milestones"
            value={`${completedMilestones}/${currentProgram.milestones.length}`}
            sub={`${milestonePercent}% milestone completion`}
            accent="#C38328"
            className="border-0 rounded-none bg-[#C38328]/10"
          />
        </div>
      </section>

      <Tabs.Root defaultValue="studies" className="grid gap-5">
        <Tabs.List className="inline-flex h-auto w-fit rounded-md border border-stroke bg-white/70 p-1">
          <Tabs.Trigger
            value="studies"
            className="h-auto flex-none rounded-md px-5 py-2.5 text-sm font-semibold text-copy shadow-none transition data-[state=active]:bg-ink data-[state=active]:text-white"
          >
            Studies
          </Tabs.Trigger>
          <Tabs.Trigger
            value="milestones"
            className="h-auto flex-none rounded-md px-5 py-2.5 text-sm font-semibold text-copy shadow-none transition data-[state=active]:bg-ink data-[state=active]:text-white"
          >
            Milestones
          </Tabs.Trigger>
        </Tabs.List>

        <Tabs.Content value="studies" className={cn(SURFACE_PANEL, "rounded-md p-5 sm:p-6")}>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className={EYEBROW_TEXT}>Connected Studies</p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-ink">Study execution across the program</h2>
              <p className="mt-2 text-sm leading-6 text-copy">
                {currentProgram.studies.length} studies linked to this asset, with {formatNumber(currentProgram.enrolled)} patients enrolled across{" "}
                {formatNumber(totalSites)} sites.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <span className={cn(DATA_CHIP, "text-sm font-semibold")}>
                <Users size={15} className="text-brand-sky" />
                {activeStudies} actively enrolling
              </span>
              <span className={cn(DATA_CHIP, "text-sm font-semibold")}>
                <Target size={15} className="text-brand-amber" />
                {formatPercent(enrollmentPercent)} enrollment completion
              </span>
            </div>
          </div>

          <div className="mt-6 grid gap-4">
            {currentProgram.studies.map((study) => (
              <StudyCard key={study.id} study={study} />
            ))}
          </div>
        </Tabs.Content>

        <Tabs.Content value="milestones" className={cn(SURFACE_PANEL, "rounded-md p-5 sm:p-6")}>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className={EYEBROW_TEXT}>Milestone Plan</p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-ink">Delivery timeline and status checkpoints</h2>
              <p className="mt-2 text-sm leading-6 text-copy">
                Timeline readiness, planned versus current dates, and execution status across the program path.
              </p>
            </div>

            <span className={cn(DATA_CHIP, "text-sm font-semibold")}>
              <Workflow size={15} className="text-brand-teal" />
              {completedMilestones} completed milestones
            </span>
          </div>

          <div className="mt-6 grid gap-4">
            {currentProgram.milestones.map((milestone, index) => (
              <MilestoneRow
                key={`${milestone.name}-${milestone.date}`}
                milestone={milestone}
                isLast={index === currentProgram.milestones.length - 1}
              />
            ))}
          </div>
        </Tabs.Content>
      </Tabs.Root>
    </section>
  );
}
