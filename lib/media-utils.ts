// Media upload utilities with compression and validation

export const MAX_IMAGE_SIZE = 5 * 1024 * 1024 // 5MB
export const MAX_VIDEO_SIZE = 50 * 1024 * 1024 // 50MB
export const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"]
export const ALLOWED_VIDEO_TYPES = ["video/mp4", "video/webm", "video/quicktime"]

export interface MediaValidationResult {
  valid: boolean
  error?: string
  file?: File
}

export function validateImageFile(file: File): MediaValidationResult {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: "Invalid image format. Please upload JPG, PNG, GIF, or WebP.",
    }
  }

  if (file.size > MAX_IMAGE_SIZE) {
    return {
      valid: false,
      error: `Image size must be less than ${MAX_IMAGE_SIZE / 1024 / 1024}MB.`,
    }
  }

  return { valid: true, file }
}

export function validateVideoFile(file: File): MediaValidationResult {
  if (!ALLOWED_VIDEO_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: "Invalid video format. Please upload MP4, WebM, or MOV.",
    }
  }

  if (file.size > MAX_VIDEO_SIZE) {
    return {
      valid: false,
      error: `Video size must be less than ${MAX_VIDEO_SIZE / 1024 / 1024}MB.`,
    }
  }

  return { valid: true, file }
}

export async function compressImage(file: File, maxWidth = 1200): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = (e) => {
      const img = new Image()
      img.src = e.target?.result as string
      img.onload = () => {
        const canvas = document.createElement("canvas")
        let width = img.width
        let height = img.height

        // Maintain aspect ratio
        if (width > maxWidth) {
          height = (height * maxWidth) / width
          width = maxWidth
        }

        canvas.width = width
        canvas.height = height

        const ctx = canvas.getContext("2d")
        ctx?.drawImage(img, 0, 0, width, height)

        // Compress to JPEG with 0.8 quality
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const compressedUrl = URL.createObjectURL(blob)
              resolve(compressedUrl)
            } else {
              reject(new Error("Image compression failed"))
            }
          },
          "image/jpeg",
          0.8,
        )
      }
      img.onerror = () => reject(new Error("Failed to load image"))
    }
    reader.onerror = () => reject(new Error("Failed to read file"))
  })
}

export function extractHashtags(text: string): string[] {
  const hashtagRegex = /#[\w]+/g
  const matches = text.match(hashtagRegex)
  return matches ? matches.map((tag) => tag.slice(1)) : []
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes"
  const k = 1024
  const sizes = ["Bytes", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i]
}
