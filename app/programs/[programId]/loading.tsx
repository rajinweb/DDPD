export default function ProgramLoading() {
  return (
    <main className="mx-auto max-w-screen-2xl px-4 pb-12 pt-6 sm:px-6 lg:px-8">
      <div className="grid gap-6">
        <div className="h-24 animate-pulse rounded-md bg-surface-muted" />
        <div className="grid gap-6 xl:grid-cols-5">
          <div className="h-80 animate-pulse rounded-md bg-surface-muted xl:col-span-3" />
          <div className="h-80 animate-pulse rounded-md bg-surface-muted xl:col-span-2" />
        </div>
        <div className="h-96 animate-pulse rounded-md bg-surface-muted" />
      </div>
    </main>
  );
}
