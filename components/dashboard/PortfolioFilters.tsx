"use client";

import { useDeferredValue, useEffect, useState } from "react";
import { RefreshCcw, Search } from "lucide-react";
import { usePortfolioNavigation } from "@/hooks/usePortfolioNavigation";
import { PHASES, THERAPEUTIC_AREAS } from "@/lib/data/programs";
import { RISK_LEVELS, SORT_OPTIONS } from "@/lib/programs";
import type { PortfolioFilters as PortfolioFiltersState } from "@/lib/types";
import { cn } from "@/lib/utils";
import { BUTTON_SECONDARY, FIELD_INPUT, FIELD_LABEL_TEXT } from "@/lib/uiClasses";
import SelectField from "@/components/customUi/SelectField";

type PortfolioFiltersProps = {
  filters: PortfolioFiltersState;
};

const phaseOptions = [
  { label: "All phases", value: "All" },
  ...PHASES.map((phase) => ({ label: phase, value: phase })),
];

const therapeuticAreaOptions = [
  { label: "All therapeutic areas", value: "All" },
  ...THERAPEUTIC_AREAS.map((area) => ({ label: area, value: area })),
];

const riskLevelOptions = [
  { label: "All risk levels", value: "All" },
  ...RISK_LEVELS.map((riskLevel) => ({ label: riskLevel, value: riskLevel })),
];

const sortOptions = SORT_OPTIONS.map((option) => ({
  label: option.label,
  value: option.value,
}));

export default function PortfolioFilters({ filters }: PortfolioFiltersProps) {
  const { isPending, navigate } = usePortfolioNavigation(filters);
  const [search, setSearch] = useState(filters.q);
  const deferredSearch = useDeferredValue(search);
  const hasActiveFilters =
    Boolean(filters.q) ||
    filters.phase !== "All" ||
    filters.therapeuticArea !== "All" ||
    filters.riskLevel !== "All" ||
    filters.sortBy !== "phase";

  useEffect(() => {
    if (deferredSearch === filters.q) {
      return;
    }

    navigate({
      q: deferredSearch,
      page: 1,
    });
  }, [deferredSearch, filters.q, navigate]);

  return (
    <div className="grid gap-5 mt-4">
      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-6">
        <label className="grid gap-2 xl:col-span-2">
          <span className={FIELD_LABEL_TEXT}>Program Search</span>
          <span className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            <input
              type="search"
              className={cn(FIELD_INPUT, "h-14 pl-11")}
              value={search}
              placeholder="Search name, code, mechanism, lead, or indication"
              onChange={(event) => setSearch(event.target.value)}
            />
          </span>
        </label>

        <div className="grid gap-2">
          <span className={FIELD_LABEL_TEXT}>Development Phase</span>
          <SelectField
            ariaLabel="Development Phase"
            value={filters.phase}
            options={phaseOptions}
            onValueChange={(value) =>
              navigate({
                phase: value as PortfolioFiltersState["phase"],
                page: 1,
              })
            }
          />
        </div>

        <div className="grid gap-2">
          <span className={FIELD_LABEL_TEXT}>Therapeutic Area</span>
          <SelectField
            ariaLabel="Therapeutic Area"
            value={filters.therapeuticArea}
            options={therapeuticAreaOptions}
            onValueChange={(value) =>
              navigate({
                therapeuticArea: value,
                page: 1,
              })
            }
          />
        </div>

        
          
          <div className="grid gap-2">
            <span className={FIELD_LABEL_TEXT}>Risk</span>
            <SelectField
              ariaLabel="Risk Level"
              value={filters.riskLevel}
              options={riskLevelOptions}
              onValueChange={(value) =>
                navigate({
                  riskLevel: value as PortfolioFiltersState["riskLevel"],
                  page: 1,
                })
              }
            />
          </div>
          <div className="grid gap-2"> 
            <span className={FIELD_LABEL_TEXT}> Sort By</span>
           
            <SelectField
              ariaLabel="Sort Programs"
              value={filters.sortBy}
              options={sortOptions}
              onValueChange={(value) =>
                navigate({
                  sortBy: value as PortfolioFiltersState["sortBy"],
                  page: 1,
                })
              }
            />
          </div>
       
      </div>
      <div className="flex flex-wrap items-center justify-end gap-3 absolute right-5 top-5">
        {isPending ? (
          <span className="flex gap-2 text-sm font-semibold" aria-live="polite">
            <RefreshCcw size={14} className="animate-spin text-brand-teal" />
            Refreshing portfolios
          </span>
        ) : null}

        <button
          type="button"
          className={cn("py-2!", BUTTON_SECONDARY)}
          disabled={!hasActiveFilters}
          onClick={() => {
            setSearch("");
            navigate({
              q: "",
              phase: "All",
              therapeuticArea: "All",
              riskLevel: "All",
              sortBy: "phase",
              page: 1,
              limit: filters.limit,
            });
          }}
        >
          Reset filters
        </button>
      </div>
    </div>
  );
}
