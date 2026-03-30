"use client";

import * as Select from "@radix-ui/react-select";
import { Check, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { FIELD_SELECT } from "@/lib/uiClasses";

export type SelectFieldOption = {
  label: string;
  value: string;
};

type SelectFieldProps = {
  value: string;
  onValueChange: (value: string) => void;
  options: readonly SelectFieldOption[];
  placeholder?: string;
  ariaLabel?: string;
  className?: string;
  contentClassName?: string;
  disabled?: boolean;
};

export default function SelectField({
  value,
  onValueChange,
  options,
  placeholder,
  ariaLabel,
  className,
  contentClassName,
  disabled = false,
}: SelectFieldProps) {
  return (
    <Select.Root value={value} onValueChange={onValueChange} disabled={disabled}>
      <Select.Trigger
        aria-label={ariaLabel}
        className={cn(
          FIELD_SELECT,
          "flex h-14 w-full min-w-0 items-center justify-between gap-3 rounded-md py-0 pr-3 text-left font-medium shadow-none data-[placeholder]:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-60",
          className,
        )}
      >
        <Select.Value className="min-w-0 flex-1 truncate" placeholder={placeholder} />
        <Select.Icon asChild>
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-surface-muted text-muted-foreground">
            <ChevronDown size={16} />
          </span>
        </Select.Icon>
      </Select.Trigger>

      <Select.Portal>
        <Select.Content
          position="popper"
          sideOffset={10}
          className={cn(
            "z-50 overflow-hidden rounded-md border border-stroke-strong bg-surface-raised text-ink shadow-panel",
            contentClassName,
          )}
          style={{ minWidth: "var(--radix-select-trigger-width)" }}
        >
          <Select.ScrollUpButton className="flex h-9 items-center justify-center text-muted-foreground">
            <ChevronUp size={16} />
          </Select.ScrollUpButton>

          <Select.Viewport className="max-h-80 p-2">
            {options.map((option) => (
              <Select.Item
                key={option.value}
                value={option.value}
                className="relative flex cursor-pointer select-none items-center rounded-md px-3 py-3 pr-9 text-sm font-medium text-copy outline-none transition-colors data-[highlighted]:bg-brand-teal/10 data-[highlighted]:text-ink data-[state=checked]:bg-brand-teal/12 data-[state=checked]:text-brand-teal"
              >
                <Select.ItemText>{option.label}</Select.ItemText>
                <span className="absolute right-3 inline-flex h-5 w-5 items-center justify-center text-brand-teal">
                  <Select.ItemIndicator>
                    <Check size={15} />
                  </Select.ItemIndicator>
                </span>
              </Select.Item>
            ))}
          </Select.Viewport>

          <Select.ScrollDownButton className="flex h-9 items-center justify-center text-muted-foreground">
            <ChevronDown size={16} />
          </Select.ScrollDownButton>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
}
