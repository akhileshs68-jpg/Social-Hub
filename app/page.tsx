"use client";

import { useEffect, useState } from "react";

export default function HomePage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [postText, setPostText] = useState("");
  const [mediaUrl, setMediaUrl] = useState("");
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
    localStorage.setItem(
      "social_posts",
      JSON.stringify(posts)
    );
  }, [posts]);

  // UPLOAD IMAGE / VIDEO
  const uploadMedia = async (file: any) => {
    try {
      const formData = new FormData();

      formData.append("file", file);
      formData.append(
        "upload_preset",
        "socialhub"
      );

      const cloudName = "dqcuvxmgj";

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();

      return data.secure_url;
    } catch (error) {
      console.log(error);

      return "";
    }
  };

  // CREATE POST
  const createPost = async () => {
    if (!postText && !mediaUrl) return;

    console.log(mediaUrl);

    const newPost = {
      id: Date.now(),
      text: postText,
      media: mediaUrl,
      type: mediaUrl.includes("/video/")
       ? "video"
       : "image",
      likes: 0,
      comments: [],
    };

    setPosts([newPost, ...posts]);

    setPostText("");
    setMediaUrl("");
    setShowPostBox(false);
  };

  // LIKE
  const likePost = (id: number) => {
    const updated = posts.map((post) =>
      post.id === id
        ? {
            ...post,
            likes: post.likes + 1,
          }
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

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(to bottom, black, #111144)",
        color: "white",
        padding: "20px",
      }}
    >
      {/* CREATE BUTTON */}
      <button
        onClick={() => setShowPostBox(true)}
        style={{
          position: "fixed",
          bottom: "30px",
          right: "30px",
          width: "70px",
          height: "70px",
          borderRadius: "50%",
          border: "none",
          background:
            "linear-gradient(to right, #7e22ce, #9333ea)",
          color: "white",
          fontSize: "40px",
          cursor: "pointer",
          boxShadow:
            "0 0 25px #9333ea",
        }}
      >
        +
      </button>

      {/* POST BOX */}
      {showPostBox && (
        <div
          style={{
            width: "400px",
            maxWidth: "90%",
            margin: "40px auto",
            background: "#111",
            padding: "20px",
            borderRadius: "20px",
            boxShadow:
              "0 0 30px #9333ea",
          }}
        >
          <h1
            style={{
              marginBottom: "20px",
            }}
          >
            Create New Post
          </h1>

          <textarea
            value={postText}
            onChange={(e) =>
              setPostText(e.target.value)
            }
            placeholder="Write something..."
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

          <br />
          <br />

          <input
            type="file"
            accept="image/*,video/*"
            onChange={async (e) => {
              const file =
                e.target.files?.[0];

              if (!file) return;

              const url =
                await uploadMedia(file);

              setMediaUrl(url);
            }}
          />

          <br />
          <br />

          <button
            onClick={createPost}
            style={{
              width: "100%",
              padding: "15px",
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
      )}

      {/* POSTS */}
      <div
        style={{
          maxWidth: "600px",
          margin: "auto",
        }}
      >
        {posts.map((post) => (
          <div
            key={post.id}
            style={{
              background: "#111",
              padding: "20px",
              borderRadius: "20px",
              marginBottom: "20px",
            }}
          >
            <p>{post.text}</p>

            {post.media && (
  <>
    {post.media.includes(".mp4") ||
    post.media.includes("video") ? (
      <video
        src={post.media}
        controls
        style={{
          width: "100%",
          borderRadius: "15px",
          marginTop: "15px",
        }}
      />
    ) : (
      <img
        src={post.media}
        alt=""
        style={{
          width: "100%",
          borderRadius: "15px",
          marginTop: "15px",
        }}
      />
    )}
  </>
)}

            <div
              style={{
                display: "flex",
                gap: "20px",
                marginTop: "15px",
              }}
            >
              <button
                onClick={() =>
                  likePost(post.id)
                }
              >
                ❤️ {post.likes}
              </button>

              <button
                onClick={() =>
                  commentPost(post.id)
                }
              >
                💬 Comment
              </button>
            </div>

            {post.comments.map(
              (
                comment: string,
                index: number
              ) => (
                <p key={index}>
                  💬 {comment}
                </p>
              )
            )}
          </div>
        ))}
      </div>
    </div>
  );
}