"use client"

import { useEffect, useState } from "react"

import {
  ref,
  onValue,
  update,
  remove
} from "firebase/database"

import {
  database,
  auth
} from "../lib/firebase"

export default function Feed() {

  const [posts, setPosts] =
    useState<any[]>([])

  const [commentText, setCommentText] =
    useState("")

  // LOAD POSTS
  useEffect(() => {

    const postsRef =
      ref(database, "posts")

    onValue(postsRef, (snapshot) => {

      const data =
        snapshot.val()

      if (data) {

        const postsArray =
          Object.keys(data).map(
            (key) => ({
              firebaseId: key,
              ...data[key]
            })
          )

        setPosts(
          postsArray.reverse()
        )

      } else {

        setPosts([])

      }

    })

  }, [])

  // LIKE
  const handleLike =
    async (post: any) => {

      const postRef =
        ref(
          database,
          `posts/${post.firebaseId}`
        )

      await update(postRef, {

        likes:
          (post.likes || 0) + 1

      })

    }

  // COMMENT
  const handleComment =
    async (post: any) => {

      if (!commentText) return

      const postRef =
        ref(
          database,
          `posts/${post.firebaseId}`
        )

      const updatedComments =
        post.comments || []

      updatedComments.push({

        username:
          auth.currentUser
            ?.displayName ||
          "Pioneer",

        text: commentText

      })

      await update(postRef, {

        comments:
          updatedComments

      })

      setCommentText("")

    }

  // SHARE
  const handleShare =
    async (post: any) => {

      if (navigator.share) {

        navigator.share({

          title:
            "Pi Social Hub",

          text:
            post.content,

          url:
            window.location.href

        })

      }

    }

  // DELETE
  const deletePost =
    async (post: any) => {

      const confirmDelete =
        confirm(
          "Delete this post?"
        )

      if (!confirmDelete) return

      await remove(
        ref(
          database,
          `posts/${post.firebaseId}`
        )
      )

    }

  return (

    <div>

      {posts.map((post) => (

        <div
          key={post.firebaseId}
          style={{
            background: "#111",
            padding: "18px",
            marginBottom: "25px",
            borderRadius: "22px",
            color: "white"
          }}
        >

          {/* TOP */}
          <div
            style={{
              display: "flex",
              justifyContent:
                "space-between",
              marginBottom: "15px"
            }}
          >

            <div
              style={{
                display: "flex",
                gap: "12px",
                alignItems:
                  "center"
              }}
            >

              {/* AVATAR */}
              <img
                src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
                style={{
                  width: "50px",
                  height: "50px",
                  borderRadius:
                    "50%"
                }}
              />

              <div>

                <h3>
                  {post.username}
                </h3>

                <p
                  style={{
                    color: "#999",
                    fontSize:
                      "13px"
                  }}
                >
                  {new Date(
                    post.createdAt
                  ).toLocaleString()}
                </p>

              </div>

            </div>

            {/* DELETE */}
            <button
              onClick={() =>
                deletePost(post)
              }
              style={{
                background:
                  "transparent",
                border: "none",
                color: "red",
                cursor:
                  "pointer"
              }}
            >
              Delete
            </button>

          </div>

          {/* CONTENT */}
          <p
            style={{
              marginBottom: "15px"
            }}
          >
            {post.content}
          </p>

          {/* IMAGE */}
          {post.mediaType ===
            "image" && (

            <img
              src={post.media}
              style={{
                width: "100%",
                borderRadius:
                  "18px",
                marginBottom:
                  "15px"
              }}
            />

          )}

          {/* VIDEO */}
          {post.mediaType ===
            "video" && (

            <video
              src={post.media}
              controls
              style={{
                width: "100%",
                borderRadius:
                  "18px",
                marginBottom:
                  "15px"
              }}
            />

          )}

          {/* ACTIONS */}
          <div
            style={{
              display: "flex",
              gap: "12px",
              marginBottom:
                "15px"
            }}
          >

            <button
              onClick={() =>
                handleLike(post)
              }
              style={{
                background:
                  "#222",
                border: "none",
                padding:
                  "10px 15px",
                borderRadius:
                  "10px",
                color: "white",
                cursor:
                  "pointer"
              }}
            >
              ❤️ {
                post.likes || 0
              }
            </button>

            <button
              onClick={() =>
                handleShare(post)
              }
              style={{
                background:
                  "#222",
                border: "none",
                padding:
                  "10px 15px",
                borderRadius:
                  "10px",
                color: "white",
                cursor:
                  "pointer"
              }}
            >
              📤 Share
            </button>

          </div>

          {/* COMMENT INPUT */}
          <input
            value={commentText}
            onChange={(e) =>
              setCommentText(
                e.target.value
              )
            }
            placeholder="Write comment..."
            style={{
              width: "100%",
              padding: "12px",
              borderRadius:
                "12px",
              border:
                "1px solid #333",
              background:
                "#1a1a1a",
              color: "white",
              marginBottom:
                "12px"
            }}
          />

          {/* COMMENT BUTTON */}
          <button
            onClick={() =>
              handleComment(post)
            }
            style={{
              width: "100%",
              padding: "12px",
              borderRadius:
                "12px",
              border: "none",
              background:
                "#ff00ff",
              color: "white",
              cursor:
                "pointer",
              marginBottom:
                "15px"
            }}
          >
            Add Comment
          </button>

          {/* COMMENTS */}
          <div>

            {post.comments &&
              post.comments.map(
                (
                  comment: any,
                  index: number
                ) => (

                  <div
                    key={index}
                    style={{
                      background:
                        "#1a1a1a",
                      padding:
                        "10px",
                      borderRadius:
                        "10px",
                      marginBottom:
                        "10px"
                    }}
                  >

                    <h4
                      style={{
                        color:
                          "#ff00ff"
                      }}
                    >
                      {
                        comment.username
                      }
                    </h4>

                    <p>
                      {
                        comment.text
                      }
                    </p>

                  </div>

                )
              )}

          </div>

        </div>

      ))}

    </div>

  )

}