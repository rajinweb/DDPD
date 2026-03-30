import * as Label from "@radix-ui/react-label";

type BadgeProps = {
  label: string;
  color: { bg: string; text: string };
};

export default function Badge({ label, color }: BadgeProps) {
  return (
    <Label.Root asChild>
      <span
        className="inline-flex items-center rounded-md px-3 py-1 text-xs font-semibold leading-none"
        style={{ background: color.bg, color: color.text }}
      >
        {label}
      </span>
    </Label.Root>
  );
}
