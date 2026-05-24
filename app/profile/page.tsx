"use client"

import { useEffect, useState } from "react"

import {
  onAuthStateChanged,
  signOut
} from "firebase/auth"

import {
  ref,
  onValue,
  update,
  push
} from "firebase/database"

import {
  auth,
  database
} from "../../lib/firebase"

export default function ProfilePage() {

  // USER
  const [user, setUser] =
    useState<any>(null)

  // POSTS
  const [posts, setPosts] =
    useState<any[]>([])

  // PROFILE
  const [bio, setBio] =
    useState(
      "Pi Network Social User 🚀"
    )

  const [profileImage, setProfileImage] =
    useState(
      "https://cdn-icons-png.flaticon.com/512/149/149071.png"
    )

  // FOLLOW
  const [followers, setFollowers] =
    useState(0)

  const [following, setFollowing] =
    useState(0)

  const [isFollowing, setIsFollowing] =
    useState(false)

  // AUTH
  useEffect(() => {

    const unsubscribe =
      onAuthStateChanged(
        auth,
        (currentUser) => {

          if (currentUser) {

            setUser(currentUser)

          } else {

            window.location.href =
              "/login"

          }

        }
      )

    return () => unsubscribe()

  }, [])

  // POSTS
  useEffect(() => {

    const postsRef =
      ref(database, "posts")

    onValue(
      postsRef,
      (snapshot) => {

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

      }
    )

  }, [])

  // FOLLOWERS
  useEffect(() => {

    const followersRef =
      ref(database, "followers")

    onValue(
      followersRef,
      (snapshot) => {

        const data =
          snapshot.val()

        if (data) {

          const total =
            Object.keys(data).length

          setFollowers(total)

        } else {

          setFollowers(0)

        }

      }
    )

  }, [])

  // IMAGE
  const handleImage = (
    e: any
  ) => {

    const file =
      e.target.files[0]

    if (!file) return

    const reader =
      new FileReader()

    reader.onloadend = () => {

      setProfileImage(
        reader.result as string
      )

    }

    reader.readAsDataURL(file)

  }

  // EDIT BIO
  const editProfile = () => {

    const newBio =
      prompt("Enter Bio")

    if (newBio) {

      setBio(newBio)

    }

  }

  // FOLLOW
  const followUser =
    async () => {

      const currentUser =
        auth.currentUser

      if (!currentUser) return

      if (!isFollowing) {

        await push(
          ref(
            database,
            "followers"
          ),
          {

            username:
              currentUser.displayName,

            email:
              currentUser.email

          }
        )

        setFollowers(
          followers + 1
        )

        setFollowing(
          following + 1
        )

        setIsFollowing(true)

      } else {

        setFollowers(
          followers - 1
        )

        setFollowing(
          following - 1
        )

        setIsFollowing(false)

      }

    }

  // LOGOUT
  const logout =
    async () => {

      await signOut(auth)

      alert("Logged Out")

      window.location.href =
        "/login"

    }

  return (

    <div
      style={{
        background: "#000",
        minHeight: "100vh",
        color: "white",
        paddingBottom: "120px"
      }}
    >

      {/* PROFILE */}
      <div
        style={{
          width: "92%",
          maxWidth: "700px",
          margin: "20px auto",
          background: "#111",
          borderRadius: "25px",
          padding: "25px"
        }}
      >

        {/* TOP */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "20px",
            flexWrap: "wrap"
          }}
        >

          {/* IMAGE */}
          <img
            src={profileImage}
            style={{
              width: "120px",
              height: "120px",
              borderRadius: "50%",
              objectFit: "cover",
              border:
                "4px solid #ff00ff"
            }}
          />

          {/* INFO */}
          <div>

            <h1
              style={{
                fontSize: "42px",
                marginBottom: "10px"
              }}
            >
              {user?.displayName}
            </h1>

            <p
              style={{
                color: "#ccc",
                marginBottom: "10px"
              }}
            >
              {bio}
            </p>

            <p
              style={{
                color: "#ff00ff"
              }}
            >
              {user?.email}
            </p>

          </div>

        </div>

        {/* STATS */}
        <div
          style={{
            display: "flex",
            justifyContent:
              "space-around",
            marginTop: "40px",
            textAlign: "center"
          }}
        >

          <div>

            <h1>
              {posts.length}
            </h1>

            <p>Posts</p>

          </div>

          <div>

            <h1>
              {followers}
            </h1>

            <p>Followers</p>

          </div>

          <div>

            <h1>
              {following}
            </h1>

            <p>Following</p>

          </div>

        </div>

        {/* INPUT */}
        <input
          type="file"
          onChange={handleImage}
          style={{
            marginTop: "25px",
            marginBottom: "20px"
          }}
        />

        {/* BUTTONS */}
        <div
          style={{
            display: "flex",
            gap: "15px",
            marginTop: "10px"
          }}
        >

          {/* EDIT */}
          <button
            onClick={editProfile}
            style={{
              flex: 1,
              padding: "15px",
              borderRadius: "12px",
              border: "none",
              background: "#ff00ff",
              color: "white",
              fontWeight: "bold",
              cursor: "pointer"
            }}
          >
            Edit Profile
          </button>

          {/* FOLLOW */}
          <button
            onClick={followUser}
            style={{
              flex: 1,
              padding: "15px",
              borderRadius: "12px",
              border: "none",
              background:
                isFollowing
                  ? "#333"
                  : "#00bfff",
              color: "white",
              fontWeight: "bold",
              cursor: "pointer"
            }}
          >
            {isFollowing
              ? "Following"
              : "Follow"}
          </button>

          {/* LOGOUT */}
          <button
            onClick={logout}
            style={{
              flex: 1,
              padding: "15px",
              borderRadius: "12px",
              border: "none",
              background: "#222",
              color: "white",
              fontWeight: "bold",
              cursor: "pointer"
            }}
          >
            Logout
          </button>

        </div>

      </div>

      {/* POSTS */}
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

            <h3
              style={{
                marginBottom: "10px"
              }}
            >
              {post.username}
            </h3>

            <p
              style={{
                marginBottom: "10px"
              }}
            >
              {post.content}
            </p>

            {post.mediaType ===
              "image" && (

              <img
                src={post.media}
                style={{
                  width: "100%",
                  borderRadius:
                    "15px"
                }}
              />

            )}

            {post.mediaType ===
              "video" && (

              <video
                src={post.media}
                controls
                style={{
                  width: "100%",
                  borderRadius:
                    "15px"
                }}
              />

            )}

          </div>

        ))}

      </div>

      {/* NAVBAR */}
      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          width: "100%",
          background: "#111",
          display: "flex",
          justifyContent:
            "space-around",
          padding: "15px 0",
          borderTop:
            "1px solid #333"
        }}
      >

        <a
          href="/"
          style={{
            color: "white",
            textDecoration:
              "none"
          }}
        >
          🏠 Home
        </a>

        <a
          href="/explore"
          style={{
            color: "white",
            textDecoration:
              "none"
          }}
        >
          🔍 Explore
        </a>

        <a
          href="/reels"
          style={{
            color: "white",
            textDecoration:
              "none"
          }}
        >
          🎬 Reels
        </a>

        <a
          href="/chat"
          style={{
            color: "white",
            textDecoration:
              "none"
          }}
        >
          💬 Chat
        </a>

        <a
          href="/profile"
          style={{
            color: "#ff00ff",
            textDecoration:
              "none",
            fontWeight:
              "bold"
          }}
        >
          👤 Profile
        </a>

      </div>

    </div>

  )

}