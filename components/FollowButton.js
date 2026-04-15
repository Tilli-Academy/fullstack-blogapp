"use client"

import { useTransition, useState } from "react"
import { toggleFollow } from "@/actions/follows"

export default function FollowButton({ targetUserId, isFollowing: initialIsFollowing, isLoggedIn }) {
  const [isPending, startTransition] = useTransition()
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing)

  if (!isLoggedIn) return null

  const handleClick = () => {
    setIsFollowing(!isFollowing)
    startTransition(async () => {
      try {
        await toggleFollow(targetUserId)
      } catch {
        setIsFollowing(isFollowing) // revert on error
      }
    })
  }

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      className={`rounded-full px-4 py-1.5 text-xs font-medium transition-colors ${
        isFollowing
          ? "border border-gray-300 text-gray-600 hover:border-red-300 hover:text-red-600"
          : "bg-green-600 text-white hover:bg-green-700"
      }`}
    >
      {isFollowing ? "Following" : "Follow"}
    </button>
  )
}
