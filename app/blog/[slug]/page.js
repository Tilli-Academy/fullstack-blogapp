import { auth } from "@/auth"
import { getPost, getAllPostSlugs } from "@/actions/posts"
import { getComments } from "@/actions/comments"
import { checkUserLike } from "@/actions/likes"
import { notFound } from "next/navigation"
import Link from "next/link"
import LikeButton from "@/components/LikeButton"
import CommentSection from "@/components/CommentSection"
import DeletePostButton from "@/components/DeletePostButton"
import { calculateReadTime } from "@/lib/utils"

export async function generateStaticParams() {
  const slugs = await getAllPostSlugs()
  return slugs.map((slug) => ({ slug }))
}

export const revalidate = 60

export default async function BlogPostPage({ params }) {
  const { slug } = await params
  const session = await auth()

  const post = await getPost(slug)

  if (!post || !post.published) {
    notFound()
  }

  const comments = await getComments(post.id)
  const hasLiked = session?.user
    ? await checkUserLike(post.id, session.user.id)
    : false

  const likeCount = post._count.likes
  const isAdmin = session?.user?.role === "ADMIN"
  const isAuthor = session?.user?.id === post.authorId
  const canEdit = isAdmin || isAuthor

  const formattedDate = new Date(post.createdAt).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  })

  const readTime = calculateReadTime(post.content || "")
  const authorName = post.author?.profile?.username || post.author?.name || "Unknown"

  return (
    <div className="min-h-screen bg-white">
      <article className="mx-auto max-w-[680px] px-4 py-12 sm:px-6">
        {/* Title */}
        <h1
          className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl lg:text-[42px] leading-tight"
          style={{ fontFamily: "Georgia, serif" }}
        >
          {post.title}
        </h1>

        {/* Author card */}
        <div className="mt-6 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gray-900 text-sm font-medium text-white">
            {authorName[0].toUpperCase()}
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">{authorName}</p>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span>{readTime}</span>
              <span>·</span>
              <span>{formattedDate}</span>
            </div>
          </div>
        </div>

        {/* Action bar */}
        <div className="mt-6 flex items-center justify-between border-y border-gray-100 py-3">
          <LikeButton
            slug={slug}
            likeCount={likeCount}
            hasLiked={hasLiked}
            isLoggedIn={!!session?.user}
          />

          {canEdit && (
            <div className="flex items-center gap-2">
              <Link
                href={`/write/${post.id}/edit`}
                className="flex items-center gap-1 rounded px-3 py-1.5 text-sm text-gray-500 transition-colors hover:text-gray-900"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit
              </Link>
              <DeletePostButton postId={post.id} />
            </div>
          )}
        </div>

        {/* Cover image */}
        {post.coverImage && (
          <div className="mt-8">
            <img
              src={post.coverImage}
              alt=""
              className="w-full rounded-lg"
            />
          </div>
        )}

        {/* Content */}
        <div
          className="prose prose-lg mt-8"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Divider */}
        <hr className="my-12 border-gray-100" />

        {/* Comments section */}
        <CommentSection
          slug={slug}
          comments={comments}
          userId={session?.user?.id}
          isAdmin={isAdmin}
          isLoggedIn={!!session?.user}
        />
      </article>
    </div>
  )
}
