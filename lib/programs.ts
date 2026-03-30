import {
  PHASES,
  PROGRAM_PRIORITIES,
  RISK_LEVELS,
  THERAPEUTIC_AREAS,
  getAllPrograms,
  getProgramById as getProgramRecordById,
  updateProgramMetadata as updateProgramRecordMetadata,
} from "@/lib/data/programs";
import type {
  Phase,
  PortfolioFilters,
  PortfolioInsightDatum,
  PortfolioInsights,
  PortfolioMeta,
  PortfolioSnapshot,
  PortfolioSort,
  Program,
  ProgramListItem,
  ProgramMetadata,
  RiskLevel,
  RoleOption,
  UserRole,
} from "@/lib/types";

type SearchParamInput = string | string[] | undefined;
type RawPortfolioFilters = Record<string, SearchParamInput>;
type QueryBehavior = {
  delayMs?: number;
};

const CLINICAL_PHASES = new Set<Phase>(["Phase I", "Phase II", "Phase III"]);
const REGULATORY_PHASES = new Set<Phase>(["NDA/BLA", "Approved"]);
const TOP_THERAPEUTIC_AREAS = 5;
const RISK_ORDER: Record<RiskLevel, number> = {
  Low: 1,
  Medium: 2,
  High: 3,
};
const UPCOMING_WINDOW_DAYS = 120;
const PHASE_COLORS: Record<Phase, string> = {
  Discovery: "#4B599A",
  Preclinical: "#0E658E",
  "Phase I": "#0D645B",
  "Phase II": "#1A7D68",
  "Phase III": "#5D7D2F",
  "NDA/BLA": "#C38328",
  Approved: "#A2474D",
};
const THERAPEUTIC_AREA_COLORS = ["#0D645B", "#0E658E", "#4B599A", "#C38328", "#5D7D2F", "#A2474D"] as const;
const RISK_COLORS: Record<RiskLevel, string> = {
  Low: "#0D645B",
  Medium: "#C38328",
  High: "#A2474D",
};

export const DEFAULT_PAGE_SIZE = 12;
export const MAX_PAGE_SIZE = 48;
export const PORTFOLIO_API_DELAY_MS = 280;
export const PAGE_SIZE_OPTIONS = [12, 24, 48] as const;
export { RISK_LEVELS };
export const ROLE_OPTIONS: readonly RoleOption[] = [
  { label: "Clinical Reviewer", value: "reviewer" },
  { label: "Portfolio Manager", value: "manager" },
] as const;
export const SORT_OPTIONS: readonly { value: PortfolioSort; label: string }[] = [
  { value: "phase", label: "Phase" },
  { value: "name", label: "Program name" },
  { value: "ta", label: "Therapeutic area" },
  { value: "enrolled", label: "Enrollment" },
  { value: "risk", label: "Risk" },
  { value: "updated", label: "Last updated" },
] as const;
export const PRIORITY_OPTIONS = PROGRAM_PRIORITIES.map((priority) => ({
  label: priority,
  value: priority,
}));
export const RISK_LEVEL_OPTIONS = RISK_LEVELS.map((riskLevel) => ({
  label: riskLevel,
  value: riskLevel,
}));

function firstValue(value: SearchParamInput) {
  return Array.isArray(value) ? value[0] : value;
}

function parsePositiveInteger(value: string | undefined, fallback: number) {
  const parsed = Number(value);

  if (!Number.isInteger(parsed) || parsed < 1) {
    return fallback;
  }

  return parsed;
}

function sleep(delayMs: number) {
  if (delayMs <= 0) {
    return Promise.resolve();
  }

  return new Promise((resolve) => {
    setTimeout(resolve, delayMs);
  });
}

function cloneProgram(program: Program) {
  return structuredClone(program);
}

function isPhase(value: string): value is Phase {
  return (PHASES as readonly string[]).includes(value);
}

function isRiskLevel(value: string): value is RiskLevel {
  return (RISK_LEVELS as readonly string[]).includes(value);
}

function isSortValue(value: string): value is PortfolioSort {
  return SORT_OPTIONS.some((option) => option.value === value);
}

