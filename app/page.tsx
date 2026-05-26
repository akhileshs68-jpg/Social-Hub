"use client"

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