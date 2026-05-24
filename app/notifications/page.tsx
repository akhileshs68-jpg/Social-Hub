"use client"

import { useEffect, useState } from "react"
import { ref, onValue } from "firebase/database"
import { database } from "../../lib/firebase"

export default function NotificationsPage() {

  const [notifications, setNotifications] = useState<any[]>([])

  // Load Notifications
  useEffect(() => {

    const notificationsRef = ref(database, "notifications")

    onValue(notificationsRef, (snapshot) => {

      const data = snapshot.val()

      if (data) {

        const notificationsArray = Object.keys(data).map((key) => ({
          firebaseId: key,
          ...data[key]
        }))

        setNotifications(notificationsArray.reverse())

      } else {

        setNotifications([])

      }

    })

  }, [])

  return (

    <div
      style={{
        background: "#000",
        minHeight: "100vh",
        color: "white",
        paddingBottom: "100px"
      }}
    >

      {/* HEADER */}
      <div
        style={{
          padding: "20px"
        }}
      >

        <h1
          style={{
            fontSize: "35px"
          }}
        >
          Notifications
        </h1>

      </div>

      {/* NOTIFICATIONS */}
      <div
        style={{
          width: "92%",
          maxWidth: "700px",
          margin: "auto"
        }}
      >

        {notifications.length === 0 && (

          <div
            style={{
              textAlign: "center",
              marginTop: "80px",
              color: "#777"
            }}
          >

            <h2>No Notifications Yet</h2>

          </div>

        )}

        {notifications.map((item) => (

          <div
            key={item.firebaseId}
            style={{
              background: "#111",
              padding: "15px",
              borderRadius: "18px",
              marginBottom: "15px",
              display: "flex",
              alignItems: "center",
              gap: "15px"
            }}
          >

            {/* Avatar */}
            <img
              src={
                item.avatar ||
                "https://cdn-icons-png.flaticon.com/512/149/149071.png"
              }
              style={{
                width: "55px",
                height: "55px",
                borderRadius: "50%",
                objectFit: "cover"
              }}
            />

            {/* Content */}
            <div>

              <h3
                style={{
                  marginBottom: "5px"
                }}
              >
                {item.username || "Pioneer"}
              </h3>

              <p
                style={{
                  color: "#ccc"
                }}
              >
                {item.text}
              </p>

            </div>

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
            textDecoration: "none"
          }}
        >
          🏠 Home
        </a>

        <a
          href="/explore"
          style={{
            color: "white",
            textDecoration: "none"
          }}
        >
          🔍 Explore
        </a>

        <a
          href="/chat"
          style={{
            color: "white",
            textDecoration: "none"
          }}
        >
          💬 Chat
        </a>

        <a
          href="/notifications"
          style={{
            color: "#ff00ff",
            textDecoration: "none",
            fontWeight: "bold"
          }}
        >
          🔔 Notifications
        </a>

        <a
          href="/profile"
          style={{
            color: "white",
            textDecoration: "none"
          }}
        >
          👤 Profile
        </a>

      </div>

    </div>

  )

}