function normalizeSearch(value: string | undefined) {
  return value?.trim() ?? "";
}

function matchesQuery(program: Program, query: string) {
  if (!query) {
    return true;
  }

  const normalizedQuery = query.toLowerCase();
  const searchSpace = [
    program.name,
    program.code,
    program.indication,
    program.therapeuticArea,
    program.mechanism,
    program.lead,
    program.tags.join(" "),
  ]
    .join(" ")
    .toLowerCase();

  return searchSpace.includes(normalizedQuery);
}

function toProgramListItem(program: Program): ProgramListItem {
  return {
    id: program.id,
    code: program.code,
    name: program.name,
    brandName: program.brandName,
    phase: program.phase,
    therapeuticArea: program.therapeuticArea,
    indication: program.indication,
    nextMilestone: program.nextMilestone,
    nextMilestoneDate: program.nextMilestoneDate,
    enrolled: program.enrolled,
    target: program.target,
    riskLevel: program.riskLevel,
    lastUpdated: program.lastUpdated,
    lead: program.lead,
    priority: program.priority,
    progress: program.progress,
    studyCount: program.studies.length,
    activeStudyCount: program.studies.filter((study) => study.status === "ongoing").length,
    totalSites: program.studies.reduce((sum, study) => sum + study.sites, 0),
    completedMilestoneCount: program.milestones.filter((milestone) => milestone.status === "completed").length,
    milestoneCount: program.milestones.length,
  };
}

function sortPrograms(programs: Program[], sortBy: PortfolioSort) {
  return [...programs].sort((left, right) => {
    switch (sortBy) {
      case "name":
        return left.name.localeCompare(right.name);
      case "ta":
        return left.therapeuticArea.localeCompare(right.therapeuticArea);
      case "enrolled":
        return right.enrolled - left.enrolled;
      case "risk":
        return RISK_ORDER[right.riskLevel] - RISK_ORDER[left.riskLevel];
      case "updated":
        return right.lastUpdated.localeCompare(left.lastUpdated);
      case "phase":
      default:
        return PHASES.indexOf(left.phase) - PHASES.indexOf(right.phase);
    }
  });
}

function buildMeta(total: number, requestedPage: number, limit: number): PortfolioMeta {
  const pages = Math.max(1, Math.ceil(total / limit));
  const page = Math.min(Math.max(requestedPage, 1), pages);
  const startRow = total === 0 ? 0 : (page - 1) * limit + 1;
  const endRow = total === 0 ? 0 : Math.min(page * limit, total);

  return {
    total,
    page,
    pages,
    limit,
    startRow,
    endRow,
  };
}

function countUpcomingMilestones(programs: Program[]) {
  const now = new Date();
  const windowEnd = now.getTime() + UPCOMING_WINDOW_DAYS * 24 * 60 * 60 * 1000;

  return programs.reduce((count, program) => {
    const upcomingMilestones = program.milestones.filter((milestone) => {
      if (milestone.status !== "upcoming") {
        return false;
      }

      const milestoneDate = new Date(`${milestone.date}T00:00:00`);
      return !Number.isNaN(milestoneDate.getTime()) && milestoneDate.getTime() <= windowEnd;
    });

    return count + upcomingMilestones.length;
  }, 0);
}

function toInsightDatum(label: string, value: number, total: number, color: string): PortfolioInsightDatum {
  return {
    label,
    value,
    percentage: total === 0 ? 0 : (value / total) * 100,
    color,
  };
}

function buildPhaseDistribution(programs: Program[]) {
  const total = programs.length;

  return PHASES.map((phase) => {
    const value = programs.filter((program) => program.phase === phase).length;
    return toInsightDatum(phase, value, total, PHASE_COLORS[phase]);
  }).filter((entry) => entry.value > 0);
}

function buildRiskDistribution(programs: Program[]) {
  const total = programs.length;

  return RISK_LEVELS.map((riskLevel) => {
    const value = programs.filter((program) => program.riskLevel === riskLevel).length;
    return toInsightDatum(riskLevel, value, total, RISK_COLORS[riskLevel]);
  }).filter((entry) => entry.value > 0);
}

