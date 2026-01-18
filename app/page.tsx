"use client"

import { useState } from "react"
import { usePiAuth } from "@/contexts/pi-auth-context"
import { Header } from "@/components/header"
import { BottomNav } from "@/components/bottom-nav"
import { HomeView } from "@/components/views/home-view"
import { ExploreView } from "@/components/views/explore-view"
import { ProfileView } from "@/components/views/profile-view"
import { ReelsView } from "@/components/views/reels-view"
import { MessagesView } from "@/components/views/messages-view"
import { PremiumView } from "@/components/views/premium-view"

type Tab = "home" | "reels" | "explore" | "messages" | "profile" | "premium"

export default function HomePage() {
  const { userData } = usePiAuth()
  const [activeTab, setActiveTab] = useState<Tab>("home")

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-16 pb-20">
        {activeTab === "home" && <HomeView />}
        {activeTab === "reels" && <ReelsView />}
        {activeTab === "explore" && <ExploreView />}
        {activeTab === "messages" && <MessagesView />}
        {activeTab === "profile" && <ProfileView />}
        {activeTab === "premium" && <PremiumView />}
      </main>

      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  )
}
