"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function toggleLike(slug) {
  const session = await auth()

  if (!session?.user) {
    return { error: "login_required" }
  }

  try {
    const post = await prisma.post.findUnique({
      where: { slug },
      select: { id: true },
    })

    if (!post) {
      return { error: "Post not found" }
    }

    const existingLike = await prisma.like.findUnique({
      where: {
        postId_userId: {
          postId: post.id,
          userId: session.user.id,
        },
      },
    })

    if (existingLike) {
      // Unlike
      await prisma.like.delete({
        where: { id: existingLike.id },
      })
    } else {
      // Like
      await prisma.like.create({
        data: {
          postId: post.id,
          userId: session.user.id,
        },
      })
    }

    revalidatePath(`/blog/${slug}`)
  } catch (error) {
    console.error("Toggle like error:", error)
    return { error: "Failed to toggle like" }
  }
}

export async function checkUserLike(postId, userId) {
  try {
    const like = await prisma.like.findUnique({
      where: {
        postId_userId: {
          postId,
          userId,
        },
      },
    })

    return !!like
  } catch (error) {
    console.error("Check user like error:", error)
    return false
  }
}

export async function getLikeCount(postId) {
  try {
    const count = await prisma.like.count({
      where: { postId },
    })

    return count
  } catch (error) {
    console.error("Get like count error:", error)
    return 0
  }
}

export async function getAllLikes() {
  const session = await auth()

  if (!session?.user || session.user.role !== "ADMIN") {
    throw new Error("Not authorized")
  }

  try {
    const likes = await prisma.like.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          include: {
            profile: true,
          },
        },
        post: {
          select: {
            id: true,
            title: true,
            slug: true,
          },
        },
      },
    })

    return likes
  } catch (error) {
    console.error("Get all likes error:", error)
    return []
  }
}
