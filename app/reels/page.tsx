"use client"

import { useEffect, useState } from "react"
import { ref, onValue } from "firebase/database"
import { database } from "../../lib/firebase"

export default function ReelsPage() {

  const [posts, setPosts] = useState<any[]>([])

  // Load Videos
  useEffect(() => {

    const postsRef = ref(database, "posts")

    onValue(postsRef, (snapshot) => {

      const data = snapshot.val()

      if (data) {

        const postsArray = Object.keys(data).map((key) => ({
          firebaseId: key,
          ...data[key]
        }))

        const videoPosts = postsArray.filter(
          (post) => post.mediaType === "video"
        )

        setPosts(videoPosts.reverse())

      } else {

        setPosts([])

      }

    })

  }, [])

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
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          background: "rgba(0,0,0,0.7)",
          padding: "15px",
          zIndex: 999,
          textAlign: "center"
        }}
      >

        <h1>Reels</h1>

      </div>

      {/* REELS */}
      <div
        style={{
          marginTop: "70px"
        }}
      >

        {posts.map((post) => (

          <div
            key={post.firebaseId}
            style={{
              position: "relative",
              width: "100%",
              height: "100vh",
              marginBottom: "20px"
            }}
          >

            {/* VIDEO */}
            <video
              src={post.media}
              controls
              autoPlay
              loop
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover"
              }}
            />

            {/* OVERLAY */}
            <div
              style={{
                position: "absolute",
                bottom: "120px",
                left: "20px",
                width: "70%"
              }}
            >

              <h2
                style={{
                  marginBottom: "10px"
                }}
              >
                {post.username || "Pioneer"}
              </h2>

              <p>{post.content}</p>

            </div>

            {/* ACTIONS */}
            <div
              style={{
                position: "absolute",
                right: "15px",
                bottom: "140px",
                display: "flex",
                flexDirection: "column",
                gap: "20px",
                alignItems: "center"
              }}
            >

              <button
                style={{
                  background: "rgba(0,0,0,0.5)",
                  border: "none",
                  color: "white",
                  padding: "12px",
                  borderRadius: "50%",
                  fontSize: "20px",
                  cursor: "pointer"
                }}
              >
                ❤️
              </button>

              <button
                style={{
                  background: "rgba(0,0,0,0.5)",
                  border: "none",
                  color: "white",
                  padding: "12px",
                  borderRadius: "50%",
                  fontSize: "20px",
                  cursor: "pointer"
                }}
              >
                💬
              </button>

              <button
                style={{
                  background: "rgba(0,0,0,0.5)",
                  border: "none",
                  color: "white",
                  padding: "12px",
                  borderRadius: "50%",
                  fontSize: "20px",
                  cursor: "pointer"
                }}
              >
                📤
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
            color: "white",
            textDecoration: "none"
          }}
        >
          🔍 Explore
        </a>

        <a
          href="/reels"
          style={{
            color: "#ff00ff",
            textDecoration: "none",
            fontWeight: "bold"
          }}
        >
          🎬 Reels
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