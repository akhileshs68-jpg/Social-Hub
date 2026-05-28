"use client"

import type React from "react"
import { useState, useRef } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ImagePlus, Video, X, Loader2 } from "lucide-react"
import { usePiAuth } from "@/contexts/pi-auth-context"
import { useFeed } from "@/contexts/feed-context"
import { validateImageFile, validateVideoFile, compressImage, extractHashtags, formatFileSize } from "@/lib/media-utils"
import { useToast } from "@/hooks/use-toast"
import { uploadToCloudinary } from "@/lib/cloudinary"

interface MediaPreview {
  type: "image" | "video"
  url: string
  file: File
}

export function CreatePost() {
  const { userProfile } = usePiAuth()
  const { addPost } = useFeed()
  const { toast } = useToast()
  const username = userProfile?.username || "Pioneer"

  const [content, setContent] = useState("")
  const [isExpanded, setIsExpanded] = useState(false)
  const [media, setMedia] = useState<MediaPreview[]>([])
  const [isUploading, setIsUploading] = useState(false)

  const imageInputRef = useRef<HTMLInputElement>(null)
  const videoInputRef = useRef<HTMLInputElement>(null)

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const validation = validateImageFile(file)
    if (!validation.valid) {
      toast({
        title: "Invalid Image",
        description: validation.error,
        variant: "destructive",
      })
      return
    }

    setIsUploading(true)

    try {
      const compressedUrl = await compressImage(file)

      setMedia([
        ...media,
        {
          type: "image",
          url: compressedUrl,
          file,
        },
      ])

      toast({
        title: "Image Added",
        description: `${file.name} (${formatFileSize(file.size)})`,
      })

    } catch (error) {
      toast({
        title: "Upload Failed",
        description: "Failed to process image. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
      if (imageInputRef.current) {
        imageInputRef.current.value = ""
      }
    }
  } // ✅ FIXED: Missing closing brace added here

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const validation = validateVideoFile(file)
    if (!validation.valid) {
      toast({
        title: "Invalid Video",
        description: validation.error,
        variant: "destructive",
      })
      return
    }

    const videoUrl = URL.createObjectURL(file)
    setMedia([...media, { type: "video", url: videoUrl, file }])
    toast({
      title: "Video Added",
      description: `${file.name} (${formatFileSize(file.size)})`,
    })

    if (videoInputRef.current) videoInputRef.current.value = ""
  }

  const removeMedia = (index: number) => {
    const newMedia = media.filter((_, i) => i !== index)
    URL.revokeObjectURL(media[index].url)
    setMedia(newMedia)
  }

  const handlePost = async () => {
    if (isUploading) return

    setIsUploading(true)

    try { // ✅ FIXED: Combined into a single valid try-catch block
      let mediaUrl = ""
      let mediaType: "image" | "video" = "image"
      let cloudinaryPublicId = ""

      if (media.length > 0) {
        const uploadedMedia = await uploadToCloudinary(media[0].file, "posts")
        mediaUrl = uploadedMedia.secureUrl
        mediaType = uploadedMedia.mediaType
        cloudinaryPublicId = uploadedMedia.publicId
      }

      if (!content.trim() && media.length === 0) {
        toast({
          title: "Empty Post",
          description: "Please add some content or media to your post.",
          variant: "destructive",
        })
        setIsUploading(false)
        return
      }

      const hashtags = extractHashtags(content)

      await addPost({
        username,
        userId: userProfile?.piUid,
        avatar: username[0]?.toUpperCase() || "P",
        authorPhotoURL: userProfile?.photoURL,
        caption: content,
        content,
        mediaUrl,
        imageUrl: mediaUrl,
        mediaType,
        cloudinaryPublicId,
        likes: 0,
        comments: 0,
        shares: 0,
        isLiked: false,
        piUid: userProfile?.piUid,
        createdAt: new Date().toISOString(),
        moderationFlag: "approved",
        hashtags: hashtags.length > 0 ? hashtags : undefined,
        media:
          media.length > 0
              ? media.map((m) => ({
                type: m.type,
                url: mediaUrl || m.url,
              }))
            : undefined,
      })

      // Clean up and reset
      media.forEach((m) => URL.revokeObjectURL(m.url))
      setContent("")
      setMedia([])
      setIsExpanded(false)

      toast({
        title: "Post Created",
        description: "Your post has been published successfully!",
      })

    } catch (error) {
      console.error("[v0] Failed to create post:", error)
      toast({
        title: "Post Failed",
        description: "Failed to publish post. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  const handleCancel = () => {
    media.forEach((m) => URL.revokeObjectURL(m.url))
    setContent("")
    setMedia([])
    setIsExpanded(false)
  }

  return (
    <div className="flex gap-3">
      <Avatar className="w-10 h-10 shrink-0">
        {userProfile?.photoURL && <AvatarImage src={userProfile.photoURL} alt={username} />}
        <AvatarFallback className="bg-primary text-primary-foreground">
          {username[0]?.toUpperCase() || "P"}
        </AvatarFallback>
      </Avatar>

      <div className="flex-1 min-w-0">
        <Textarea
          placeholder="What's on your mind? Add #hashtags..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onFocus={() => setIsExpanded(true)}
          className="min-h-[60px] max-h-[200px] resize-none border-0 bg-transparent p-0 focus-visible:ring-0 text-base"
          aria-label="Create post"
        />

        {media.length > 0 && (
          <div className="mt-3 grid grid-cols-2 gap-2">
            {media.map((item, index) => (
              <div key={index} className="relative rounded-lg overflow-hidden bg-muted aspect-square">
                {item.type === "image" ? (
                  <img
                    src={item.url || "/placeholder.svg"}
                    alt="Upload preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <video src={item.url} className="w-full h-full object-cover" controls />
                )}
                <Button
                  size="icon"
                  variant="destructive"
                  className="absolute top-2 right-2 h-6 w-6 rounded-full"
                  onClick={() => removeMedia(index)}
                  aria-label="Remove media"
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
            ))}
          </div>
        )}

        {isExpanded && ( // ✅ FIXED: Cleaned up messy JSX tags at the end of the file
          <div className="mt-3 flex items-center justify-between gap-2">
            <div className="flex gap-1">
              <Button
                size="sm"
                variant="ghost"
                className="h-9 w-9 p-0 touch-manipulation"
                onClick={() => imageInputRef.current?.click()}
                disabled={isUploading || media.length >= 4}
                aria-label="Add image"
              >
                {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ImagePlus className="w-4 h-4" />}
              </Button>
              <input
                ref={imageInputRef}
                type="file"
                accept="image/jpeg,image/png,image/gif,image/webp"
                onChange={handleImageUpload}
                className="hidden"
              />

              <Button
                size="sm"
                variant="ghost"
                className="h-9 w-9 p-0 touch-manipulation"
                onClick={() => videoInputRef.current?.click()}
                disabled={media.length >= 4}
                aria-label="Add video"
              >
                <Video className="w-4 h-4" />
              </Button>
              <input
                ref={videoInputRef}
                type="file"
                accept="video/mp4,video/webm,video/quicktime"
                onChange={handleVideoUpload}
                className="hidden"
              />
            </div>
            
            <div className="flex gap-2">
              <Button size="sm" variant="ghost" onClick={handleCancel} className="touch-manipulation">
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handlePost}
                disabled={isUploading || (!content.trim() && media.length === 0)}
                className="touch-manipulation"
              >
                {isUploading ? "Posting..." : "Post"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
