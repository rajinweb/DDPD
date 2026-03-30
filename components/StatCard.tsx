import { cn } from "@/lib/utils";
import { EYEBROW_TEXT, SURFACE_PANEL } from "@/lib/uiClasses";

type StatCardProps = {
  label: string;
  value: string | number;
  sub?: string;
  accent?: string;
  className?: string;
};

export default function StatCard({ label, value, sub, accent, className }: StatCardProps) {
  return (
    <article className={cn(SURFACE_PANEL, `relative overflow-hidden rounded-md p-5 ${className}`)}>
      <div className="flex items-center justify-between gap-4">
        <p className={EYEBROW_TEXT}>{label}</p>
        <span className="h-3 w-3 rounded-full" style={{ backgroundColor: accent ?? "var(--teal)" }} aria-hidden="true" />
      </div>
      <p className="mt-4 text-3xl font-semibold tracking-tight text-ink" style={accent ? { color: accent } : undefined}>
        {value}
      </p>
      {sub ? <p className="mt-2 text-sm leading-6 text-copy">{sub}</p> : null}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-1 opacity-70"
        style={{ background: `linear-gradient(90deg, ${accent ?? "var(--teal)"}, transparent 85%)` }}
        aria-hidden="true"
      />
    </article>
  );
}
