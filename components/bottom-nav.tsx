"use client"

interface BottomNavProps {
  activeTab: string
  onTabChange: (tab: any) => void
}

export default function BottomNav({
  activeTab,
  onTabChange,
}: BottomNavProps) {
  return (
    <nav
      className="
fixed
bottom-0
left-1/2
-translate-x-1/2
w-full
max-w-[430px]
h-16
bg-black/80
backdrop-blur-2xl
border-t
border-white/10
flex
items-center
justify-around
z-50
shadow-[0_-10px_30px_rgba(0,0,0,0.45)]
"
    >
      <button
        onClick={() => onTabChange("home")}
        className="text-neutral-400 hover:text-[#F4B814] transition-all"
      >
        Home
      </button>

      <button
        onClick={() => onTabChange("reels")}
        className="text-neutral-400 hover:text-[#F4B814] transition-all"
      >
        Reels
      </button>

      <button
        onClick={() => onTabChange("explore")}
        className="text-neutral-400 hover:text-[#F4B814] transition-all"
      >
        Explore
      </button>

      <button
        onClick={() => onTabChange("messages")}
        className="text-white"
      >
        Messages
      </button>

      <button
        onClick={() => onTabChange("profile")}
        className="text-white"
      >
        Profile
      </button>
    </nav>
  )
}