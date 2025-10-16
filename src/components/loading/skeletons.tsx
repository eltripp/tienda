import { Skeleton } from "@/components/ui/skeleton";

export function SkeletonHero() {
  return (
    <div className="mt-6 overflow-hidden rounded-3xl border border-slate-900/80 bg-slate-950/70 p-8">
      <div className="grid gap-8 lg:grid-cols-2">
        <div className="space-y-4">
          <Skeleton className="h-6 w-32 rounded-full bg-slate-800" />
          <Skeleton className="h-16 w-3/4 rounded-2xl bg-slate-800" />
          <Skeleton className="h-24 w-full rounded-3xl bg-slate-800" />
          <div className="flex gap-4">
            <Skeleton className="h-12 w-40 rounded-2xl bg-emerald-900/40" />
            <Skeleton className="h-12 w-40 rounded-2xl bg-slate-800" />
          </div>
        </div>
        <Skeleton className="aspect-[4/3] w-full rounded-[2.5rem] bg-slate-800" />
      </div>
    </div>
  );
}

export function SkeletonProductGrid() {
  return (
    <div className="mt-16 px-6 sm:px-10 lg:px-12">
      <div className="mx-auto w-full max-w-7xl">
        <Skeleton className="h-12 w-80 rounded-2xl bg-slate-800" />
        <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={`product-skeleton-${index}`}
              className="space-y-4 rounded-3xl border border-slate-900/60 bg-slate-950/60 p-4"
            >
              <Skeleton className="aspect-[4/3] w-full rounded-2xl bg-slate-800" />
              <Skeleton className="h-6 w-3/4 rounded-2xl bg-slate-800" />
              <Skeleton className="h-4 w-1/2 rounded-2xl bg-slate-800" />
              <Skeleton className="h-10 w-full rounded-2xl bg-emerald-900/40" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function SkeletonSection() {
  return (
    <div className="mt-24 px-6 sm:px-10 lg:px-12">
      <div className="mx-auto w-full max-w-7xl space-y-6">
        <Skeleton className="h-4 w-40 rounded-full bg-slate-800" />
        <Skeleton className="h-10 w-2/3 rounded-2xl bg-slate-800" />
        <Skeleton className="h-4 w-1/2 rounded-full bg-slate-800" />
        <div className="grid gap-6 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={`category-skeleton-${index}`}
              className="space-y-4 rounded-3xl border border-slate-900/60 bg-slate-950/60 p-6"
            >
              <Skeleton className="h-8 w-40 rounded-2xl bg-slate-800" />
              <Skeleton className="h-4 w-full rounded-full bg-slate-800" />
              <Skeleton className="aspect-[16/9] w-full rounded-3xl bg-slate-800" />
              <Skeleton className="h-4 w-1/3 rounded-full bg-slate-800" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
