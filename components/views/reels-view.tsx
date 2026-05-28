"use client"

import { useState, useEffect } from "react"
import { ReelCard } from "@/components/reel-card"
import type { Reel } from "@/lib/types"

export function ReelsView() {
  const [reels, setReels] = useState<Reel[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    // Mock reels data - in production, fetch from API
    const mockReels: Reel[] = [
      {
        id: "1",
        videoUrl: "/placeholder.svg?height=800&width=450",
        thumbnail: "/placeholder.svg?height=800&width=450",
        creator: {
          username: "pitravel",
          avatar: "PT",
          piUid: "pi123",
          isFollowing: false,
        },
        caption: "Sunset vibes in Bali 🌅 #travel #sunset #paradise",
        hashtags: ["travel", "sunset", "paradise"],
        likes: 15420,
        comments: 342,
        shares: 89,
        views: 52340,
        isLiked: false,
        createdAt: "2024-01-15T10:00:00Z",
        duration: 15,
        moderationFlag: "approved",
      },
      {
        id: "2",
        videoUrl: "/placeholder.svg?height=800&width=450",
        thumbnail: "/placeholder.svg?height=800&width=450",
        creator: {
          username: "chefpi",
          avatar: "CP",
          piUid: "pi456",
          isFollowing: true,
        },
        caption: "Easy 5-minute pasta recipe! 🍝 #cooking #recipe #foodie",
        hashtags: ["cooking", "recipe", "foodie"],
        likes: 23100,
        comments: 567,
        shares: 234,
        views: 98760,
        isLiked: true,
        createdAt: "2024-01-15T09:30:00Z",
        duration: 30,
        moderationFlag: "approved",
      },
      {
        id: "3",
        videoUrl: "/placeholder.svg?height=800&width=450",
        thumbnail: "/placeholder.svg?height=800&width=450",
        creator: {
          username: "fitpi",
          avatar: "FP",
          piUid: "pi789",
          isFollowing: false,
        },
        caption: "10 min full body workout 💪 No equipment needed! #fitness #workout",
        hashtags: ["fitness", "workout"],
        likes: 18900,
        comments: 421,
        shares: 156,
        views: 67890,
        isLiked: false,
        createdAt: "2024-01-15T08:45:00Z",
        duration: 60,
        moderationFlag: "approved",
      },
    ]

    setReels(mockReels)
  }, [])

  const handleLike = (reelId: string) => {
    setReels((prev) =>
      prev.map((reel) =>
        reel.id === reelId
          ? {
              ...reel,
              isLiked: !reel.isLiked,
              likes: reel.isLiked ? reel.likes - 1 : reel.likes + 1,
            }
          : reel,
      ),
    )
  }

  const handleFollow = (piUid: string) => {
    setReels((prev) =>
      prev.map((reel) =>
        reel.creator.piUid === piUid
          ? {
              ...reel,
              creator: {
                ...reel.creator,
                isFollowing: !reel.creator.isFollowing,
              },
            }
          : reel,
      ),
    )
  }

  const handleComment = (reelId: string) => {
    // In production, open comment modal/sheet
    console.log("[v0] Opening comments for reel:", reelId)
  }

  const handleShare = (reelId: string) => {
    // In production, open share modal
    console.log("[v0] Sharing reel:", reelId)
  }

  if (reels.length === 0) {
    return (
      <div className="h-[calc(100vh-8rem)] flex items-center justify-center">
        <p className="text-muted-foreground">Loading reels...</p>
      </div>
    )
  }

  return (
    <div className="h-[calc(100vh-8rem)] overflow-y-scroll snap-y snap-mandatory scrollbar-hide">
      {reels.map((reel, index) => (
        <ReelCard
          key={reel.id}
          reel={reel}
          isActive={currentIndex === index}
          onLike={handleLike}
          onComment={handleComment}
          onShare={handleShare}
          onFollow={handleFollow}
        />
      ))}
    </div>
  )
}
