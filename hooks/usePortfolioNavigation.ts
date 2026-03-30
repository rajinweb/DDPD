"use client";

import { usePathname, useRouter } from "next/navigation";
import { useCallback, useTransition } from "react";
import { buildPortfolioSearchParams } from "@/lib/programs";
import type { PortfolioFilters } from "@/lib/types";

export function usePortfolioNavigation(filters: PortfolioFilters) {
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const navigate = useCallback((nextFilters: Partial<PortfolioFilters>) => {
    const query = buildPortfolioSearchParams({
      ...filters,
      ...nextFilters,
    }).toString();

    startTransition(() => {
      router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
    });
  }, [filters, pathname, router, startTransition]);

  return {
    isPending,
    navigate,
  };
}
