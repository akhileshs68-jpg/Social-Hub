"use client"

import { useState, useRef } from "react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Heart, MessageCircle, Share2, Bookmark, Play, Volume2, VolumeX } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Reel } from "@/lib/types"

interface ReelPreviewCardProps {
  reel: Reel
  onLike: () => void
  onSave: () => void
  onComment: () => void
  onShare: () => void
}

export function ReelPreviewCard({ reel, onLike, onSave, onComment, onShare }: ReelPreviewCardProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isMuted, setIsMuted] = useState(true)
  const [isPlaying, setIsPlaying] = useState(false)

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
        setIsPlaying(false)
      } else {
        videoRef.current.play()
        setIsPlaying(true)
      }
    }
  }

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num.toString()
  }

  return (
    <article className="p-4 hover:bg-muted/30 transition-colors">
      <div className="flex gap-3">
        <Avatar className="w-10 h-10 shrink-0">
          <AvatarFallback className="bg-primary text-primary-foreground">{reel.creator.avatar}</AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-sm">{reel.creator.username}</span>
            <span className="text-xs text-muted-foreground">
              {new Date(reel.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })}
            </span>
          </div>

          {/* Reel video preview */}
          <div className="mt-3 relative rounded-lg overflow-hidden bg-black aspect-[9/16] max-h-[500px]">
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              loop
              playsInline
              muted={isMuted}
              poster={reel.thumbnail}
              onClick={togglePlayPause}
            >
              <source src={reel.videoUrl} type="video/mp4" />
            </video>

            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

            {/* Play button overlay */}
            {!isPlaying && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="bg-black/50 rounded-full p-4">
                  <Play className="w-8 h-8 text-white" />
                </div>
              </div>
            )}

            {/* Bottom caption */}
            <div className="absolute bottom-3 left-3 right-3 z-10">
              <p className="text-white text-sm leading-relaxed line-clamp-2">{reel.caption}</p>
            </div>

            {/* Mute button */}
            <button
              onClick={toggleMute}
              className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center"
              aria-label={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-white" /> : <Volume2 className="w-4 h-4 text-white" />}
            </button>

            {/* Views counter */}
            <div className="absolute top-3 left-3 z-10 bg-black/50 backdrop-blur-sm rounded-full px-2 py-1">
              <span className="text-white text-xs font-medium">{formatNumber(reel.views)} views</span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="mt-3 flex items-center justify-between">
            <div className="flex items-center -ml-2">
              <Button
                size="sm"
                variant="ghost"
                className={cn("h-9 gap-2 hover:text-primary touch-manipulation", reel.isLiked && "text-primary")}
                onClick={onLike}
                aria-label={reel.isLiked ? "Unlike" : "Like"}
              >
                <Heart className={cn("w-4 h-4 transition-transform", reel.isLiked && "fill-primary scale-110")} />
                <span className="text-xs font-medium">{formatNumber(reel.likes)}</span>
              </Button>

              <Button
                size="sm"
                variant="ghost"
                className="h-9 gap-2 hover:text-primary touch-manipulation"
                onClick={onComment}
                aria-label="View comments"
              >
                <MessageCircle className="w-4 h-4" />
                <span className="text-xs font-medium">{formatNumber(reel.comments)}</span>
              </Button>

              <Button
                size="sm"
                variant="ghost"
                className="h-9 gap-2 hover:text-primary touch-manipulation"
                onClick={onShare}
                aria-label="Share reel"
              >
                <Share2 className="w-4 h-4" />
                <span className="text-xs font-medium">{formatNumber(reel.shares)}</span>
              </Button>
            </div>

            <Button
              size="sm"
              variant="ghost"
              className={cn("h-9 hover:text-primary touch-manipulation", reel.isSaved && "text-primary")}
              onClick={onSave}
              aria-label={reel.isSaved ? "Unsave" : "Save"}
            >
              <Bookmark className={cn("w-4 h-4 transition-transform", reel.isSaved && "fill-primary")} />
            </Button>
          </div>
        </div>
      </div>
    </article>
  )
}
