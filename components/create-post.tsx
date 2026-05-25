"use client";

import { useState } from "react";

import {
  Bell,
  MessageCircle,
  Search,
  Plus,
  Image,
  Video,
  FileText,
  CircleDashed,
} from "lucide-react";

export default function Header() {

  const [open, setOpen] =
    useState(false);

  return (

    <header
      className="
        sticky
        top-0
        z-50
        backdrop-blur-2xl
        bg-black/40
        border-b
        border-white/10
      "
    >

      <div
        className="
          max-w-[520px]
          mx-auto
          px-4
          py-4
          flex
          items-center
          justify-between
        "
      >

        {/* LOGO */}
        <h1
          className="
            text-[26px]
            font-extrabold
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

        {/* RIGHT SIDE */}
        <div
          className="
            flex
            items-center
            gap-3
            relative
          "
        >

          {/* SEARCH */}
          <button
            className="
              w-11
              h-11
              rounded-2xl
              bg-white/5
              border
              border-white/10
              flex
              items-center
              justify-center
              hover:bg-white/10
              transition
              shadow-lg
            "
          >
            <Search size={19} />
          </button>

          {/* NOTIFICATION */}
          <button
            className="
              w-11
              h-11
              rounded-2xl
              bg-white/5
              border
              border-white/10
              flex
              items-center
              justify-center
              hover:bg-white/10
              transition
              shadow-lg
            "
          >
            <Bell size={19} />
          </button>

          {/* CHAT */}
          <button
            className="
              w-11
              h-11
              rounded-2xl
              bg-white/5
              border
              border-white/10
              flex
              items-center
              justify-center
              hover:bg-white/10
              transition
              shadow-lg
            "
          >
            <MessageCircle size={19} />
          </button>

          {/* PLUS BUTTON */}
          <button

            onClick={() =>
              setOpen(!open)
            }

            className="
              w-12
              h-12
              rounded-2xl
              bg-gradient-to-r
              from-pink-500
              via-violet-500
              to-blue-500
              flex
              items-center
              justify-center
              shadow-[0_0_30px_rgba(168,85,247,0.5)]
              hover:scale-105
              transition
            "
          >

            <Plus size={24} />

          </button>

          {/* POPUP MENU */}
          {open && (

            <div
              className="
                absolute
                top-16
                right-0
                w-60
                rounded-[30px]
                p-3
                bg-[#0f0f14]/95
                backdrop-blur-2xl
                border
                border-white/10
                shadow-2xl
                space-y-2
              "
            >

              {/* STORY */}
              <button
                className="
                  w-full
                  flex
                  items-center
                  gap-4
                  p-4
                  rounded-2xl
                  hover:bg-white/10
                  transition
                "
              >

                <div
                  className="
                    w-10
                    h-10
                    rounded-xl
                    bg-pink-500/20
                    flex
                    items-center
                    justify-center
                  "
                >
                  <CircleDashed size={18} />
                </div>

                <span>
                  Add Story
                </span>

              </button>

              {/* PHOTO */}
              <button
                className="
                  w-full
                  flex
                  items-center
                  gap-4
                  p-4
                  rounded-2xl
                  hover:bg-white/10
                  transition
                "
              >

                <div
                  className="
                    w-10
                    h-10
                    rounded-xl
                    bg-blue-500/20
                    flex
                    items-center
                    justify-center
                  "
                >
                  <Image size={18} />
                </div>

                <span>
                  Upload Photo
                </span>

              </button>

              {/* VIDEO */}
              <button
                className="
                  w-full
                  flex
                  items-center
                  gap-4
                  p-4
                  rounded-2xl
                  hover:bg-white/10
                  transition
                "
              >

                <div
                  className="
                    w-10
                    h-10
                    rounded-xl
                    bg-violet-500/20
                    flex
                    items-center
                    justify-center
                  "
                >
                  <Video size={18} />
                </div>

                <span>
                  Upload Video
                </span>

              </button>

              {/* POST */}
              <button
                className="
                  w-full
                  flex
                  items-center
                  gap-4
                  p-4
                  rounded-2xl
                  hover:bg-white/10
                  transition
                "
              >

                <div
                  className="
                    w-10
                    h-10
                    rounded-xl
                    bg-green-500/20
                    flex
                    items-center
                    justify-center
                  "
                >
                  <FileText size={18} />
                </div>

                <span>
                  Create Post
                </span>

              </button>

            </div>

          )}

        </div>

      </div>

    </header>

  );
}