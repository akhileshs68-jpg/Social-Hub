"use client";

import { useState } from "react";

export default function Home() {
  const [liked, setLiked] = useState(false);

  const [text, setText] = useState("");

  const [posts, setPosts] = useState([
    {
      id: 1,
      user: "Pi Network",
      text: "Welcome to Pi Social Hub 🚀",
      image:
        "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=1200",
    },
  ]);

  const handlePost = () => {
    if (!text.trim()) {
      alert("Write something first");
      return;
    }

    const newPost = {
      id: Date.now(),
      user: "You",
      text: text,
      image:
        "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=1200",
    };

    setPosts([newPost, ...posts]);
    setText("");
  };

  const handleDelete = (id: number) => {
    setPosts(posts.filter((post) => post.id !== id));
  };

  const handleLike = () => {
    setLiked(!liked);
  };

  const handleComment = () => {
    alert("Comment Button Working");
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    alert("Link Copied");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#020617",
        color: "white",
        fontFamily: "Arial",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        paddingBottom: "120px",
      }}
    >
      {/* TOP HEADER */}
      <div
        style={{
          width: "100%",
          background: "#0f172a",
          borderBottom: "1px solid #1e293b",
          position: "sticky",
          top: 0,
          zIndex: 1000,
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "420px",
            margin: "0 auto",
            padding: "14px 16px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            boxSizing: "border-box",
          }}
        >
          <h1
            style={{
              margin: 0,
              fontSize: "28px",
              fontWeight: "bold",
            }}
          >
            Pi Social Hub
          </h1>

          <div
            style={{
              display: "flex",
              gap: "14px",
              alignItems: "center",
            }}
          >
            <button style={iconBtn}>🏠</button>
            <button style={iconBtn}>🔎</button>
            <button style={iconBtn}>🔔</button>
            <button style={iconBtn}>👤</button>

            <button
              onClick={() => alert("Logout")}
              style={{
                background: "#ff00ff",
                border: "none",
                color: "white",
                padding: "10px 16px",
                borderRadius: "10px",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* STORIES */}
      <div
        style={{
          width: "100%",
          maxWidth: "420px",
          display: "flex",
          gap: "18px",
          padding: "18px 10px",
          boxSizing: "border-box",
        }}
      >
        {["You", "Pi", "Tech", "Crypto"].map((item, i) => (
          <div
            key={i}
            style={{
              textAlign: "center",
            }}
          >
            <img
              src={`https://i.pravatar.cc/150?img=${i + 10}`}
              alt={item}
              style={{
                width: "58px",
                height: "58px",
                borderRadius: "50%",
                border: "3px solid #ff00ff",
                objectFit: "cover",
              }}
            />

            <div
              style={{
                marginTop: "6px",
                fontSize: "14px",
              }}
            >
              {item}
            </div>
          </div>
        ))}
      </div>

      {/* CREATE POST */}
      <div
        style={{
          width: "100%",
          maxWidth: "420px",
          background: "#111827",
          borderRadius: "20px",
          padding: "16px",
          boxSizing: "border-box",
        }}
      >
        <h2>Create Post</h2>

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="What's happening in Pi Network?"
          style={{
            width: "100%",
            height: "100px",
            background: "#1e293b",
            border: "none",
            borderRadius: "14px",
            color: "white",
            padding: "14px",
            resize: "none",
            boxSizing: "border-box",
          }}
        />

        <div
          style={{
            display: "flex",
            gap: "10px",
            marginTop: "14px",
          }}
        >
          <button
            onClick={() => alert("Photo Upload")}
            style={actionBtn}
          >
            📷 Photo
          </button>

          <button
            onClick={() => alert("Video Upload")}
            style={actionBtn}
          >
            🎥 Video
          </button>

          <button
            onClick={() => alert("Reels Upload")}
            style={actionBtn}
          >
            🎞 Reels
          </button>
        </div>

        <button
          onClick={handlePost}
          style={{
            width: "100%",
            marginTop: "16px",
            background: "#ff00ff",
            border: "none",
            color: "white",
            padding: "16px",
            borderRadius: "14px",
            fontWeight: "bold",
            cursor: "pointer",
            fontSize: "16px",
          }}
        >
          🚀 Publish Post
        </button>
      </div>

      {/* POSTS */}
      {posts.map((post) => (
        <div
          key={post.id}
          style={{
            width: "100%",
            maxWidth: "420px",
            background: "#111827",
            borderRadius: "20px",
            padding: "14px",
            marginTop: "20px",
            boxSizing: "border-box",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <img
              src="https://i.pravatar.cc/150?img=20"
              style={{
                width: "45px",
                height: "45px",
                borderRadius: "50%",
              }}
            />

            <div>
              <div style={{ fontWeight: "bold" }}>
                {post.user}
              </div>

              <div
                style={{
                  color: "#cbd5e1",
                  fontSize: "14px",
                }}
              >
                Just now
              </div>
            </div>
          </div>

          <p>{post.text}</p>

          <img
            src={post.image}
            style={{
              width: "100%",
              borderRadius: "16px",
              height: "260px",
              objectFit: "cover",
            }}
          />

          <div
            style={{
              display: "flex",
              gap: "10px",
              marginTop: "14px",
            }}
          >
            <button
              onClick={handleLike}
              style={actionBtn}
            >
              {liked ? "❤️ Liked" : "🤍 Like"}
            </button>

            <button
              onClick={handleComment}
              style={actionBtn}
            >
              💬 Comment
            </button>

            <button
              onClick={handleShare}
              style={actionBtn}
            >
              📤 Share
            </button>
          </div>

          <button
            onClick={() => handleDelete(post.id)}
            style={{
              width: "100%",
              marginTop: "14px",
              background: "red",
              border: "none",
              color: "white",
              padding: "14px",
              borderRadius: "12px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            🗑 Delete Post
          </button>
        </div>
      ))}

      {/* BOTTOM NAV */}
      <div
        style={{
          position: "fixed",
          bottom: "10px",
          width: "100%",
          display: "flex",
          justifyContent: "center",
          zIndex: 1000,
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "420px",
            background: "#111827",
            border: "1px solid #1e293b",
            borderRadius: "18px",
            padding: "14px 10px",
            display: "flex",
            justifyContent: "space-around",
            alignItems: "center",
            boxSizing: "border-box",
          }}
        >
          <button
            onClick={() => alert("Home")}
            style={navBtn}
          >
            🏠 Home
          </button>

          <button
            onClick={() => alert("Explore")}
            style={navBtn}
          >
            🔎 Explore
          </button>

          <button
            onClick={handlePost}
            style={navBtn}
          >
            ➕ Create
          </button>

          <button
            onClick={() => alert("Alerts")}
            style={navBtn}
          >
            🔔 Alerts
          </button>

          <button
            onClick={() => alert("Profile")}
            style={navBtn}
          >
            👤 Profile
          </button>
        </div>
      </div>
    </div>
  );
}

const iconBtn = {
  background: "transparent",
  border: "none",
  color: "white",
  cursor: "pointer",
  fontSize: "18px",
};

const actionBtn = {
  flex: 1,
  background: "#1e293b",
  border: "none",
  color: "white",
  padding: "14px",
  borderRadius: "12px",
  cursor: "pointer",
  fontWeight: "bold",
};

const navBtn = {
  background: "transparent",
  border: "none",
  color: "white",
  cursor: "pointer",
  fontSize: "14px",
};