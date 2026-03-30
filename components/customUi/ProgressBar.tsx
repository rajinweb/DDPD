import * as Progress from "@radix-ui/react-progress";

type ProgressBarProps = {
  value: number;
  max: number;
  color?: string;
};

export function getEnrollmentProgressColor(percentage: number) {
  if (percentage >= 90) {
    return "#5D7D2F";
  }

  if (percentage >= 60) {
    return "#C38328";
  }

  return "#0E658E";
}

export default function ProgressBar({ value, max, color = "#0D645B" }: ProgressBarProps) {
  const percentage = Math.min(100, Math.round((value / Math.max(max, 1)) * 100));

  return (
    <div className="grid gap-2">
      <Progress.Root
        value={percentage}
        className="relative h-1.5 w-full overflow-hidden rounded-md bg-surface-muted"
      >
        <Progress.Indicator
          className="h-full rounded-md transition-all duration-300 ease-out"
          style={{ width: `${percentage}%`, background: color }}
        />
      </Progress.Root>
      <div className="text-xs text-muted-foreground">{percentage}%</div>
    </div>
  );
}
