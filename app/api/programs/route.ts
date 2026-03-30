import { PORTFOLIO_API_DELAY_MS, getPortfolioSnapshot, parsePortfolioFilters } from "@/lib/programs";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const filters = parsePortfolioFilters({
    q: url.searchParams.get("q") ?? undefined,
    phase: url.searchParams.get("phase") ?? undefined,
    therapeuticArea: url.searchParams.get("therapeuticArea") ?? undefined,
    riskLevel: url.searchParams.get("riskLevel") ?? undefined,
    sortBy: url.searchParams.get("sortBy") ?? undefined,
    page: url.searchParams.get("page") ?? undefined,
    limit: url.searchParams.get("limit") ?? undefined,
  });
  const snapshot = await getPortfolioSnapshot(filters, {
    delayMs: PORTFOLIO_API_DELAY_MS,
  });

  return NextResponse.json(snapshot, {
    headers: {
      "Cache-Control": "no-store",
    },
  });
}
