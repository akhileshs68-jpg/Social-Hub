<<<<<<< HEAD
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
=======
"use client";

import { useState } from "react";

import {
  Bell,
  MessageCircle,
  Search,
  Plus,
  Image,
  Video,
  FileText,
  CircleDashed,
} from "lucide-react";

export default function Header() {

  const [open, setOpen] =
    useState(false);

  return (

    <header
      className="
        sticky
        top-0
        z-50
        backdrop-blur-2xl
        bg-black/40
        border-b
        border-white/10
      "
    >

      <div
        className="
          max-w-[520px]
          mx-auto
          px-4
          py-4
          flex
          items-center
          justify-between
        "
      >

        {/* LOGO */}
        <h1
          className="
            text-[26px]
            font-extrabold
            tracking-tight
            bg-gradient-to-r
            from-pink-500
            via-violet-500
            to-blue-500
            bg-clip-text
            text-transparent
          "
        >
          Pi Social Hub
        </h1>

        {/* RIGHT SIDE */}
        <div
          className="
            flex
            items-center
            gap-3
            relative
          "
        >

          {/* SEARCH */}
          <button
            className="
              w-11
              h-11
              rounded-2xl
              bg-white/5
              border
              border-white/10
              flex
              items-center
              justify-center
              hover:bg-white/10
              transition
              shadow-lg
            "
          >
            <Search size={19} />
          </button>

          {/* NOTIFICATION */}
          <button
            className="
              w-11
              h-11
              rounded-2xl
              bg-white/5
              border
              border-white/10
              flex
              items-center
              justify-center
              hover:bg-white/10
              transition
              shadow-lg
            "
          >
            <Bell size={19} />
          </button>

          {/* CHAT */}
          <button
            className="
              w-11
              h-11
              rounded-2xl
              bg-white/5
              border
              border-white/10
              flex
              items-center
              justify-center
              hover:bg-white/10
              transition
              shadow-lg
            "
          >
            <MessageCircle size={19} />
          </button>

          {/* PLUS BUTTON */}
          <button

            onClick={() =>
              setOpen(!open)
            }

            className="
              w-12
              h-12
              rounded-2xl
              bg-gradient-to-r
              from-pink-500
              via-violet-500
              to-blue-500
              flex
              items-center
              justify-center
              shadow-[0_0_30px_rgba(168,85,247,0.5)]
              hover:scale-105
              transition
            "
          >

            <Plus size={24} />

          </button>

          {/* POPUP MENU */}
          {open && (

            <div
              className="
                absolute
                top-16
                right-0
                w-60
                rounded-[30px]
                p-3
                bg-[#0f0f14]/95
                backdrop-blur-2xl
                border
                border-white/10
                shadow-2xl
                space-y-2
              "
            >

              {/* STORY */}
              <button
                className="
                  w-full
                  flex
                  items-center
                  gap-4
                  p-4
                  rounded-2xl
                  hover:bg-white/10
                  transition
                "
              >

                <div
                  className="
                    w-10
                    h-10
                    rounded-xl
                    bg-pink-500/20
                    flex
                    items-center
                    justify-center
                  "
                >
                  <CircleDashed size={18} />
                </div>

                <span>
                  Add Story
                </span>

              </button>

              {/* PHOTO */}
              <button
                className="
                  w-full
                  flex
                  items-center
                  gap-4
                  p-4
                  rounded-2xl
                  hover:bg-white/10
                  transition
                "
              >

                <div
                  className="
                    w-10
                    h-10
                    rounded-xl
                    bg-blue-500/20
                    flex
                    items-center
                    justify-center
                  "
                >
                  <Image size={18} />
                </div>

                <span>
                  Upload Photo
                </span>

              </button>

              {/* VIDEO */}
              <button
                className="
                  w-full
                  flex
                  items-center
                  gap-4
                  p-4
                  rounded-2xl
                  hover:bg-white/10
                  transition
                "
              >

                <div
                  className="
                    w-10
                    h-10
                    rounded-xl
                    bg-violet-500/20
                    flex
                    items-center
                    justify-center
                  "
                >
                  <Video size={18} />
                </div>

                <span>
                  Upload Video
                </span>

              </button>

              {/* POST */}
              <button
                className="
                  w-full
                  flex
                  items-center
                  gap-4
                  p-4
                  rounded-2xl
                  hover:bg-white/10
                  transition
                "
              >

                <div
                  className="
                    w-10
                    h-10
                    rounded-xl
                    bg-green-500/20
                    flex
                    items-center
                    justify-center
                  "
                >
                  <FileText size={18} />
                </div>

                <span>
                  Create Post
                </span>

              </button>

            </div>

          )}

        </div>

      </div>

    </header>

  );
}
>>>>>>> c07617a5128ffd992b542a41c1dea574864a3046
