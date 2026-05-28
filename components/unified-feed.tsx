"use client"

import { PostCard } from "@/components/post-card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useFeed } from "@/contexts/feed-context"
import { useToast } from "@/hooks/use-toast"

function FeedSkeleton() {
  return (
    <div className="divide-y divide-border">
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className="p-5">
          <div className="flex gap-3">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="flex-1 space-y-3">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-36 w-full rounded-xl" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export function UnifiedFeed() {
  const { posts, isLoading, error, likePost, addComment, sharePostById, refreshFeed } = useFeed()
  const { toast } = useToast()

  const handleLike = async (postId: string, shouldLike: boolean) => {
    try {
      await likePost(postId, shouldLike)
    } catch (likeError) {
      console.error("[socialhub] Like failed:", likeError)
      toast({
        title: "Like failed",
        description: likeError instanceof Error ? likeError.message : "Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleShare = async (postId: string) => {
    try {
      await sharePostById(postId)
    } catch (shareError) {
      console.error("[socialhub] Share count failed:", shareError)
    }
  }

  if (isLoading) return <FeedSkeleton />

  if (error) {
    return (
      <div className="px-4 py-10 text-center">
        <p className="text-sm text-muted-foreground">{error}</p>
        <Button className="mt-4" variant="outline" onClick={refreshFeed}>
          Try Again
        </Button>
      </div>
    )
  }

  if (posts.length === 0) {
    return (
      <div className="px-4 py-12 text-center">
        <p className="text-sm text-muted-foreground">No public posts yet. Be the first to share something.</p>
      </div>
    )
  }

  return (
    <div className="divide-y divide-border">
      {posts.map((post) => (
        <PostCard
          key={post.id}
          {...post}
          onLike={() => handleLike(post.id, !post.isLiked)}
          onComment={() => undefined}
          onAddComment={(text) => addComment(post.id, text)}
          onShare={() => handleShare(post.id)}
        />
      ))}
    </div>
  )
}
