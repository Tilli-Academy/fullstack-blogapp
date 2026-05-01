import { getAllComments, deleteComment } from "@/actions/comments"

export default async function AdminCommentsPage() {
  const comments = await getAllComments()

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Comments</h1>

      <div className="space-y-4">
        {comments?.map((comment) => (
          <div key={comment.id} className="border rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm">
                <span className="font-medium">
                  {comment.user.profile?.username || comment.user.name || "Unknown"}
                </span>
                <span className="text-gray-400 mx-2">on</span>
                <span className="text-blue-600">
                  {comment.post?.title || "Unknown post"}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-gray-400">
                  {new Date(comment.createdAt).toLocaleDateString()}
                </span>
                <form action={deleteComment}>
                  <input type="hidden" name="commentId" value={comment.id} />
                  <input
                    type="hidden"
                    name="slug"
                    value={comment.post?.slug || ""}
                  />
                  <button
                    type="submit"
                    className="text-xs text-red-500 hover:text-red-700"
                  >
                    Delete
                  </button>
                </form>
              </div>
            </div>
            <p className="text-sm text-gray-700">{comment.content}</p>
          </div>
        ))}
        {(!comments || comments.length === 0) && (
          <p className="text-gray-400">No comments yet.</p>
        )}
      </div>
    </div>
  )
}
