"use client";

import { useState } from "react";

export default function HomePage() {
  const [likes, setLikes] = useState(1);

  const [posts, setPosts] = useState([
    {
      text: "Welcome to Pi Social Hub 🚀",
      media:
        "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1200&auto=format&fit=crop",
      type: "image",
    },
  ]);

  const [showPostBox, setShowPostBox] = useState(false);
  const [postText, setPostText] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [mediaType, setMediaType] = useState("image");

  const createPost = () => {
    if (!postText || !imageUrl) return;

    const newPost = {
      text: postText,
      media: imageUrl,
      type: mediaType,
    };

    setPosts((prev) => [newPost, ...prev]);

    setPostText("");
    setImageUrl("");
    setMediaType("image");
    setShowPostBox(false);
  };

  return (
    <main
      style={{
        background:
          "linear-gradient(to bottom, #050505, #111827, #1e1b4b)",
        minHeight: "100vh",
        color: "white",
        paddingBottom: "100px",
        fontFamily: "Arial",
      }}
    >
      {/* Header */}
      <div
        style={{
          textAlign: "center",
          padding: "25px",
          fontSize: "45px",
          fontWeight: "bold",
          color: "#c084fc",
          textShadow: "0 0 25px #9333ea",
        }}
      >
        Pi Social Hub 🚀
      </div>

      {/* Feed */}
      {posts.map((post, index) => (
        <div
          key={index}
          style={{
            background: "#1e1e35",
            margin: "20px",
            borderRadius: "25px",
            overflow: "hidden",
            border: "1px solid #9333ea",
            boxShadow: "0 0 20px rgba(147,51,234,0.5)",
          }}
        >
          {/* Profile */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              padding: "20px",
            }}
          >
            <div
              style={{
                width: "60px",
                height: "60px",
                borderRadius: "50%",
                background:
                  "linear-gradient(to bottom, #9333ea, #6b21a8)",
              }}
            />

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

          {/* Media */}
          {post.type === "video" ? (
            <video
              src={post.media}
              controls
              style={{
                width: "100%",
                height: "500px",
                objectFit: "cover",
              }}
            />
          ) : (
            <img
              src={post.media}
              alt="post"
              style={{
                width: "100%",
                height: "500px",
                objectFit: "cover",
              }}
            />
          )}

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
                  background:
                    "linear-gradient(to right, #7e22ce, #9333ea)",
                  border: "none",
                  padding: "15px 30px",
                  borderRadius: "15px",
                  color: "white",
                  fontSize: "18px",
                  cursor: "pointer",
                }}
              >
                ❤️ {likes} Likes
              </button>

              <button
                style={{
                  background:
                    "linear-gradient(to right, #7e22ce, #9333ea)",
                  border: "none",
                  padding: "15px 30px",
                  borderRadius: "15px",
                  color: "white",
                  fontSize: "18px",
                }}
              >
                💬 Comment
              </button>

              <button
                style={{
                  background:
                    "linear-gradient(to right, #7e22ce, #9333ea)",
                  border: "none",
                  padding: "15px 30px",
                  borderRadius: "15px",
                  color: "white",
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
          right: "30px",
          bottom: "30px",
          width: "80px",
          height: "80px",
          borderRadius: "50%",
          border: "none",
          background:
            "linear-gradient(to bottom, #9333ea, #6b21a8)",
          color: "white",
          fontSize: "40px",
          cursor: "pointer",
          boxShadow: "0 0 30px #9333ea",
        }}
      >
        +
      </button>

      {/* Post Popup */}
      {showPostBox && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.7)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              width: "500px",
              background: "#111",
              padding: "30px",
              borderRadius: "25px",
              border: "1px solid #9333ea",
              boxShadow: "0 0 25px #9333ea",
            }}
          >
            <h2>Create New Post</h2>

            <textarea
              placeholder="Write something..."
              value={postText}
              onChange={(e) => setPostText(e.target.value)}
              style={{
                width: "100%",
                height: "120px",
                padding: "15px",
                borderRadius: "15px",
                background: "#222",
                color: "white",
                border: "none",
                marginTop: "15px",
              }}
            />

            <input
              type="file"
              accept="image/*,video/*"
              onChange={(e) => {
                const file = e.target.files?.[0];

                if (file) {
                  const fileUrl =
                    URL.createObjectURL(file);

                  setImageUrl(fileUrl);

                  if (
                    file.type.startsWith("video")
                  ) {
                    setMediaType("video");
                  } else {
                    setMediaType("image");
                  }
                }
              }}
              style={{
                marginTop: "20px",
                color: "white",
              }}
            />

            <button
              onClick={createPost}
              style={{
                width: "100%",
                marginTop: "25px",
                padding: "18px",
                borderRadius: "15px",
                border: "none",
                background:
                  "linear-gradient(to right, #7e22ce, #9333ea)",
                color: "white",
                fontSize: "20px",
                cursor: "pointer",
              }}
            >
              🚀 Post Now
            </button>
          </div>
        </div>
      )}
    </main>
  );
}