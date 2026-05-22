"use client"

import { useState } from "react"

export default function HomePage() {
  const [entered, setEntered] = useState(false)

  if (entered) {
    return (
      <main
        style={{
          minHeight: "100vh",
          background: "#000",
          color: "#fff",
          padding: "20px",
          fontFamily: "sans-serif",
        }}
      >
        <h1 style={{ textAlign: "center", marginBottom: "30px" }}>
          Social Feed 🚀
        </h1>

        <div
          style={{
            background: "#111",
            padding: "20px",
            borderRadius: "16px",
            marginBottom: "20px",
          }}
        >
          <h2>Akhilesh</h2>
          <p>Welcome to Social Hub Pi 🔥</p>
        </div>

        <div
          style={{
            background: "#111",
            padding: "20px",
            borderRadius: "16px",
          }}
        >
          <h2>Pi Network</h2>
          <p>Mainnet is the future 🚀</p>
        </div>
      </main>
    )
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#000",
        color: "#fff",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        fontFamily: "sans-serif",
      }}
    >
      <h1 style={{ fontSize: "48px", marginBottom: "10px" }}>
        Social Hub Pi 🚀
      </h1>

      <p style={{ fontSize: "18px", opacity: 0.7 }}>
        Pi Network Social Platform
      </p>

      <button
        onClick={() => setEntered(true)}
        style={{
          marginTop: "30px",
          padding: "12px 24px",
          background: "#9333ea",
          border: "none",
          borderRadius: "10px",
          color: "#fff",
          fontSize: "16px",
          cursor: "pointer",
        }}
      >
        Enter App
      </button>
    </main>
  )
}