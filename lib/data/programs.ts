import type { Program, ProgramMetadata, RiskLevel, Phase, Study, Milestone, StatusLabel } from "@/lib/types";

export const THERAPEUTIC_AREAS = [
  "Oncology",
  "Immunology",
  "Neurology",
  "Cardiology",
  "Infectious Disease",
  "Rare Disease",
  "Metabolic",
] as const;

export const PHASES = [
  "Discovery",
  "Preclinical",
  "Phase I",
  "Phase II",
  "Phase III",
  "NDA/BLA",
  "Approved",
] as const;

export const PROGRAM_PRIORITIES = [
  "Standard",
  "Priority Review",
  "Breakthrough Therapy",
  "Orphan Drug",
  "Fast Track",
] as const;

export const RISK_LEVELS: readonly RiskLevel[] = ["Low", "Medium", "High"] as const;

export const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  completed: { bg: "#E4F1E3", text: "#3E6B24" },
  ongoing: { bg: "#DCEEF7", text: "#0E658E" },
  upcoming: { bg: "#F7EAD6", text: "#8A5A17" },
  delayed: { bg: "#F8E1E3", text: "#A2474D" },
  terminated: { bg: "#ECEFF1", text: "#5C6B73" },
  Low: { bg: "#E4F1E3", text: "#3E6B24" },
  Medium: { bg: "#F7EAD6", text: "#8A5A17" },
  High: { bg: "#F8E1E3", text: "#A2474D" },
  Active: { bg: "#DCEFE7", text: "#0D645B" },
  Regulatory: { bg: "#F3E4EE", text: "#8A3F6D" },
  Completed: { bg: "#E4F1E3", text: "#3E6B24" },
};

const PROGRAM_COUNT = 240;
const BASE_DATE = new Date("2025-01-15T00:00:00Z");
const MILESTONE_TYPES = [
  "Target Discovery Review",
  "IND Filing",
  "First Patient In",
  "Dose Escalation Review",
  "Proof of Concept",
  "End of Phase II Meeting",
  "Primary Analysis",
  "NDA Submission",
  "Approval Readiness",
] as const;
const DRUG_NAMES = [
  "Azelaruxin",
  "Bimoclomol-X",
  "Carvuxitide",
  "Delafinib",
  "Estorelvab",
  "Fonrilanar",
  "Gabrexinib",
  "Hepsatinib",
  "Ilocivelimab",
  "Jovasilenib",
  "Korulumab",
  "Lirexonide",
  "Mevanteclib",
  "Nivacuranib",
  "Osveritinib",
  "Plorucimab",
  "Quexitarafenib",
  "Riloxafib",
  "Soltavermab",
  "Trilecozinib",
  "Urovelimab",
  "Velobinib",
  "Welaxinide",
  "Ximberitide",
  "Yervoxitinib",
  "Zorulimab",
  "Altexinib",
  "Burevaclib",
  "Cremonifenib",
  "Dalvuxinide",
  "Elurexant",
  "Fostemamir",
  "Glenvorafenib",
  "Heptriximab",
  "Imvelarin",
  "Jandecitinib",
  "Kovadimer",
  "Lumirezan",
  "Marnovab",
  "Nexovarin",
] as const;
const MODALITIES = [
  "Small Molecule",
  "Biologic",
  "ADC",
  "mRNA",
  "Cell Therapy",
  "Gene Therapy",
  "siRNA",
  "Peptide",
] as const;
const ROUTES = ["IV", "Oral", "SC", "Intrathecal", "Inhaled", "Topical"] as const;
const MECHANISMS = [
  "KRAS G12C inhibitor",
  "PD-L1/TIM-3 bispecific",
  "BTK inhibitor",
  "IL-17A/F inhibitor",
  "PCSK9 degrader",
  "MAPT antisense",
  "FGFR1-3 inhibitor",
  "CD19 CAR-T",
  "JAK1 inhibitor",
  "TROP2 ADC",
  "GLP-1/GIP agonist",
  "C5aR1 antagonist",
  "VEGFR2 inhibitor",
  "TLR7/8 agonist",
  "BCL-2 inhibitor",
  "ATM kinase inhibitor",
  "PI3Kdelta inhibitor",
  "CXCR4 antagonist",
  "RAS(ON) inhibitor",
  "IRAK4 degrader",
] as const;
const LEADS = [
  "Dr. Sarah Chen",
  "Dr. Marcus Webb",
  "Dr. Priya Nair",
  "Dr. James Okafor",
  "Dr. Elena Vasquez",
  "Dr. Nina Patel",
  "Dr. Daniel Foster",
  "Dr. Laura Kim",
] as const;
const TAGS = [
  "Solid Tumor",
  "Autoimmune",
  "Neurodegeneration",
  "Cardio-Renal",
  "Rare",
  "First-in-Class",
  "Lifecycle",
  "External Partner",
] as const;
const FINDINGS = [
  "NSCLC",
  "Advanced CLL",
  "Refractory RA",
  "Moderate-to-Severe Crohn's Disease",
  "ALS",
  "HFrEF",
  "NASH",
  "Relapsing MS",
  "Metastatic Melanoma",
  "T2D",
  "SLE",
  "HER2+ Breast Cancer",
  "Ulcerative Colitis",
  "Idiopathic Pulmonary Fibrosis",
] as const;
const STUDY_POPULATIONS = [
  "Biomarker-selected adults",
  "Treatment-experienced population",
  "Treatment-naive patients",
  "Global pivotal cohort",
  "Expansion cohort with high unmet need",
] as const;
const STUDY_PHASE_DESIGNATIONS = [
  "Phase I",
  "Phase I/II",
  "Phase II",
  "Phase II/III",
  "Phase III",
] as const;
const ENDPOINTS = ["ORR", "PFS", "OS", "ACR70", "EDSS", "HbA1c", "LDL-C", "LVEF", "DAS28", "SLEDAI"] as const;
const PARTNERS = [null, null, "Pfizer", "Roche", "AstraZeneca", "Novartis", "BMS", "Merck"] as const;

