import { getPosts } from "@/actions/posts"
import { auth } from "@/auth"
import BlogCard from "@/components/BlogCard"
import Link from "next/link"

export const revalidate = 60

export default async function HomePage() {
  const { posts, total } = await getPosts(1, 30)
  const session = await auth()

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Banner - Medium Style */}
      <div className="border-b border-black bg-amber-400">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
          <div className="max-w-2xl">
            <h1
              className="text-7xl font-normal tracking-tight text-gray-900 sm:text-8xl lg:text-[106px]"
              style={{ fontFamily: "Georgia, serif", lineHeight: "1" }}
            >
              Stay curious.
            </h1>
            <p className="mt-8 text-2xl text-gray-900">
              Discover stories, thinking, and expertise from writers on any topic.
            </p>
            {session?.user ? (
              <Link
                href="/write"
                className="mt-10 inline-block rounded-full bg-gray-900 px-12 py-3 text-base font-medium text-white transition-colors hover:bg-gray-800"
              >
                Start writing
              </Link>
            ) : (
              <Link
                href="/signup"
                className="mt-10 inline-block rounded-full bg-gray-900 px-12 py-3 text-base font-medium text-white transition-colors hover:bg-gray-800"
              >
                Start reading
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Main Feed - Single Column */}
      <div className="mx-auto max-w-[728px] px-6 py-16">
        {posts && posts.length > 0 ? (
          <div className="space-y-12">
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
