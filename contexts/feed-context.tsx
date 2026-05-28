"use client"

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react"
import type { Post, PostComment } from "@/lib/types"
import { usePiAuth } from "@/contexts/pi-auth-context"
import {
  createComment,
  createPost,
  sharePost,
  subscribeToPosts,
  togglePostLike,
} from "@/lib/firebase-social-service"

interface FeedContextType {
  posts: Post[]
  isLoading: boolean
  error: string | null
  addPost: (post: Omit<Post, "id" | "timeAgo">) => Promise<void>
  likePost: (postId: string, shouldLike: boolean) => Promise<void>
  addComment: (postId: string, text: string) => Promise<void>
  sharePostById: (postId: string) => Promise<void>
  refreshFeed: () => void
}

const FeedContext = createContext<FeedContextType | undefined>(undefined)

export function FeedProvider({ children }: { children: ReactNode }) {
  const { userProfile } = usePiAuth()
  const [posts, setPosts] = useState<Post[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    setIsLoading(true)
    setError(null)

    try {
      const { unsubscribe } = subscribeToPosts(
        userProfile?.piUid,
        (nextPosts) => {
          setPosts(nextPosts)
          setIsLoading(false)
        },
        (feedError) => {
          console.error("[socialhub] Failed to subscribe to posts:", feedError)
          setError("Could not load the public feed. Please try again.")
          setIsLoading(false)
        },
      )

      return unsubscribe
    } catch (feedError) {
      console.error("[socialhub] Failed to start feed subscription:", feedError)
      setError(feedError instanceof Error ? feedError.message : "Could not load the public feed.")
      setIsLoading(false)
    }
  }, [userProfile?.piUid, refreshKey])

  const addPost = useCallback(
    async (post: Omit<Post, "id" | "timeAgo">) => {
      await createPost({
        username: post.username,
        avatar: post.avatar,
        authorPhotoURL: userProfile?.photoURL,
        userId: post.userId || userProfile?.piUid,
        caption: post.caption || post.content,
        content: post.content,
        mediaUrl: post.mediaUrl || post.imageUrl,
        imageUrl: post.mediaUrl || post.imageUrl,
        mediaType: post.mediaType,
        cloudinaryPublicId: post.cloudinaryPublicId,
        media: post.media,
        hashtags: post.hashtags,
        piUid: post.piUid || userProfile?.piUid,
        createdAt: post.createdAt,
        moderationFlag: post.moderationFlag,
        isEdited: post.isEdited,
      })
    },
    [userProfile?.photoURL, userProfile?.piUid],
  )

  const likePost = useCallback(
    async (postId: string, shouldLike: boolean) => {
      if (!userProfile?.piUid) {
        throw new Error("You must be signed in to like posts.")
      }

      await togglePostLike(postId, userProfile.piUid, shouldLike)
    },
    [userProfile?.piUid],
  )

  const addComment = useCallback(
    async (postId: string, text: string) => {
      if (!userProfile?.piUid) {
        throw new Error("You must be signed in to comment.")
      }

      const comment: Omit<PostComment, "id" | "postId" | "createdAt"> = {
        piUid: userProfile.piUid,
        username: userProfile.username,
        avatar: userProfile.avatar,
        authorPhotoURL: userProfile.photoURL,
        text,
      }

      await createComment(postId, comment)
    },
    [userProfile],
  )

  const sharePostById = useCallback(async (postId: string) => {
    await sharePost(postId)
  }, [])

  const refreshFeed = useCallback(() => {
    setRefreshKey((key) => key + 1)
  }, [])

  const value = useMemo(
    () => ({
      posts,
      isLoading,
      error,
      addPost,
      likePost,
      addComment,
      sharePostById,
      refreshFeed,
    }),
    [posts, isLoading, error, addPost, likePost, addComment, sharePostById, refreshFeed],
  )

  return <FeedContext.Provider value={value}>{children}</FeedContext.Provider>
}

export function useFeed() {
  const context = useContext(FeedContext)
  if (context === undefined) {
    return {
      posts: [],
      isLoading: false,
      error: "FeedContext not available",
      addPost: async () => console.warn("[socialhub] FeedContext not available"),
      likePost: async () => console.warn("[socialhub] FeedContext not available"),
      addComment: async () => console.warn("[socialhub] FeedContext not available"),
      sharePostById: async () => console.warn("[socialhub] FeedContext not available"),
      refreshFeed: () => console.warn("[socialhub] FeedContext not available"),
    }
  }
  return context
}
