import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { notFound, redirect } from "next/navigation"
import PostForm from "@/components/PostForm"
import { updatePost } from "@/actions/posts"

export default async function EditWritePage({ params }) {
  const { id } = await params
  const session = await auth()

  if (!session?.user) {
    redirect("/login")
  }

  const post = await prisma.post.findUnique({
    where: { id },
  })

  if (!post) notFound()

  // Only author or admin can edit
  if (post.authorId !== session.user.id && session.user.role !== "ADMIN") {
    redirect("/")
  }

  const updatePostWithId = updatePost.bind(null, post.id)

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-3xl px-4 py-12">
        <PostForm action={updatePostWithId} initialData={post} />
      </div>
    </div>
  )
}
