"use client"

import { type FormEvent, useEffect, useMemo, useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Heart, MessageCircle, Share2, MoreHorizontal, Edit, Trash2, Flag, Bookmark } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import type { Post, PostComment } from "@/lib/types"
import { usePiAuth } from "@/contexts/pi-auth-context"
import { useToast } from "@/hooks/use-toast"
import { createComment, subscribeToPostComments } from "@/lib/firebase-social-service"

interface PostCardProps extends Post {
  onLike?: () => void
  onSave?: () => void
  onComment?: () => void
  onShare?: () => void
  onAddComment?: (text: string) => Promise<void>
}

const READ_MORE_LIMIT = 180

export function PostCard({
  id,
  username,
  avatar,
  authorPhotoURL,
  timeAgo,
  content,
  likes: initialLikes,
  comments,
  shares,
  isLiked: initialIsLiked,
  isSaved: initialIsSaved,
  imageUrl,
  mediaType,
  media,
  hashtags,
  piUid,
  isEdited,
  onLike,
  onSave,
  onComment,
  onShare,
  onAddComment,
}: PostCardProps) {
  const { userProfile } = usePiAuth()
  const { toast } = useToast()
  const [isLiked, setIsLiked] = useState(initialIsLiked)
  const [likes, setLikes] = useState(initialLikes)
  const [commentCount, setCommentCount] = useState(comments)
  const [shareCount, setShareCount] = useState(shares)
  const [isSaved, setIsSaved] = useState(initialIsSaved || false)
  const [commentsOpen, setCommentsOpen] = useState(false)
  const [commentText, setCommentText] = useState("")
  const [postComments, setPostComments] = useState<PostComment[]>([])
  const [commentsLoading, setCommentsLoading] = useState(false)
  const [submittingComment, setSubmittingComment] = useState(false)
  const [isContentExpanded, setIsContentExpanded] = useState(false)

  const isOwnPost = userProfile?.piUid === piUid
  const shouldTruncateContent = content.length > READ_MORE_LIMIT
  const visibleContent = useMemo(() => {
    if (!shouldTruncateContent || isContentExpanded) return content
    return `${content.slice(0, READ_MORE_LIMIT).trim()}...`
  }, [content, isContentExpanded, shouldTruncateContent])

  useEffect(() => {
    setIsLiked(initialIsLiked)
    setLikes(initialLikes)
  }, [initialIsLiked, initialLikes])

  useEffect(() => {
    setCommentCount(comments)
  }, [comments])

  useEffect(() => {
    setShareCount(shares)
  }, [shares])

  useEffect(() => {
    if (!commentsOpen) return

    setCommentsLoading(true)
    const { unsubscribe } = subscribeToPostComments(
      id,
      (nextComments) => {
        setPostComments(nextComments)
        setCommentCount(Math.max(comments, nextComments.length))
        setCommentsLoading(false)
      },
      (error) => {
        console.error("[socialhub] Failed to load comments:", error)
        setCommentsLoading(false)
        toast({
          title: "Comments failed to load",
          description: "Please try again.",
          variant: "destructive",
        })
      },
    )

    return unsubscribe
  }, [comments, commentsOpen, id, toast])

  const handleLike = () => {
    setIsLiked((liked) => !liked)
    setLikes((count) => (isLiked ? count - 1 : count + 1))

    if (onLike) {
      onLike()
    }
  }

  const handleSave = () => {
    setIsSaved((saved) => !saved)

    if (onSave) {
      onSave()
    } else {
      toast({
        title: isSaved ? "Removed from saved" : "Saved",
        description: isSaved ? "Post removed from your saved collection" : "Post saved to your collection",
      })
    }
  }

  const handleComment = () => {
    if (onComment) {
      onComment()
    }
    setCommentsOpen(true)
  }

  const handleAddComment = async (event: FormEvent) => {
    event.preventDefault()
    const text = commentText.trim()
    if (!text) return

    const optimisticComment: PostComment = {
      id: `optimistic-${Date.now()}`,
      postId: id,
      piUid: userProfile?.piUid || "local-user",
      username: userProfile?.username || "You",
      avatar: userProfile?.avatar || "Y",
      authorPhotoURL: userProfile?.photoURL,
      text,
      createdAt: new Date().toISOString(),
    }

    setSubmittingComment(true)
    setPostComments((currentComments) => [...currentComments, optimisticComment])
    setCommentCount((count) => count + 1)
    setCommentText("")

    try {
      if (onAddComment) {
        await onAddComment(text)
      } else if (userProfile?.piUid) {
        await createComment(id, {
          piUid: userProfile.piUid,
          username: userProfile.username,
          avatar: userProfile.avatar,
          authorPhotoURL: userProfile.photoURL,
          text,
        })
      }
    } catch (error) {
      console.error("[socialhub] Failed to add comment:", error)
      setPostComments((currentComments) => currentComments.filter((comment) => comment.id !== optimisticComment.id))
      setCommentCount((count) => Math.max(0, count - 1))
      setCommentText(text)
      toast({
        title: "Comment failed",
        description: "Please try again.",
        variant: "destructive",
      })
    } finally {
      setSubmittingComment(false)
    }
  }

  const handleShare = async () => {
    if (onShare) {
      onShare()
    }

    const shareUrl = typeof window !== "undefined" ? `${window.location.origin}/?post=${id}` : ""
    const shareData = {
      title: `${username}'s post`,
      text: content,
      url: shareUrl,
    }
    let usedNativeShare = false

    try {
      if (navigator.share) {
        await navigator.share(shareData)
        usedNativeShare = true
      } else if (navigator.clipboard && shareUrl) {
        await navigator.clipboard.writeText(shareUrl)
      }

      setShareCount((count) => count + 1)
      toast({
        title: "Post shared",
        description: usedNativeShare ? "Share sheet opened successfully." : "Post link copied to clipboard.",
      })
    } catch (error) {
      if ((error as Error).name === "AbortError") return

      toast({
        title: "Share failed",
        description: "Could not open sharing right now. Please try again.",
        variant: "destructive",
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
    <article className="bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-3xl p-5 shadow-xl hover:border-cyan-400/30 transition-all duration-300">
      <div className="flex gap-3">
        <Avatar className="w-10 h-10 shrink-0">
          {authorPhotoURL && <AvatarImage src={authorPhotoURL} alt={username} />}
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

          <p className="mt-2 text-sm leading-relaxed text-balance">
            {renderContentWithHashtags(visibleContent)}
            {shouldTruncateContent && (
              <button
                type="button"
                className="ml-1 font-medium text-primary hover:underline"
                onClick={() => setIsContentExpanded((expanded) => !expanded)}
              >
                {isContentExpanded ? "Show Less" : "See More"}
              </button>
            )}
          </p>

          {imageUrl && (
            <div className="mt-3 overflow-hidden rounded-xl border border-white/10">

              {mediaType === "video" ? (
                <video
                  src={imageUrl}
                  controls
                  className="w-full"
                />
              ) : (
                <img
                  src={imageUrl}
                  alt="Post"
                  className="w-full"
                />
              )}

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
                <span className="text-xs font-medium">{commentCount}</span>
              </Button>

              <Button
                size="sm"
                variant="ghost"
                className="h-9 gap-2 hover:text-primary touch-manipulation"
                onClick={handleShare}
                aria-label="Share post"
              >
                <Share2 className="w-4 h-4" />
                <span className="text-xs font-medium">{shareCount}</span>
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

      <Dialog open={commentsOpen} onOpenChange={setCommentsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Comments</DialogTitle>
          </DialogHeader>

          <div className="max-h-64 overflow-y-auto space-y-3 pr-1">
            {commentsLoading ? (
              <p className="text-sm text-muted-foreground">Loading comments...</p>
            ) : postComments.length > 0 ? (
              postComments.map((comment) => (
                <div key={comment.id} className="rounded-lg border border-border p-3">
                  <div className="flex items-start gap-2">
                    <Avatar className="h-8 w-8">
                      {comment.authorPhotoURL && <AvatarImage src={comment.authorPhotoURL} alt={comment.username} />}
                      <AvatarFallback>{comment.avatar}</AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="text-sm font-medium">{comment.username}</p>
                      <p className="mt-1 text-sm text-muted-foreground">{comment.text}</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No comments yet.</p>
            )}
          </div>

          <form onSubmit={handleAddComment} className="grid gap-3">
            <Textarea
              value={commentText}
              onChange={(event) => setCommentText(event.target.value)}
              placeholder="Write a comment"
              aria-label="Write a comment"
            />
            <DialogFooter>
              <Button type="submit" disabled={!commentText.trim() || submittingComment}>
                {submittingComment ? "Posting..." : "Post Comment"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </article>
  )
}
