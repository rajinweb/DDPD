export const SURFACE_CARD =
  "border border-stroke bg-surface-shell shadow-card backdrop-blur-lg";

export const SURFACE_PANEL =
  "border border-stroke-strong bg-surface-raised";

export const EYEBROW_TEXT =
  "text-xs font-bold uppercase tracking-widest text-muted-foreground";

export const FIELD_LABEL_TEXT =
  "text-sm font-bold uppercase  text-copy";

export const FIELD_INPUT =
  "w-full rounded-md border border-stroke bg-white/80 px-4 py-3.5 text-ink transition-all duration-200 ease-out focus:border-brand-teal/40 focus:outline-none focus:ring-4 focus:ring-brand-teal/10";

export const FIELD_SELECT = FIELD_INPUT;

export const FIELD_TEXTAREA = `${FIELD_INPUT} min-h-32 resize-y`;

const BUTTON_BASE =
  "inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 font-bold transition-all duration-200 ease-out";

const BUTTON_DISABLED = "disabled:cursor-not-allowed disabled:opacity-60 disabled:shadow-none";

export const BUTTON_PRIMARY =
  `${BUTTON_BASE} border border-transparent bg-brand-teal text-white shadow-brand hover:-translate-y-px ${BUTTON_DISABLED}`;

export const BUTTON_SECONDARY =
  `${BUTTON_BASE} border border-stroke-strong bg-white/80 text-ink hover:-translate-y-px ${BUTTON_DISABLED}`;

export const BUTTON_TERTIARY =
  `${BUTTON_BASE} border border-transparent bg-transparent text-copy hover:-translate-y-px ${BUTTON_DISABLED}`;

export const DATA_CHIP =
  "inline-flex items-center gap-2 rounded-md border border-stroke bg-white/70 px-4 py-2 text-copy";

export const DEFINITION_LIST = "grid gap-4";
export const DEFINITION_TERM =
  "text-xs font-bold uppercase tracking-widest text-muted-foreground";
export const DEFINITION_DESC =
  "mt-1.5 text-base leading-7 text-ink";
