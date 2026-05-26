"use client"

type MediaItem = {
  type: string
  url: string
}

interface PostCardProps {
  id: string
  username: string
  content: string
  likes: number
  createdAt?: string
  media?: MediaItem[]
  onDelete?: () => void
}

export default function PostCard({
  username,
  content,
  likes,
  media,
  onDelete
}: PostCardProps) {

  return (

    <div
      className="
        bg-[#111827]
        rounded-3xl
        p-4
        text-white
        shadow-xl
      "
    >

      {/* USER */}

      <div
        className="
          flex
          items-center
          justify-between
          mb-3
        "
      >

        <div
          className="
            flex
            items-center
            gap-3
          "
        >

          <div
            className="
              w-12
              h-12
              rounded-full
              bg-pink-500
              flex
              items-center
              justify-center
              font-bold
            "
          >
            P
          </div>

          <div>

            <h2
              className="
                font-semibold
              "
            >
              {username}
            </h2>

            <p
              className="
                text-xs
                text-gray-400
              "
            >
              Pi Network User
            </p>

          </div>

        </div>

        {onDelete && (

          <button
            onClick={onDelete}
            className="
              text-red-400
              text-sm
            "
          >
            Delete
          </button>

        )}

      </div>

      {/* CONTENT */}

      <p
        className="
          text-sm
          leading-relaxed
          mb-4
        "
      >
        {content}
      </p>

      {/* MEDIA */}

      {media &&
        media.map((item, index) => (

          <div
            key={index}
            className="mb-3"
          >

            {item.type === "image" && (

              <img
                src={item.url}
                className="
                  w-full
                  rounded-2xl
                "
              />

            )}

            {item.type === "video" && (

              <video
                src={item.url}
                controls
                className="
                  w-full
                  rounded-2xl
                "
              />

            )}

          </div>

        ))}

      {/* ACTIONS */}

      <div
        className="
          flex
          items-center
          gap-4
          mt-4
          text-sm
          text-gray-300
        "
      >

        <button>❤️ {likes}</button>

        <button>💬 Comment</button>

        <button>📤 Share</button>

      </div>

    </div>

  )

}