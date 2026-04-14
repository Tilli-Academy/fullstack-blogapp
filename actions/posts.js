"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

async function requireAdmin() {
  const session = await auth()

  if (!session?.user) {
    throw new Error("Not authenticated")
  }

  if (session.user.role !== "ADMIN") {
    throw new Error("Not authorized")
  }

  return session.user
}

async function requireAuth() {
  const session = await auth()

  if (!session?.user) {
    throw new Error("Not authenticated")
  }

  return session.user
}

async function requireOwnerOrAdmin(postId) {
  const session = await auth()

  if (!session?.user) {
    throw new Error("Not authenticated")
  }

  const post = await prisma.post.findUnique({
    where: { id: postId },
    select: { authorId: true },
  })

  if (!post) {
    throw new Error("Post not found")
  }

  if (session.user.role !== "ADMIN" && post.authorId !== session.user.id) {
    throw new Error("Not authorized")
  }

  return session.user
}

export async function createPost(prevState, formData) {
  const user = await requireAuth()

  const title = formData.get("title")
  const content = formData.get("content")
  const excerpt = formData.get("excerpt")
  const coverImage = formData.get("coverImage")
  const published = formData.get("published") === "on"

  const slug =
    title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "") +
    "-" +
    Date.now()

  try {
    await prisma.post.create({
      data: {
        title,
        slug,
        content,
        excerpt: excerpt || null,
        coverImage: coverImage || null,
        authorId: user.id,
        published,
      },
    })
  } catch (error) {
    console.error("Create post error:", error)
    return { error: "Failed to create post" }
  }

  revalidatePath("/")
  revalidatePath("/admin/posts")
  redirect("/")
}

export async function updatePost(postId, prevState, formData) {
  await requireOwnerOrAdmin(postId)

  const title = formData.get("title")
  const content = formData.get("content")
  const excerpt = formData.get("excerpt")
  const coverImage = formData.get("coverImage")
  const published = formData.get("published") === "on"

  let post
  try {
    post = await prisma.post.update({
      where: { id: postId },
      data: {
        title,
        content,
        excerpt: excerpt || null,
        coverImage: coverImage || null,
        published,
      },
    })
  } catch (error) {
    console.error("Update post error:", error)
    return { error: "Failed to update post" }
  }

  revalidatePath("/")
  revalidatePath("/admin/posts")
  revalidatePath(`/blog/${post.slug}`)
  redirect(`/blog/${post.slug}`)
}

export async function deletePost(postId) {
  await requireOwnerOrAdmin(postId)

  try {
    await prisma.post.delete({
      where: { id: postId },
    })
  } catch (error) {
    console.error("Delete post error:", error)
    throw error
  }

  revalidatePath("/")
  revalidatePath("/admin/posts")
  redirect("/")
}

export async function getPost(slug) {
  try {
    const post = await prisma.post.findUnique({
      where: { slug },
      include: {
        author: {
          include: {
            profile: true,
          },
        },
        _count: {
          select: {
            likes: true,
            comments: true,
          },
        },
      },
    })

    return post
  } catch (error) {
    console.error("Get post error:", error)
    return null
  }
}

export async function getAllPostSlugs() {
  try {
    const posts = await prisma.post.findMany({
      where: { published: true },
      select: { slug: true },
    })

    return posts.map((post) => post.slug)
  } catch (error) {
    console.error("Get post slugs error:", error)
    return []
  }
}

export async function getPosts(page = 1, limit = 9) {
  try {
    const skip = (page - 1) * limit

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where: { published: true },
        orderBy: { createdAt: "desc" },
        take: limit,
        skip,
        include: {
          author: {
            include: {
              profile: true,
            },
          },
          _count: {
            select: {
              likes: true,
              comments: true,
            },
          },
        },
      }),
      prisma.post.count({
        where: { published: true },
      }),
    ])

    return {
      posts,
      total,
      pages: Math.ceil(total / limit),
      currentPage: page,
    }
  } catch (error) {
    console.error("Get posts error:", error)
    return {
      posts: [],
      total: 0,
      pages: 0,
      currentPage: 1,
    }
  }
}

export async function getAdminPosts() {
  await requireAdmin()

  try {
    const posts = await prisma.post.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        author: {
          include: {
            profile: true,
          },
        },
        _count: {
          select: {
            likes: true,
            comments: true,
          },
        },
      },
    })

    return posts
  } catch (error) {
    console.error("Get admin posts error:", error)
    return []
  }
}

export async function getUserPosts() {
  const user = await requireAuth()

  try {
    const posts = await prisma.post.findMany({
      where: { authorId: user.id },
      orderBy: { createdAt: "desc" },
      include: {
        _count: {
          select: {
            likes: true,
            comments: true,
          },
        },
      },
    })

    return posts
  } catch (error) {
    console.error("Get user posts error:", error)
    return []
  }
}
