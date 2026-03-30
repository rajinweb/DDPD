"use client";

import { RotateCcw } from "lucide-react";
import { BUTTON_PRIMARY } from "@/lib/uiClasses";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="mx-auto flex min-h-screen max-w-screen-md items-center px-4 py-16 sm:px-6 lg:px-8">
      <section className="grid gap-5 rounded-md border border-stroke-strong bg-surface-raised p-8 shadow-panel">
        <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Application Error</p>
        <h1 className="text-4xl font-semibold tracking-tight text-ink">Something unexpected interrupted the portfolio view.</h1>
        <p className="text-base leading-7 text-copy">{error.message || "An unknown error occurred."}</p>
        <div>
          <button type="button" className={BUTTON_PRIMARY} onClick={reset}>
            <RotateCcw size={16} />
            Try again
          </button>
        </div>
      </section>
    </main>
  );
}
