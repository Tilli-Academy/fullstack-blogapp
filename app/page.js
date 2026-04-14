import { getPosts } from "@/actions/posts"
import { auth } from "@/auth"
import BlogCard from "@/components/BlogCard"
import Link from "next/link"

export const revalidate = 60

export default async function HomePage() {
  const { posts, total } = await getPosts(1, 20)
  const session = await auth()

  return (
    <div className="min-h-screen bg-white">
      {/* Banner */}
      <div className="border-b border-gray-200 bg-amber-50">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="max-w-xl">
            <h1
              className="text-6xl font-bold tracking-tight text-gray-900 sm:text-7xl"
              style={{ fontFamily: "Georgia, serif" }}
            >
              Stay curious.
            </h1>
            <p className="mt-4 text-xl text-gray-600">
              Discover stories, thinking, and expertise from writers on any topic.
            </p>
            {session?.user ? (
              <Link
                href="/write"
                className="mt-8 inline-block rounded-full bg-gray-900 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-gray-800"
              >
                Start writing
              </Link>
            ) : (
              <Link
                href="/signup"
                className="mt-8 inline-block rounded-full bg-gray-900 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-gray-800"
              >
                Start reading
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Feed */}
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        {posts && posts.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {posts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className="text-lg text-gray-500">No stories yet.</p>
            <p className="mt-2 text-sm text-gray-400">
              Be the first to share something.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
