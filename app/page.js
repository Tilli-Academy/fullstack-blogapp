import { Suspense } from "react"
import { getPosts } from "@/actions/posts"
import { getFollowingFeed, getStaffPicks, getSuggestedUsers } from "@/actions/follows"
import { auth } from "@/auth"
import { SidebarProvider } from "@/components/SidebarProvider"
import SidebarToggle from "@/components/SidebarToggle"
import Sidebar from "@/components/Sidebar"
import FeedTabs from "@/components/FeedTabs"
import FeedSkeleton from "@/components/FeedSkeleton"
import RecommendedSection from "@/components/RecommendedSection"
import Link from "next/link"

export const revalidate = 60

export default async function HomePage() {
  const session = await auth()
  const isLoggedIn = !!session?.user
  const isAdmin = session?.user?.role === "ADMIN"

  // Fetch all data in parallel
  const [
    { posts: forYouPosts },
    followingData,
    staffPicks,
    suggestedUsers,
  ] = await Promise.all([
    getPosts(1, 30),
    isLoggedIn ? getFollowingFeed() : Promise.resolve({ posts: [] }),
    getStaffPicks(3),
    getSuggestedUsers(5),
  ])

  return (
    <SidebarProvider>
      <div className="min-h-screen bg-white">
        {/* Hero Banner - Medium Style */}
        <div className="border-b border-black bg-amber-400">
          <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
            <div className="max-w-2xl">
              <h1
                className="text-7xl font-normal tracking-tight text-gray-900 sm:text-8xl lg:text-[106px]"
                style={{ fontFamily: "Georgia, serif", lineHeight: "1" }}
              >
                Stay curious.
              </h1>
              <p className="mt-8 text-2xl text-gray-900">
                Discover stories, thinking, and expertise from writers on any topic.
              </p>
              {isLoggedIn ? (
                <Link
                  href="/write"
                  className="mt-10 inline-block rounded-full bg-gray-900 px-12 py-3 text-base font-medium text-white transition-colors hover:bg-gray-800"
                >
                  Start writing
                </Link>
              ) : (
                <Link
                  href="/signup"
                  className="mt-10 inline-block rounded-full bg-gray-900 px-12 py-3 text-base font-medium text-white transition-colors hover:bg-gray-800"
                >
                  Start reading
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* 3-Column Layout */}
        <div className="mx-auto max-w-[1336px] px-6 py-8">
          {/* Sidebar Toggle Row */}
          <div className="mb-6">
            <SidebarToggle />
          </div>

          <div className="flex gap-8">
            {/* Left Sidebar */}
            <Sidebar isLoggedIn={isLoggedIn} isAdmin={isAdmin} />

            {/* Center Feed */}
            <main className="mx-auto flex-1 min-w-0 max-w-2xl">
              <Suspense fallback={<FeedSkeleton />}>
                <FeedTabs
                  forYouPosts={forYouPosts}
                  followingPosts={followingData.posts}
                  isLoggedIn={isLoggedIn}
                />
              </Suspense>
            </main>

            {/* Right Sidebar */}
            <RecommendedSection
              staffPicks={staffPicks}
              suggestedUsers={suggestedUsers}
              isLoggedIn={isLoggedIn}
            />
          </div>
        </div>
      </div>
    </SidebarProvider>
  )
}
