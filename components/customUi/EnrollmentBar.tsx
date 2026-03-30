import * as Progress from "@radix-ui/react-progress";
import { getEnrollmentProgressColor } from "@/components/customUi/ProgressBar";

type EnrollmentBarProps = {
  enrolled: number;
  target: number;
};

export default function EnrollmentBar({ enrolled, target }: EnrollmentBarProps) {
  const percentage = Math.min(100, Math.round((enrolled / Math.max(target, 1)) * 100));
  const fillColor = getEnrollmentProgressColor(percentage);

  return (
    <div className="grid gap-2">
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>{enrolled.toLocaleString()} enrolled</span>
        <span>{target.toLocaleString()} target</span>
      </div>
      <Progress.Root
        value={percentage}
        className="relative h-1.5 w-full overflow-hidden rounded-md bg-surface-muted"
      >
        <Progress.Indicator
          className="h-full rounded-md transition-all duration-300 ease-out"
          style={{ width: `${percentage}%`, background: fillColor }}
        />
      </Progress.Root>
    </div>
  );
}
