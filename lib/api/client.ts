import { buildPortfolioSearchParams } from "@/lib/programs";
import type {
  ApiErrorPayload,
  PortfolioFilters,
  PortfolioSnapshot,
  Program,
  ProgramMetadataUpdateRequest,
  UserRole,
} from "@/lib/types";

async function requestJson<T>(input: RequestInfo | URL, init: RequestInit, fallbackMessage: string): Promise<T> {
  const response = await fetch(input, {
    cache: "no-store",
    ...init,
  });

  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as ApiErrorPayload | null;
    throw new Error(payload?.error ?? fallbackMessage);
  }

  return (await response.json()) as T;
}

export async function fetchPortfolioSnapshot(filters: PortfolioFilters) {
  const query = buildPortfolioSearchParams(filters).toString();
  return requestJson<PortfolioSnapshot>(
    `/api/programs${query ? `?${query}` : ""}`,
    {
      method: "GET",
    },
    "Unable to load portfolio data.",
  );
}

export async function fetchProgramDetails(programId: number | string) {
  return requestJson<Program>(
    `/api/programs/${programId}`,
    {
      method: "GET",
    },
    "Unable to load program details.",
  );
}

export async function patchProgramMetadata(
  programId: number,
  payload: ProgramMetadataUpdateRequest,
  role: UserRole,
) {
  return requestJson<Program>(
    `/api/programs/${programId}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "x-portfolio-role": role,
      },
      body: JSON.stringify(payload),
    },
    "Unable to update program metadata.",
  );
}
