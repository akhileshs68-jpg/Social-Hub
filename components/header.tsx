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