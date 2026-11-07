export default function Loading() {
  return (
    <div className="px-6 md:px-16 py-6 relative max-w-380 mx-auto w-full select-none">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-1.5 h-6 bg-zinc-800 rounded-full animate-pulse" />
        <div className="h-6 w-44 bg-zinc-800/80 rounded-md animate-pulse" />
      </div>
      <div className="flex gap-3 md:gap-4 overflow-hidden py-3">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="w-42.5 sm:w-48.75 md:w-53.75 shrink-0 aspect-2/3 rounded-xl bg-zinc-900 border border-white/5 overflow-hidden relative animate-pulse"
          >
            <div className="w-full h-full bg-linear-to-r from-transparent via-white/5 to-transparent animate-shimmer" />
          </div>
        ))}
      </div>
      <style jsx>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        .animate-shimmer {
          animation: shimmer 1.8s infinite;
        }
      `}</style>
    </div>
  );
}
