import { notFound } from "next/navigation"
import { getUserProfile, getUserPosts } from "@/actions/users"
import BlogCard from "@/components/BlogCard"
import FollowButton from "@/components/FollowButton"
import { auth } from "@/auth"

export default async function UserProfilePage({ params }) {
  const { username } = await params
  const session = await auth()
  const isLoggedIn = !!session?.user

  const [profile, { posts }] = await Promise.all([
    getUserProfile(username),
    getUserPosts(username, 1, 20),
  ])

  if (!profile) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-4xl px-6 py-12">
        {/* Profile Header */}
        <div className="mb-12 flex flex-col items-center text-center">
          {/* Avatar */}
          <div className="mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-gray-200 text-3xl font-medium text-gray-700">
            {profile.avatar ? (
              <img
                src={profile.avatar}
                alt={profile.username}
                className="h-full w-full rounded-full object-cover"
              />
            ) : (
              profile.username[0]?.toUpperCase()
            )}
          </div>

          {/* Name and Username */}
          <h1
            className="mb-2 text-4xl font-bold text-gray-900"
            style={{ fontFamily: "Georgia, serif" }}
          >
            {profile.name || profile.username}
          </h1>
          <p className="mb-4 text-lg text-gray-500">@{profile.username}</p>

          {/* Bio */}
          {profile.bio && (
            <p className="mb-6 max-w-2xl text-base text-gray-600">{profile.bio}</p>
          )}

          {/* Stats */}
          <div className="mb-6 flex gap-8 text-center">
            <div>
              <div className="text-2xl font-bold text-gray-900">{profile.postsCount}</div>
              <div className="text-sm text-gray-500">Posts</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{profile.followersCount}</div>
              <div className="text-sm text-gray-500">Followers</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{profile.followingCount}</div>
              <div className="text-sm text-gray-500">Following</div>
            </div>
          </div>

          {/* Follow Button */}
          {!profile.isOwnProfile && (
            <FollowButton
              targetUserId={profile.id}
              isFollowing={profile.isFollowing}
              isLoggedIn={isLoggedIn}
            />
          )}
        </div>

        {/* Divider */}
        <div className="mb-8 border-t border-gray-200" />

        {/* Posts Section */}
        <div>
          <h2
            className="mb-6 text-2xl font-bold text-gray-900"
            style={{ fontFamily: "Georgia, serif" }}
          >
            Published Stories
          </h2>

          {posts.length > 0 ? (
            <div className="space-y-8">
              {posts.map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <div className="py-20 text-center">
              <p className="text-lg text-gray-500">
                {profile.isOwnProfile
                  ? "You haven't published any stories yet."
                  : `${profile.username} hasn't published any stories yet.`}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
