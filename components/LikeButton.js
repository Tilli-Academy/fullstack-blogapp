"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toggleLike } from "@/actions/likes";

export default function LikeButton({ slug, likeCount, hasLiked, isLoggedIn }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleClick() {
    if (!isLoggedIn) {
      router.push(`/login?redirectTo=/blog/${slug}`);
      return;
    }

    startTransition(async () => {
      await toggleLike(slug);
    });
  }

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      className={`group relative inline-flex items-center gap-3 overflow-hidden rounded-xl px-6 py-3 font-medium shadow-lg transition-all duration-300 ${
        hasLiked
          ? "bg-gradient-to-r from-pink-500 to-red-500 text-white hover:from-pink-600 hover:to-red-600"
          : "bg-white text-gray-700 hover:bg-gray-50 hover:shadow-xl"
      } ${isPending ? "opacity-50 cursor-not-allowed" : "hover:-translate-y-1"}`}
    >
      {/* Background animation */}
      <div className={`absolute inset-0 transition-transform duration-300 ${hasLiked ? "bg-gradient-to-r from-pink-400 to-red-400" : "bg-gradient-to-r from-blue-400 to-indigo-400"} opacity-0 group-hover:opacity-20`} />

      {/* Heart icon */}
      <svg
        className={`h-5 w-5 transition-all duration-300 ${hasLiked ? "scale-110 fill-current" : "scale-100"} ${isPending ? "animate-pulse" : ""}`}
        fill={hasLiked ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth={hasLiked ? "0" : "2"}
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        />
      </svg>

      {/* Like count */}
      <span className="relative font-semibold">
        {likeCount} {likeCount === 1 ? "Like" : "Likes"}
      </span>

      {/* Tooltip for non-logged-in users */}
      {!isLoggedIn && (
        <span className="absolute -top-12 left-1/2 -translate-x-1/2 rounded-lg bg-gray-900 px-3 py-1.5 text-xs text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100">
          Login to like
        </span>
      )}
    </button>
  );
}
