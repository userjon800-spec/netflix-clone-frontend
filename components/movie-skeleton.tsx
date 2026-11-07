"use client";

export default function MovieSkeleton({
  count = 6,
  title = true,
}: {
  count?: number;
  title?: boolean;
}) {
  return (
    <div className="px-6 md:px-16 py-6 max-w-380 mx-auto w-full select-none">
      {title && (
        <div className="flex items-center gap-2 mb-4">
          <div className="w-1.5 h-6 bg-zinc-800 rounded-full animate-pulse" />
          <div className="w-48 h-6 bg-zinc-800/80 rounded-md animate-pulse" />
        </div>
      )}
      <div className="flex gap-3 md:gap-4 overflow-hidden py-3">
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            className="w-42.5 sm:w-48.75 md:w-53.75 shrink-0 aspect-2/3 rounded-xl bg-linear-to-br from-zinc-800/60 via-zinc-800/30 to-zinc-900/60 border border-white/5 animate-pulse relative overflow-hidden"
          >
            {/* Shimmer effekt */}
            <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]" />
          </div>
        ))}
      </div>
    </div>
  );
}
