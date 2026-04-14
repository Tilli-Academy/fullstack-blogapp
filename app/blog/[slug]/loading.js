export default function Loading() {
  return (
    <div className="min-h-screen bg-white">
      {/* Clean minimal loading spinner */}
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-100 border-t-gray-900"></div>
          <p className="text-sm text-gray-400">Loading...</p>
        </div>
      </div>
    </div>
  )
}
