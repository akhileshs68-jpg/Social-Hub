export default function HomePage() {
  return (
    <main
      style={{
        background:
          "linear-gradient(to bottom, #0f0f0f, #1a1a2e, #16213e)",
        minHeight: "100vh",
        color: "white",
        paddingBottom: "100px",
        fontFamily: "Arial",
      }}
    >
      {/* Header */}

      <div
        style={{
          position: "sticky",
          top: 0,
          background: "rgba(0,0,0,0.7)",
          backdropFilter: "blur(10px)",
          padding: "20px",
          borderBottom: "1px solid #333",
          zIndex: 100,
        }}
      >
        <h1
          style={{
            textAlign: "center",
            color: "#a855f7",
            fontSize: "32px",
            fontWeight: "bold",
          }}
        >
          Pi Social Hub 🚀
        </h1>
      </div>

      {/* Story Section */}

      <div
        style={{
          display: "flex",
          gap: "15px",
          overflowX: "auto",
          padding: "20px",
        }}
      >
        {["Akhilesh", "Pi News", "Crypto", "Mainnet", "Community"].map(
          (item, i) => (
            <div
              key={i}
              style={{
                minWidth: "80px",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  width: "70px",
                  height: "70px",
                  borderRadius: "50%",
                  background:
                    "linear-gradient(135deg,#9333ea,#7e22ce,#4c1d95)",
                  padding: "3px",
                  margin: "auto",
                }}
              >
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    borderRadius: "50%",
                    background: "#111",
                  }}
                ></div>
              </div>

              <p style={{ fontSize: "12px", marginTop: "8px" }}>
                {item}
              </p>
            </div>
          )
        )}
      </div>

      {/* Post Card */}

      <div
        style={{
          background: "rgba(255,255,255,0.05)",
          margin: "20px",
          borderRadius: "25px",
          overflow: "hidden",
          backdropFilter: "blur(15px)",
          border: "1px solid rgba(255,255,255,0.1)",
          boxShadow: "0 0 20px rgba(168,85,247,0.3)",
        }}
      >
        {/* Post Header */}

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            padding: "20px",
          }}
        >
          <div
            style={{
              width: "55px",
              height: "55px",
              borderRadius: "50%",
              background:
                "linear-gradient(135deg,#9333ea,#7e22ce,#4c1d95)",
            }}
          ></div>

          <div>
            <h3 style={{ margin: 0 }}>Akhilesh</h3>
            <p
              style={{
                margin: 0,
                color: "#aaa",
                fontSize: "13px",
              }}
            >
              Pi Pioneer • 2 min ago
            </p>
          </div>
        </div>

        {/* Post Image */}

        <img
          src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3"
          style={{
            width: "100%",
            height: "320px",
            objectFit: "cover",
          }}
        />

        {/* Post Content */}

        <div style={{ padding: "20px" }}>
          <p
            style={{
              fontSize: "16px",
              lineHeight: "28px",
              color: "#ddd",
            }}
          >
            Welcome to the future of decentralized social media powered by
            Pi Network 🔥
          </p>

          {/* Action Buttons */}

          <div
            style={{
              display: "flex",
              justifyContent: "space-around",
              marginTop: "20px",
            }}
          >
            <button
              style={{
                background: "rgba(168,85,247,0.2)",
                border: "none",
                color: "white",
                padding: "12px 18px",
                borderRadius: "15px",
                cursor: "pointer",
              }}
            >
              ❤️ Like
            </button>

            <button
              style={{
                background: "rgba(168,85,247,0.2)",
                border: "none",
                color: "white",
                padding: "12px 18px",
                borderRadius: "15px",
                cursor: "pointer",
              }}
            >
              💬 Comment
            </button>

            <button
              style={{
                background: "rgba(168,85,247,0.2)",
                border: "none",
                color: "white",
                padding: "12px 18px",
                borderRadius: "15px",
                cursor: "pointer",
              }}
            >
              📤 Share
            </button>
          </div>
        </div>
      </div>

      {/* Floating Create Button */}

      <button
        style={{
          position: "fixed",
          bottom: "90px",
          right: "25px",
          width: "65px",
          height: "65px",
          borderRadius: "50%",
          border: "none",
          background:
            "linear-gradient(135deg,#9333ea,#7e22ce,#4c1d95)",
          color: "white",
          fontSize: "35px",
          boxShadow: "0 0 25px rgba(168,85,247,0.8)",
          cursor: "pointer",
          zIndex: 999,
        }}
      >
        +
      </button>

      {/* Bottom Navbar */}

      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          background: "rgba(0,0,0,0.85)",
          backdropFilter: "blur(12px)",
          display: "flex",
          justifyContent: "space-around",
          padding: "18px",
          borderTop: "1px solid #333",
        }}
      >
        <button
          style={{
            background: "none",
            border: "none",
            color: "#a855f7",
            fontSize: "28px",
          }}
        >
          🏠
        </button>

        <button
          style={{
            background: "none",
            border: "none",
            color: "white",
            fontSize: "28px",
          }}
        >
          🔍
        </button>

        <button
          style={{
            background: "none",
            border: "none",
            color: "white",
            fontSize: "28px",
          }}
        >
          🔔
        </button>

        <button
          style={{
            background: "none",
            border: "none",
            color: "white",
            fontSize: "28px",
          }}
        >
          👤
        </button>
      </div>
    </main>
  );
}