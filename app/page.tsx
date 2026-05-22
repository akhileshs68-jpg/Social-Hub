"use client";

import { useState } from "react";

export default function HomePage() {
  const [likes, setLikes] = useState(2);
  const [showComment, setShowComment] = useState(false);
  const [comments, setComments] = useState<string[]>([]);
  const [commentText, setCommentText] = useState("");

  const addComment = () => {
    if (commentText.trim() === "") return;

    setComments([...comments, commentText]);
    setCommentText("");
  };

  return (
    <main
      style={{
        background:
          "linear-gradient(to bottom, #050505, #111827, #1e1b4b)",
        minHeight: "100vh",
        color: "white",
        paddingBottom: "120px",
        fontFamily: "Arial",
      }}
    >
      {/* Header */}
      <div
        style={{
          textAlign: "center",
          padding: "35px 20px",
          fontSize: "48px",
          fontWeight: "bold",
          color: "#a855f7",
          textShadow: "0 0 20px #9333ea",
        }}
      >
        Pi Social Hub 🚀
      </div>

      {/* Top Menu */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          padding: "15px",
          background: "#09090b",
          borderTop: "1px solid #27272a",
          borderBottom: "1px solid #27272a",
          position: "sticky",
          top: 0,
          zIndex: 100,
        }}
      >
        <span>Akhilesh</span>
        <span>Pi News</span>
        <span>Crypto</span>
        <span>Mainnet</span>
        <span>Community</span>
      </div>

      {/* Post Card */}
      <div
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
            <p style={{ margin: 0, color: "#c4b5fd" }}>
              Pi Pioneer • 2 min ago
            </p>
          </div>
        </div>

        {/* Image */}
        <img
          src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3"
          style={{
            width: "100%",
            height: "500px",
            objectFit: "cover",
          }}
        />

        {/* Caption */}
        <div style={{ padding: "25px" }}>
          <p style={{ fontSize: "22px" }}>
            Welcome to the future of decentralized social media powered by Pi
            Network 🔥
          </p>

          {/* Buttons */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-around",
              marginTop: "25px",
            }}
          >
            {/* Like */}
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

            {/* Comment */}
            <button
              onClick={() => setShowComment(!showComment)}
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

            {/* Share */}
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

          {/* Comment Section */}
          {showComment && (
            <div style={{ marginTop: "30px" }}>
              <input
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Write comment..."
                style={{
                  width: "100%",
                  padding: "15px",
                  borderRadius: "12px",
                  border: "none",
                  outline: "none",
                  fontSize: "16px",
                  marginBottom: "15px",
                }}
              />

              <button
                onClick={addComment}
                style={{
                  background: "#9333ea",
                  color: "white",
                  border: "none",
                  padding: "12px 25px",
                  borderRadius: "12px",
                  cursor: "pointer",
                }}
              >
                Post Comment
              </button>

              {/* Comment List */}
              <div style={{ marginTop: "20px" }}>
                {comments.map((comment, index) => (
                  <div
                    key={index}
                    style={{
                      background: "#27272a",
                      padding: "15px",
                      borderRadius: "12px",
                      marginTop: "10px",
                    }}
                  >
                    💜 {comment}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Floating Add Button */}
      <button
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