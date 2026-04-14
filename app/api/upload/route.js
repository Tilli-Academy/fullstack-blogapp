import { auth } from "@/auth"
import { NextResponse } from "next/server"

export async function POST(request) {
  const session = await auth()

  if (!session?.user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  const formData = await request.formData()
  const file = formData.get("file")

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 })
  }

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
  const apiKey = process.env.CLOUDINARY_API_KEY
  const apiSecret = process.env.CLOUDINARY_API_SECRET

  if (!cloudName || !apiKey || !apiSecret) {
    return NextResponse.json(
      { error: "Cloudinary not configured" },
      { status: 500 }
    )
  }

  const timestamp = Math.round(Date.now() / 1000)
  // Image optimization: limit width to 1920px, auto quality, auto format (WebP when supported)
  const transformation = "c_limit,w_1920,q_auto,f_auto"

  // Generate signature (must include all parameters)
  const { createHash } = await import("crypto")
  const signatureString = `timestamp=${timestamp}&transformation=${transformation}${apiSecret}`
  const signature = createHash("sha1").update(signatureString).digest("hex")

  const uploadData = new FormData()
  uploadData.append("file", file)
  uploadData.append("api_key", apiKey)
  uploadData.append("timestamp", timestamp.toString())
  uploadData.append("signature", signature)
  uploadData.append("transformation", transformation)

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    { method: "POST", body: uploadData }
  )

  if (!response.ok) {
    return NextResponse.json({ error: "Upload failed" }, { status: 500 })
  }

  const data = await response.json()

  // Insert transformation parameters into the URL
  // Original: https://res.cloudinary.com/cloud/image/upload/v123/abc.jpg
  // Modified: https://res.cloudinary.com/cloud/image/upload/c_limit,w_1920,q_auto,f_auto/v123/abc.jpg
  const optimizedUrl = data.secure_url.replace(
    '/upload/',
    `/upload/${transformation}/`
  )

  return NextResponse.json({ url: optimizedUrl })
}
