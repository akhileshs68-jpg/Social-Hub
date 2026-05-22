export default function HomePage() {
  return (
    <main
      style={{
        backgroundColor: "#000",
        color: "white",
        minHeight: "100vh",
        paddingBottom: "80px",
      }}
    >
      <h1
        style={{
          textAlign: "center",
          padding: "20px",
          fontSize: "40px",
          fontWeight: "bold",
        }}
      >
        Social Feed 🚀
      </h1>

      <div
        style={{
          background: "#111",
          margin: "20px",
          borderRadius: "20px",
          overflow: "hidden",
        }}
      >
        <img
          src="https://images.unsplash.com/photo-1519389950473-47ba0277781c"
          style={{
            width: "100%",
            height: "300px",
            objectFit: "cover",
          }}
        />

        <div style={{ padding: "20px" }}>
          <h2>Akhilesh</h2>
          <p>Welcome to Social Hub Pi 🔥</p>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
            padding: "15px",
            borderTop: "1px solid #333",
          }}
        >
          <button>❤️ Like</button>
          <button>💬 Comment</button>
          <button>📤 Share</button>
        </div>
      </div>

      <div
        style={{
          position: "fixed",
          bottom: "0",
          left: "0",
          right: "0",
          background: "#111",
          display: "flex",
          justifyContent: "space-around",
          padding: "15px",
          borderTop: "1px solid #333",
        }}
      >
        <button>🏠</button>
        <button>🔍</button>
        <button>➕</button>
        <button>🔔</button>
        <button>👤</button>
      </div>
    </main>
  );
}