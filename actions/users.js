"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"

export async function getUserProfile(username) {
  try {
    const session = await auth()
    const currentUserId = session?.user?.id

    const user = await prisma.user.findFirst({
      where: {
        profile: { username },
      },
      include: {
        profile: true,
        _count: {
          select: {
            posts: { where: { published: true } },
            followers: true,
            following: true,
          },
        },
      },
    })

    if (!user) return null

    // Check if current user is following this user
    let isFollowing = false
    if (currentUserId && currentUserId !== user.id) {
      const follow = await prisma.follow.findUnique({
        where: {
          followerId_followingId: {
            followerId: currentUserId,
            followingId: user.id,
          },
        },
      })
      isFollowing = !!follow
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.image,
      username: user.profile?.username || user.name || "user",
      bio: user.profile?.bio,
      avatar: user.profile?.avatar || user.image,
      role: user.profile?.role || "USER",
      postsCount: user._count.posts,
      followersCount: user._count.followers,
      followingCount: user._count.following,
      isFollowing,
      isOwnProfile: currentUserId === user.id,
    }
  } catch (error) {
    console.error("Get user profile error:", error)
    return null
  }
}

export async function getUserPosts(username, page = 1, limit = 10) {
  try {
    const skip = (page - 1) * limit

    const user = await prisma.user.findFirst({
      where: { profile: { username } },
      select: { id: true },
    })

    if (!user) return { posts: [], total: 0 }

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where: {
          authorId: user.id,
          published: true,
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
        include: {
          author: { include: { profile: true } },
          _count: { select: { likes: true, comments: true } },
        },
      }),
      prisma.post.count({
        where: {
          authorId: user.id,
          published: true,
        },
      }),
    ])

    return { posts, total }
  } catch (error) {
    console.error("Get user posts error:", error)
    return { posts: [], total: 0 }
  }
}

export async function getCurrentUserProfile() {
  const session = await auth()
  if (!session?.user) return null

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        profile: true,
      },
    })

    if (!user?.profile) return null

    return {
      username: user.profile.username,
      name: user.name,
      image: user.image,
      avatar: user.profile.avatar,
    }
  } catch (error) {
    console.error("Get current user profile error:", error)
    return null
  }
}

export async function getAllUsers(page = 1, limit = 20) {
  try {
    const session = await auth()
    const currentUserId = session?.user?.id

    const skip = (page - 1) * limit

    // Get all users with profiles
    const users = await prisma.user.findMany({
      where: {
        profile: { isNot: null },
      },
      include: {
        profile: true,
        _count: {
          select: {
            posts: { where: { published: true } },
            followers: true,
            following: true,
          },
        },
      },
      orderBy: [
        { createdAt: "desc" },
      ],
      skip,
      take: limit,
    })

    // Check which users the current user is following
    let followingIds = []
    if (currentUserId) {
      const following = await prisma.follow.findMany({
        where: { followerId: currentUserId },
        select: { followingId: true },
      })
      followingIds = following.map((f) => f.followingId)
    }

    return users.map((user) => ({
      id: user.id,
      name: user.name,
      username: user.profile?.username || user.name || "user",
      bio: user.profile?.bio,
      avatar: user.profile?.avatar || user.image,
      postsCount: user._count.posts,
      followersCount: user._count.followers,
      followingCount: user._count.following,
      isFollowing: followingIds.includes(user.id),
      isCurrentUser: currentUserId === user.id,
    }))
  } catch (error) {
    console.error("Get all users error:", error)
    return []
  }
}
