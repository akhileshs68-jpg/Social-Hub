"use client"

import { useState } from "react"

import {
  ref,
  push
} from "firebase/database"

import {
  auth,
  database
} from "../lib/firebase"

export default function CreatePost() {

  const [content, setContent] =
    useState("")

  const [mediaPreview, setMediaPreview] =
    useState("")

  const [mediaType, setMediaType] =
    useState("")

  // FILE
  const handleFile = (
    e: any
  ) => {

    const file = e.target.files[0]

    if (!file) return

    const reader = new FileReader()

    reader.onloadend = () => {

      setMediaPreview(
        reader.result as string
      )

    }

    reader.readAsDataURL(file)

    // TYPE
    if (
      file.type.startsWith("image")
    ) {

      setMediaType("image")

    } else {

      setMediaType("video")

    }

  }

  // POST
  const createPost = async () => {

    if (
      !content &&
      !mediaPreview
    ) {
      return
    }

    const user = auth.currentUser

    if (!user) {

      alert("Login First")

      return

    }

    await push(
      ref(database, "posts"),
      {

        username:
          user.displayName ||
          "Pioneer",

        email:
          user.email,

        content,

        media:
          mediaPreview,

        mediaType,

        likes: 0,

        comments: 0,

        shares: 0,

        createdAt:
          Date.now()

      }
    )

    alert("Post Created")

    setContent("")
    setMediaPreview("")
    setMediaType("")

  }

  return (

    <div
      style={{
        background: "#111",
        padding: "20px",
        borderRadius: "20px",
        marginBottom: "25px"
      }}
    >

      {/* TEXTAREA */}
      <textarea
        value={content}
        onChange={(e) =>
          setContent(
            e.target.value
          )
        }
        placeholder="What's on your mind?"
        style={{
          width: "100%",
          minHeight: "120px",
          background: "#1a1a1a",
          border: "1px solid #333",
          borderRadius: "15px",
          padding: "15px",
          color: "white",
          resize: "none",
          marginBottom: "15px"
        }}
      />

      {/* FILE */}
      <input
        type="file"
        onChange={handleFile}
        style={{
          marginBottom: "20px",
          color: "white"
        }}
      />

      {/* IMAGE PREVIEW */}
      {mediaType === "image" &&
        mediaPreview && (

          <img
            src={mediaPreview}
            style={{
              width: "100%",
              borderRadius: "15px",
              marginBottom: "15px"
            }}
          />

        )}

      {/* VIDEO PREVIEW */}
      {mediaType === "video" &&
        mediaPreview && (

          <video
            src={mediaPreview}
            controls
            style={{
              width: "100%",
              borderRadius: "15px",
              marginBottom: "15px"
            }}
          />

        )}

      {/* BUTTON */}
      <button
        onClick={createPost}
        style={{
          width: "100%",
          padding: "15px",
          border: "none",
          borderRadius: "12px",
          background: "#ff00ff",
          color: "white",
          fontWeight: "bold",
          cursor: "pointer",
          fontSize: "16px"
        }}
      >
        Create Post
      </button>

    </div>

  )

}