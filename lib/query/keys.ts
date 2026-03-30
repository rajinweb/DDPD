import type { PortfolioFilters } from "@/lib/types";

export const portfolioQueryKeys = {
  all: ["portfolio"] as const,
  snapshot: (filters: PortfolioFilters) => ["portfolio", "snapshot", filters] as const,
  program: (programId: number | string) => ["portfolio", "program", String(programId)] as const,
};
