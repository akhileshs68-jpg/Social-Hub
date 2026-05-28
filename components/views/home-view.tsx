"use client"

import { CreatePost } from "@/components/create-post"
import { UnifiedFeed } from "@/components/unified-feed"
import { StoriesBar } from "@/components/stories-bar"

export function HomeView() {
  return (
    <div className="container mx-auto px-0 max-w-2xl">
      <StoriesBar />
      <div className="px-4 py-4 border-b border-border bg-card sticky top-16 z-10">
        <CreatePost />
      </div>
      <UnifiedFeed />
    </div>
  )
}
