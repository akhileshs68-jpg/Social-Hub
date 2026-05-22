"use client";

import { useState } from "react";

export default function HomePage() {
  const [posts, setPosts] = useState([
    {
      name: "Akhilesh",
      text: "Welcome to Social Hub Pi 🔥",
      likes: 120,
      comments: 18,
      image:
        "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1200&auto=format&fit=crop",
    },
  ]);

  const addPost = () => {
    const text = prompt("Write your post");

    if (!text) return;

    const newPost = {
      name: "You",
      text,
      likes: 0,
      comments: 0,
      image:
        "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1200&auto=format&fit=crop",
    };

    setPosts([newPost, ...posts]);
  };

  const likePost = (index: number) => {
    const updated = [...posts];
    updated[index].likes += 1;
    setPosts(updated);
  };

  return (
    <main className="bg-black min-h-screen text-white pb-28">
      <div className="sticky top-0 z-50 bg-black border-b border-zinc-800 p-4 text-center text-4xl font-bold">
        Social Feed 🚀
      </div>

      <div className="max-w-2xl mx-auto p-4 space-y-6">
        {posts.map((post, index) => (
          <div
            key={index}
            className="bg-zinc-900 rounded-3xl overflow-hidden border border-zinc-800 shadow-xl"
          >
            <div className="p-5">
              <h2 className="text-2xl font-bold">{post.name}</h2>
              <p className="text-zinc-300 mt-2">{post.text}</p>
            </div>

            <img
              src={post.image}
              className="w-full h-[300px] object-cover"
            />

            <div className="flex justify-between items-center p-4 text-lg">
              <button onClick={() => likePost(index)}>
                ❤️ {post.likes}
              </button>

              <button>💬 {post.comments}</button>

              <button>📤 Share</button>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Navbar */}
      <div className="fixed bottom-0 left-0 right-0 bg-zinc-950 border-t border-zinc-800 z-50">
        <div className="max-w-2xl mx-auto flex justify-around items-center py-4 text-3xl">
          <button>🏠</button>

          <button>🔍</button>

          <button
            onClick={addPost}
            className="bg-purple-600 px-5 py-2 rounded-full text-xl"
          >
            ➕
          </button>

          <button>🔔</button>

          <button>👤</button>
        </div>
      </div>
    </main>
  );
}