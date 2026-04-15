import { getAllUsers } from "@/actions/users"
import { auth } from "@/auth"
import Link from "next/link"
import FollowButton from "@/components/FollowButton"

export const metadata = {
  title: "Discover People - BlogSpace",
  description: "Discover and follow writers on BlogSpace",
}

export default async function PeoplePage() {
  const session = await auth()
  const isLoggedIn = !!session?.user

  const users = await getAllUsers(1, 50)

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-6xl px-6 py-12">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1
            className="mb-4 text-5xl font-bold text-gray-900"
            style={{ fontFamily: "Georgia, serif" }}
          >
            Discover Writers
          </h1>
          <p className="text-lg text-gray-600">
            Follow writers to personalize your reading experience
          </p>
        </div>

        {/* Users Grid */}
        {users.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {users.map((user) => (
              <div
                key={user.id}
                className="group rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
              >
                {/* Avatar */}
                <Link
                  href={`/profile/${user.username}`}
                  className="mb-4 flex justify-center"
                >
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gray-200 text-2xl font-medium text-gray-700 transition-transform group-hover:scale-105">
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.username}
                        className="h-full w-full rounded-full object-cover"
                      />
                    ) : (
                      user.username[0]?.toUpperCase()
                    )}
                  </div>
                </Link>

                {/* User Info */}
                <div className="text-center">
                  <Link href={`/profile/${user.username}`}>
                    <h3
                      className="mb-1 text-xl font-bold text-gray-900 hover:text-gray-600 transition-colors"
                      style={{ fontFamily: "Georgia, serif" }}
                    >
                      {user.name || user.username}
                    </h3>
                  </Link>
                  <p className="mb-3 text-sm text-gray-500">@{user.username}</p>

                  {/* Bio */}
                  {user.bio && (
                    <p className="mb-4 line-clamp-2 text-sm text-gray-600">
                      {user.bio}
                    </p>
                  )}

                  {/* Stats */}
                  <div className="mb-4 flex justify-center gap-6 text-sm">
                    <div>
                      <span className="font-semibold text-gray-900">
                        {user.postsCount}
                      </span>
                      <span className="ml-1 text-gray-500">Posts</span>
                    </div>
                    <div>
                      <span className="font-semibold text-gray-900">
                        {user.followersCount}
                      </span>
                      <span className="ml-1 text-gray-500">Followers</span>
                    </div>
                  </div>

                  {/* Follow Button */}
                  {!user.isCurrentUser && (
                    <div className="flex justify-center">
                      <FollowButton
                        targetUserId={user.id}
                        isFollowing={user.isFollowing}
                        isLoggedIn={isLoggedIn}
                      />
                    </div>
                  )}

                  {user.isCurrentUser && (
                    <span className="inline-block rounded-full bg-gray-100 px-4 py-2 text-sm font-medium text-gray-600">
                      You
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-20 text-center">
            <p className="text-lg text-gray-500">No users found yet.</p>
          </div>
        )}
      </div>
    </div>
  )
}
