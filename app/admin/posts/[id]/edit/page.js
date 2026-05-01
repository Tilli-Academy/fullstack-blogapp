import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import PostForm from "@/components/PostForm"
import { updatePost } from "@/actions/posts"

export default async function EditPostPage({ params }) {
  const { id } = await params

  const post = await prisma.post.findUnique({
    where: { id },
  })

  if (!post) notFound()

  const updatePostWithId = updatePost.bind(null, post.id)

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Edit Post</h1>
      <PostForm action={updatePostWithId} initialData={post} />
    </div>
  )
}
