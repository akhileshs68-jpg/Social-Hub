"use client"

import { useState } from "react"
import { ref, push } from "firebase/database"
import { database } from "../lib/firebase"

export default function CreatePost() {

  const [content, setContent] = useState("")
  const [mediaPreview, setMediaPreview] = useState("")
  const [mediaType, setMediaType] = useState("")
  const [media, setMedia] = useState<any>(null)

  const handleFile = (e: any) => {

    const file = e.target.files[0]

    if (!file) return

    setMedia(file)

    const reader = new FileReader()

    reader.onloadend = () => {

      setMediaPreview(reader.result as string)

      if (file.type.startsWith("video")) {
        setMediaType("video")
      } else {
        setMediaType("image")
      }
    }

    reader.readAsDataURL(file)
  }

  const handlePost = async () => {

    const newPost = {
      id: Date.now(),
      content,
      media: mediaPreview,
      mediaType,
      likes: 0,
      comments: [],
      shares: 0,
      createdAt: new Date().toISOString(),
    }

    await push(ref(database, "posts"), newPost)

    setContent("")
    setMedia(null)
    setMediaPreview("")
    setMediaType("")

    alert("Post Created")
  }

  return (
    <div
      style={{
        background: "#111",
        padding: "20px",
        borderRadius: "20px",
        marginBottom: "20px",
        color: "white",
      }}
    >

      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="What's on your mind?"
        style={{
          width: "100%",
          height: "100px",
          borderRadius: "10px",
          padding: "10px",
          marginBottom: "10px",
        }}
      />

      <input
        type="file"
        onChange={handleFile}
      />

      <br />

      <button
        onClick={handlePost}
        style={{
          marginTop: "10px",
          background: "purple",
          color: "white",
          padding: "10px 20px",
          borderRadius: "10px",
          border: "none",
          cursor: "pointer",
        }}
      >
        Post
      </button>

    </div>
  )
}