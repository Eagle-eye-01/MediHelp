export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-soft">
        <div className="h-6 w-40 animate-pulse rounded-full bg-slate-200" />
        <div className="mt-4 h-4 w-full animate-pulse rounded-full bg-slate-100" />
        <div className="mt-2 h-4 w-3/4 animate-pulse rounded-full bg-slate-100" />
        <div className="mt-8 grid gap-3">
          <div className="h-20 animate-pulse rounded-xl bg-slate-100" />
          <div className="h-20 animate-pulse rounded-xl bg-slate-100" />
        </div>
      </div>
    </div>
  );
}
