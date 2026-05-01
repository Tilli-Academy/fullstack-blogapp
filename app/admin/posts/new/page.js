import PostForm from "@/components/PostForm";
import { createPost } from "@/actions/posts";

export default function NewPostPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">New Post</h1>
      <PostForm action={createPost} />
    </div>
  );
}
