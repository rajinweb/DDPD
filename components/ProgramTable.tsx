"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { usePrefetchProgramDetails } from "@/hooks/usePortfolioData";
import { List, type ListImperativeAPI, type RowComponentProps } from "react-window";
import type { ProgramListItem } from "@/lib/types";
import { STATUS_COLORS } from "@/lib/data/programs";
import { formatShortDate } from "@/lib/formatters";
import { cn } from "@/lib/utils";
import { SURFACE_PANEL } from "@/lib/uiClasses";
import PhasePill from "@/components/customUi/PhasePill";
import Badge from "@/components/customUi/Badge";
import EnrollmentBar from "@/components/customUi/EnrollmentBar";

type ProgramTableProps = {
  programs: ProgramListItem[];
};

type ProgramRowProps = {
  onNavigate: (programId: number) => void;
  onPrefetch: (programId: number) => void;
  programs: ProgramListItem[];
};

const TABLE_MIN_WIDTH = 1660;
const TABLE_MAX_HEIGHT = 640;
const TABLE_ROW_HEIGHT = 148;
const TABLE_GRID_TEMPLATE =
  "minmax(200px, 1.1fr) minmax(130px, 0.9fr) minmax(170px, 1fr) minmax(170px, 1fr) minmax(210px, 1.15fr) minmax(210px, 1.15fr) minmax(240px, 1.3fr) minmax(180px, 0.95fr)";

const headerCellClassName =
  "px-6 py-4 text-left text-xs font-bold uppercase tracking-widest text-muted-foreground";

const bodyCellClassName = "px-4 py-5 text-sm text-copy";

function ProgramRow({
  ariaAttributes,
  index,
  onNavigate,
  onPrefetch,
  programs,
  style,
}: RowComponentProps<ProgramRowProps>) {
  const program = programs[index];

  return (
    <div {...ariaAttributes} style={style} className="border-t border-stroke">
      <div
        tabIndex={0}
        className="grid h-full cursor-pointer items-start transition-colors hover:bg-brand-teal/5 focus:bg-brand-teal/5 focus:outline-none"
        style={{ gridTemplateColumns: TABLE_GRID_TEMPLATE }}
        onClick={() => onNavigate(program.id)}
        onMouseEnter={() => onPrefetch(program.id)}
        onFocus={() => onPrefetch(program.id)}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            onNavigate(program.id);
          }
        }}
      >
        <div className="min-w-0 px-6 py-5">
          <div className="grid gap-2">
            <Link
              href={`/programs/${program.id}`}
              className="truncate text-base font-semibold tracking-tight text-ink transition-colors hover:text-brand-teal group-hover:text-brand-teal"
              onClick={(event) => event.stopPropagation()}
            >
              {program.name}
            </Link>
            <div className="grid gap-1 text-sm text-copy">
              <span className="font-semibold">{program.code}</span>
              {program.brandName ? <span>{program.brandName}</span> : null}
              <span>{program.indication}</span>
            </div>
          </div>
        </div>

        <div className={cn(bodyCellClassName, "py-5")}>
          <PhasePill phase={program.phase} />
        </div>

        <div className={cn(bodyCellClassName, "py-5 font-medium")}>{program.therapeuticArea}</div>

        <div className={cn(bodyCellClassName, "py-5")}>
          <div className="grid gap-1">
            <span className="font-semibold text-ink">{program.lead}</span>
            <span>{program.priority}</span>
          </div>
        </div>

        <div className={cn(bodyCellClassName, "py-5")}>
          <div className="grid gap-1">
            <span className="font-semibold text-ink">{program.studyCount} studies</span>
            <span>{program.activeStudyCount} actively enrolling</span>
            <span>{program.totalSites} sites in network</span>
          </div>
        </div>

        <div className={cn(bodyCellClassName, "py-5")}>
          <div className="grid gap-1">
            <span className="font-semibold text-ink">{program.nextMilestone}</span>
            <span>{formatShortDate(program.nextMilestoneDate)}</span>
            <span>Updated {formatShortDate(program.lastUpdated)}</span>
          </div>
        </div>

        <div className={cn(bodyCellClassName, "py-5")}>
          <EnrollmentBar enrolled={program.enrolled} target={program.target} />
        </div>

        <div className={cn(bodyCellClassName, "py-5")}>
          <div className="grid gap-2">
            <Badge label={program.riskLevel} color={STATUS_COLORS[program.riskLevel]} />
            <span>
              {program.completedMilestoneCount}/{program.milestoneCount} milestones delivered
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProgramTable({ programs }: ProgramTableProps) {
  const router = useRouter();
  const prefetchProgramDetails = usePrefetchProgramDetails();
  const listRef = useRef<ListImperativeAPI | null>(null);
  const listHeight = Math.min(programs.length * TABLE_ROW_HEIGHT, TABLE_MAX_HEIGHT);
  const [bodyScrollbarWidth, setBodyScrollbarWidth] = useState(0);

  useEffect(() => {
    const listElement = listRef.current?.element;

    if (!listElement) {
      return;
    }

    const syncScrollbarWidth = () => {
      setBodyScrollbarWidth(listElement.offsetWidth - listElement.clientWidth);
    };

    syncScrollbarWidth();

    const resizeObserver = new ResizeObserver(syncScrollbarWidth);
    resizeObserver.observe(listElement);

    return () => {
      resizeObserver.disconnect();
    };
  }, [listRef, programs.length]);

  function prefetchProgram(programId: number) {
    router.prefetch(`/programs/${programId}`);
    void prefetchProgramDetails(programId);
  }

  return (
    <div className={cn(SURFACE_PANEL, "overflow-hidden rounded-md")}>
      <div className="overflow-x-auto">
        <div style={{ minWidth: TABLE_MIN_WIDTH }}>
          <div
            className="grid bg-ink/5"
            style={{
              gridTemplateColumns: TABLE_GRID_TEMPLATE,
              paddingRight: bodyScrollbarWidth,
            }}
            role="row"
          >
            <div role="columnheader" className={headerCellClassName}>Program</div>
            <div role="columnheader" className={headerCellClassName}>Phase</div>
            <div role="columnheader" className={headerCellClassName}>Therapeutic Area</div>
            <div role="columnheader" className={headerCellClassName}>Lead</div>
            <div role="columnheader" className={headerCellClassName}>Connected Studies</div>
            <div role="columnheader" className={headerCellClassName}>Next Milestone</div>
            <div role="columnheader" className={headerCellClassName}>Enrollment</div>
            <div role="columnheader" className={headerCellClassName}>Risk</div>
          </div>

          <List
            listRef={listRef}
            rowComponent={ProgramRow}
            rowCount={programs.length}
            rowHeight={TABLE_ROW_HEIGHT}
            rowProps={{
              programs,
              onNavigate: (programId) => router.push(`/programs/${programId}`),
              onPrefetch: prefetchProgram,
            }}
            defaultHeight={Math.min(programs.length * TABLE_ROW_HEIGHT, TABLE_MAX_HEIGHT)}
            overscanCount={4}
            style={{
              height: listHeight,
              width: "100%",
              scrollbarGutter: "stable",
            }}
          />
        </div>
      </div>
    </div>
  );
}
