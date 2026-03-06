export default function Loading() {
  return (
    <div className="px-16 py-8 max-md:px-4">
        <h2 className="text-white text-2xl font-bold mb-4">Trending Now</h2>
        <div className="flex gap-2 overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="min-w-50 h-75 bg-gray-800 animate-pulse rounded-md"
            ></div>
          ))}
        </div>
      </div>
  )
}