import Link from "next/link";

export default function AdminSidebar() {
  return (
    <aside className="w-56 border-r bg-gray-50 min-h-screen p-4">
      <h2 className="text-lg font-bold mb-4">Admin</h2>
      <nav className="space-y-2">
        <Link
          href="/admin"
          className="block px-3 py-2 text-sm rounded hover:bg-gray-200"
        >
          Dashboard
        </Link>
        <Link
          href="/admin/posts"
          className="block px-3 py-2 text-sm rounded hover:bg-gray-200"
        >
          Posts
        </Link>
        <Link
          href="/admin/posts/new"
          className="block px-3 py-2 text-sm rounded hover:bg-gray-200"
        >
          New Post
        </Link>
        <Link
          href="/admin/comments"
          className="block px-3 py-2 text-sm rounded hover:bg-gray-200"
        >
          Comments
        </Link>
        <Link
          href="/admin/likes"
          className="block px-3 py-2 text-sm rounded hover:bg-gray-200"
        >
          Likes
        </Link>
        <hr className="my-3" />
        <Link
          href="/"
          className="block px-3 py-2 text-sm text-gray-500 rounded hover:bg-gray-200"
        >
          Back to Blog
        </Link>
      </nav>
    </aside>
  );
}
