"use client"

import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
} from "lucide-react"

interface PostCardProps {
  id: string
  username: string
  content: string
  likes: number
  comments: number
  shares: number
  media?: Array<{
    type: "image" | "video"
    url: string
  }>
}

export function PostCard({
  id,
  username,
  content,
  likes,
  comments,
  shares,
  media,
}: PostCardProps) {

  return (

    <div className="mx-3 mb-4 rounded-[28px] border border-white/10 bg-[#080808] backdrop-blur-xl shadow-[0_0_30px_rgba(0,0,0,0.45)] overflow-hidden transition-all duration-300 hover:border-[#F4B814]/30 p-4">

      <div className="flex items-center gap-3">

        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-cyan-700 text-white font-bold">
          {username[0]}
        </div>

        <div>

          <h3 className="text-sm font-semibold text-white">
            {username}
          </h3>

          <p className="text-xs text-neutral-500">
            1h ago
          </p>

        </div>

      </div>

      <p className="mt-4 text-[15px] leading-7 text-neutral-100 font-medium tracking-[0.2px]">
        {content}
      </p>

      {media && media.length > 0 && (

        <div className="mt-4 rounded-2xl overflow-hidden border border-white/10">

          {media[0].type === "image" ? (

            <img
              src={media[0].url}
              alt="post"
              className="w-full max-h-[500px] object-cover"
            />

          ) : (

            <video
              src={media[0].url}
              controls
              className="w-full max-h-[500px]"
            />

          )}

        </div>

      )}

      <div className="mt-5 border-t border-white/10 pt-3">

        <div className="flex items-center justify-between">

          <button
            onClick={() => {

              const currentLikes =
                Number(localStorage.getItem(`likes-${id}`) || 0) + 1

              localStorage.setItem(
                `likes-${id}`,
                currentLikes.toString()
              )

              window.location.reload()

            }}
            className="flex items-center gap-2 text-neutral-400 hover:text-[#F4B814]"
          >

            <Heart className="h-5 w-5" />

            <span className="text-xs">
              {localStorage.getItem(`likes-${id}`) || likes}
            </span>

          </button>

          <button className="flex items-center gap-2 text-neutral-400 hover:text-[#F4B814]">

            <MessageCircle className="h-5 w-5" />

            <span className="text-xs">

              {JSON.parse(
                localStorage.getItem(`comments-${id}`) || "[]"
              ).length || comments}

            </span>

          </button>

          <button
            onClick={() => {

              navigator.share?.({
                title: "SocialHub",
                text: content,
                url: window.location.href,
              })

            }}
            className="flex items-center gap-2 text-neutral-400 hover:text-[#F4B814]"
          >

            <Share2 className="h-5 w-5" />

            <span className="text-xs">
              {shares}
            </span>

          </button>

          <button className="text-neutral-400 hover:bg-white/5 hover:text-[#F4B814] rounded-xl px-2 py-2 transition-all">

            <Bookmark className="h-5 w-5" />

          </button>

        </div>

        <div className="mt-4">

          <input
            id={`comment-${id}`}
            placeholder="Write comment..."
            className="w-full rounded-2xl border border-white/10 bg-black/30 p-3 text-sm text-white outline-none"
          />

          <button
            onClick={() => {

              const input = document.getElementById(
                `comment-${id}`
              ) as HTMLInputElement

              if (!input.value) return

              const existingComments = JSON.parse(
                localStorage.getItem(`comments-${id}`) || "[]"
              )

              existingComments.push(input.value)

              localStorage.setItem(
                `comments-${id}`,
                JSON.stringify(existingComments)
              )

              window.location.reload()

            }}
            className="mt-3 rounded-2xl bg-[#F4B814] px-5 py-2 text-sm font-semibold text-black"
          >

            Add Comment

          </button>

          <div className="mt-4 space-y-2">

            {JSON.parse(
              localStorage.getItem(`comments-${id}`) || "[]"
            ).map((comment: string, index: number) => (

              <div
                key={index}
                className="rounded-xl bg-white/5 px-3 py-2 text-sm text-white"
              >

                💬 {comment}

              </div>

            ))}

          </div>

        </div>

      </div>

    </div>

  )
}