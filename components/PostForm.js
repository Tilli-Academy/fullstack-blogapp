"use client"

import { useActionState, useState, useRef } from "react"
import RichTextEditor from "./RichTextEditor"

export default function PostForm({ action, initialData, redirectTo = "/admin/posts" }) {
  const [state, formAction, isPending] = useActionState(action, null)
  const [content, setContent] = useState(initialData?.content || "")
  const [coverImage, setCoverImage] = useState(initialData?.coverImage || "")
  const [uploading, setUploading] = useState(false)
  const coverInputRef = useRef(null)

  const handleCoverUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    const formData = new FormData()
    formData.append("file", file)

    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData })
      const data = await res.json()
      if (data.url) {
        setCoverImage(data.url)
      }
    } catch (err) {
      console.error("Cover upload failed:", err)
    } finally {
      setUploading(false)
    }
  }

  return (
    <form action={formAction} className="space-y-6 max-w-3xl mx-auto">
      {state?.error && (
        <p className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">
          {state.error}
        </p>
      )}

      <input type="hidden" name="content" value={content} />
      <input type="hidden" name="coverImage" value={coverImage} />

      {/* Cover Image */}
      <div>
        {coverImage ? (
          <div className="relative group">
            <img
              src={coverImage}
              alt="Cover"
              className="w-full h-64 object-cover rounded-lg"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => coverInputRef.current?.click()}
                className="px-4 py-2 bg-white text-gray-900 text-sm rounded-lg font-medium"
              >
                Change
              </button>
              <button
                type="button"
                onClick={() => setCoverImage("")}
                className="px-4 py-2 bg-red-500 text-white text-sm rounded-lg font-medium"
              >
                Remove
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => coverInputRef.current?.click()}
            disabled={uploading}
            className="w-full h-48 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-400 hover:border-gray-400 hover:text-gray-500 transition-colors"
          >
            {uploading ? (
              <span className="text-sm">Uploading...</span>
            ) : (
              <>
                <svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-sm font-medium">Add a cover image</span>
              </>
            )}
          </button>
        )}
        <input
          ref={coverInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleCoverUpload}
        />
      </div>

      {/* Title */}
      <div>
        <input
          name="title"
          type="text"
          required
          placeholder="Title"
          defaultValue={initialData?.title || ""}
          className="w-full text-4xl font-bold placeholder-gray-300 border-none focus:outline-none focus:ring-0 font-serif"
          style={{ fontFamily: "Georgia, serif" }}
        />
      </div>

      {/* Excerpt */}
      <div>
        <input
          name="excerpt"
          type="text"
          placeholder="Write a brief excerpt..."
          defaultValue={initialData?.excerpt || ""}
          className="w-full text-lg text-gray-500 placeholder-gray-300 border-none focus:outline-none focus:ring-0"
        />
      </div>

      {/* Rich Text Editor */}
      <RichTextEditor content={initialData?.content || ""} onChange={setContent} />

      {/* Publish & Submit */}
      <div className="flex items-center justify-between border-t pt-6">
        <div className="flex items-center gap-3">
          <input
            id="published"
            name="published"
            type="checkbox"
            defaultChecked={initialData?.published ?? true}
            className="rounded border-gray-300"
          />
          <label htmlFor="published" className="text-sm text-gray-600">
            Publish immediately
          </label>
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="px-6 py-2.5 bg-green-600 text-white text-sm font-medium rounded-full hover:bg-green-700 disabled:opacity-50 transition-colors"
        >
          {isPending
            ? "Saving..."
            : initialData
              ? "Update"
              : "Publish"}
        </button>
      </div>
    </form>
  )
}
