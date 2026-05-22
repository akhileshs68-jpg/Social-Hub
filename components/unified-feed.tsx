"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { PostCard } from "@/components/post-card"
import { ReelPreviewCard } from "@/components/reel-preview-card"
import { Loader2 } from "lucide-react"
import type { FeedItem, Post, Reel } from "@/lib/types"
import { useToast } from "@/hooks/use-toast"

// Mock data generator
const generateMockFeedItems = (startIndex: number, count: number): FeedItem[] => {
  const items: FeedItem[] = []
  const now = Date.now()

  for (let i = 0; i < count; i++) {
    const index = startIndex + i
    const isReel = index % 5 === 3 // Every 5th item is a reel

    if (isReel) {
      const reel: Reel = {
        id: `reel-${index}`,
        videoUrl: `/placeholder.svg?height=720&width=405&query=vertical video ${index}`,
        thumbnail: `/placeholder.svg?height=720&width=405&query=reel thumbnail ${index}`,
        creator: {
          username: `creator${index}`,
          avatar: String.fromCharCode(65 + (index % 26)),
          piUid: `user${index}`,
          isFollowing: Math.random() > 0.5,
        },
        caption: `Amazing reel content #${index}! Check this out 🔥`,
        hashtags: ["viral", "trending", "pinetwork"],
        likes: Math.floor(Math.random() * 10000),
        comments: Math.floor(Math.random() * 500),
        shares: Math.floor(Math.random() * 100),
        views: Math.floor(Math.random() * 50000),
        isLiked: false,
        isSaved: false,
        createdAt: new Date(now - index * 3600000).toISOString(),
        duration: 15 + Math.floor(Math.random() * 45),
        moderationFlag: "approved",
      }
      items.push({
        id: `feed-reel-${index}`,
        type: "reel",
        data: reel,
        createdAt: reel.createdAt,
      })
    } else {
      const post: Post = {
        id: `post-${index}`,
        username: `user${index}`,
        avatar: String.fromCharCode(65 + (index % 26)),
        timeAgo: `${Math.floor(index / 2) + 1}h ago`,
        content: `Post content ${index}. This is a sample post in the unified feed! #PiNetwork #Social`,
        likes: Math.floor(Math.random() * 500),
        comments: Math.floor(Math.random() * 50),
        shares: Math.floor(Math.random() * 20),
        isLiked: false,
        isSaved: false,
        hashtags: ["PiNetwork", "Social"],
        piUid: `user${index}`,
        createdAt: new Date(now - index * 3600000).toISOString(),
        moderationFlag: "approved",
        ...(Math.random() > 0.5 && {
          imageUrl: `/placeholder.svg?height=400&width=600&query=post image ${index}`,
        }),
      }
      items.push({
        id: `feed-post-${index}`,
        type: "post",
        data: post,
        createdAt: post.createdAt,
      })
    }
  }

  return items
}

const loadUserPosts = (): Post[] => {
  try {
    const stored = localStorage.getItem("user_posts")
    return stored ? JSON.parse(stored) : []
  } catch (error) {
    console.error("[v0] Failed to load user posts:", error)
    return []
  }
}

export function UnifiedFeed() {
  const [feedItems, setFeedItems] = useState<FeedItem[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [page, setPage] = useState(0)
  const observerTarget = useRef<HTMLDivElement>(null)
  const { toast } = useToast()

  useEffect(() => {
    loadInitialFeed()
  }, [])

  useEffect(() => {
    const handleStorageChange = () => {
      loadInitialFeed()
    }

    window.addEventListener("storage", handleStorageChange)
    // Custom event for same-tab updates
    window.addEventListener("feedUpdate", handleStorageChange)

    return () => {
      window.removeEventListener("storage", handleStorageChange)
      window.removeEventListener("feedUpdate", handleStorageChange)
    }
  }, [])

  // Infinite scroll observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          loadMoreItems()
        }
      },
      { threshold: 0.1 },
    )

    if (observerTarget.current) {
      observer.observe(observerTarget.current)
    }

    return () => observer.disconnect()
  }, [hasMore, isLoading, page])

  const loadInitialFeed = useCallback(() => {
    setIsLoading(true)
    setPage(0)

    // Simulate API call
    setTimeout(() => {
      const userPosts = loadUserPosts()
      const userFeedItems: FeedItem[] = userPosts.map((post) => ({
        id: post.id,
        type: "post",
        data: post,
        createdAt: post.createdAt || new Date().toISOString(),
      }))

      const mockItems = generateMockFeedItems(0, 10)
      setFeedItems([...userFeedItems, ...mockItems])
      setPage(1)
      setIsLoading(false)
      setHasMore(true)
    }, 500)
  }, [])

  const loadMoreItems = useCallback(() => {
    if (isLoading) return

    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      const newItems = generateMockFeedItems(page * 10, 10)
      setFeedItems((prev) => [...prev, ...newItems])
      setPage((prev) => prev + 1)
      setIsLoading(false)

      // Simulate end of feed after 50 items
      if ((page + 1) * 10 >= 50) {
        setHasMore(false)
      }
    }, 1000)
  }, [page, isLoading])

  const handleLike = (itemId: string, itemType: "post" | "reel") => {
    setFeedItems((prev) =>
      prev.map((item) => {
        if (item.id === itemId) {
          const data = item.data as any
          return {
            ...item,
            data: {
              ...data,
              isLiked: !data.isLiked,
              likes: data.isLiked ? data.likes - 1 : data.likes + 1,
            },
          }
        }
        return item
      }),
    )
  }

  const handleSave = (itemId: string) => {
    setFeedItems((prev) =>
      prev.map((item) => {
        if (item.id === itemId) {
          const data = item.data as any
          const wasSaved = data.isSaved
          toast({
            title: wasSaved ? "Removed from saved" : "Saved",
            description: wasSaved ? "Item removed from your saved collection" : "Item saved to your collection",
          })
          return {
            ...item,
            data: {
              ...data,
              isSaved: !data.isSaved,
            },
          }
        }
        return item
      }),
    )
  }

  const handleComment = (itemId: string) => {
    toast({
      title: "Comments",
      description: "Comment functionality will be implemented soon.",
    })
  }

  const handleShare = (itemId: string) => {
    toast({
      title: "Share",
      description: "Share functionality will be implemented soon.",
    })
  }

  return (
    <div className="divide-y divide-border">
      {feedItems.map((item) => {
        if (item.type === "post") {
          return (
            <PostCard
              key={item.id}
              {...(item.data as Post)}
              onLike={() => handleLike(item.id, "post")}
              onSave={() => handleSave(item.id)}
              onComment={() => handleComment(item.id)}
              onShare={() => handleShare(item.id)}
            />
          )
        } else {
          return (
            <ReelPreviewCard
              key={item.id}
              reel={item.data as Reel}
              onLike={() => handleLike(item.id, "reel")}
              onSave={() => handleSave(item.id)}
              onComment={() => handleComment(item.id)}
              onShare={() => handleShare(item.id)}
            />
          )
        }
      })}

      {/* Loading indicator */}
      {isLoading && (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>
      )}

      {/* Intersection observer target */}
      {hasMore && <div ref={observerTarget} className="h-20" />}

      {/* End of feed message */}
      {!hasMore && <div className="text-center py-8 text-sm text-muted-foreground">You're all caught up! 🎉</div>}
    </div>
  )
}
