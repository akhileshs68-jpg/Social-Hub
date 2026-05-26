"use client";

import { useState } from "react";

export default function Home() {
  const [posts, setPosts] = useState([
    {
      user: "Pi Network",
      text: "Welcome to Pi Social Hub 🚀",
      image:
        "https://images.unsplash.com/photo-1639762681057-408e52192e55?q=80&w=1200&auto=format&fit=crop",
      likes: 0,
    },
  ]);

  const [text, setText] = useState("");

  const publishPost = () => {
    if (!text) return;

    const newPost = {
      user: "You",
      text,
      image:
        "https://images.unsplash.com/photo-1639762681057-408e52192e55?q=80&w=1200&auto=format&fit=crop",
      likes: 0,
    };

    setPosts([newPost, ...posts]);
    setText("");
  };

  const likePost = (index: number) => {
    const updated = [...posts];
    updated[index].likes += 1;
    setPosts(updated);
  };

  const deletePost = (index: number) => {
    const updated = posts.filter((_, i) => i !== index);
    setPosts(updated);
  };

  return (
    <div
      style={{
        background: "#020617",
        minHeight: "100vh",
        color: "white",
        display: "flex",
        justifyContent: "center",
        paddingTop: "90px",
        paddingBottom: "100px",
        overflowX: "hidden",
      }}
    >
{/* TOP NAVBAR */}
<div
  style={{
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "70px",
    background: "#111827",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
    borderBottom: "1px solid #222",
  }}
>
  <div
    style={{
      width: "100%",
      maxWidth: "500px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "0 15px",
      boxSizing: "border-box",
    }}
  >
    <h1
      style={{
        fontSize: "20px",
        fontWeight: "bold",
        margin: 0,
      }}
    >
      Pi Social Hub
    </h1>

    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "16px",
      }}
    >
      <span style={{ cursor: "pointer" }}>🏠</span>
      <span style={{ cursor: "pointer" }}>🔎</span>
      <span style={{ cursor: "pointer" }}>🔔</span>
      <span style={{ cursor: "pointer" }}>👤</span>

      <button
        style={{
          background: "#ff00ff",
          border: "none",
          color: "white",
          padding: "10px 16px",
          borderRadius: "12px",
          cursor: "pointer",
          fontWeight: "bold",
        }}
      >
        Logout
      </button>
    </div>
  </div>
</div>

      {/* MAIN CONTENT */}
      <div
        style={{
          width: "100%",
          maxWidth: "500px",
          padding: "0 15px",
          boxSizing: "border-box",
        }}
      >
        {/* STORIES */}
<div
  style={{
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    gap: "18px",
    marginTop: "0px",
    marginBottom: "0px",
    width: "100%",
    maxWidth: "420px",
    marginLeft: "0",
    marginRight: "auto",
    paddingLeft: "10px"
  }}
