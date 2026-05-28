<<<<<<< HEAD
"use client"

import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { usePiAuth } from "@/contexts/pi-auth-context"
import { NotificationBell } from "@/components/notification-bell"
import { ThemeToggle } from "@/components/theme-toggle"

export function Header() {
  const { userProfile, isAuthenticated } = usePiAuth()

  return (
  <header className="fixed top-0 left-0 right-0 z-30 backdrop-blur-xl bg-slate-950/70 border-b border-white/10">
    <div className="max-w-2xl mx-auto px-4 py-3">
      <div className="flex items-center justify-between gap-4">

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-cyan-400 to-purple-500 flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-lg">π</span>
          </div>

          <h1 className="text-2xl font-extrabold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
            Social Hub Pi
          </h1>
        </div>

        <div className="flex-1 max-w-sm hidden sm:block">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />

            <Input
              placeholder="Search..."
              className="pl-10 rounded-full bg-slate-900/80 border border-white/10 text-white"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          {isAuthenticated && <NotificationBell />}

          {isAuthenticated && userProfile && (
            <Avatar className="w-10 h-10 ring-2 ring-cyan-400/40">
              <AvatarFallback className="bg-gradient-to-r from-cyan-500 to-purple-500 text-white">
                {(userProfile.displayName || userProfile.username)?.charAt(0).toUpperCase() || "P"}
              </AvatarFallback>
            </Avatar>
          )}
        </div>

      </div>
    </div>
  </header>
  )
}
=======
"use client";

import { useRef, useState } from "react";

import {
  Bell,
  MessageCircle,
  Search,
  Plus,
} from "lucide-react";

export default function Header() {

  const fileInputRef =
    useRef<HTMLInputElement>(null);

  const [stories] = useState([
    {
      id: 1,
      name: "You",
      image:
        "https://i.pravatar.cc/150?img=1",
    },
    {
      id: 2,
      name: "Pi",
      image:
        "https://i.pravatar.cc/150?img=2",
    },
    {
      id: 3,
      name: "Tech",
      image:
        "https://i.pravatar.cc/150?img=3",
    },
    {
      id: 4,
      name: "Crypto",
      image:
        "https://i.pravatar.cc/150?img=4",
    },
    {
      id: 5,
      name: "News",
      image:
        "https://i.pravatar.cc/150?img=5",
    },
  ]);

  return (

    <header
      className="
        sticky
        top-0
        z-50
        px-4
        pt-4
      "
    >

      <div
        className="
          max-w-[520px]
          mx-auto
          rounded-[34px]
          border
          border-white/10
          bg-[#0B1020]/80
          backdrop-blur-2xl
          shadow-2xl
          overflow-hidden
        "
      >

        {/* TOP HEADER */}
        <div
          className="
            px-5
            pt-5
            pb-2
            flex
            items-center
            justify-between
          "
        >

          {/* LEFT */}
          <div>

            <h1
              className="
                text-[24px]
                font-black
                tracking-tight
                bg-gradient-to-r
                from-pink-500
                via-violet-500
                to-blue-500
                bg-clip-text
                text-transparent
              "
            >
              Pi Social Hub
            </h1>

            <p
              className="
                text-[11px]
                text-gray-400
                mt-[2px]
              "
            >
              Connect with Pioneers
            </p>

          </div>

          {/* RIGHT ICONS */}
          <div
            className="
              flex
              items-center
              gap-2
            "
          >

            {/* SEARCH */}
            <button
              className="
                w-10
                h-10
                rounded-2xl
                bg-gradient-to-br
                from-pink-500/20
                to-violet-500/20
                border
                border-pink-500/20
                flex
                items-center
                justify-center
                shadow-lg
              "
            >

              <Search
                size={18}
                className="
                  text-pink-400
                "
              />

            </button>

            {/* NOTIFICATION */}
            <button
              className="
                w-10
                h-10
                rounded-2xl
                bg-gradient-to-br
                from-cyan-500/20
                to-blue-500/20
                border
                border-cyan-500/20
                flex
                items-center
                justify-center
                shadow-lg
              "
            >

              <Bell
                size={18}
                className="
                  text-cyan-400
                "
              />

            </button>

            {/* CHAT */}
            <button
              className="
                w-10
                h-10
                rounded-2xl
                bg-gradient-to-br
                from-violet-500/20
                to-fuchsia-500/20
                border
                border-violet-500/20
                flex
                items-center
                justify-center
                shadow-lg
              "
            >

              <MessageCircle
                size={18}
                className="
                  text-violet-400
                "
              />

            </button>

          </div>

        </div>

        {/* STORIES */}
        <div
          className="
            flex
            items-start
            gap-4
            overflow-x-auto
            px-5
            pt-3
            pb-6
            scrollbar-hide
          "
        >

          {/* ADD STORY */}
          <div
            className="
              min-w-[78px]
              flex
              flex-col
              items-center
            "
          >

            <button

              onClick={() =>
                fileInputRef.current?.click()
              }

              className="
                w-[74px]
                h-[74px]
                rounded-full
                bg-gradient-to-r
                from-pink-500
                via-violet-500
                to-blue-500
                p-[3px]
                shadow-[0_0_25px_rgba(168,85,247,0.4)]
              "
            >

              <div
                className="
                  w-full
                  h-full
                  rounded-full
                  bg-[#111827]
                  flex
                  items-center
                  justify-center
                "
              >

                <Plus
                  size={30}
                  className="
                    text-white
                  "
                />

              </div>

            </button>

            <p
              className="
                text-xs
                mt-2
                text-pink-400
                font-medium
              "
            >
              Add
            </p>

            <input
              ref={fileInputRef}
              type="file"
              hidden
            />

          </div>

          {/* STORY ITEMS */}
          {stories.map((story) => (

            <div
              key={story.id}
              className="
                min-w-[72px]
                flex
                flex-col
                items-center
              "
            >

              <div
                className="
                  w-[72px]
                  h-[72px]
                  rounded-full
                  p-[3px]
                  bg-gradient-to-r
                  from-pink-500
                  via-violet-500
                  to-blue-500
                "
              >

                <img
                  src={story.image}
                  alt=""
                  className="
                    w-full
                    h-full
                    rounded-full
                    object-cover
                    border-2
                    border-[#0B1020]
                  "
                />

              </div>

              <p
                className="
                  text-xs
                  mt-2
                  text-gray-300
                  font-medium
                  truncate
                  max-w-[70px]
                "
              >
                {story.name}
              </p>

            </div>

          ))}

        </div>

      </div>

    </header>

  );
}
>>>>>>> c07617a5128ffd992b542a41c1dea574864a3046
