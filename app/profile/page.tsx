"use client"

import { useEffect, useState } from "react"
import { ref, onValue, set } from "firebase/database"
import { database } from "../../lib/firebase"

export default function ProfilePage() {

  const [profile, setProfile] = useState({
    name: "Akhilesh Singh",
    bio: "Pi Network Social User 🚀",
    avatar: "",
    followers: 100,
    following: 50
  })

  const [posts, setPosts] = useState<any[]>([])

  // Load Profile Realtime
  useEffect(() => {

    const profileRef = ref(database, "profile")

    onValue(profileRef, (snapshot) => {

      const data = snapshot.val()

      if (data) {
        setProfile(data)
      }

    })

  }, [])

  // Load Posts Realtime
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

  // Upload Avatar
  const handleImage = (e: any) => {

    const file = e.target.files[0]

    if (!file) return

    const reader = new FileReader()

    reader.onloadend = () => {

      setProfile({
        ...profile,
        avatar: reader.result as string
      })

    }

    reader.readAsDataURL(file)

  }

  // Save Profile
  const saveProfile = async () => {

    await set(ref(database, "profile"), profile)

    alert("Profile Saved Successfully")

  }

  return (

    <div
      style={{
        background: "#000",
        minHeight: "100vh",
        color: "white",
        paddingBottom: "100px"
      }}
    >

      {/* PROFILE CARD */}
      <div
        style={{
          width: "92%",
          maxWidth: "700px",
          margin: "20px auto",
          background: "#111",
          borderRadius: "25px",
          padding: "25px",
          boxShadow: "0 0 25px rgba(255,0,255,0.2)"
        }}
      >

        {/* TOP */}
        <div
          style={{
            display: "flex",
            gap: "20px",
            alignItems: "center",
            flexWrap: "wrap"
          }}
        >

          {/* PROFILE IMAGE */}
          <div>

            <img
              src={
                profile.avatar ||
                "https://cdn-icons-png.flaticon.com/512/149/149071.png"
              }
              style={{
                width: "120px",
                height: "120px",
                borderRadius: "50%",
                objectFit: "cover",
                border: "4px solid #ff00ff"
              }}
            />

          </div>

          {/* USER INFO */}
          <div
            style={{
              flex: 1
            }}
          >

            <input
              value={profile.name}
              onChange={(e) =>
                setProfile({
                  ...profile,
                  name: e.target.value
                })
              }
              placeholder="Enter Name"
              style={{
                width: "100%",
                background: "#1a1a1a",
                color: "white",
                border: "1px solid #333",
                borderRadius: "10px",
                padding: "12px",
                fontSize: "30px",
                fontWeight: "bold",
                marginBottom: "10px"
              }}
            />

            <textarea
              value={profile.bio}
              onChange={(e) =>
                setProfile({
                  ...profile,
                  bio: e.target.value
                })
              }
              placeholder="Enter Bio"
              style={{
                width: "100%",
                height: "90px",
                background: "#1a1a1a",
                color: "white",
                border: "1px solid #333",
                borderRadius: "10px",
                padding: "12px",
                fontSize: "16px",
                resize: "none"
              }}
            />

          </div>

        </div>

        {/* STATS */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
            marginTop: "35px",
            textAlign: "center"
          }}
        >

          <div>
            <h1>{posts.length}</h1>
            <p>Posts</p>
          </div>

          <div>
            <h1>{profile.followers}</h1>
            <p>Followers</p>
          </div>

          <div>
            <h1>{profile.following}</h1>
            <p>Following</p>
          </div>

        </div>

        {/* IMAGE INPUT */}
        <div
          style={{
            marginTop: "25px"
          }}
        >

          <input
            type="file"
            onChange={handleImage}
            style={{
              color: "white"
            }}
          />

        </div>

        {/* SAVE BUTTON */}
        <button
          onClick={saveProfile}
          style={{
            width: "100%",
            marginTop: "20px",
            padding: "15px",
            background: "linear-gradient(90deg,#ff00ff,#9900ff)",
            border: "none",
            borderRadius: "12px",
            color: "white",
            fontSize: "18px",
            fontWeight: "bold",
            cursor: "pointer"
          }}
        >
          Save Profile
        </button>

      </div>

      {/* MY POSTS */}
      <div
        style={{
          width: "92%",
          maxWidth: "700px",
          margin: "auto"
        }}
      >

        <h1
          style={{
            marginBottom: "20px"
          }}
        >
          My Posts
        </h1>

        {posts.map((post) => (

          <div
            key={post.firebaseId}
            style={{
              background: "#111",
              padding: "15px",
              borderRadius: "20px",
              marginBottom: "20px"
            }}
          >

            <h3>{profile.name}</h3>

            <p
              style={{
                marginBottom: "10px"
              }}
            >
              {post.content}
            </p>

            {post.mediaType === "image" && (

              <img
                src={post.media}
                style={{
                  width: "100%",
                  borderRadius: "15px"
                }}
              />

            )}

            {post.mediaType === "video" && (

              <video
                src={post.media}
                controls
                style={{
                  width: "100%",
                  borderRadius: "15px"
                }}
              />

            )}

          </div>

        ))}

      </div>

      {/* BOTTOM NAVBAR */}
      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          width: "100%",
          background: "#111",
          display: "flex",
          justifyContent: "space-around",
          padding: "15px 0",
          borderTop: "1px solid #333",
          zIndex: 999
        }}
      >

        <a
          href="/"
          style={{
            color: "white",
            textDecoration: "none",
            fontSize: "18px"
          }}
        >
          🏠 Home
        </a>

        <a
          href="/explore"
          style={{
            color: "white",
            textDecoration: "none",
            fontSize: "18px"
          }}
        >
          🔍 Explore
        </a>

        <a
          href="/chat"
          style={{
            color: "white",
            textDecoration: "none",
            fontSize: "18px"
          }}
        >
          💬 Chat
        </a>

        <a
          href="/notifications"
          style={{
            color: "white",
            textDecoration: "none",
            fontSize: "18px"
          }}
        >
          🔔 Notifications
        </a>

        <a
          href="/profile"
          style={{
            color: "#ff00ff",
            textDecoration: "none",
            fontSize: "18px",
            fontWeight: "bold"
          }}
        >
          👤 Profile
        </a>

      </div>

    </div>

  )

}