>
          {["You", "Pi", "Tech", "Crypto"].map((item, index) => (
            <div
              key={index}
              style={{
                textAlign: "center",
              }}
            >
              <img
                src={`https://i.pravatar.cc/150?img=${index + 10}`}
                alt=""
                style={{
                  width: "60px",
                  height: "60px",
                  borderRadius: "50%",
                  border: "3px solid #ff00ff",
                }}
              />
              <p style={{ marginTop: "5px", fontSize: "14px" }}>{item}</p>
            </div>
          ))}
        </div>

        {/* CREATE POST */}
        <div
          style={{
            background: "#111827",
            padding: "20px",
            borderRadius: "20px",
            marginBottom: "25px",
          }}
        >
          <h2
            style={{
              fontSize: "20px",
              marginBottom: "15px",
            }}
          >
            Create Post
          </h2>

          <textarea
            placeholder="What's happening in Pi Network?"
            value={text}
            onChange={(e) => setText(e.target.value)}
            style={{
              width: "100%",
              height: "100px",
              background: "#1f2937",
              border: "none",
              borderRadius: "15px",
              color: "white",
              padding: "15px",
              resize: "none",
              boxSizing: "border-box",
            }}
          />

          <div
            style={{
              display: "flex",
              gap: "10px",
              marginTop: "15px",
            }}
          >
            <button
              style={{
                flex: 1,
                background: "#1f2937",
                border: "none",
                color: "white",
                padding: "12px",
                borderRadius: "12px",
                cursor: "pointer",
              }}
            >
              📷 Photo
            </button>

            <button
              style={{
                flex: 1,
                background: "#1f2937",
                border: "none",
                color: "white",
                padding: "12px",
                borderRadius: "12px",
                cursor: "pointer",
              }}
            >
              🎥 Video
            </button>

            <button
              style={{
                flex: 1,
                background: "#1f2937",
                border: "none",
                color: "white",
                padding: "12px",
                borderRadius: "12px",
                cursor: "pointer",
              }}
            >
              🎬 Reels
            </button>
          </div>

          <button
            onClick={publishPost}
            style={{
              width: "100%",
              marginTop: "15px",
              background: "#ff00ff",
              border: "none",
              color: "white",
              padding: "15px",
              borderRadius: "15px",
              fontWeight: "bold",
              cursor: "pointer",
              fontSize: "16px",
            }}
          >
            🚀 Publish Post
          </button>
        </div>

        {/* POSTS */}
        {posts.map((post, index) => (
          <div
            key={index}
            style={{
              background: "#111827",
              borderRadius: "20px",
              padding: "15px",
              marginBottom: "20px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                marginBottom: "10px",
              }}
            >
              <img
                src={`https://i.pravatar.cc/150?img=${index + 20}`}
                alt=""
                style={{
                  width: "45px",
                  height: "45px",
                  borderRadius: "50%",
                }}
              />

              <div>
                <h3>{post.user}</h3>
                <p
                  style={{
                    color: "#9ca3af",
                    fontSize: "13px",
                  }}
                >
                  Just now
                </p>
              </div>
            </div>

            <p style={{ marginBottom: "15px" }}>{post.text}</p>

            <img
              src={post.image}
              alt=""
              style={{
                width: "100%",
                borderRadius: "15px",
                marginBottom: "15px",
              }}
            />

            <div
              style={{
                display: "flex",
                gap: "10px",
              }}
            >
              <button
                onClick={() => likePost(index)}
                style={{
                  flex: 1,
                  background: "#1f2937",
                  border: "none",
                  color: "white",
                  padding: "12px",
                  borderRadius: "12px",
                  cursor: "pointer",
                }}
              >
                🤍 Like {post.likes}
              </button>

              <button
                style={{
                  flex: 1,
                  background: "#1f2937",
                  border: "none",
                  color: "white",
                  padding: "12px",
                  borderRadius: "12px",
                  cursor: "pointer",
                }}
              >
                💬 Comment
              </button>

              <button
                style={{
                  flex: 1,
                  background: "#1f2937",
                  border: "none",
                  color: "white",
                  padding: "12px",
                  borderRadius: "12px",
                  cursor: "pointer",
                }}
              >
                📤 Share
              </button>
            </div>

            <button
              onClick={() => deletePost(index)}
              style={{
                width: "100%",
                marginTop: "15px",
                background: "red",
                border: "none",
                color: "white",
                padding: "12px",
                borderRadius: "12px",
                cursor: "pointer",
              }}
            >
              🗑 Delete Post
            </button>
          </div>
        ))}
      </div>

      {/* BOTTOM NAVBAR */}
<div
  style={{
    position: "fixed",
    bottom: "15px",
    left: "50%",
    transform: "translateX(-50%)",

    width: "95%",
    maxWidth: "500px",

    height: "65px",
    background: "#111827",

    borderRadius: "20px",
    border: "1px solid #222",

    display: "flex",
    justifyContent: "space-around",
    alignItems: "center",

    zIndex: 1000,
    boxSizing: "border-box",

    padding: "0 10px",
  }}
>
  <button
    style={{
      background: "transparent",
      border: "none",
      color: "white",
      cursor: "pointer",
      fontSize: "14px",
    }}
  >
    🏠 Home
  </button>

  <button
    style={{
      background: "transparent",
      border: "none",
      color: "white",
      cursor: "pointer",
      fontSize: "14px",
    }}
  >
    🔎 Explore
  </button>

  <button
    style={{
      background: "transparent",
      border: "none",
      color: "#ff00ff",
      cursor: "pointer",
      fontWeight: "bold",
      fontSize: "14px",
    }}
  >
    ➕ Create
  </button>

  <button
    style={{
      background: "transparent",
      border: "none",
      color: "white",
      cursor: "pointer",
      fontSize: "14px",
    }}
  >
    🔔 Alerts
  </button>

  <button
    style={{
      background: "transparent",
      border: "none",
      color: "white",
      cursor: "pointer",
      fontSize: "14px",
    }}
  >
    👤 Profile
  </button>
</div>
    </div>
  );
}
