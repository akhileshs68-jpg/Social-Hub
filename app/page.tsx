"use client"

import Header from "../components/header"
import Feed from "../components/feed"
import CreatePost from "../components/create-post"
import BottomNav from "../components/bottom-nav"

export default function HomePage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(to bottom, black, darkblue)",
        color: "white",
        paddingBottom: "100px",
      }}
    >
      <Header />

      <div
        style={{
          maxWidth: "700px",
          margin: "0 auto",
          padding: "20px",
        }}
      >
        <CreatePost />

        <Feed />
      </div>

      <BottomNav />
    </div>
  )
}