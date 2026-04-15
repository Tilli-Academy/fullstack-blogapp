export default function Loading() {
  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-[1336px] px-6 py-8">
        {/* Toggle skeleton */}
        <div className="mb-6">
          <div className="h-9 w-9 animate-pulse rounded-full bg-gray-100" />
        </div>

        <div className="flex gap-8">
          {/* Left sidebar skeleton */}
          <div className="hidden lg:block w-56 space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-10 w-full animate-pulse rounded-lg bg-gray-100" />
            ))}
          </div>

          {/* Feed skeleton */}
          <div className="mx-auto flex-1 max-w-2xl space-y-8">
            {/* Tab skeleton */}
            <div className="flex border-b border-gray-200 pb-4">
              <div className="h-4 w-16 animate-pulse rounded bg-gray-200 mr-8" />
              <div className="h-4 w-20 animate-pulse rounded bg-gray-100" />
            </div>
            {/* Card skeletons */}
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex gap-6 pb-8 border-b border-gray-100 animate-pulse">
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded-full bg-gray-200" />
                    <div className="h-3 w-24 rounded bg-gray-200" />
                  </div>
                  <div className="h-6 w-full rounded bg-gray-200" />
                  <div className="h-6 w-3/4 rounded bg-gray-200" />
                  <div className="h-4 w-full rounded bg-gray-100" />
                  <div className="flex gap-3 pt-2">
                    <div className="h-3 w-16 rounded bg-gray-100" />
                    <div className="h-3 w-16 rounded bg-gray-100" />
                  </div>
                </div>
                <div className="h-32 w-32 flex-shrink-0 rounded bg-gray-200" />
              </div>
            ))}
          </div>

          {/* Right sidebar skeleton */}
          <div className="hidden xl:block w-80 space-y-6 pl-8 border-l border-gray-100">
            <div className="h-4 w-24 animate-pulse rounded bg-gray-200" />
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-2 animate-pulse">
                <div className="flex items-center gap-2">
                  <div className="h-5 w-5 rounded-full bg-gray-200" />
                  <div className="h-3 w-20 rounded bg-gray-200" />
                </div>
                <div className="h-4 w-full rounded bg-gray-200" />
                <div className="h-4 w-2/3 rounded bg-gray-200" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
