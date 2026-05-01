"use client"

import { useState, useTransition } from "react"
import BlogCard from "./BlogCard"
import FeedSkeleton from "./FeedSkeleton"

export default function FeedTabs({ forYouPosts, followingPosts, isLoggedIn }) {
  const [activeTab, setActiveTab] = useState("forYou")

  const posts = activeTab === "forYou" ? forYouPosts : followingPosts

  return (
    <div>
      {/* Tab Headers */}
      <div className="sticky top-14 z-10 flex border-b border-gray-200 bg-white">
        <button
          onClick={() => setActiveTab("forYou")}
          className={`flex-1 py-4 text-sm font-medium transition-colors relative ${
            activeTab === "forYou" ? "text-gray-900" : "text-gray-500 hover:text-gray-700"
          }`}
        >
          For You
          {activeTab === "forYou" && (
            <span className="absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 w-16 bg-gray-900" />
          )}
        </button>
        {isLoggedIn && (
          <button
            onClick={() => setActiveTab("following")}
            className={`flex-1 py-4 text-sm font-medium transition-colors relative ${
              activeTab === "following" ? "text-gray-900" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Following
            {activeTab === "following" && (
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 w-16 bg-gray-900" />
            )}
          </button>
        )}
      </div>

      {/* Feed Content */}
      <div className="pt-8">
        {posts && posts.length > 0 ? (
          <div className="space-y-8">
            {posts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center">
            {activeTab === "following" ? (
              <>
                <p className="text-lg text-gray-500">
                  Stories from the people you follow will appear here.
                </p>
                <p className="mt-2 text-sm text-gray-400">
                  Follow some writers to fill up your feed.
                </p>
              </>
            ) : (
              <>
                <p className="text-lg text-gray-500">No stories yet.</p>
                <p className="mt-2 text-sm text-gray-400">
                  Be the first to share something.
                </p>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
