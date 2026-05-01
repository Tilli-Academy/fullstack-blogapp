"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function addComment(slug, formData) {
  const session = await auth()

  if (!session?.user) {
    return { error: "You must be logged in to comment" }
  }

  const content = formData.get("content")?.toString().trim()
  if (!content) {
    return { error: "Comment cannot be empty" }
  }

  try {
    const post = await prisma.post.findUnique({
      where: { slug },
      select: { id: true },
    })

    if (!post) {
      return { error: "Post not found" }
    }

    await prisma.comment.create({
      data: {
        postId: post.id,
        userId: session.user.id,
        content,
      },
    })

    revalidatePath(`/blog/${slug}`)
  } catch (error) {
    console.error("Add comment error:", error)
    return { error: "Failed to add comment" }
  }
}

export async function deleteComment(formData) {
  const session = await auth()

  if (!session?.user) {
    return { error: "Not authenticated" }
  }

  const commentId = formData.get("commentId")
  const slug = formData.get("slug")

  try {
    // Get the comment to check ownership or admin status
    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
      select: { userId: true },
    })

    if (!comment) {
      return { error: "Comment not found" }
    }

    // Only allow deletion if user is admin or comment owner
    if (session.user.role !== "ADMIN" && comment.userId !== session.user.id) {
      return { error: "Not authorized" }
    }

    await prisma.comment.delete({
      where: { id: commentId },
    })

    if (slug) {
      revalidatePath(`/blog/${slug}`)
    }
    revalidatePath("/admin/comments")
  } catch (error) {
    console.error("Delete comment error:", error)
    return { error: "Failed to delete comment" }
  }
}

export async function getComments(postId) {
  try {
    const comments = await prisma.comment.findMany({
      where: { postId },
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          include: {
            profile: true,
          },
        },
      },
    })

    return comments
  } catch (error) {
    console.error("Get comments error:", error)
    return []
  }
}

export async function getAllComments() {
  const session = await auth()

  if (!session?.user || session.user.role !== "ADMIN") {
    throw new Error("Not authorized")
  }

  try {
    const comments = await prisma.comment.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          include: {
            profile: true,
          },
        },
        post: {
          select: {
            title: true,
            slug: true,
          },
        },
      },
    })

    return comments
  } catch (error) {
    console.error("Get all comments error:", error)
    return []
  }
}
