"use client";

import Feed from "../components/feed";
import Header from "../components/header";
import BottomNav from "../components/bottom-nav";

export default function HomePage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(to bottom, black, #090979)",
        color: "white",
      }}
    >
      <Header />
      <Feed />
      <BottomNav />
    </main>
  );
}