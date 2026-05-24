"use client"

import Header from "../components/header"
import Feed from "../components/feed"
import CreatePost from "../components/create-post"
import BottomNav from "../components/bottom-nav"
import Stories from "../components/stories"

export default function HomePage() {

  return (

    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(to bottom, black, darkblue)",
        color: "white",
        paddingBottom: "100px",
      }}
    >

      {/* HEADER */}
      <Header />

      {/* MAIN CONTENT */}
      <div
        style={{
          maxWidth: "700px",
          margin: "0 auto",
          padding: "20px",
        }}
      >

        {/* STORIES */}
        <Stories />

        {/* CREATE POST */}
        <CreatePost />

        {/* FEED */}
        <Feed />

      </div>

      {/* BOTTOM NAV */}
      <BottomNav />

    </div>

  )

}