function buildTherapeuticAreaDistribution(programs: Program[]) {
  const counts = new Map<string, number>();
  const therapeuticAreaOrder = new Map<string, number>(THERAPEUTIC_AREAS.map((area, index) => [area, index]));

  for (const program of programs) {
    counts.set(program.therapeuticArea, (counts.get(program.therapeuticArea) ?? 0) + 1);
  }

  const ranked = Array.from(counts.entries())
    .sort((left, right) => {
      if (right[1] !== left[1]) {
        return right[1] - left[1];
      }

      return (therapeuticAreaOrder.get(left[0]) ?? Number.MAX_SAFE_INTEGER) - (therapeuticAreaOrder.get(right[0]) ?? Number.MAX_SAFE_INTEGER);
    });

  const total = programs.length;
  const topAreas = ranked.slice(0, TOP_THERAPEUTIC_AREAS).map(([label, value], index) =>
    toInsightDatum(label, value, total, THERAPEUTIC_AREA_COLORS[index % THERAPEUTIC_AREA_COLORS.length]),
  );
  const otherValue = ranked.slice(TOP_THERAPEUTIC_AREAS).reduce((sum, [, value]) => sum + value, 0);

  if (otherValue > 0) {
    topAreas.push(
      toInsightDatum("Other", otherValue, total, THERAPEUTIC_AREA_COLORS[topAreas.length % THERAPEUTIC_AREA_COLORS.length]),
    );
  }

  return topAreas;
}

function buildPortfolioInsights(programs: Program[]): PortfolioInsights {
  const totalPrograms = programs.length;
  const totalStudies = programs.reduce((sum, program) => sum + program.studies.length, 0);
  const totalTargetEnrollment = programs.reduce((sum, program) => sum + program.target, 0);
  const totalEnrollment = programs.reduce((sum, program) => sum + program.enrolled, 0);

  return {
    phaseDistribution: buildPhaseDistribution(programs),
    therapeuticAreaDistribution: buildTherapeuticAreaDistribution(programs),
    riskDistribution: buildRiskDistribution(programs),
    enrollmentCompletionRate: totalTargetEnrollment === 0 ? 0 : (totalEnrollment / totalTargetEnrollment) * 100,
    averageStudiesPerProgram: totalPrograms === 0 ? 0 : totalStudies / totalPrograms,
  };
}

export function parseUserRole(value: string | null | undefined): UserRole {
  return value === "manager" ? "manager" : "reviewer";
}

export function getRoleCapabilities(role: UserRole) {
  return {
    canEditMetadata: role === "manager",
  };
}

export function parsePortfolioFilters(searchParams: RawPortfolioFilters): PortfolioFilters {
  const rawPhase = firstValue(searchParams.phase);
  const rawTherapeuticArea = firstValue(searchParams.therapeuticArea);
  const rawRiskLevel = firstValue(searchParams.riskLevel);
  const rawSortBy = firstValue(searchParams.sortBy);

  return {
    q: normalizeSearch(firstValue(searchParams.q)),
    phase: rawPhase && isPhase(rawPhase) ? rawPhase : "All",
    therapeuticArea:
      rawTherapeuticArea && (THERAPEUTIC_AREAS as readonly string[]).includes(rawTherapeuticArea)
        ? rawTherapeuticArea
        : "All",
    riskLevel: rawRiskLevel && isRiskLevel(rawRiskLevel) ? rawRiskLevel : "All",
    sortBy: rawSortBy && isSortValue(rawSortBy) ? rawSortBy : "phase",
    page: parsePositiveInteger(firstValue(searchParams.page), 1),
    limit: Math.min(parsePositiveInteger(firstValue(searchParams.limit), DEFAULT_PAGE_SIZE), MAX_PAGE_SIZE),
  };
}

