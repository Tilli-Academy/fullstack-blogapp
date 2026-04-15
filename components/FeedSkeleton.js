export default function FeedSkeleton({ count = 4 }) {
  return (
    <div className="space-y-8">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex gap-8 pb-8 border-b border-gray-100 animate-pulse">
          {/* Text skeleton */}
          <div className="flex-1 space-y-3">
            {/* Author */}
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded-full bg-gray-200" />
              <div className="h-3 w-24 rounded bg-gray-200" />
            </div>
            {/* Title */}
            <div className="h-6 w-full rounded bg-gray-200" />
            <div className="h-6 w-3/4 rounded bg-gray-200" />
            {/* Excerpt */}
            <div className="h-4 w-full rounded bg-gray-100" />
            <div className="h-4 w-2/3 rounded bg-gray-100" />
            {/* Meta */}
            <div className="flex gap-3 pt-2">
              <div className="h-3 w-16 rounded bg-gray-100" />
              <div className="h-3 w-12 rounded bg-gray-100" />
              <div className="h-3 w-12 rounded bg-gray-100" />
            </div>
          </div>
          {/* Image skeleton */}
          <div className="h-32 w-32 flex-shrink-0 rounded bg-gray-200" />
        </div>
      ))}
    </div>
  )
}
