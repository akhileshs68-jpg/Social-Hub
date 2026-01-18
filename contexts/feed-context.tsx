"use client"

import { createContext, useContext, useState, useCallback, type ReactNode } from "react"
import type { Post } from "@/lib/types"

interface FeedContextType {
  addPost: (post: Omit<Post, "id" | "timeAgo">) => void
  refreshFeed: () => void
}

const FeedContext = createContext<FeedContextType | undefined>(undefined)

export function FeedProvider({ children }: { children: ReactNode }) {
  const [feedUpdateTrigger, setFeedUpdateTrigger] = useState(0)

  const addPost = useCallback((post: Omit<Post, "id" | "timeAgo">) => {
    // Create complete post object
    const newPost: Post = {
      ...post,
      id: `post-${Date.now()}-${Math.random().toString(36).substring(7)}`,
      timeAgo: "Just now",
    }

    // Store in localStorage for persistence across page reloads
    try {
      const existingPosts = localStorage.getItem("user_posts")
      const posts = existingPosts ? JSON.parse(existingPosts) : []
      posts.unshift(newPost)
      // Keep only last 50 user posts
      if (posts.length > 50) posts.pop()
      localStorage.setItem("user_posts", JSON.stringify(posts))

      // Trigger custom event for same-tab feed updates
      window.dispatchEvent(new Event("feedUpdate"))
    } catch (error) {
      console.error("[v0] Failed to save post to localStorage:", error)
      // Non-blocking: Continue even if localStorage fails
    }

    // Trigger feed refresh
    setFeedUpdateTrigger((prev) => prev + 1)
  }, [])

  const refreshFeed = useCallback(() => {
    setFeedUpdateTrigger((prev) => prev + 1)
  }, [])

  return <FeedContext.Provider value={{ addPost, refreshFeed }}>{children}</FeedContext.Provider>
}

export function useFeed() {
  const context = useContext(FeedContext)
  if (context === undefined) {
    // Return dummy functions if context is not available (non-blocking)
    return {
      addPost: () => console.warn("[v0] FeedContext not available"),
      refreshFeed: () => console.warn("[v0] FeedContext not available"),
    }
  }
  return context
}
