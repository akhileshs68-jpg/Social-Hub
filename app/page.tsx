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
        display: "flex",
        justifyContent: "center"
      }}
    >

      <div style={{ width: "100%", maxWidth: "500px" }}>

        {/* HEADER */}

        <div
          style={{
            background: "#111827",
            padding: "15px",
            borderRadius: "20px",
            marginBottom: "20px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          }}
        >
          <h1>Pi Social Hub</h1>

          <button
            style={{
              background: "#ff00ff",
              border: "none",
              color: "white",
              padding: "10px 20px",
              borderRadius: "12px",
              cursor: "pointer"
            }}
          >
            Logout
          </button>
        </div>

        {/* CREATE POST */}

        <div
          style={{
            background: "#111827",
            padding: "20px",
            borderRadius: "20px",
            marginBottom: "20px"
          }}
        >

          <h1 style={{ marginBottom: "20px" }}>
            Create Post
          </h1>

          <textarea
            placeholder="What's happening in Pi Network?"
            value={post}
            onChange={(e) => setPost(e.target.value)}
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

          {/* FILE INPUTS */}

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
              📷 Photo
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

          {/* PREVIEW */}

          {image && (
            <img
              src={image}
              alt=""
              style={{
                width: "100%",
                borderRadius: "15px",
                marginBottom: "15px"
              }}
            />
          )}

          {video && (
            <video
              src={video}
              controls
              style={{
                width: "100%",
                borderRadius: "15px",
                marginBottom: "15px"
              }}
            />
          )}

          {reel && (
            <video
              src={reel}
              controls
              style={{
                width: "100%",
                borderRadius: "15px",
                marginBottom: "15px"
              }}
            />
          )}

          {/* PUBLISH */}

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

        {posts.map((item, index) => (

          <div
            key={index}
            style={{
              background: "#111827",
              padding: "20px",
              borderRadius: "20px",
              marginBottom: "20px"
            }}
          >

            <h2>Pi User</h2>

            <p style={{ marginTop: "10px" }}>
              {item.text}
            </p>

            {item.image && (
              <img
                src={item.image}
                alt=""
                style={{
                  width: "100%",
                  borderRadius: "15px",
                  marginTop: "15px"
                }}
              />
            )}

            {item.video && (
              <video
                src={item.video}
                controls
                style={{
                  width: "100%",
                  borderRadius: "15px",
                  marginTop: "15px"
                }}
              />
            )}

            {item.reel && (
              <video
                src={item.reel}
                controls
                style={{
                  width: "100%",
                  borderRadius: "15px",
                  marginTop: "15px"
                }}
              />
            )}

            {/* ACTION BUTTONS */}

            <div
              style={{
                display: "flex",
                gap: "10px",
                marginTop: "15px"
              }}
            >

              <button
                onClick={() => {
                  if (likedPosts.includes(index)) {
                    setLikedPosts(
                      likedPosts.filter((i) => i !== index)
                    )
                  } else {
                    setLikedPosts([...likedPosts, index])
                  }
                }}
                style={{
                  flex: 1,
                  background: likedPosts.includes(index)
                    ? "#ff00ff"
                    : "#1f2937",
                  border: "none",
                  color: "white",
                  padding: "10px",
                  borderRadius: "10px",
                  cursor: "pointer"
                }}
              >
                {likedPosts.includes(index)
                  ? "💖 Liked"
                  : "❤️ Like"}
              </button>

              <button
                onClick={() =>
                  alert("Comment feature coming soon 💬")
                }
                style={{
                  flex: 1,
                  background: "#1f2937",
                  border: "none",
                  color: "white",
                  padding: "10px",
                  borderRadius: "10px",
                  cursor: "pointer"
                }}
              >
                💬 Comment
              </button>

              <button
                onClick={() => {
                  navigator.clipboard.writeText(
                    window.location.href
                  )
                  alert("Post link copied 🔗")
                }}
                style={{
                  flex: 1,
                  background: "#1f2937",
                  border: "none",
                  color: "white",
                  padding: "10px",
                  borderRadius: "10px",
                  cursor: "pointer"
                }}
              >
                🔁 Share
                <button
  onClick={() => {
    const updatedPosts = posts.filter(
      (_, i) => i !== index
    )

    setPosts(updatedPosts)
  }}
  style={{
    flex: 1,
    background: "#ff0000",
    border: "none",
    color: "white",
    padding: "10px",
    borderRadius: "10px",
    cursor: "pointer"
  }}
>
  🗑 Delete
</button>
              </button>

            </div>

          </div>

        ))}

      </div>

    </div>
  )
}