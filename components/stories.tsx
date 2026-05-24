"use client"

import { useEffect, useState } from "react"

import {
  ref,
  push,
  onValue
} from "firebase/database"

import {
  auth,
  database
} from "../lib/firebase"

export default function Stories() {

  const [stories, setStories] =
    useState<any[]>([])

  const [media, setMedia] =
    useState("")

  const [mediaType, setMediaType] =
    useState("")

  // LOAD STORIES
  useEffect(() => {

    const storiesRef =
      ref(database, "stories")

    onValue(
      storiesRef,
      (snapshot) => {

        const data =
          snapshot.val()

        if (data) {

          const storiesArray =
            Object.keys(data).map(
              (key) => ({
                firebaseId: key,
                ...data[key]
              })
            )

          setStories(
            storiesArray.reverse()
          )

        } else {

          setStories([])

        }

      }
    )

  }, [])

  // FILE
  const handleFile = (
    e: any
  ) => {

    const file =
      e.target.files[0]

    if (!file) return

    const reader =
      new FileReader()

    reader.onloadend = () => {

      setMedia(
        reader.result as string
      )

    }

    reader.readAsDataURL(file)

    if (
      file.type.startsWith(
        "image"
      )
    ) {

      setMediaType("image")

    } else {

      setMediaType("video")

    }

  }

  // UPLOAD STORY
  const uploadStory =
    async () => {

      const user =
        auth.currentUser

      if (!user) {

        alert("Login First")

        return

      }

      if (!media) {

        alert("Select File")

        return

      }

      await push(
        ref(database, "stories"),
        {

          username:
            user.displayName,

          email:
            user.email,

          media,

          mediaType,

          createdAt:
            Date.now()

        }
      )

      alert(
        "Story Uploaded"
      )

      setMedia("")
      setMediaType("")

    }

  return (

    <div
      style={{
        marginBottom: "25px"
      }}
    >

      {/* UPLOAD */}
      <div
        style={{
          background: "#111",
          padding: "18px",
          borderRadius: "20px",
          marginBottom: "20px"
        }}
      >

        <input
          type="file"
          onChange={handleFile}
          style={{
            color: "white",
            marginBottom: "15px"
          }}
        />

        <button
          onClick={uploadStory}
          style={{
            width: "100%",
            padding: "12px",
            borderRadius: "12px",
            border: "none",
            background:
              "#ff00ff",
            color: "white",
            cursor: "pointer",
            fontWeight: "bold"
          }}
        >
          Upload Story
        </button>

      </div>

      {/* STORIES */}
      <div
        style={{
          display: "flex",
          overflowX: "auto",
          gap: "15px"
        }}
      >

        {stories.map((story) => (

          <div
            key={story.firebaseId}
            style={{
              minWidth: "120px",
              background: "#111",
              borderRadius: "20px",
              overflow: "hidden"
            }}
          >

            {/* IMAGE */}
            {story.mediaType ===
              "image" && (

              <img
                src={story.media}
                style={{
                  width: "120px",
                  height: "180px",
                  objectFit: "cover"
                }}
              />

            )}

            {/* VIDEO */}
            {story.mediaType ===
              "video" && (

              <video
                src={story.media}
                style={{
                  width: "120px",
                  height: "180px",
                  objectFit: "cover"
                }}
              />

            )}

            {/* USER */}
            <div
              style={{
                padding: "10px",
                color: "white",
                textAlign: "center"
              }}
            >

              {story.username}

            </div>

          </div>

        ))}

      </div>

    </div>

  )

}