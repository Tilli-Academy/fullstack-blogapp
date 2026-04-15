import Link from "next/link"
import FollowButton from "./FollowButton"

export default function RecommendedSection({
  staffPicks = [],
  suggestedUsers = [],
  isLoggedIn = false,
}) {
  return (
    <aside className="sticky top-20 hidden lg:block w-80 space-y-8 self-start pl-8 border-l border-gray-100">
      {/* Staff Picks */}
      {staffPicks.length > 0 && (
        <div>
          <h3 className="mb-4 text-base font-semibold text-gray-900">
            Staff Picks
          </h3>
          <div className="space-y-5">
            {staffPicks.map((post) => {
              const authorName =
                post.author?.profile?.username || post.author?.name || "Unknown"
              return (
                <div key={post.id} className="group">
                  <Link
                    href={`/profile/${post.author?.profile?.username || authorName}`}
                    className="flex items-center gap-2 mb-1.5 w-fit hover:opacity-70 transition-opacity"
                  >
                    <div className="h-5 w-5 rounded-full bg-gray-900 text-[10px] font-medium text-white flex items-center justify-center">
                      {authorName[0].toUpperCase()}
                    </div>
                    <span className="text-xs text-gray-600">{authorName}</span>
                  </Link>
                  <Link href={`/blog/${post.slug}`}>
                    <h4
                      className="text-sm font-bold text-gray-900 line-clamp-2 group-hover:text-gray-600 transition-colors leading-snug"
                      style={{ fontFamily: "Georgia, serif" }}
                    >
                      {post.title}
                    </h4>
                  </Link>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Who to Follow */}
      {suggestedUsers.length > 0 && (
        <div>
          <h3 className="mb-4 text-base font-semibold text-gray-900">
            Who to follow
          </h3>
          <div className="space-y-4">
            {suggestedUsers.map((user) => (
              <div key={user.id} className="flex items-start gap-3">
                <Link href={`/profile/${user.username}`}>
                  <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-gray-200 text-sm font-medium text-gray-700 hover:opacity-70 transition-opacity">
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.username}
                        className="h-full w-full rounded-full object-cover"
                      />
                    ) : (
                      user.username[0]?.toUpperCase()
                    )}
                  </div>
                </Link>
                <div className="flex-1 min-w-0">
                  <Link href={`/profile/${user.username}`}>
                    <p className="text-sm font-medium text-gray-900 truncate hover:opacity-70 transition-opacity">
                      {user.username}
                    </p>
                  </Link>
                  <p className="text-xs text-gray-500 line-clamp-1">
                    {user.bio || `${user.postCount} stories`}
                  </p>
                </div>
                <FollowButton
                  targetUserId={user.id}
                  isFollowing={false}
                  isLoggedIn={isLoggedIn}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Topics */}
      <div>
        <h3 className="mb-4 text-base font-semibold text-gray-900">
          Recommended topics
        </h3>
        <div className="flex flex-wrap gap-2">
          {["Technology", "Design", "Programming", "Writing", "AI", "Startup", "Science"].map(
            (topic) => (
              <span
                key={topic}
                className="rounded-full bg-gray-100 px-4 py-2 text-sm text-gray-700"
              >
                {topic}
              </span>
            )
          )}
        </div>
      </div>

      {/* Footer Links */}
      <div className="border-t border-gray-100 pt-4">
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-400">
          <a href="#" className="hover:text-gray-600">Help</a>
          <a href="#" className="hover:text-gray-600">Status</a>
          <a href="#" className="hover:text-gray-600">About</a>
          <a href="#" className="hover:text-gray-600">Blog</a>
          <a href="#" className="hover:text-gray-600">Privacy</a>
          <a href="#" className="hover:text-gray-600">Terms</a>
        </div>
      </div>
    </aside>
  )
}
