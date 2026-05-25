"use client"

import { useState } from "react"

export default function Home() {

  const [post, setPost] = useState("")
  const [image, setImage] = useState("")
  const [video, setVideo] = useState("")
  const [reel, setReel] = useState("")

  const [likedPosts, setLikedPosts] = useState<number[]>([])

  const [posts, setPosts] = useState<any[]>([
    {
      text: "Welcome to Pi Social Hub 🚀",
      image:
        "https://images.unsplash.com/photo-1639762681057-408e52192e55?q=80&w=1200&auto=format&fit=crop",
      video: "",
      reel: ""
    }
  ])

  const publishPost = () => {

    if (!post && !image && !video && !reel) {
      alert("Create something first")
      return
    }

    const newPost = {
      text: post,
      image,
      video,
      reel
    }

    setPosts([newPost, ...posts])

    setPost("")
    setImage("")
    setVideo("")
    setReel("")
  }

  return (
    <div
      style={{
        background: "#020617",
        minHeight: "100vh",
        padding: "20px",
        color: "white",
        fontFamily: "Arial"
      }}
    >

      {/* TOP BAR */}

      <div
        style={{
          maxWidth: "450px",
          margin: "0 auto",
          background: "#111827",
          padding: "15px",
          borderRadius: "20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px"
        }}
      >

        <h1 style={{ fontSize: "22px" }}>
          Pi Social Hub
        </h1>

        <button
          style={{
            background: "#ff00ff",
            border: "none",
            color: "white",
            padding: "10px 20px",
            borderRadius: "12px",
            cursor: "pointer",
            fontWeight: "bold"
          }}
        >
          Logout
        </button>

      </div>

      {/* STORIES */}

      <div
        style={{
          maxWidth: "450px",
          margin: "0 auto",
          display: "flex",
          gap: "15px",
          marginBottom: "20px",
          overflowX: "auto"
        }}
      >

        {["You", "Pi", "Tech", "Crypto"].map((item, index) => (

          <div
            key={index}
            style={{
              textAlign: "center"
            }}
          >

            <img
              src={`https://i.pravatar.cc/150?img=${index + 10}`}
              alt=""
              style={{
                width: "65px",
                height: "65px",
                borderRadius: "50%",
                border: "3px solid #ff00ff"
              }}
            />

            <p style={{ marginTop: "5px" }}>
              {item}
            </p>

          </div>

        ))}

      </div>

      {/* CREATE POST */}

      <div
        style={{
          maxWidth: "450px",
          margin: "0 auto",
          background: "#111827",
          padding: "20px",
          borderRadius: "25px",
          marginBottom: "25px"
        }}
      >

        <h2
          style={{
            marginBottom: "15px",
            fontSize: "22px"
          }}
        >
          Create Post
        </h2>

        <textarea
          value={post}
          onChange={(e) => setPost(e.target.value)}
          placeholder="What's happening in Pi Network?"
          style={{
            width: "100%",
            height: "100px",
            borderRadius: "15px",
            border: "none",
            padding: "15px",
            background: "#1f2937",
            color: "white",
            resize: "none",
            outline: "none",
            marginBottom: "15px"
          }}
        />

        {/* HIDDEN INPUTS */}

        <input
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          onChange={(e: any) => {
            const file = e.target.files[0]
            if (file) {
              setImage(URL.createObjectURL(file))
            }
          }}
        />

        <input
          type="file"
          accept="video/*"
          style={{ display: "none" }}
          onChange={(e: any) => {
            const file = e.target.files[0]
            if (file) {
              setVideo(URL.createObjectURL(file))
            }
          }}
        />

        <input
          type="file"
          accept="video/*"
          style={{ display: "none" }}
          onChange={(e: any) => {
            const file = e.target.files[0]
            if (file) {
              setReel(URL.createObjectURL(file))
            }
          }}
        />

        {/* BUTTONS */}

        <div
          style={{
            display: "flex",
            gap: "10px",
            marginBottom: "15px"
          }}
        >

          <button
            onClick={() =>
              document.querySelectorAll('input[type="file"]')[0]?.click()
            }
            style={{
              flex: 1,
              background: "#1f2937",
              border: "none",
              color: "white",
              padding: "12px",
              borderRadius: "12px",
              cursor: "pointer"
            }}
          >
            🖼 Photo
          </button>

          <button
            onClick={() =>
              document.querySelectorAll('input[type="file"]')[1]?.click()
            }
            style={{
              flex: 1,
              background: "#1f2937",
              border: "none",
              color: "white",
              padding: "12px",
              borderRadius: "12px",
              cursor: "pointer"
            }}
          >
            🎥 Video
          </button>

          <button
            onClick={() =>
              document.querySelectorAll('input[type="file"]')[2]?.click()
            }
            style={{
              flex: 1,
              background: "#1f2937",
              border: "none",
              color: "white",
              padding: "12px",
              borderRadius: "12px",
              cursor: "pointer"
            }}
          >
            🎬 Reels
          </button>

        </div>

        <button
          onClick={publishPost}
          style={{
            width: "100%",
            background: "#ff00ff",
            border: "none",
            color: "white",
            padding: "14px",
            borderRadius: "15px",
            fontWeight: "bold",
            cursor: "pointer",
            fontSize: "15px"
          }}
        >
          🚀 Publish Post
        </button>

      </div>

      {/* POSTS */}

      <div
        style={{
          maxWidth: "450px",
          margin: "0 auto"
        }}
      >

        {posts.map((item, index) => (

          <div
            key={index}
            style={{
              background: "#111827",
              padding: "20px",
              borderRadius: "25px",
              marginBottom: "25px"
            }}
          >

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                marginBottom: "15px"
              }}
            >

              <img
                src="https://i.pravatar.cc/150?img=12"
                alt=""
                style={{
                  width: "50px",
                  height: "50px",
                  borderRadius: "50%"
                }}
              />

              <div>
                <h3>Pi Network</h3>
                <p style={{ color: "#9ca3af" }}>
                  Just now
                </p>
              </div>

            </div>

            <p
              style={{
                marginBottom: "15px"
              }}
            >
              {item.text}
            </p>

            {item.image && (
              <img
                src={item.image}
                alt=""
                style={{
                  width: "100%",
                  borderRadius: "20px",
                  marginBottom: "15px"
                }}
              />
            )}

            {item.video && (
              <video
                src={item.video}
                controls
                style={{
                  width: "100%",
                  borderRadius: "20px",
                  marginBottom: "15px"
                }}
              />
            )}

            {item.reel && (
              <video
                src={item.reel}
                controls
                autoPlay
                loop
                style={{
                  width: "100%",
                  borderRadius: "20px",
                  marginBottom: "15px"
                }}
              />
            )}

            {/* ACTION BUTTONS */}

            <div
              style={{
                display: "flex",
                gap: "10px"
              }}
            >

              <button
                onClick={() => {

                  if (likedPosts.includes(index)) {

                    setLikedPosts(
                      likedPosts.filter((i) => i !== index)
                    )

                  } else {

                    setLikedPosts([
                      ...likedPosts,
                      index
                    ])

                  }

                }}
                style={{
                  flex: 1,
                  background: likedPosts.includes(index)
                    ? "#ff00ff"
                    : "#1f2937",
                  border: "none",
                  color: "white",
                  padding: "12px",
                  borderRadius: "12px",
                  cursor: "pointer"
                }}
              >
                {likedPosts.includes(index)
                  ? "💖 Liked"
                  : "🤍 Like"}
              </button>

              <button
                onClick={() =>
                  alert("Comment feature coming soon 🚀")
                }
                style={{
                  flex: 1,
                  background: "#1f2937",
                  border: "none",
                  color: "white",
                  padding: "12px",
                  borderRadius: "12px",
                  cursor: "pointer"
                }}
              >
                💬 Comment
              </button>

              <button
                onClick={() => {

                  navigator.share?.({
                    title: "Pi Social Hub",
                    text: item.text
                  })

                }}
                style={{
                  flex: 1,
                  background: "#1f2937",
                  border: "none",
                  color: "white",
                  padding: "12px",
                  borderRadius: "12px",
                  cursor: "pointer"
                }}
              >
                📤 Share
              </button>

            </div>

          </div>

        ))}

      </div>

      {/* BOTTOM NAVBAR */}

      <div
        style={{
          position: "fixed",
          bottom: "0",
          left: "0",
          width: "100%",
          background: "#111827",
          display: "flex",
          justifyContent: "space-around",
          padding: "15px",
          borderTop: "1px solid #1f2937"
        }}
      >

        <div>🏠 Home</div>
        <div>🔍 Explore</div>
        <div>🔔 Alerts</div>
        <div>👤 Profile</div>

      </div>

    </div>
  )
}