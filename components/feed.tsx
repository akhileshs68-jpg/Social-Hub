"use client"

import { useEffect, useState } from "react"
import { ref, onValue, update } from "firebase/database"
import { database } from "../lib/firebase"

export default function Feed() {

  const [posts, setPosts] = useState<any[]>([])
  const [commentText, setCommentText] = useState("")

  useEffect(() => {

    const postsRef = ref(database, "posts")

    onValue(postsRef, (snapshot) => {

      const data = snapshot.val()

      if (data) {

        const postsArray = Object.keys(data).map((key) => ({
          firebaseId: key,
          ...data[key]
        }))

        setPosts(postsArray.reverse())

      } else {

        setPosts([])

      }

    })

  }, [])

  const handleLike = async (post: any) => {

    const postRef = ref(database, `posts/${post.firebaseId}`)

    await update(postRef, {
      likes: (post.likes || 0) + 1
    })

  }

  const handleComment = async (post: any) => {

    if (!commentText) return

    const postRef = ref(database, `posts/${post.firebaseId}`)

    const updatedComments = post.comments || []

    updatedComments.push(commentText)

    await update(postRef, {
      comments: updatedComments
    })

    setCommentText("")

    alert("Comment Added")

  }

  const handleShare = async (post: any) => {

    if (navigator.share) {

      navigator.share({
        title: "Pi Social Hub",
        text: post.content,
        url: window.location.href
      })

    } else {

      alert("Share not supported")

    }

  }

  return (

    <div>

      {posts.map((post) => (

        <div
          key={post.firebaseId}
          style={{
            background: "#111",
            padding: "10px",
            marginBottom: "20px",
            borderRadius: "20px",
            color: "white",
          }}
        >

          <p>{post.content}</p>

          {post.mediaType === "image" && (

            <img
              src={post.media}
              style={{
                width: "100%",
                borderRadius: "10px",
                marginTop: "10px"
              }}
            />

          )}

          {post.mediaType === "video" && (

            <video
              src={post.media}
              controls
              style={{
                width: "100%",
                borderRadius: "10px",
                marginTop: "10px"
              }}
            />

          )}

          <input
            type="text"
            placeholder="Write comment..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            style={{
              width: "100%",
              padding: "8px",
              marginTop: "10px",
              borderRadius: "10px"
            }}
          />

          <div
            style={{
              display: "flex",
              gap: "10px",
              marginTop: "10px",
            }}
          >

            <button onClick={() => handleLike(post)}>
              👍 Like {post.likes || 0}
            </button>

            <button onClick={() => handleComment(post)}>
              💬 Comment
            </button>

            <button onClick={() => handleShare(post)}>
              📤 Share
            </button>

          </div>

          <div style={{ marginTop: "10px" }}>

            {post.comments?.map((comment: any, index: number) => (

              <p key={index}>
                💬 {comment}
              </p>

            ))}

          </div>

        </div>

      ))}

    </div>

  )

}