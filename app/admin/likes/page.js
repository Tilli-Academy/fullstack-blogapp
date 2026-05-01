import { getAllLikes } from "@/actions/likes"
import Link from "next/link"

export default async function AdminLikesPage() {
  const likes = await getAllLikes()

  // Group likes by post
  const likesByPost = likes.reduce((acc, like) => {
    const postId = like.post.id
    if (!acc[postId]) {
      acc[postId] = {
        post: like.post,
        likes: [],
      }
    }
    acc[postId].likes.push(like)
    return acc
  }, {})

  const postsWithLikes = Object.values(likesByPost)

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Likes Management</h1>
          <p className="mt-2 text-gray-600">View all likes across all blog posts</p>
        </div>
        <div className="rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 text-white shadow-lg">
          <div className="text-sm font-medium">Total Likes</div>
          <div className="text-3xl font-bold">{likes.length}</div>
        </div>
      </div>

      {postsWithLikes.length > 0 ? (
        <div className="space-y-6">
          {postsWithLikes.map(({ post, likes }) => (
            <div key={post.id} className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-lg">
              {/* Post Header */}
              <div className="border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50 p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <Link
                      href={`/blog/${post.slug}`}
                      className="group inline-flex items-center gap-2 text-xl font-bold text-gray-900 transition-colors duration-200 hover:text-blue-600"
                    >
                      {post.title}
                      <svg className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </Link>
                  </div>
                  <div className="flex items-center gap-2 rounded-full bg-white px-4 py-2 shadow-sm">
                    <svg className="h-5 w-5 text-pink-500" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    <span className="font-semibold text-gray-900">{likes.length}</span>
                  </div>
                </div>
              </div>

              {/* Likes List */}
              <div className="p-6">
                <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-500">
                  People who liked this post
                </h3>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {likes.map((like) => (
                    <div
                      key={like.id}
                      className="flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 p-4 transition-all duration-200 hover:border-blue-300 hover:bg-blue-50"
                    >
                      {/* Avatar */}
                      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-sm font-semibold text-white">
                        {(like.user?.profile?.username || like.user?.name || like.user?.email || "U")[0].toUpperCase()}
                      </div>

                      {/* User Info */}
                      <div className="flex-1 min-w-0">
                        <p className="truncate font-medium text-gray-900">
                          {like.user?.profile?.username || like.user?.name || "Unknown"}
                        </p>
                        <p className="truncate text-xs text-gray-500">
                          {new Date(like.createdAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>

                      {/* Like Icon */}
                      <svg className="h-5 w-5 flex-shrink-0 text-pink-500" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-300 bg-white py-20">
          <div className="mb-4 rounded-full bg-gray-100 p-6">
            <svg className="h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
          <p className="text-lg font-medium text-gray-900">No likes yet</p>
          <p className="mt-1 text-sm text-gray-500">Likes will appear here as users interact with posts</p>
        </div>
      )}
    </div>
  )
}
