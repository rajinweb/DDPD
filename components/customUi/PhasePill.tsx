import * as Label from "@radix-ui/react-label";
import type { Phase } from "@/lib/types";
import { STATUS_COLORS } from "@/lib/data/programs";

export const PHASE_COLORS: Record<Phase, { bg: string; text: string; dot: string }> = {
  "Discovery": { bg: "#DCEFE7", text: "#0D645B", dot: "#1A7D68" },
  "Preclinical": { bg: "#DCEEF7", text: "#0E658E", dot: "#2B86B8" },
  "Phase I": { bg: "#F7EAD6", text: "#8A5A17", dot: "#C38328" },
  "Phase II": { bg: "#F4E2C5", text: "#7B4E13", dot: "#A86D1A" },
  "Phase III": { bg: "#E5E8F8", text: "#4B599A", dot: "#6875BE" },
  "NDA/BLA": { bg: "#F3E4EE", text: "#8A3F6D", dot: "#B85B92" },
  "Approved": { bg: "#E4F1E3", text: "#3E6B24", dot: "#5D7D2F" },
};

/**
 * Shared utility to get colors for Status, Risk, and Milestone states
 */
export function getMetadataColor(key: string) {
  return STATUS_COLORS[key] ?? { bg: "#E5E7EB", text: "#374151" };
}

type PhasePillProps = {
  phase: string;
};

export function getPhaseColor(phaseLabel: string) {
  if (phaseLabel in PHASE_COLORS) {
    return PHASE_COLORS[phaseLabel as Phase];
  }

  if (phaseLabel.includes("III")) {
    return PHASE_COLORS["Phase III"];
  }

  if (phaseLabel.includes("II")) {
    return PHASE_COLORS["Phase II"];
  }

  if (phaseLabel.includes("I")) {
    return PHASE_COLORS["Phase I"];
  }

  return PHASE_COLORS["Discovery"];
}

export default function PhasePill({ phase }: PhasePillProps) {
  const color = getPhaseColor(phase);
  return (
    <Label.Root asChild>
      <span
        className="inline-flex items-center gap-2 rounded-md px-3 py-1 text-xs font-semibold leading-none"
        style={{
          background: color.bg,
          color: color.text,
          boxShadow: "inset 0 0 0 1px rgba(255, 255, 255, 0.18)",
        }}
      >
        <span
          className="h-2.5 w-2.5 rounded-full"
          style={{ background: color.dot }}
        />
        {phase}
      </span>
    </Label.Root>
  );
}
