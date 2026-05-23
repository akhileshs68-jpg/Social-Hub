"use client";

import { useEffect, useState } from "react";

export default function HomePage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [postText, setPostText] = useState("");
  const [mediaUrl, setMediaUrl] = useState("");
  const [mediaType, setMediaType] = useState("image");
  const [showPostBox, setShowPostBox] = useState(false);

  // LOAD POSTS
  useEffect(() => {
    const savedPosts = localStorage.getItem("social_posts");

    if (savedPosts) {
      setPosts(JSON.parse(savedPosts));
    }
  }, []);

  // SAVE POSTS
  useEffect(() => {
    localStorage.setItem("social_posts", JSON.stringify(posts));
  }, [posts]);

  // UPLOAD IMAGE / VIDEO
  const uploadMedia = async (file: any) => {
    const formData = new FormData();

    formData.append("file", file);
    formData.append("upload_preset", "socialhub");

    const cloudName =
      process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await res.json();

    return data.secure_url;
  };

  // CREATE POST
  const createPost = async () => {
    if (!postText || !mediaUrl) return;

    const newPost = {
      id: Date.now(),
      text: postText,
      media: mediaUrl,
      type: mediaType,
      likes: 0,
      comments: [],
    };

    const updatedPosts = [newPost, ...posts];

    setPosts(updatedPosts);

    setPostText("");
    setMediaUrl("");
    setShowPostBox(false);
  };

  // LIKE
  const likePost = (id: number) => {
    const updated = posts.map((post) =>
      post.id === id
        ? { ...post, likes: post.likes + 1 }
        : post
    );

    setPosts(updated);
  };

  // COMMENT
  const commentPost = (id: number) => {
    const text = prompt("Write comment");

    if (!text) return;

    const updated = posts.map((post) =>
      post.id === id
        ? {
            ...post,
            comments: [...post.comments, text],
          }
        : post
    );

    setPosts(updated);
  };

  // SHARE
  const sharePost = async (post: any) => {
    await navigator.share({
      title: "Pi Social Hub",
      text: post.text,
      url: window.location.href,
    });
  };

  return (
    <main
      style={{
        background:
          "linear-gradient(to bottom,#050505,#111827,#1e1b4b)",
        minHeight: "100vh",
        paddingBottom: "120px",
      }}
    >
      {/* POSTS */}
      <div
        style={{
          maxWidth: "900px",
          margin: "auto",
          padding: "20px",
        }}
      >
        {posts.map((post) => (
          <div
            key={post.id}
            style={{
              background: "#111827",
              borderRadius: "20px",
              overflow: "hidden",
              marginBottom: "30px",
              border: "1px solid #9333ea",
              boxShadow: "0 0 20px #7e22ce",
            }}
          >
            {/* HEADER */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                padding: "20px",
                gap: "15px",
              }}
            >
              <div
                style={{
                  width: "60px",
                  height: "60px",
                  borderRadius: "50%",
                  background:
                    "linear-gradient(to bottom,#9333ea,#4c1d95)",
                }}
              />

              <div>
                <h2
                  style={{
                    margin: 0,
                    color: "white",
                  }}
                >
                  Akhilesh
                </h2>

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

            {/* MEDIA */}
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

            {/* TEXT */}
            <div style={{ padding: "25px" }}>
              <p
                style={{
                  color: "white",
                  fontSize: "22px",
                }}
              >
                {post.text}
              </p>
            </div>

            {/* BUTTONS */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-around",
                paddingBottom: "25px",
              }}
            >
              <button
                onClick={() => likePost(post.id)}
                style={{
                  background: "#6d28d9",
                  color: "white",
                  border: "none",
                  padding: "15px 25px",
                  borderRadius: "15px",
                  cursor: "pointer",
                  fontSize: "18px",
                }}
              >
                ❤️ {post.likes} Likes
              </button>

              <button
                onClick={() => commentPost(post.id)}
                style={{
                  background: "#6d28d9",
                  color: "white",
                  border: "none",
                  padding: "15px 25px",
                  borderRadius: "15px",
                  cursor: "pointer",
                  fontSize: "18px",
                }}
              >
                💬 Comment
              </button>

              <button
                onClick={() => sharePost(post)}
                style={{
                  background: "#6d28d9",
                  color: "white",
                  border: "none",
                  padding: "15px 25px",
                  borderRadius: "15px",
                  cursor: "pointer",
                  fontSize: "18px",
                }}
              >
                📤 Share
              </button>
            </div>

            {/* COMMENTS */}
            <div style={{ padding: "20px" }}>
              {post.comments.map(
                (comment: string, index: number) => (
                  <div
                    key={index}
                    style={{
                      background: "#1f2937",
                      padding: "12px",
                      borderRadius: "10px",
                      color: "white",
                      marginBottom: "10px",
                    }}
                  >
                    {comment}
                  </div>
                )
              )}
            </div>
          </div>
        ))}
      </div>

      {/* CREATE POST BOX */}
      {showPostBox && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.7)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 100,
          }}
        >
          <div
            style={{
              width: "500px",
              background: "#111",
              padding: "30px",
              borderRadius: "20px",
              boxShadow: "0 0 30px #9333ea",
            }}
          >
            <h1 style={{ color: "white" }}>
              Create New Post
            </h1>

            <textarea
              placeholder="Write something..."
              value={postText}
              onChange={(e) =>
                setPostText(e.target.value)
              }
              style={{
                width: "100%",
                height: "120px",
                background: "#222",
                color: "white",
                border: "none",
                padding: "15px",
                borderRadius: "10px",
              }}
            />

            <input
              type="file"
              accept="image/*,video/*"
              onChange={async (e: any) => {
                const file = e.target.files[0];

                if (!file) return;

                if (file.type.startsWith("video")) {
                  setMediaType("video");
                } else {
                  setMediaType("image");
                }

                const uploaded =
                  await uploadMedia(file);

                setMediaUrl(uploaded);
              }}
              style={{
                width: "100%",
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
                  "linear-gradient(to right,#7e22ce,#9333ea)",
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

      {/* FLOAT BUTTON */}
      <button
        onClick={() => setShowPostBox(true)}
        style={{
          position: "fixed",
          bottom: "40px",
          right: "40px",
          width: "90px",
          height: "90px",
          borderRadius: "50%",
          border: "none",
          background:
            "linear-gradient(to bottom,#9333ea,#6d28d9)",
          color: "white",
          fontSize: "50px",
          cursor: "pointer",
          boxShadow: "0 0 30px #9333ea",
        }}
      >
        +
      </button>
    </main>
  );
}