export default function HomePage() {
  return (
    <main className="bg-black min-h-screen text-white pb-40">
      
      <h1 className="text-5xl font-bold text-center py-6">
        Social Feed 🚀
      </h1>

      {/* Post 1 */}
      <div className="bg-zinc-900 m-2 rounded-xl overflow-hidden">
        <div className="p-4">
          <h2 className="text-3xl font-bold">Akhilesh</h2>
          <p className="mt-3">Welcome to Social Hub Pi 🔥</p>
        </div>

        <img
          src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1200&auto=format&fit=crop"
          alt="post"
          className="w-full h-[300px] object-cover"
        />

        <div className="flex justify-between p-4 text-lg">
          <span>❤️ 120 Likes</span>
          <span>💬 18 Comments</span>
          <span>📨 Share</span>
        </div>
      </div>

      {/* Post 2 */}
      <div className="bg-zinc-900 m-2 rounded-xl overflow-hidden">
        <div className="p-4">
          <h2 className="text-3xl font-bold">Pi Network</h2>
          <p className="mt-3">Mainnet is the future 🚀</p>
        </div>

        <img
          src="https://images.unsplash.com/photo-1639762681057-408e52192e55?q=80&w=1200&auto=format&fit=crop"
          alt="post"
          className="w-full h-[300px] object-cover"
        />

        <div className="flex justify-between p-4 text-lg">
          <span>❤️ 250 Likes</span>
          <span>💬 40 Comments</span>
          <span>📨 Share</span>
        </div>
      </div>

      {/* Bottom Navbar */}
      <div className="fixed bottom-0 left-0 right-0 bg-zinc-950 border-t border-zinc-800 z-50">
        <div className="flex justify-around items-center py-4 text-3xl">
          <button>🏠</button>
          <button>🔍</button>

          <button className="bg-purple-600 px-5 py-2 rounded-full text-xl">
            ➕
          </button>

          <button>🔔</button>
          <button>👤</button>
        </div>
      </div>
     <div style={{
  position: "fixed",
  bottom: "0",
  left: "0",
  right: "0",
backgroundColor: "black",
padding: "20px",
display: "flex",
justifyContent: "space-around",
zIndex: 9999
}}>
  <button>🏠</button>
  <button>🔍</button>
  <button>➕</button>
  <button>🔔</button>
  <button>👤</button>
</div>
    </main>
  )
}