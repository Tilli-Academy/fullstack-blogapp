"use server"

import { signIn, signOut } from "@/auth"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import { AuthError } from "next-auth"

export async function login(prevState, formData) {
  const email = formData.get("email")
  const password = formData.get("password")
  const redirectTo = formData.get("redirectTo") || "/"

  try {
    await signIn("credentials", {
      email,
      password,
      redirect: false,
    })
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "Invalid credentials" }
    }
    throw error
  }

  revalidatePath("/", "layout")
  redirect(redirectTo)
}

export async function signup(prevState, formData) {
  const email = formData.get("email")
  const password = formData.get("password")
  const username = formData.get("username")
  const name = formData.get("name")

  try {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return { error: "User already exists" }
    }

    // Check if username is taken
    const existingUsername = await prisma.profile.findUnique({
      where: { username },
    })

    if (existingUsername) {
      return { error: "Username already taken" }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user and profile in a transaction
    await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email,
          password: hashedPassword,
          name: name || username,
        },
      })

      await tx.profile.create({
        data: {
          userId: user.id,
          username,
          role: "USER",
        },
      })
    })

    // Sign in the user
    await signIn("credentials", {
      email,
      password,
      redirect: false,
    })
  } catch (error) {
    console.error("Signup error:", error)
    return { error: "Failed to create account" }
  }

  revalidatePath("/", "layout")
  redirect("/")
}

export async function logout() {
  await signOut({ redirect: false })
  revalidatePath("/", "layout")
  redirect("/")
}
