export default function HomePage() {
  return (
    <main className="min-h-screen bg-black text-white pb-24">
      <div className="max-w-2xl mx-auto py-6 px-4">
        <h1 className="text-4xl font-bold text-center mb-8">
          Social Feed 🚀
        </h1>

        {/* Post 1 */}
        <div className="bg-zinc-900 rounded-2xl overflow-hidden mb-6">
          <div className="p-4">
            <h2 className="text-2xl font-bold">Akhilesh</h2>
            <p className="mt-2">Welcome to Social Hub Pi 🔥</p>
          </div>

          <img
            src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1200"
            alt="post"
            className="w-full h-[300px] object-cover"
          />

          <div className="flex justify-between p-4 text-sm">
            <span>❤️ 120 Likes</span>
            <span>💬 18 Comments</span>
            <span>🔁 Share</span>
          </div>
        </div>

        {/* Post 2 */}
        <div className="bg-zinc-900 rounded-2xl overflow-hidden mb-6">
          <div className="p-4">
            <h2 className="text-2xl font-bold">Pi Network</h2>
            <p className="mt-2">Mainnet is the future 🚀</p>
          </div>

          <img
            src="https://images.unsplash.com/photo-1639762681057-408e52192e55?q=80&w=1200"
            alt="post"
            className="w-full h-[300px] object-cover"
          />

          <div className="flex justify-between p-4 text-sm">
            <span>❤️ 250 Likes</span>
            <span>💬 40 Comments</span>
            <span>🔁 Share</span>
          </div>
        </div>
      </div>

      {/* Bottom Navbar */}
      <div className="fixed bottom-0 left-0 right-0 bg-zinc-950 border-t border-zinc-800">
        <div className="max-w-2xl mx-auto flex justify-around items-center py-4 text-2xl">
          <button>🏠</button>
          <button>🔍</button>

          <button className="bg-purple-600 px-5 py-2 rounded-full text-base">
            ➕
          </button>

          <button>🔔</button>
          <button>👤</button>
        </div>
      </div>
    </main>
  );
}