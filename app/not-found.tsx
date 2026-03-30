import Link from "next/link";
import { BUTTON_PRIMARY } from "@/lib/uiClasses";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-screen max-w-screen-md items-center px-4 py-16 sm:px-6 lg:px-8">
      <section className="grid gap-5 rounded-md border border-stroke-strong bg-surface-raised p-8 shadow-panel">
        <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Program Not Found</p>
        <h1 className="text-4xl font-semibold tracking-tight text-ink">The requested program record is unavailable.</h1>
        <p className="text-base leading-7 text-copy">
          The mock dataset may have been reset, or the program identifier does not exist in the current portfolio view.
        </p>
        <div>
          <Link href="/" className={BUTTON_PRIMARY}>
            Return to portfolio
          </Link>
        </div>
      </section>
    </main>
  );
}
