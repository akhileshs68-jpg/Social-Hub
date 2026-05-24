"use client"

import { useEffect, useState } from "react"
import { ref, onValue, push } from "firebase/database"
import { database } from "../../lib/firebase"

export default function ChatPage() {

  const [messages, setMessages] = useState<any[]>([])
  const [text, setText] = useState("")

  // Load Messages
  useEffect(() => {

    const messagesRef = ref(database, "messages")

    onValue(messagesRef, (snapshot) => {

      const data = snapshot.val()

      if (data) {

        const messagesArray = Object.keys(data).map((key) => ({
          firebaseId: key,
          ...data[key]
        }))

        setMessages(messagesArray)

      } else {

        setMessages([])

      }

    })

  }, [])

  // Send Message
  const sendMessage = async () => {

    if (!text) return

    await push(ref(database, "messages"), {

      username: "Pioneer",

      text: text,

      createdAt: Date.now()

    })

    setText("")

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
          Chat
        </h1>

      </div>

      {/* CHAT AREA */}
      <div
        style={{
          width: "92%",
          maxWidth: "700px",
          margin: "auto",
          paddingBottom: "120px"
        }}
      >

        {messages.map((msg) => (

          <div
            key={msg.firebaseId}
            style={{
              background: "#111",
              padding: "15px",
              borderRadius: "18px",
              marginBottom: "15px"
            }}
          >

            <h3
              style={{
                marginBottom: "8px",
                color: "#ff00ff"
              }}
            >
              {msg.username}
            </h3>

            <p>{msg.text}</p>

          </div>

        ))}

      </div>

      {/* INPUT */}
      <div
        style={{
          position: "fixed",
          bottom: "70px",
          left: 0,
          width: "100%",
          background: "#000",
          padding: "15px",
          display: "flex",
          gap: "10px"
        }}
      >

        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type message..."
          style={{
            flex: 1,
            padding: "15px",
            borderRadius: "12px",
            border: "1px solid #333",
            background: "#111",
            color: "white"
          }}
        />

        <button
          onClick={sendMessage}
          style={{
            padding: "15px 20px",
            borderRadius: "12px",
            border: "none",
            background: "#ff00ff",
            color: "white",
            cursor: "pointer",
            fontWeight: "bold"
          }}
        >
          Send
        </button>

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
            color: "#ff00ff",
            textDecoration: "none",
            fontWeight: "bold"
          }}
        >
          💬 Chat
        </a>

        <a
          href="/notifications"
          style={{
            color: "white",
            textDecoration: "none"
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