type MockDatabase = {
  programs: Program[];
};

declare global {
  var __drugPortfolioMockDb: MockDatabase | undefined;
}

function createSeededRandom(seed: number) {
  let state = seed >>> 0;

  return () => {
    state = (1664525 * state + 1013904223) >>> 0;
    return state / 4294967296;
  };
}

function pick<T>(random: () => number, values: readonly T[]) {
  return values[Math.floor(random() * values.length)];
}

function pickUniqueTags(random: () => number) {
  const count = 1 + Math.floor(random() * 3);
  const selected = new Set<string>();

  while (selected.size < count) {
    selected.add(pick(random, TAGS));
  }

  return Array.from(selected);
}

function offsetDate(monthOffset: number, dayOffset = 0) {
  const nextDate = new Date(BASE_DATE);
  nextDate.setUTCMonth(nextDate.getUTCMonth() + monthOffset);
  nextDate.setUTCDate(nextDate.getUTCDate() + dayOffset);
  return nextDate.toISOString().split("T")[0];
}

function buildMilestones(phase: Phase, random: () => number): Milestone[] {
  const phaseIndex = PHASES.indexOf(phase);
  const completedCount = Math.max(1, Math.min(phaseIndex + 1, 5));
  const upcomingCount = phaseIndex >= PHASES.length - 2 ? 1 : 2;
  const milestones: Milestone[] = [];

  for (let index = 0; index < completedCount; index += 1) {
    const monthOffset = -(completedCount - index) * 5 - Math.floor(random() * 3);
    milestones.push({
      name: MILESTONE_TYPES[index],
      date: offsetDate(monthOffset, Math.floor(random() * 18)),
      plannedDate: offsetDate(monthOffset - 1, Math.floor(random() * 18)),
      status: "completed",
    });
  }

  for (let index = 0; index < upcomingCount; index += 1) {
    const nameIndex = Math.min(completedCount + index, MILESTONE_TYPES.length - 1);
    const monthOffset = 2 + index * 4 + Math.floor(random() * 4);
    const status: StatusLabel = random() > 0.88 ? "delayed" : "upcoming";

    milestones.push({
      name: MILESTONE_TYPES[nameIndex],
      date: offsetDate(monthOffset, Math.floor(random() * 18)),
      plannedDate: offsetDate(monthOffset - 1, Math.floor(random() * 18)),
      status,
    });
  }

  return milestones;
}

function buildStudies(programId: number, phase: Phase, random: () => number): Study[] {
  const phaseIndex = PHASES.indexOf(phase);
  const maxStudyCount = phaseIndex >= 4 ? 5 : phaseIndex >= 2 ? 4 : 3;
  const studyCount = 1 + Math.floor(random() * maxStudyCount);

  return Array.from({ length: studyCount }, (_, index) => {
    const enrolled = 18 + Math.floor(random() * 820);
    const target = enrolled + 20 + Math.floor(random() * 280);
    const startOffset = -30 + Math.floor(random() * 18);
    const endOffset = startOffset + 8 + Math.floor(random() * 24);
    const statusPool: readonly StatusLabel[] =
      phase === "Discovery" || phase === "Preclinical"
        ? ["completed", "upcoming"]
        : ["ongoing", "completed", "upcoming", "delayed"];
    const status = pick(random, statusPool);

    return {
      id: `${programId}-S${index + 1}`,
      nctId: `NCT${String(10000000 + programId * 17 + index).padStart(8, "0")}`,
      title: `${STUDY_PHASE_DESIGNATIONS[Math.min(index, STUDY_PHASE_DESIGNATIONS.length - 1)]} study of ${
        DRUG_NAMES[programId % DRUG_NAMES.length]
      } in ${pick(random, STUDY_POPULATIONS)}`,
      phase: STUDY_PHASE_DESIGNATIONS[Math.min(index, STUDY_PHASE_DESIGNATIONS.length - 1)],
      status,
      enrolled,
      target,
      sites: 6 + Math.floor(random() * 124),
      startDate: offsetDate(startOffset, Math.floor(random() * 18)),
      endDate: offsetDate(endOffset, Math.floor(random() * 18)),
      indication: pick(random, FINDINGS),
      primaryEndpoint: pick(random, ENDPOINTS),
    };
  });
}

