export default function Loading() {
  return (
    <main className="mx-auto max-w-screen-2xl px-4 pb-12 pt-6 sm:px-6 lg:px-8">
      <div className="grid gap-6">
        <div className="h-28 animate-pulse rounded-md bg-surface-muted" />
        <div className="h-64 animate-pulse rounded-md bg-surface-muted" />
        <div className="grid gap-4 md:grid-cols-3">
          <div className="h-36 animate-pulse rounded-md bg-surface-muted" />
          <div className="h-36 animate-pulse rounded-md bg-surface-muted" />
          <div className="h-36 animate-pulse rounded-md bg-surface-muted" />
        </div>
      </div>
    </main>
  );
}
