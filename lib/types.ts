export type Phase =
  | "Discovery"
  | "Preclinical"
  | "Phase I"
  | "Phase II"
  | "Phase III"
  | "NDA/BLA"
  | "Approved";

export type RiskLevel = "Low" | "Medium" | "High";

export type StatusLabel = "completed" | "ongoing" | "upcoming" | "delayed" | "terminated";

export type UserRole = "reviewer" | "manager";

export type Study = {
  id: string;
  nctId: string;
  title: string;
  phase: string;
  status: StatusLabel;
  enrolled: number;
  target: number;
  sites: number;
  startDate: string;
  endDate: string;
  indication: string;
  primaryEndpoint: string;
};

export type Milestone = {
  name: string;
  date: string;
  plannedDate: string;
  actualDate?: string;
  status: StatusLabel;
};

export type Program = {
  id: number;
  code: string;
  name: string;
  brandName: string | null;
  phase: Phase;
  therapeuticArea: string;
  mechanism: string;
  modality: string;
  route: string;
  indication: string;
  priority: string;
  partner: string | null;
  nda: string | null;
  nextMilestone: string;
  nextMilestoneDate: string;
  description: string;
  startDate: string;
  projectedCompletion: string;
  studies: Study[];
  milestones: Milestone[];
  enrolled: number;
  target: number;
  budget: number;
  budgetUsed: number;
  riskLevel: RiskLevel;
  lastUpdated: string;
  lead: string;
  tags: string[];
  progress: number;
};

export type ProgramMetadata = Pick<Program, "indication" | "lead" | "riskLevel" | "priority">;

export type ProgramListItem = Pick<
  Program,
  | "id"
  | "code"
  | "name"
  | "brandName"
  | "phase"
  | "therapeuticArea"
  | "indication"
  | "nextMilestone"
  | "nextMilestoneDate"
  | "enrolled"
  | "target"
  | "riskLevel"
  | "lastUpdated"
  | "lead"
  | "priority"
  | "progress"
> & {
  studyCount: number;
  activeStudyCount: number;
  totalSites: number;
  completedMilestoneCount: number;
  milestoneCount: number;
};

export type PortfolioSort = "phase" | "name" | "ta" | "enrolled" | "risk" | "updated";

export type PortfolioFilters = {
  q: string;
  phase: Phase | "All";
  therapeuticArea: string | "All";
  riskLevel: RiskLevel | "All";
  sortBy: PortfolioSort;
  page: number;
  limit: number;
};

export type PortfolioSummary = {
  totalPrograms: number;
  activeClinicalPrograms: number;
  enrolledPatients: number;
  regulatoryPrograms: number;
  highRiskPrograms: number;
  totalStudies: number;
  upcomingMilestones: number;
};

export type PortfolioInsightDatum = {
  label: string;
  value: number;
  percentage: number;
  color: string;
};

export type PortfolioInsights = {
  phaseDistribution: PortfolioInsightDatum[];
  therapeuticAreaDistribution: PortfolioInsightDatum[];
  riskDistribution: PortfolioInsightDatum[];
  enrollmentCompletionRate: number;
  averageStudiesPerProgram: number;
};

export type PortfolioMeta = {
  total: number;
  page: number;
  pages: number;
  limit: number;
  startRow: number;
  endRow: number;
};

export type PortfolioSnapshot = {
  programs: ProgramListItem[];
  summary: PortfolioSummary;
  insights: PortfolioInsights;
  meta: PortfolioMeta;
  filters: PortfolioFilters;
};

export type ProgramMetadataUpdateRequest = {
  metadata: Partial<ProgramMetadata>;
};

export type ApiErrorPayload = {
  error: string;
  code?: string;
};

export type RoleOption = {
  label: string;
  value: UserRole;
};