function buildProgram(index: number): Program {
  const random = createSeededRandom(index + 17);
  const phase = pick(random, PHASES) as Phase;
  const therapeuticArea = pick(random, THERAPEUTIC_AREAS);
  const studies = buildStudies(index + 100, phase, random);
  const milestones = buildMilestones(phase, random);
  const enrolled = studies.reduce((sum, study) => sum + study.enrolled, 0);
  const target = studies.reduce((sum, study) => sum + study.target, 0);
  const budget = 60 + Math.floor(random() * 760);
  const budgetUsed = Math.min(budget - 4, Math.floor(budget * (0.22 + random() * 0.62)));
  const nextMilestone = milestones.find((milestone) => milestone.status !== "completed") ?? milestones[milestones.length - 1];
  const name = `${DRUG_NAMES[index % DRUG_NAMES.length]}-${String(index + 1).padStart(3, "0")}`;
  const partner = pick(random, PARTNERS);

  return {
    id: index + 1,
    code: `${therapeuticArea.slice(0, 2).toUpperCase()}-${String(index + 1).padStart(3, "0")}`,
    name,
    brandName: index % 5 === 0 ? `${name.slice(0, 4)}ra` : null,
    phase,
    therapeuticArea,
    mechanism: pick(random, MECHANISMS),
    modality: pick(random, MODALITIES),
    route: pick(random, ROUTES),
    indication: pick(random, FINDINGS),
    priority: pick(random, PROGRAM_PRIORITIES),
    partner,
    nda: phase === "NDA/BLA" || phase === "Approved" ? `NDA ${210000 + index}` : null,
    nextMilestone: nextMilestone.name,
    nextMilestoneDate: nextMilestone.date,
    description: `${name} is a ${pick(random, MECHANISMS)} program being advanced in ${therapeuticArea.toLowerCase()} for ${pick(
      random,
      FINDINGS,
    ).toLowerCase()}.`,
    startDate: offsetDate(-48 + Math.floor(random() * 18), Math.floor(random() * 12)),
    projectedCompletion: offsetDate(14 + Math.floor(random() * 42), Math.floor(random() * 12)),
    studies,
    milestones,
    enrolled,
    target,
    budget,
    budgetUsed,
    riskLevel: pick(random, RISK_LEVELS),
    lastUpdated: offsetDate(-Math.floor(random() * 4), Math.floor(random() * 8)),
    lead: pick(random, LEADS),
    tags: pickUniqueTags(random),
    progress: +(12 + random() * 82).toFixed(1),
  };
}

function createDatabase(): MockDatabase {
  return {
    programs: Array.from({ length: PROGRAM_COUNT }, (_, index) => buildProgram(index)),
  };
}

function getDatabase() {
  if (!globalThis.__drugPortfolioMockDb) {
    globalThis.__drugPortfolioMockDb = createDatabase();
  }

  return globalThis.__drugPortfolioMockDb;
}

export function getAllPrograms() {
  return getDatabase().programs;
}

export function getProgramById(programId: string | number) {
  const numericId = Number(programId);
  return getDatabase().programs.find((program) => program.id === numericId);
}

export function updateProgramMetadata(programId: number, metadata: Partial<ProgramMetadata>) {
  const database = getDatabase();
  const index = database.programs.findIndex((program) => program.id === programId);

  if (index === -1) {
    return null;
  }

  const existingProgram = database.programs[index];
  const nextProgram: Program = {
    ...existingProgram,
    ...(metadata.indication ? { indication: metadata.indication } : {}),
    ...(metadata.lead ? { lead: metadata.lead } : {}),
    ...(metadata.priority ? { priority: metadata.priority } : {}),
    ...(metadata.riskLevel ? { riskLevel: metadata.riskLevel } : {}),
    lastUpdated: new Date().toISOString().split("T")[0],
  };

  database.programs[index] = nextProgram;
  return nextProgram;
}
