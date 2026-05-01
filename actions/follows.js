"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function toggleFollow(targetUserId) {
  const session = await auth()
  if (!session?.user) throw new Error("Not authenticated")
  if (session.user.id === targetUserId) throw new Error("Cannot follow yourself")

  const existing = await prisma.follow.findUnique({
    where: {
      followerId_followingId: {
        followerId: session.user.id,
        followingId: targetUserId,
      },
    },
  })

  if (existing) {
    await prisma.follow.delete({ where: { id: existing.id } })
  } else {
    await prisma.follow.create({
      data: {
        followerId: session.user.id,
        followingId: targetUserId,
      },
    })
  }

  revalidatePath("/")
}

export async function checkIsFollowing(targetUserId) {
  const session = await auth()
  if (!session?.user) return false

  const existing = await prisma.follow.findUnique({
    where: {
      followerId_followingId: {
        followerId: session.user.id,
        followingId: targetUserId,
      },
    },
  })

  return !!existing
}

export async function getFollowingFeed(page = 1, limit = 20) {
  const session = await auth()
  if (!session?.user) return { posts: [], total: 0 }

  const skip = (page - 1) * limit

  // Get IDs of users the current user follows
  const following = await prisma.follow.findMany({
    where: { followerId: session.user.id },
    select: { followingId: true },
  })

  const followingIds = following.map((f) => f.followingId)

  if (followingIds.length === 0) return { posts: [], total: 0 }

  const [posts, total] = await Promise.all([
    prisma.post.findMany({
      where: {
        published: true,
        authorId: { in: followingIds },
      },
      orderBy: { createdAt: "desc" },
      take: limit,
      skip,
      include: {
        author: { include: { profile: true } },
        _count: { select: { likes: true, comments: true } },
      },
    }),
    prisma.post.count({
      where: {
        published: true,
        authorId: { in: followingIds },
      },
    }),
  ])

  return { posts, total }
}

export async function getStaffPicks(limit = 3) {
  try {
    const posts = await prisma.post.findMany({
      where: {
        published: true,
        author: { profile: { role: "ADMIN" } },
      },
      orderBy: { createdAt: "desc" },
      take: limit,
      include: {
        author: { include: { profile: true } },
        _count: { select: { likes: true, comments: true } },
      },
    })
    return posts
  } catch (error) {
    console.error("Get staff picks error:", error)
    return []
  }
}

export async function getSuggestedUsers(limit = 5) {
  const session = await auth()

  // Get IDs of users the current user already follows
  let followingIds = []
  if (session?.user) {
    const following = await prisma.follow.findMany({
      where: { followerId: session.user.id },
      select: { followingId: true },
    })
    followingIds = following.map((f) => f.followingId)
    followingIds.push(session.user.id) // exclude self
  }

  try {
    const users = await prisma.user.findMany({
      where: {
        ...(followingIds.length > 0 ? { id: { notIn: followingIds } } : {}),
        profile: { isNot: null },
        posts: { some: { published: true } },
      },
      take: limit,
      include: {
        profile: true,
        _count: { select: { posts: true, followers: true } },
      },
      orderBy: { posts: { _count: "desc" } },
    })

    return users.map((u) => ({
      id: u.id,
      username: u.profile?.username || u.name || "Unknown",
      bio: u.profile?.bio,
      avatar: u.profile?.avatar || u.image,
      postCount: u._count.posts,
      followerCount: u._count.followers,
    }))
  } catch (error) {
    console.error("Get suggested users error:", error)
    return []
  }
}
