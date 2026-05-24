"use client";

export default function Header() {
  return (
    <div
      style={{
        width: "100%",
        padding: "15px 20px",
        background: "#111",
        borderBottom: "1px solid #333",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        position: "sticky",
        top: 0,
        zIndex: 999,
      }}
    >
      <h1
        style={{
          color: "white",
          fontSize: "28px",
          fontWeight: "bold",
        }}
      >
        Pi Social Hub
      </h1>

      <div
        style={{
          display: "flex",
          gap: "15px",
          color: "white",
          fontSize: "22px",
        }}
      >
        <span>🔍</span>
        <span>🔔</span>
        <span>💬</span>
      </div>
    </div>
  );
}