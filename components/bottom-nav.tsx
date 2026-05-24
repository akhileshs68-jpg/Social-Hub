"use client"

import { useRouter } from "next/navigation"

export default function BottomNav() {

  const router = useRouter()

  return (

    <div
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        width: "100%",
        height: "70px",
        background: "#111",
        display: "flex",
        justifyContent: "space-around",
        alignItems: "center",
        borderTop: "1px solid #333",
        zIndex: 99999,
        pointerEvents: "auto"
      }}
    >

      <button
        onClick={() => router.push("/")}
        style={{
          background: "none",
          border: "none",
          color: "white",
          fontSize: "16px",
          cursor: "pointer"
        }}
      >
        🏠 Home
      </button>

      <button
        onClick={() => router.push("/explore")}
        style={{
          background: "none",
          border: "none",
          color: "white",
          fontSize: "16px",
          cursor: "pointer"
        }}
      >
        🔍 Explore
      </button>

      <button
        onClick={() => router.push("/notifications")}
        style={{
          background: "none",
          border: "none",
          color: "white",
          fontSize: "16px",
          cursor: "pointer"
        }}
      >
        🔔 Notifications
      </button>

      <button
        onClick={() => router.push("/profile")}
        style={{
          background: "none",
          border: "none",
          color: "#ff00ff",
          fontSize: "16px",
          fontWeight: "bold",
          cursor: "pointer"
        }}
      >
        👤 Profile
      </button>

    </div>

  )

}