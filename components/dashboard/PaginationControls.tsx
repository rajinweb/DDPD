"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, LoaderCircle } from "lucide-react";
import { usePortfolioNavigation } from "@/hooks/usePortfolioNavigation";
import type { PortfolioFilters, PortfolioMeta } from "@/lib/types";
import { cn } from "@/lib/utils";
import { BUTTON_SECONDARY, DATA_CHIP, FIELD_INPUT } from "@/lib/uiClasses";

type PaginationControlsProps = {
  filters: PortfolioFilters;
  meta: PortfolioMeta;
};

type PageJumpFormProps = {
  currentPage: number;
  totalPages: number;
  isPending: boolean;
  onJump: (page: number) => void;
};

function PageJumpForm({ currentPage, totalPages, isPending, onJump }: PageJumpFormProps) {
  const [pageInput, setPageInput] = useState(String(currentPage));
  const parsedPageInput = Number.parseInt(pageInput, 10);
  const isPageInputValid =
    Number.isFinite(parsedPageInput) && parsedPageInput >= 1 && parsedPageInput <= totalPages;
  const canJumpToPage = isPageInputValid && parsedPageInput !== currentPage;

  const submitPageJump = () => {
    if (!pageInput) {
      setPageInput(String(currentPage));
      return;
    }

    const nextPage = Math.min(Math.max(Number.parseInt(pageInput, 10) || currentPage, 1), totalPages);
    setPageInput(String(nextPage));

    if (nextPage !== currentPage) {
      onJump(nextPage);
    }
  };

  return (
    <form
      key={currentPage}
      className="flex items-center gap-2"
      onSubmit={(event) => {
        event.preventDefault();
        submitPageJump();
      }}
    >
      <label htmlFor="portfolio-page-jump" className="text-sm font-semibold text-copy">
        Page
      </label>
      <input
        id="portfolio-page-jump"
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        aria-label="Jump to page"
        value={pageInput}
        onChange={(event) => {
          setPageInput(event.target.value.replace(/\D+/g, ""));
        }}
        onBlur={submitPageJump}
        className={cn(FIELD_INPUT, "h-11 w-16 px-3 py-0 text-center")}
        disabled={totalPages === 1 || isPending}
      />
      <span className="text-sm text-copy">of {totalPages}</span>
      <button
        type="submit"
        className={BUTTON_SECONDARY}
        disabled={!canJumpToPage || isPending}
      >
        Go
      </button>
    </form>
  );
}

export default function PaginationControls({ filters, meta }: PaginationControlsProps) {
  const { isPending, navigate } = usePortfolioNavigation(filters);

  if (meta.total === 0) {
    return null;
  }

  const hasPreviousPage = meta.page > 1;
  const hasNextPage = meta.page < meta.pages;

  const changePage = (nextPage: number) => {
    navigate({
      page: Math.min(Math.max(nextPage, 1), meta.pages),
    });
  };

  return (
    <div className="mt-6 flex flex-col gap-4 border-t border-stroke pt-5 md:flex-row md:items-center md:justify-between">
      <p className="text-sm text-copy">
        <span className="font-semibold">
          Showing {meta.startRow}-{meta.endRow} of {meta.total} matched programs.
        </span>{" "}
        <span>{meta.limit} per page.</span>
      </p>

      <div className="flex flex-wrap items-center justify-end gap-3">
        {isPending ? (
          <span className={cn(DATA_CHIP, "border-0 px-0 text-sm font-semibold")}>
            <LoaderCircle size={14} className="animate-spin text-brand-teal" />
            Updating page
          </span>
        ) : null}

        <span className={cn(DATA_CHIP, "hidden border-0 px-0 text-sm font-semibold lg:flex")}>
          Page {meta.page} of {meta.pages}
        </span>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => changePage(meta.page - 1)}
            className={cn(BUTTON_SECONDARY, !hasPreviousPage && "opacity-50")}
            disabled={isPending || !hasPreviousPage}
          >
            <span className="hidden lg:inline">Previous</span>
            <ChevronLeft size={16} className="h-6" />
          </button>

          <PageJumpForm
            key={meta.page}
            currentPage={meta.page}
            totalPages={meta.pages}
            isPending={isPending}
            onJump={changePage}
          />

          <button
            type="button"
            onClick={() => changePage(meta.page + 1)}
            className={cn(BUTTON_SECONDARY, !hasNextPage && "opacity-50")}
            disabled={isPending || !hasNextPage}
          >
            <span className="hidden lg:inline">Next</span>
            <ChevronRight size={16} className="h-6" />
          </button>
        </div>
      </div>
    </div>
  );
}
