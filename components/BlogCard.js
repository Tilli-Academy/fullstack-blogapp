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
    <article className="group flex gap-6 pb-8 border-b border-gray-100 last:border-0">
      {/* Text Content */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Author metadata - top left */}
        <Link
          href={`/profile/${post.author?.profile?.username || authorName}`}
          className="mb-2 flex items-center gap-2 w-fit hover:opacity-70 transition-opacity"
        >
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-900 text-[10px] font-medium text-white flex-shrink-0">
            {authorInitial}
          </div>
          <span className="text-sm font-medium text-gray-900 truncate">
            {authorName}
          </span>
        </Link>

        {/* Large bold serif headline */}
        <Link href={`/blog/${post.slug}`} className="block mb-1.5">
          <h2
            className="text-xl font-bold text-gray-900 leading-snug line-clamp-2 group-hover:text-gray-600 transition-colors sm:text-2xl"
            style={{ fontFamily: "Georgia, serif" }}
          >
            {post.title}
          </h2>
        </Link>

        {/* Content snippet */}
        {post.excerpt && (
          <p className="mb-auto text-base text-gray-500 line-clamp-2 leading-relaxed hidden sm:block">
            {post.excerpt}
          </p>
        )}

        {/* Social proof footer: Date, Likes, Comments */}
        <div className="flex items-center gap-4 mt-4 text-[13px] text-gray-500">
          <span>{formattedDate}</span>
          <span>·</span>
          <span>{readTime}</span>

          {post._count?.likes > 0 && (
            <>
              <span>·</span>
              <span className="flex items-center gap-1">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                {post._count.likes}
              </span>
            </>
          )}

          {post._count?.comments > 0 && (
            <>
              <span>·</span>
              <span className="flex items-center gap-1">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                </svg>
                {post._count.comments}
              </span>
            </>
          )}
        </div>
      </div>

      {/* Thumbnail image - right side */}
      {post.coverImage && (
        <Link href={`/blog/${post.slug}`} className="flex-shrink-0 self-center">
          <div className="h-28 w-28 overflow-hidden sm:h-36 sm:w-36">
            <img
              src={post.coverImage}
              alt=""
              className="h-full w-full object-cover"
            />
          </div>
        </Link>
      )}
    </article>
  )
}
