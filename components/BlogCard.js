import Link from "next/link"
import { calculateReadTime } from "@/lib/utils"

export default function BlogCard({ post }) {
  const formattedDate = new Date(post.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })

  const readTime = calculateReadTime(post.content || "")
  const authorName = post.author?.profile?.username || post.author?.name || "Unknown"
  const authorInitial = authorName[0].toUpperCase()

  return (
    <article className="py-8 group">
      <div className="flex gap-6">
        {/* Text content */}
        <div className="flex-1 min-w-0">
          {/* Author row */}
          <div className="flex items-center gap-2 mb-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-900 text-[10px] font-medium text-white">
              {authorInitial}
            </div>
            <span className="text-sm text-gray-700">{authorName}</span>
            <span className="text-sm text-gray-400">·</span>
            <span className="text-sm text-gray-400">{formattedDate}</span>
          </div>

          {/* Title */}
          <Link href={`/blog/${post.slug}`} className="block">
            <h2
              className="text-xl font-bold text-gray-900 leading-snug group-hover:text-gray-600 transition-colors line-clamp-2"
              style={{ fontFamily: "Georgia, serif" }}
            >
              {post.title}
            </h2>
          </Link>

          {/* Excerpt */}
          {post.excerpt && (
            <p className="mt-1 text-base text-gray-500 line-clamp-2">
              {post.excerpt}
            </p>
          )}

          {/* Meta row */}
          <div className="mt-4 flex items-center gap-4 text-sm text-gray-400">
            <span>{readTime}</span>
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

        {/* Cover image thumbnail */}
        {post.coverImage && (
          <Link href={`/blog/${post.slug}`} className="flex-shrink-0">
            <img
              src={post.coverImage}
              alt=""
              className="h-28 w-28 rounded object-cover sm:h-32 sm:w-40"
            />
          </Link>
        )}
      </div>
    </article>
  )
}
