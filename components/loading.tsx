export default function Loading() {
  return (
    <div className="px-16 py-8 max-md:px-4 relative">
      <div className="flex items-center gap-2 mb-4">
        <div className="h-8 w-48 bg-gray-800 rounded-md animate-pulse"></div>
        <div className="h-5 w-24 bg-gray-800/50 rounded-full animate-pulse"></div>
      </div>
      <div className="flex gap-3 overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="relative min-w-50 h-75 shrink-0">
            <div className="w-full h-full bg-gray-800 rounded-md overflow-hidden">
              <div className="w-full h-full bg-linear-to-r from-gray-800 via-gray-700 to-gray-800 animate-shimmer"></div>
            </div>
            <div className="absolute -left-8 top-1/2 -translate-y-1/2 w-16 h-16 bg-gray-800/20 rounded-full hidden md:block animate-pulse"></div>
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
          animation: shimmer 2s infinite;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.05),
            transparent
          );
        }
      `}</style>
    </div>
  );
}