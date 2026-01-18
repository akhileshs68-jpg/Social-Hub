"use client"

import { useEffect, useRef, useState } from "react"
import { Heart, MessageCircle, Share2, Volume2, VolumeX, Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import type { Reel } from "@/lib/types"

interface ReelCardProps {
  reel: Reel
  isActive: boolean
  onLike: (reelId: string) => void
  onComment: (reelId: string) => void
  onShare: (reelId: string) => void
  onFollow: (piUid: string) => void
}

export function ReelCard({ reel, isActive, onLike, onComment, onShare, onFollow }: ReelCardProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isMuted, setIsMuted] = useState(true)
  const [isPlaying, setIsPlaying] = useState(false)
  const observerRef = useRef<IntersectionObserver | null>(null)

  // Auto-play when reel is in view
  useEffect(() => {
    if (!videoRef.current) return

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            videoRef.current?.play()
            setIsPlaying(true)
          } else {
            videoRef.current?.pause()
            setIsPlaying(false)
          }
        })
      },
      { threshold: 0.7 }, // Play when 70% visible
    )

    observerRef.current.observe(videoRef.current)

    return () => {
      observerRef.current?.disconnect()
    }
  }, [])

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

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

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num.toString()
  }

  return (
    <div className="h-[calc(100vh-8rem)] snap-start relative bg-black">
      {/* Video */}
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
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 pointer-events-none" />

      {/* Top bar with creator info */}
      <div className="absolute top-4 left-4 right-4 flex items-center gap-3 z-10">
        <Avatar className="w-10 h-10 border-2 border-white">
          <AvatarFallback className="bg-primary text-primary-foreground">{reel.creator.avatar}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <p className="text-white font-semibold text-sm">{reel.creator.username}</p>
        </div>
        {!reel.creator.isFollowing && (
          <Button
            size="sm"
            className="bg-primary hover:bg-primary/90 text-primary-foreground h-8 px-4"
            onClick={() => onFollow(reel.creator.piUid)}
          >
            Follow
          </Button>
        )}
      </div>

      {/* Play/Pause indicator */}
      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="bg-black/50 rounded-full p-4">
            <Play className="w-12 h-12 text-white" />
          </div>
        </div>
      )}

      {/* Bottom caption */}
      <div className="absolute bottom-20 left-4 right-20 z-10">
        <p className="text-white text-sm leading-relaxed mb-2">{reel.caption}</p>
        <div className="flex items-center gap-2 text-xs text-white/80">
          <span>{formatNumber(reel.views)} views</span>
          <span>•</span>
          <span>
            {new Date(reel.createdAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })}
          </span>
        </div>
      </div>

      {/* Right side actions */}
      <div className="absolute bottom-20 right-4 flex flex-col gap-6 z-10">
        {/* Like */}
        <button
          onClick={() => onLike(reel.id)}
          className="flex flex-col items-center gap-1 touch-manipulation"
          aria-label={reel.isLiked ? "Unlike" : "Like"}
        >
          <div
            className={cn(
              "w-12 h-12 rounded-full flex items-center justify-center transition-all",
              reel.isLiked ? "bg-red-500" : "bg-white/20 backdrop-blur-sm",
            )}
          >
            <Heart className={cn("w-6 h-6 transition-all", reel.isLiked ? "fill-white text-white" : "text-white")} />
          </div>
          <span className="text-white text-xs font-medium">{formatNumber(reel.likes)}</span>
        </button>

        {/* Comment */}
        <button
          onClick={() => onComment(reel.id)}
          className="flex flex-col items-center gap-1 touch-manipulation"
          aria-label="Comment"
        >
          <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <MessageCircle className="w-6 h-6 text-white" />
          </div>
          <span className="text-white text-xs font-medium">{formatNumber(reel.comments)}</span>
        </button>

        {/* Share */}
        <button
          onClick={() => onShare(reel.id)}
          className="flex flex-col items-center gap-1 touch-manipulation"
          aria-label="Share"
        >
          <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <Share2 className="w-6 h-6 text-white" />
          </div>
          <span className="text-white text-xs font-medium">{formatNumber(reel.shares)}</span>
        </button>

        {/* Mute/Unmute */}
        <button
          onClick={toggleMute}
          className="flex flex-col items-center gap-1 touch-manipulation"
          aria-label={isMuted ? "Unmute" : "Mute"}
        >
          <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
            {isMuted ? <VolumeX className="w-6 h-6 text-white" /> : <Volume2 className="w-6 h-6 text-white" />}
          </div>
        </button>
      </div>
    </div>
  )
}
