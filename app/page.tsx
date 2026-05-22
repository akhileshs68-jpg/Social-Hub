export default function HomePage() {
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
  );
}