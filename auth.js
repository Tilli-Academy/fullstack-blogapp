import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import Credentials from "next-auth/providers/credentials"
import Google from "next-auth/providers/google"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
          role: "USER", // Default role for Google signups
        }
      },
    }),
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid credentials")
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email,
          },
          include: {
            profile: true,
          },
        })

        if (!user || !user.password) {
          throw new Error("Invalid credentials")
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        )

        if (!isPasswordValid) {
          throw new Error("Invalid credentials")
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          role: user.profile?.role || "USER",
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      try {
        // For OAuth providers (Google), ensure profile exists
        if (account?.provider === "google") {
          console.log("🔵 Google sign-in detected for user:", user.email)

          const existingProfile = await prisma.profile.findUnique({
            where: { userId: user.id },
          })

          if (!existingProfile) {
            console.log("🟡 Creating new profile for user:", user.id)
            const username = user.email?.split("@")[0] + "_" + user.id.slice(-4)
            await prisma.profile.create({
              data: {
                userId: user.id,
                username,
                role: "USER",
              },
            })
            console.log("✅ Profile created successfully:", username)
          } else {
            console.log("✅ Existing profile found:", existingProfile.username)
          }
        }
        return true
      } catch (error) {
        console.error("❌ Sign-in callback error:", error)
        return false
      }
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id
        token.role = user.role
      }
      // Fetch role from profile if not already in token
      if (!token.role) {
        const profile = await prisma.profile.findUnique({
          where: { userId: token.id },
        })
        token.role = profile?.role || "USER"
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id
        session.user.role = token.role
      }
      return session
    },
  },
})
