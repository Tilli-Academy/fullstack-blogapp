import PostForm from "@/components/PostForm"
import { createPost } from "@/actions/posts"

export default function WritePage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-3xl px-4 py-12">
        <PostForm action={createPost} />
      </div>
    </div>
  )
}
