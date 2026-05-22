"use client"

import { PostCard } from "@/components/post-card"

export default function HomePage() {
  return (
    <main className="min-h-screen bg-black py-6">

      <PostCard
        id="1"
        username="Akhilesh"
        content="Welcome to Social Hub Pi 🚀"
        likes={12}
        comments={3}
        shares={1}
        media={[
          {
            type: "image",
            url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
          },
        ]}
      />

    </main>
  )
}