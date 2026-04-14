import Link from "next/link"
import { calculateReadTime } from "@/lib/utils"

export default function BlogCard({ post }) {
  const formattedDate = new Date(post.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  })

  const readTime = calculateReadTime(post.content || "")
  const authorName = post.author?.profile?.username || post.author?.name || "Unknown"
  const authorInitial = authorName[0].toUpperCase()

  return (
    <article className="group flex gap-8 pb-12 border-b border-gray-100 last:border-0">
      {/* Text Content - Takes up more space */}
      <div className="flex-1 min-w-0">
        {/* Author Info */}
        <div className="mb-3 flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-900 text-[10px] font-medium text-white">
            {authorInitial}
          </div>
          <span className="text-sm font-medium text-gray-900">{authorName}</span>
        </div>

        {/* Title - Larger */}
        <Link href={`/blog/${post.slug}`} className="block mb-3">
          <h2
            className="text-2xl font-bold text-gray-900 leading-snug line-clamp-2 group-hover:opacity-60 transition-opacity"
            style={{ fontFamily: "Georgia, serif" }}
          >
            {post.title}
          </h2>
        </Link>

        {/* Excerpt - Larger */}
        {post.excerpt && (
          <p className="mb-6 text-base text-gray-600 line-clamp-3 leading-relaxed">
            {post.excerpt}
          </p>
        )}

        {/* Meta Info */}
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <span>{formattedDate}</span>
            <span>·</span>
            <span>{readTime}</span>
          </div>

          <div className="flex items-center gap-4">
            {post._count?.likes > 0 && (
              <span className="flex items-center gap-1">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                {post._count.likes}
              </span>
            )}
            {post._count?.comments > 0 && (
              <span className="flex items-center gap-1">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                </svg>
                {post._count.comments}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Cover Image - Right Side */}
      {post.coverImage && (
        <Link
          href={`/blog/${post.slug}`}
          className="flex-shrink-0 block overflow-hidden"
        >
          <div className="relative h-32 w-32 sm:h-36 sm:w-36 overflow-hidden">
            <img
              src={post.coverImage}
              alt={post.title}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        </Link>
      )}
    </article>
  )
}
