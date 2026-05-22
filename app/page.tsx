"use client";

import { useState } from "react";

export default function HomePage() {
  const [likes, setLikes] = useState(1);
  const [showComment, setShowComment] = useState(false);
  const [showPost, setShowPost] = useState(false);
  const [postText, setPostText] = useState("");

  return (
    <main
      style={{
        background: "linear-gradient(to bottom, #0f0f0f, #1a1a2e, #16213e)",
        minHeight: "100vh",
        color: "white",
        paddingBottom: "100px",
        fontFamily: "Arial",
      }}
    >
      {/* Header */}

      <div
        style={{
          position: "sticky",
          top: 0,
          background: "rgba(0,0,0,0.7)",
          backdropFilter: "blur(10px)",
          padding: "20px",
          borderBottom: "1px solid #333",
          zIndex: 100,
        }}
      >
        <h1
          style={{
            textAlign: "center",
            color: "#a855f7",
            fontSize: "32px",
            fontWeight: "bold",
          }}
        >
          Pi Social Hub 🚀
        </h1>
      </div>

      {/* Stories */}

      <div
        style={{
          display: "flex",
          gap: "15px",
          overflowX: "auto",
          padding: "20px",
        }}
      >
        {["Akhilesh", "Pi News", "Crypto", "Mainnet", "Community"].map(
          (item, i) => (
            <div
              key={i}
              style={{
                minWidth: "80px",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  width: "70px",
                  height: "70px",
                  borderRadius: "50%",
                  background:
                    "linear-gradient(135deg,#9333ea,#7e22ce,#4c1d95)",
                  padding: "3px",
                  margin: "auto",
                }}
              >
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    borderRadius: "50%",
                    background: "#111",
                  }}
                ></div>
              </div>

              <p style={{ fontSize: "12px", marginTop: "8px" }}>
                {item}
              </p>
            </div>
          )
        )}
      </div>

      {/* Post */}

      <div
        style={{
          background: "rgba(255,255,255,0.05)",
          margin: "20px",
          borderRadius: "25px",
          overflow: "hidden",
          backdropFilter: "blur(15px)",
          border: "1px solid rgba(255,255,255,0.1)",
          boxShadow: "0 0 20px rgba(168,85,247,0.3)",
        }}
      >
        {/* Post Header */}

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            padding: "20px",
          }}
        >
          <div
            style={{
              width: "55px",
              height: "55px",
              borderRadius: "50%",
              background:
                "linear-gradient(135deg,#9333ea,#7e22ce,#4c1d95)",
            }}
          ></div>

          <div>
            <h3 style={{ margin: 0 }}>Akhilesh</h3>

            <p
              style={{
                margin: 0,
                color: "#aaa",
                fontSize: "13px",
              }}
            >
              Pi Pioneer • 2 min ago
            </p>
          </div>
        </div>

        {/* Image */}

        <img
          src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3"
          style={{
            width: "100%",
            height: "320px",
            objectFit: "cover",
          }}
        />

        {/* Content */}

        <div style={{ padding: "20px" }}>
          <p
            style={{
              fontSize: "16px",
              lineHeight: "28px",
              color: "#ddd",
            }}
          >
            Welcome to the future of decentralized social media powered by
            Pi Network 🔥
          </p>

          {/* Buttons */}

          <div
            style={{
              display: "flex",
              justifyContent: "space-around",
              marginTop: "20px",
            }}
          >
            <button
              onClick={() => setLikes(likes + 1)}
              style={{
                background: "rgba(168,85,247,0.2)",
                border: "none",
                color: "white",
                padding: "12px 18px",
                borderRadius: "15px",
                cursor: "pointer",
              }}
            >
              ❤️ {likes} Likes
            </button>

            <button
              onClick={() => setShowComment(true)}
              style={{
                background: "rgba(168,85,247,0.2)",
                border: "none",
                color: "white",
                padding: "12px 18px",
                borderRadius: "15px",
                cursor: "pointer",
              }}
            >
              💬 Comment
            </button>

            <button
              style={{
                background: "rgba(168,85,247,0.2)",
                border: "none",
                color: "white",
                padding: "12px 18px",
                borderRadius: "15px",
                cursor: "pointer",
              }}
            >
              📤 Share
            </button>
          </div>
        </div>
      </div>

      {/* Floating Button */}

      <button
        onClick={() => setShowPost(true)}
        style={{
          position: "fixed",
          bottom: "90px",
          right: "25px",
          width: "65px",
          height: "65px",
          borderRadius: "50%",
          border: "none",
          background:
            "linear-gradient(135deg,#9333ea,#7e22ce,#4c1d95)",
          color: "white",
          fontSize: "35px",
          boxShadow: "0 0 25px rgba(168,85,247,0.8)",
          cursor: "pointer",
          zIndex: 999,
        }}
      >
        +
      </button>

      {/* Navbar */}

      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          background: "rgba(0,0,0,0.85)",
          backdropFilter: "blur(12px)",
          display: "flex",
          justifyContent: "space-around",
          padding: "18px",
          borderTop: "1px solid #333",
        }}
      >
        <button
          style={{
            background: "none",
            border: "none",
            color: "#a855f7",
            fontSize: "28px",
          }}
        >
          🏠
        </button>

        <button
          style={{
            background: "none",
            border: "none",
            color: "white",
            fontSize: "28px",
          }}
        >
          🔍
        </button>

        <button
          style={{
            background: "none",
            border: "none",
            color: "white",
            fontSize: "28px",
          }}
        >
          🔔
        </button>

        <button
          style={{
            background: "none",
            border: "none",
            color: "white",
            fontSize: "28px",
          }}
        >
          👤
        </button>
      </div>

      {/* Comment Modal */}

      {showComment && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.7)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
          }}
        >
          <div
            style={{
              background: "#1e1e2f",
              padding: "30px",
              borderRadius: "20px",
              width: "300px",
            }}
          >
            <h2>Comments</h2>

            <input
              placeholder="Write comment..."
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "10px",
                border: "none",
                marginTop: "15px",
              }}
            />

            <button
              onClick={() => setShowComment(false)}
              style={{
                marginTop: "20px",
                width: "100%",
                padding: "12px",
                background: "#9333ea",
                border: "none",
                color: "white",
                borderRadius: "12px",
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Create Post Modal */}

      {showPost && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.7)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
          }}
        >
          <div
            style={{
              background: "#1e1e2f",
              padding: "30px",
              borderRadius: "20px",
              width: "320px",
            }}
          >
            <h2>Create Post</h2>

            <textarea
              value={postText}
              onChange={(e) => setPostText(e.target.value)}
              placeholder="What's happening?"
              style={{
                width: "100%",
                height: "120px",
                padding: "12px",
                borderRadius: "12px",
                border: "none",
                marginTop: "15px",
              }}
            />

            <input
              type="file"
              style={{
                marginTop: "15px",
                color: "white",
              }}
            />

            <button
              onClick={() => {
                alert(postText);
                setShowPost(false);
              }}
              style={{
                marginTop: "20px",
                width: "100%",
                padding: "12px",
                background: "#9333ea",
                border: "none",
                color: "white",
                borderRadius: "12px",
              }}
            >
              Post
            </button>
          </div>
        </div>
      )}
    </main>
  );
}