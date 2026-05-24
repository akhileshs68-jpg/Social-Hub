"use client";

import { useEffect, useState } from "react";

export default function Feed() {
  const [posts, setPosts] = useState<any[]>([]);

  useEffect(() => {
    const savedPosts = localStorage.getItem("social_posts");

    if (savedPosts) {
      setPosts(JSON.parse(savedPosts));
    }
  }, []);

  const likePost = (id: number) => {
    const updated = posts.map((post) =>
      post.id === id
        ? { ...post, likes: post.likes + 1 }
        : post
    );

    setPosts(updated);
    localStorage.setItem(
      "social_posts",
      JSON.stringify(updated)
    );
  };

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

    localStorage.setItem(
      "social_posts",
      JSON.stringify(updated)
    );
  };

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "700px",
        margin: "20px auto",
      }}
    >
      {posts.map((post) => (
        <div
          key={post.id}
          style={{
            background: "#0d0d0d",
            padding: "20px",
            borderRadius: "20px",
            marginBottom: "25px",
            color: "white",
            boxShadow: "0 0 20px rgba(128,0,255,0.2)",
          }}
        >
          <h3>{post.text}</h3>

          {/* IMAGE */}
          {post.media &&
            !post.media.includes(".mp4") && (
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

          {/* VIDEO */}
          {post.media &&
            post.media.includes(".mp4") && (
              <video
                src={post.media}
                controls
                style={{
                  width: "100%",
                  borderRadius: "15px",
                  marginTop: "15px",
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
            <button
              onClick={() => likePost(post.id)}
              style={{
                padding: "8px 14px",
                borderRadius: "10px",
                border: "none",
                cursor: "pointer",
              }}
            >
              ❤️ {post.likes}
            </button>

            <button
              onClick={() =>
                commentPost(post.id)
              }
              style={{
                padding: "8px 14px",
                borderRadius: "10px",
                border: "none",
                cursor: "pointer",
              }}
            >
              💬 Comment
            </button>

            <button
              onClick={async () => {
                try {
                  const postLink =
                    window.location.href;

                  await navigator.clipboard.writeText(
                    postLink
                  );

                  alert("Post link copied!");
                } catch (err) {
                  alert(
                    "Clipboard permission denied"
                  );
                }
              }}
              style={{
                padding: "8px 14px",
                borderRadius: "10px",
                border: "none",
                cursor: "pointer",
              }}
            >
              📤 Share
            </button>
          </div>

          {/* COMMENTS */}
          <div style={{ marginTop: "15px" }}>
            {post.comments?.map(
              (
                comment: string,
                index: number
              ) => (
                <p
                  key={index}
                  style={{
                    background: "#1a1a1a",
                    padding: "8px",
                    borderRadius: "8px",
                    marginTop: "8px",
                  }}
                >
                  💬 {comment}
                </p>
              )
            )}
          </div>
        </div>
      ))}
    </div>
  );
}