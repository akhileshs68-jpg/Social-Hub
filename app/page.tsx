"use client";

import { useState } from "react";

export default function HomePage() {
  const [likes, setLikes] = useState(1);

  const [posts, setPosts] = useState([
    {
      text: "Welcome to Pi Social Hub 🚀",
      image:
        "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1200&auto=format&fit=crop",
    },
  ]);

  const [showPostBox, setShowPostBox] = useState(false);
  const [postText, setPostText] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const createPost = () => {
    if (!postText || !imageUrl) return;

    const newPost = {
      text: postText,
      image: imageUrl,
    };

    setPosts([newPost, ...posts]);

    setPostText("");
    setImageUrl("");
    setShowPostBox(false);
  };

  return (
    <main
      style={{
        background:
          "linear-gradient(to bottom, #050505, #111827, #1e1b4b)",
        minHeight: "100vh",
        color: "white",
        fontFamily: "Arial",
        paddingBottom: "120px",
      }}
    >
      {/* Header */}
      <div
        style={{
          textAlign: "center",
          padding: "30px",
          fontSize: "45px",
          fontWeight: "bold",
          color: "#a855f7",
          textShadow: "0 0 20px #9333ea",
        }}
      >
        Pi Social Hub 🚀
      </div>

      {/* Menu */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          padding: "15px",
          background: "#09090b",
          borderTop: "1px solid #27272a",
          borderBottom: "1px solid #27272a",
        }}
      >
        <span>Akhilesh</span>
        <span>Pi News</span>
        <span>Crypto</span>
        <span>Mainnet</span>
        <span>Community</span>
      </div>

      {/* Create Post Popup */}
      {showPostBox && (
        <div
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "90%",
            maxWidth: "500px",
            background: "#18181b",
            padding: "25px",
            borderRadius: "20px",
            zIndex: 999,
            border: "1px solid #9333ea",
            boxShadow: "0 0 30px #9333ea",
          }}
        >
          <h2>Create New Post</h2>

          <textarea
            placeholder="Write something..."
            value={postText}
            onChange={(e) => setPostText(e.target.value)}
            style={{
              width: "100%",
              height: "100px",
              marginTop: "15px",
              padding: "15px",
              borderRadius: "12px",
              border: "none",
              background: "#27272a",
              color: "white",
            }}
          />

          <input
             type="file"
             accept="image/*,video/*"
             onChange={(e) => {
              const file = e.target.files?.[0];

              if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImageUrl(imageUrl);
    }
  }}
  style={{
    width: "100%",
    padding: "12px",
    borderRadius: "10px",
    background: "#222",
    color: "white",
    border: "1px solid #9333ea",
    marginTop: "10px",
  }}
/>
           

          <button
            onClick={createPost}
            style={{
              marginTop: "20px",
              width: "100%",
              padding: "15px",
              border: "none",
              borderRadius: "12px",
              background:
                "linear-gradient(to right, #9333ea, #7e22ce)",
              color: "white",
              fontSize: "18px",
              cursor: "pointer",
            }}
          >
            🚀 Post Now
          </button>
        </div>
      )}

      {/* Posts */}
      {posts.map((post, index) => (
        <div
          key={index}
          style={{
            margin: "30px auto",
            width: "95%",
            background: "#1e1e2f",
            borderRadius: "25px",
            overflow: "hidden",
            border: "1px solid #7e22ce",
            boxShadow: "0 0 25px rgba(168,85,247,0.4)",
          }}
        >
          {/* User */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              padding: "20px",
            }}
          >
            <div
              style={{
                width: "55px",
                height: "55px",
                borderRadius: "50%",
                background:
                  "linear-gradient(to bottom, #9333ea, #4c1d95)",
              }}
            ></div>

            <div style={{ marginLeft: "15px" }}>
              <h2 style={{ margin: 0 }}>Akhilesh</h2>

              <p
                style={{
                  margin: 0,
                  color: "#c4b5fd",
                }}
              >
                Pi Pioneer • now
              </p>
            </div>
          </div>

          {/* Image */}
          <img
            src={post.image}
            alt="post"
            style={{
              width: "100%",
              height: "500px",
              objectFit: "cover",
            }}
          />

          {/* Caption */}
          <div style={{ padding: "25px" }}>
            <p style={{ fontSize: "22px" }}>{post.text}</p>

            {/* Buttons */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-around",
                marginTop: "25px",
              }}
            >
              <button
                onClick={() => setLikes(likes + 1)}
                style={{
                  background: "#4c1d95",
                  color: "white",
                  border: "none",
                  padding: "14px 25px",
                  borderRadius: "15px",
                  cursor: "pointer",
                  fontSize: "18px",
                }}
              >
                ❤️ {likes} Likes
              </button>

              <button
                style={{
                  background: "#4c1d95",
                  color: "white",
                  border: "none",
                  padding: "14px 25px",
                  borderRadius: "15px",
                  cursor: "pointer",
                  fontSize: "18px",
                }}
              >
                💬 Comment
              </button>

              <button
                style={{
                  background: "#4c1d95",
                  color: "white",
                  border: "none",
                  padding: "14px 25px",
                  borderRadius: "15px",
                  cursor: "pointer",
                  fontSize: "18px",
                }}
              >
                📤 Share
              </button>
            </div>
          </div>
        </div>
      ))}

      {/* Floating Button */}
      <button
        onClick={() => setShowPostBox(true)}
        style={{
          position: "fixed",
          bottom: "100px",
          right: "25px",
          width: "75px",
          height: "75px",
          borderRadius: "50%",
          border: "none",
          background:
            "linear-gradient(to bottom, #9333ea, #4c1d95)",
          color: "white",
          fontSize: "40px",
          cursor: "pointer",
          boxShadow: "0 0 25px #9333ea",
        }}
      >
        +
      </button>

      {/* Bottom Navbar */}
      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          background: "#050505",
          display: "flex",
          justifyContent: "space-around",
          padding: "20px",
          borderTop: "1px solid #27272a",
        }}
      >
        <span style={{ fontSize: "32px" }}>🏠</span>
        <span style={{ fontSize: "32px" }}>🔍</span>
        <span style={{ fontSize: "32px" }}>🔔</span>
        <span style={{ fontSize: "32px" }}>👤</span>
      </div>
    </main>
  );
}