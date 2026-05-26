"use client";

import { useState } from "react";

export default function Home() {

  const [text, setText] = useState("");
  const [image, setImage] = useState("");
  const [video, setVideo] = useState("");
  const [reel, setReel] = useState("");

  const [posts, setPosts] = useState<any[]>([]);

  const handlePost = () => {

    if (!text && !image && !video && !reel) {
      alert("Create something first");
      return;
    }

    const newPost = {
      id: Date.now(),
      text,
      image,
      video,
      reel,
      likes: 0,
    };

    setPosts([newPost, ...posts]);

    setText("");
    setImage("");
    setVideo("");
    setReel("");
  };

  return (

    <div
      style={{
        background: "#020617",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        paddingBottom: "100px",
      }}
    >

      {/* TOP BAR */}

      <div
        style={{
          width: "100%",
          background: "#0f172a",
          padding: "15px",
          display: "flex",
          justifyContent: "center",
          position: "sticky",
          top: 0,
          zIndex: 1000,
        }}
      >

        <div
          style={{
            width: "100%",
            maxWidth: "500px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >

          <h1
            style={{
              color: "white",
              fontSize: "30px",
              margin: 0,
            }}
          >
            Pi Social Hub
          </h1>

          <div
            style={{
              display: "flex",
              gap: "15px",
              alignItems: "center",
              color: "white",
            }}
          >
            <button style={topBtn}>🏠</button>
            <button style={topBtn}>🔎</button>
            <button style={topBtn}>🔔</button>
            <button style={topBtn}>👤</button>

            <button
              style={{
                background: "#ff00ff",
                border: "none",
                color: "white",
                padding: "10px 15px",
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

      {/* STORIES */}

      <div
        style={{
          width: "100%",
          maxWidth: "500px",
          display: "flex",
          gap: "20px",
          overflowX: "auto",
          padding: "20px 10px",
          boxSizing: "border-box",
        }}
      >

        {["You", "Pi", "Tech", "Crypto"].map((item, i) => (

          <div
            key={i}
            style={{
              textAlign: "center",
              color: "white",
            }}
          >

            <img
              src={`https://i.pravatar.cc/150?img=${i + 5}`}
              style={{
                width: "65px",
                height: "65px",
                borderRadius: "50%",
                border: "3px solid #ff00ff",
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
          maxWidth: "500px",
          background: "#111827",
          borderRadius: "20px",
          padding: "20px",
          boxSizing: "border-box",
        }}
      >

        <h2
          style={{
            color: "white",
            marginTop: 0,
          }}
        >
          Create Post
        </h2>

        {/* HIDDEN INPUTS */}

        <input
          type="file"
          id="photoInput"
          accept="image/*"
          style={{ display: "none" }}
          onChange={(e: any) => {

            const file = e.target.files[0];

            if (file) {
              setImage(URL.createObjectURL(file));
            }
          }}
        />

        <input
          type="file"
          id="videoInput"
          accept="video/*"
          style={{ display: "none" }}
          onChange={(e: any) => {

            const file = e.target.files[0];

            if (file) {
              setVideo(URL.createObjectURL(file));
            }
          }}
        />

        <input
          type="file"
          id="reelInput"
          accept="video/*"
          style={{ display: "none" }}
          onChange={(e: any) => {

            const file = e.target.files[0];

            if (file) {
              setReel(URL.createObjectURL(file));
            }
          }}
        />

        {/* TEXTAREA */}

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="What's happening in Pi Network?"
          style={{
            width: "100%",
            height: "110px",
            borderRadius: "15px",
            border: "none",
            background: "#1e293b",
            color: "white",
            padding: "15px",
            boxSizing: "border-box",
            resize: "none",
            outline: "none",
          }}
        />

        {/* BUTTONS */}

        <div
          style={{
            display: "flex",
            gap: "10px",
            marginTop: "15px",
          }}
        >

          <button
            style={actionBtn}
            onClick={() =>
              document.getElementById("photoInput")?.click()
            }
          >
            📷 Photo
          </button>

          <button
            style={actionBtn}
            onClick={() =>
              document.getElementById("videoInput")?.click()
            }
          >
            🎥 Video
          </button>

          <button
            style={actionBtn}
            onClick={() =>
              document.getElementById("reelInput")?.click()
            }
          >
            🎞 Reels
          </button>

        </div>

        {/* PREVIEW */}

        {image && (
          <img
            src={image}
            style={{
              width: "100%",
              marginTop: "15px",
              borderRadius: "15px",
            }}
          />
        )}

        {video && (
          <video
            src={video}
            controls
            style={{
              width: "100%",
              marginTop: "15px",
              borderRadius: "15px",
            }}
          />
        )}

        {reel && (
          <video
            src={reel}
            controls
            autoPlay
            loop
            style={{
              width: "100%",
              marginTop: "15px",
              borderRadius: "15px",
            }}
          />
        )}

        {/* POST BUTTON */}

        <button
          onClick={handlePost}
          style={{
            width: "100%",
            marginTop: "15px",
            padding: "15px",
            background: "#ff00ff",
            border: "none",
            borderRadius: "15px",
            color: "white",
            fontWeight: "bold",
            cursor: "pointer",
            fontSize: "16px",
          }}
        >
          🚀 Publish Post
        </button>

      </div>

      {/* POSTS */}

      <div
        style={{
          width: "100%",
          maxWidth: "500px",
          marginTop: "20px",
        }}
      >

        {posts.map((post) => (

          <div
            key={post.id}
            style={{
              background: "#111827",
              borderRadius: "20px",
              padding: "15px",
              marginBottom: "20px",
              color: "white",
            }}
          >

            <h3>You</h3>

            <p>{post.text}</p>

            {post.image && (
              <img
                src={post.image}
                style={{
                  width: "100%",
                  borderRadius: "15px",
                }}
              />
            )}

            {post.video && (
              <video
                src={post.video}
                controls
                style={{
                  width: "100%",
                  borderRadius: "15px",
                }}
              />
            )}

            {post.reel && (
              <video
                src={post.reel}
                controls
                autoPlay
                loop
                style={{
                  width: "100%",
                  borderRadius: "15px",
                }}
              />
            )}

            <div
              style={{
                display: "flex",
                gap: "10px",
                marginTop: "15px",
              }}
            >

              <button style={actionBtn}>❤️ Like</button>
              <button style={actionBtn}>💬 Comment</button>
              <button style={actionBtn}>📤 Share</button>

            </div>

          </div>

        ))}

      </div>

      {/* BOTTOM NAVBAR */}

      <div
        style={{
          position: "fixed",
          bottom: "10px",
          width: "100%",
          display: "flex",
          justifyContent: "center",
        }}
      >

        <div
          style={{
            width: "95%",
            maxWidth: "500px",
            background: "#111827",
            borderRadius: "20px",
            padding: "15px",
            display: "flex",
            justifyContent: "space-around",
            color: "white",
          }}
        >

          <button style={bottomBtn}>🏠 Home</button>
          <button style={bottomBtn}>🔎 Explore</button>
          <button style={bottomBtn}>➕ Create</button>
          <button style={bottomBtn}>🔔 Alerts</button>
          <button style={bottomBtn}>👤 Profile</button>

        </div>

      </div>

    </div>
  );
}

const topBtn: any = {
  background: "transparent",
  border: "none",
  color: "white",
  cursor: "pointer",
  fontSize: "18px",
};

const actionBtn: any = {
  flex: 1,
  padding: "12px",
  background: "#1e293b",
  border: "none",
  borderRadius: "12px",
  color: "white",
  cursor: "pointer",
};

const bottomBtn: any = {
  background: "transparent",
  border: "none",
  color: "white",
  cursor: "pointer",
};