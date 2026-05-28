"use client"

<<<<<<< HEAD
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
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-800 text-white">
      <Header />

      <main className="pt-24 pb-28 px-4 max-w-3xl mx-auto space-y-6">
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
=======
import Feed from "../components/feed"
import BottomNav from "../components/bottom-nav"
import CreatePost from "../components/create-post"
import Header from "../components/header"

export default function Home() {

  return (

    <main
      className="
        min-h-screen
        bg-[#020617]
        text-white
        flex
        flex-col
        items-center
        pb-28
      "
    >

      {/* HEADER */}
      <Header />

      {/* STORIES */}

      <div
        className="
          w-full
          max-w-[520px]
          flex
          gap-5
          overflow-x-auto
          px-4
          py-5
        "
      >

        {[
          "You",
          "Pi",
          "Tech",
          "Crypto"
        ].map((item, i) => (

          <div
            key={i}
            className="
              flex
              flex-col
              items-center
              text-white
            "
          >

            <img
              src={`https://i.pravatar.cc/150?img=${i + 10}`}
              className="
                w-16
                h-16
                rounded-full
                border-4
                border-pink-500
              "
            />

            <span
              className="
                text-sm
                mt-2
              "
            >
              {item}
            </span>

          </div>

        ))}

      </div>

      {/* CREATE POST */}

      <div
        className="
          w-full
          max-w-[520px]
          px-4
        "
      >

        <CreatePost />

      </div>

      {/* FEED */}

      <div
        className="
          w-full
          max-w-[520px]
          px-4
          mt-6
        "
      >

        <Feed />

      </div>

      {/* NAVBAR */}

      <BottomNav />

    </main>

  )

}
>>>>>>> c07617a5128ffd992b542a41c1dea574864a3046
