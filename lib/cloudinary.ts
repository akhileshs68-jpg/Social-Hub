"use client"

export type CloudinaryMediaType = "image" | "video"

export interface CloudinaryUploadResult {
  secureUrl: string
  publicId: string
  mediaType: CloudinaryMediaType
  bytes: number
  width?: number
  height?: number
  duration?: number
  format?: string
  originalFilename?: string
}

type CloudinaryResponse = {
  secure_url?: string
  public_id?: string
  resource_type?: string
  bytes?: number
  width?: number
  height?: number
  duration?: number
  format?: string
  original_filename?: string
  error?: {
    message?: string
  }
}

const getCloudinaryConfig = () => {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET
  const missingCloudinaryEnv = [
    !cloudName && "NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME",
    !uploadPreset && "NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET",
  ].filter(Boolean)

  if (!cloudName || !uploadPreset) {
    console.error(
      `[Cloudinary Config] Missing public env values: ${missingCloudinaryEnv.join(", ")}. ` +
        "Add them to the root .env file or Pi App Studio environment settings.",
    )
    throw new Error(`Cloudinary is not configured. Missing: ${missingCloudinaryEnv.join(", ")}.`)
  }

  return { cloudName, uploadPreset }
}

const resolveMediaType = (file: File): CloudinaryMediaType => {
  if (file.type.startsWith("video/")) return "video"
  return "image"
}

export async function uploadToCloudinary(file: File, folder: "posts" | "stories" | "profiles") {
  const { cloudName, uploadPreset } = getCloudinaryConfig()
  const mediaType = resolveMediaType(file)
  const endpoint = `https://api.cloudinary.com/v1_1/${cloudName}/${mediaType}/upload`
  const formData = new FormData()

  formData.append("file", file)
  formData.append("upload_preset", uploadPreset)
  formData.append("folder", `socialhub/${folder}`)

  const response = await fetch(endpoint, {
    method: "POST",
    body: formData,
  })
  const data = (await response.json()) as CloudinaryResponse

  if (!response.ok || data.error || !data.secure_url || !data.public_id) {
    throw new Error(data.error?.message || "Cloudinary upload failed.")
  }

  return {
    secureUrl: data.secure_url,
    publicId: data.public_id,
    mediaType,
    bytes: Number(data.bytes || file.size),
    width: data.width,
    height: data.height,
    duration: data.duration,
    format: data.format,
    originalFilename: data.original_filename || file.name,
  } satisfies CloudinaryUploadResult
}