export function buildPortfolioSearchParams(filters: Partial<PortfolioFilters>) {
  const params = new URLSearchParams();

  if (filters.q?.trim()) {
    params.set("q", filters.q.trim());
  }

  if (filters.phase && filters.phase !== "All") {
    params.set("phase", filters.phase);
  }

  if (filters.therapeuticArea && filters.therapeuticArea !== "All") {
    params.set("therapeuticArea", filters.therapeuticArea);
  }

  if (filters.riskLevel && filters.riskLevel !== "All") {
    params.set("riskLevel", filters.riskLevel);
  }

  if (filters.sortBy && filters.sortBy !== "phase") {
    params.set("sortBy", filters.sortBy);
  }

  if (filters.page && filters.page > 1) {
    params.set("page", String(filters.page));
  }

  if (filters.limit && filters.limit !== DEFAULT_PAGE_SIZE) {
    params.set("limit", String(filters.limit));
  }

  return params;
}

export async function getPortfolioSnapshot(filters: PortfolioFilters, behavior: QueryBehavior = {}): Promise<PortfolioSnapshot> {
  const allPrograms = getAllPrograms();
  const filteredPrograms = allPrograms.filter((program) => {
    if (!matchesQuery(program, filters.q)) {
      return false;
    }

    if (filters.phase !== "All" && program.phase !== filters.phase) {
      return false;
    }

    if (filters.therapeuticArea !== "All" && program.therapeuticArea !== filters.therapeuticArea) {
      return false;
    }

    if (filters.riskLevel !== "All" && program.riskLevel !== filters.riskLevel) {
      return false;
    }

    return true;
  });

  const sortedPrograms = sortPrograms(filteredPrograms, filters.sortBy);
  const meta = buildMeta(sortedPrograms.length, filters.page, filters.limit);
  const startIndex = meta.startRow === 0 ? 0 : meta.startRow - 1;
  const pagedPrograms = sortedPrograms.slice(startIndex, meta.endRow);

  await sleep(behavior.delayMs ?? 0);

  return {
    programs: pagedPrograms.map(toProgramListItem),
    summary: {
      totalPrograms: filteredPrograms.length,
      activeClinicalPrograms: filteredPrograms.filter((program) => CLINICAL_PHASES.has(program.phase)).length,
      enrolledPatients: filteredPrograms.reduce((sum, program) => sum + program.enrolled, 0),
      regulatoryPrograms: filteredPrograms.filter((program) => REGULATORY_PHASES.has(program.phase)).length,
      highRiskPrograms: filteredPrograms.filter((program) => program.riskLevel === "High").length,
      totalStudies: filteredPrograms.reduce((sum, program) => sum + program.studies.length, 0),
      upcomingMilestones: countUpcomingMilestones(filteredPrograms),
    },
    insights: buildPortfolioInsights(filteredPrograms),
    meta,
    filters: {
      ...filters,
      page: meta.page,
    },
  };
}

export async function getProgramById(programId: string, behavior: QueryBehavior = {}) {
  const program = getProgramRecordById(programId);
  await sleep(behavior.delayMs ?? 0);
  return program ? cloneProgram(program) : undefined;
}

export async function updateProgramMetadata(programId: number, metadata: Partial<ProgramMetadata>, behavior: QueryBehavior = {}) {
  const updatedProgram = updateProgramRecordMetadata(programId, metadata);
  await sleep(behavior.delayMs ?? 0);
  return updatedProgram ? cloneProgram(updatedProgram) : null;
}

export function authorizeProgramEditor(request: Request) {
  const role = parseUserRole(request.headers.get("x-portfolio-role"));
  return getRoleCapabilities(role).canEditMetadata;
}

export function parseProgramMetadataUpdate(payload: unknown): Partial<ProgramMetadata> | null {
  if (!payload || typeof payload !== "object") {
    return null;
  }

  const candidate = payload as Record<string, unknown>;
  const metadata: Partial<ProgramMetadata> = {};

  if (typeof candidate.indication === "string" && candidate.indication.trim()) {
    metadata.indication = candidate.indication.trim();
  }

  if (typeof candidate.lead === "string" && candidate.lead.trim()) {
    metadata.lead = candidate.lead.trim();
  }

  if (typeof candidate.priority === "string" && candidate.priority.trim()) {
    metadata.priority = candidate.priority.trim();
  }

  if (typeof candidate.riskLevel === "string" && isRiskLevel(candidate.riskLevel)) {
    metadata.riskLevel = candidate.riskLevel;
  }

  return Object.keys(metadata).length > 0 ? metadata : null;
}
