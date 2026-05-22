"use client"

<<<<<<< HEAD
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
} from "lucide-react"

interface PostCardProps {
  id: string
  username: string
  content: string
  likes: number
  comments: number
  shares: number
  media?: Array<{
    type: "image" | "video"
    url: string
  }>
=======
import { useState } from "react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Heart, MessageCircle, Share2, MoreHorizontal, Edit, Trash2, Flag, Bookmark } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import type { Post } from "@/lib/types"
import { usePiAuth } from "@/contexts/pi-auth-context"
import { useToast } from "@/hooks/use-toast"

interface PostCardProps extends Post {
  onLike?: () => void
  onSave?: () => void
  onComment?: () => void
  onShare?: () => void
>>>>>>> 82bc3ca8b44839ba49ec0fc525fcb6c408caf7eb
}

export function PostCard({
  id,
  username,
<<<<<<< HEAD
  content,
  likes,
  comments,
  shares,
  media,
}: PostCardProps) {

  return (

    <div className="mx-3 mb-4 rounded-[28px] border border-white/10 bg-[#080808] backdrop-blur-xl shadow-[0_0_30px_rgba(0,0,0,0.45)] overflow-hidden transition-all duration-300 hover:border-[#F4B814]/30 p-4">

      <div className="flex items-center gap-3">

        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-cyan-700 text-white font-bold">
          {username[0]}
        </div>

        <div>

          <h3 className="text-sm font-semibold text-white">
            {username}
          </h3>

          <p className="text-xs text-neutral-500">
            1h ago
          </p>

        </div>

      </div>

      <p className="mt-4 text-[15px] leading-7 text-neutral-100 font-medium tracking-[0.2px]">
        {content}
      </p>

      {media && media.length > 0 && (

        <div className="mt-4 rounded-2xl overflow-hidden border border-white/10">

          {media[0].type === "image" ? (

            <img
              src={media[0].url}
              alt="post"
              className="w-full max-h-[500px] object-cover"
            />

          ) : (

            <video
              src={media[0].url}
              controls
              className="w-full max-h-[500px]"
            />

          )}

        </div>

      )}

      <div className="mt-5 border-t border-white/10 pt-3">

        <div className="flex items-center justify-between">

          <button
            onClick={() => {

              const currentLikes =
                Number(localStorage.getItem(`likes-${id}`) || 0) + 1

              localStorage.setItem(
                `likes-${id}`,
                currentLikes.toString()
              )

              window.location.reload()

            }}
            className="flex items-center gap-2 text-neutral-400 hover:text-[#F4B814]"
          >

            <Heart className="h-5 w-5" />

            <span className="text-xs">
              {localStorage.getItem(`likes-${id}`) || likes}
            </span>

          </button>

          <button className="flex items-center gap-2 text-neutral-400 hover:text-[#F4B814]">

            <MessageCircle className="h-5 w-5" />

            <span className="text-xs">

              {JSON.parse(
                localStorage.getItem(`comments-${id}`) || "[]"
              ).length || comments}

            </span>

          </button>

          <button
            onClick={() => {

              navigator.share?.({
                title: "SocialHub",
                text: content,
                url: window.location.href,
              })

            }}
            className="flex items-center gap-2 text-neutral-400 hover:text-[#F4B814]"
          >

            <Share2 className="h-5 w-5" />

            <span className="text-xs">
              {shares}
            </span>

          </button>

          <button className="text-neutral-400 hover:bg-white/5 hover:text-[#F4B814] rounded-xl px-2 py-2 transition-all">

            <Bookmark className="h-5 w-5" />

          </button>

        </div>

        <div className="mt-4">

          <input
            id={`comment-${id}`}
            placeholder="Write comment..."
            className="w-full rounded-2xl border border-white/10 bg-black/30 p-3 text-sm text-white outline-none"
          />

          <button
            onClick={() => {

              const input = document.getElementById(
                `comment-${id}`
              ) as HTMLInputElement

              if (!input.value) return

              const existingComments = JSON.parse(
                localStorage.getItem(`comments-${id}`) || "[]"
              )

              existingComments.push(input.value)

              localStorage.setItem(
                `comments-${id}`,
                JSON.stringify(existingComments)
              )

              window.location.reload()

            }}
            className="mt-3 rounded-2xl bg-[#F4B814] px-5 py-2 text-sm font-semibold text-black"
          >

            Add Comment

          </button>

          <div className="mt-4 space-y-2">

            {JSON.parse(
              localStorage.getItem(`comments-${id}`) || "[]"
            ).map((comment: string, index: number) => (

              <div
                key={index}
                className="rounded-xl bg-white/5 px-3 py-2 text-sm text-white"
              >

                💬 {comment}

              </div>

            ))}

          </div>

        </div>

      </div>

    </div>

  )
}
=======
  avatar,
  timeAgo,
  content,
  likes: initialLikes,
  comments,
  shares,
  isLiked: initialIsLiked,
  isSaved: initialIsSaved,
  imageUrl,
  media,
  hashtags,
  piUid,
  isEdited,
  onLike,
  onSave,
  onComment,
  onShare,
}: PostCardProps) {
  const { userProfile } = usePiAuth()
  const { toast } = useToast()
  const [isLiked, setIsLiked] = useState(initialIsLiked)
  const [likes, setLikes] = useState(initialLikes)
  const [isSaved, setIsSaved] = useState(initialIsSaved || false)

  const isOwnPost = userProfile?.piUid === piUid

  const handleLike = () => {
    if (onLike) {
      onLike()
    } else {
      setIsLiked(!isLiked)
      setLikes(isLiked ? likes - 1 : likes + 1)
    }
  }

  const handleSave = () => {
    if (onSave) {
      onSave()
    } else {
      setIsSaved(!isSaved)
      toast({
        title: isSaved ? "Removed from saved" : "Saved",
        description: isSaved ? "Post removed from your saved collection" : "Post saved to your collection",
      })
    }
  }

  const handleComment = () => {
    if (onComment) {
      onComment()
    } else {
      toast({
        title: "Comments",
        description: "Comment functionality will be implemented soon.",
      })
    }
  }

  const handleShare = () => {
    if (onShare) {
      onShare()
    } else {
      toast({
        title: "Share",
        description: "Share functionality will be implemented soon.",
      })
    }
  }

  const handleEdit = () => {
    toast({
      title: "Edit Post",
      description: "Edit functionality will open a dialog to modify the post.",
    })
  }

  const handleDelete = () => {
    toast({
      title: "Post Deleted",
      description: "Your post has been removed.",
    })
  }

  const handleFlag = () => {
    toast({
      title: "Post Reported",
      description: "Thank you for helping keep our community safe.",
    })
  }

  const renderContentWithHashtags = (text: string) => {
    const parts = text.split(/(#[\w]+)/g)
    return parts.map((part, index) => {
      if (part.startsWith("#")) {
        return (
          <span key={index} className="text-primary font-medium hover:underline cursor-pointer">
            {part}
          </span>
        )
      }
      return part
    })
  }

  return (
    <article className="p-4 hover:bg-muted/30 transition-colors active:bg-muted/40">
      <div className="flex gap-3">
        <Avatar className="w-10 h-10 shrink-0">
          <AvatarFallback className="bg-primary text-primary-foreground">{avatar}</AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <span className="font-semibold text-sm truncate">{username}</span>
              <span className="text-xs text-muted-foreground shrink-0">
                {timeAgo}
                {isEdited && " · Edited"}
              </span>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="icon" variant="ghost" className="h-8 w-8 shrink-0 -mr-2">
                  <MoreHorizontal className="w-4 h-4" />
                  <span className="sr-only">More options</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {isOwnPost ? (
                  <>
                    <DropdownMenuItem onClick={handleEdit}>
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Post
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleDelete} className="text-destructive">
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete Post
                    </DropdownMenuItem>
                  </>
                ) : (
                  <>
                    <DropdownMenuItem onClick={handleFlag}>
                      <Flag className="w-4 h-4 mr-2" />
                      Report Post
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <p className="mt-2 text-sm leading-relaxed text-balance">{renderContentWithHashtags(content)}</p>

          {imageUrl && (
            <div className="mt-3 rounded-lg overflow-hidden border">
              <img src={imageUrl || "/placeholder.svg"} alt="Post content" className="w-full object-cover max-h-96" />
            </div>
          )}

          {media && media.length > 0 && (
            <div
              className={cn("mt-3 gap-2 rounded-lg overflow-hidden", media.length === 1 ? "grid" : "grid grid-cols-2")}
            >
              {media.map((item, index) => (
                <div key={index} className="relative bg-muted">
                  {item.type === "image" ? (
                    <img
                      src={item.url || "/placeholder.svg"}
                      alt={`Post media ${index + 1}`}
                      className={cn("w-full object-cover", media.length === 1 ? "max-h-96" : "aspect-square")}
                    />
                  ) : (
                    <video
                      src={item.url}
                      controls
                      className={cn("w-full object-cover", media.length === 1 ? "max-h-96" : "aspect-square")}
                    />
                  )}
                </div>
              ))}
            </div>
          )}

          {hashtags && hashtags.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {hashtags.map((tag, index) => (
                <span key={index} className="text-xs text-primary font-medium">
                  #{tag}
                </span>
              ))}
            </div>
          )}

          <div className="mt-3 flex items-center justify-between">
            <div className="flex items-center -ml-2">
              <Button
                size="sm"
                variant="ghost"
                className={cn("h-9 gap-2 hover:text-primary touch-manipulation", isLiked && "text-primary")}
                onClick={handleLike}
                aria-label={isLiked ? "Unlike post" : "Like post"}
              >
                <Heart className={cn("w-4 h-4 transition-transform", isLiked && "fill-primary scale-110")} />
                <span className="text-xs font-medium">{likes}</span>
              </Button>

              <Button
                size="sm"
                variant="ghost"
                className="h-9 gap-2 hover:text-primary touch-manipulation"
                onClick={handleComment}
                aria-label="View comments"
              >
                <MessageCircle className="w-4 h-4" />
                <span className="text-xs font-medium">{comments}</span>
              </Button>

              <Button
                size="sm"
                variant="ghost"
                className="h-9 gap-2 hover:text-primary touch-manipulation"
                onClick={handleShare}
                aria-label="Share post"
              >
                <Share2 className="w-4 h-4" />
                <span className="text-xs font-medium">{shares}</span>
              </Button>
            </div>

            <Button
              size="sm"
              variant="ghost"
              className={cn("h-9 hover:text-primary touch-manipulation", isSaved && "text-primary")}
              onClick={handleSave}
              aria-label={isSaved ? "Unsave post" : "Save post"}
            >
              <Bookmark className={cn("w-4 h-4 transition-transform", isSaved && "fill-primary")} />
            </Button>
          </div>
        </div>
      </div>
    </article>
  )
}
>>>>>>> 82bc3ca8b44839ba49ec0fc525fcb6c408caf7eb
