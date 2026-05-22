export default function HomePage() {
  const posts = [
    {
      id: 1,
      user: "Akhilesh",
      text: "Welcome to Social Hub Pi 🔥",
      image:
        "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1200",
    },
    {
      id: 2,
      user: "Pi Network",
      text: "Mainnet is the future 🚀",
      image:
        "https://images.unsplash.com/photo-1639762681057-408e52192e55?q=80&w=1200",
    },
  ];

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="max-w-2xl mx-auto py-6 px-4">
        <h1 className="text-4xl font-bold text-center mb-8">
          Social Feed 🚀
        </h1>

        {posts.map((post) => (
          <div
            key={post.id}
            className="bg-zinc-900 rounded-2xl overflow-hidden mb-6 border border-zinc-800"
          >
            <div className="p-4">
              <h2 className="text-2xl font-bold">{post.user}</h2>
              <p className="text-zinc-300 mt-2">{post.text}</p>
            </div>

            <img
              src={post.image}
              alt="post"
              className="w-full h-[300px] object-cover"
            />

            <div className="flex justify-between p-4 text-sm text-zinc-400">
              <span>❤️ 120 Likes</span>
              <span>💬 18 Comments</span>
              <span>🔁 Share</span>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}