"use client"

import { useEffect, useState } from "react"
import { ref, onValue } from "firebase/database"
import { database } from "../../lib/firebase"

export default function ExplorePage() {

  const [posts, setPosts] = useState<any[]>([])
  const [search, setSearch] = useState("")

  // Load Realtime Posts
  useEffect(() => {

    const postsRef = ref(database, "posts")

    onValue(postsRef, (snapshot) => {

      const data = snapshot.val()

      if (data) {

        const postsArray = Object.keys(data).map((key) => ({
          firebaseId: key,
          ...data[key]
        }))

        setPosts(postsArray.reverse())

      } else {

        setPosts([])

      }

    })

  }, [])

  // Search Filter
  const filteredPosts = posts.filter((post) => {

    const text =
      (post.content || "").toLowerCase()

    return text.includes(search.toLowerCase())

  })

  return (

    <div
      style={{
        background: "#000",
        minHeight: "100vh",
        color: "white",
        paddingBottom: "100px"
      }}
    >

      {/* HEADER */}
      <div
        style={{
          padding: "20px"
        }}
      >

        <h1
          style={{
            fontSize: "35px",
            marginBottom: "20px"
          }}
        >
          Explore
        </h1>

        {/* SEARCH */}
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search posts..."
          style={{
            width: "100%",
            padding: "15px",
            borderRadius: "15px",
            border: "1px solid #333",
            background: "#111",
            color: "white",
            fontSize: "16px"
          }}
        />

      </div>

      {/* POSTS */}
      <div
        style={{
          width: "92%",
          maxWidth: "700px",
          margin: "auto"
        }}
      >

        {filteredPosts.map((post) => (

          <div
            key={post.firebaseId}
            style={{
              background: "#111",
              padding: "15px",
              borderRadius: "20px",
              marginBottom: "20px"
            }}
          >

            {/* USER */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                marginBottom: "10px"
              }}
            >

              <img
                src={
                  post.avatar ||
                  "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                }
                style={{
                  width: "45px",
                  height: "45px",
                  borderRadius: "50%",
                  objectFit: "cover"
                }}
              />

              <h3>
                {post.username || "Pioneer"}
              </h3>

            </div>

            {/* CONTENT */}
            <p
              style={{
                marginBottom: "10px"
              }}
            >
              {post.content}
            </p>

            {/* IMAGE */}
            {post.mediaType === "image" && (

              <img
                src={post.media}
                style={{
                  width: "100%",
                  borderRadius: "15px"
                }}
              />

            )}

            {/* VIDEO */}
            {post.mediaType === "video" && (

              <video
                src={post.media}
                controls
                style={{
                  width: "100%",
                  borderRadius: "15px"
                }}
              />

            )}

            {/* ACTIONS */}
            <div
              style={{
                display: "flex",
                gap: "15px",
                marginTop: "15px"
              }}
            >

              <button
                style={{
                  background: "#222",
                  color: "white",
                  border: "none",
                  padding: "10px 15px",
                  borderRadius: "10px",
                  cursor: "pointer"
                }}
              >
                👍 Like
              </button>

              <button
                style={{
                  background: "#222",
                  color: "white",
                  border: "none",
                  padding: "10px 15px",
                  borderRadius: "10px",
                  cursor: "pointer"
                }}
              >
                💬 Comment
              </button>

              <button
                style={{
                  background: "#222",
                  color: "white",
                  border: "none",
                  padding: "10px 15px",
                  borderRadius: "10px",
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
          bottom: 0,
          left: 0,
          width: "100%",
          background: "#111",
          display: "flex",
          justifyContent: "space-around",
          padding: "15px 0",
          borderTop: "1px solid #333",
          zIndex: 999
        }}
      >

        <a
          href="/"
          style={{
            color: "white",
            textDecoration: "none"
          }}
        >
          🏠 Home
        </a>

        <a
          href="/explore"
          style={{
            color: "#ff00ff",
            textDecoration: "none",
            fontWeight: "bold"
          }}
        >
          🔍 Explore
        </a>

        <a
          href="/chat"
          style={{
            color: "white",
            textDecoration: "none"
          }}
        >
          💬 Chat
        </a>

        <a
          href="/notifications"
          style={{
            color: "white",
            textDecoration: "none"
          }}
        >
          🔔 Notifications
        </a>

        <a
          href="/profile"
          style={{
            color: "white",
            textDecoration: "none"
          }}
        >
          👤 Profile
        </a>

      </div>

    </div>

  )

}