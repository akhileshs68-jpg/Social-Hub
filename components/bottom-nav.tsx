"use client";

export default function BottomNav() {
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
        zIndex: 999,
      }}
    >
      <button
        style={{
          background: "none",
          border: "none",
          color: "white",
          fontSize: "16px",
        }}
      >
        🏠 Home
      </button>

      <button
        style={{
          background: "none",
          border: "none",
          color: "white",
          fontSize: "16px",
        }}
      >
        🔍 Explore
      </button>

      <button
        style={{
          background: "none",
          border: "none",
          color: "white",
          fontSize: "16px",
        }}
      >
        💬 Chat
      </button>

      <button
        style={{
          background: "none",
          border: "none",
          color: "white",
          fontSize: "16px",
        }}
      >
        🔔 Notifications
      </button>

      <button
        style={{
          background: "none",
          border: "none",
          color: "white",
          fontSize: "16px",
        }}
      >
        👤 Profile
      </button>
    </div>
  );
}