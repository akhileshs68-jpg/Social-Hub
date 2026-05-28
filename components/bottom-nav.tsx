"use client"

<<<<<<< HEAD
import { Home, Film, MessageCircle, User, Coins } from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

type Tab = "home" | "reels" | "explore" | "messages" | "profile" | "premium"

interface BottomNavProps {
  activeTab: Tab
  onTabChange: (tab: Tab) => void
}

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  const navItems = [
    { id: "home" as Tab, icon: Home, label: "Home" },
    { id: "reels" as Tab, icon: Film, label: "Reels" },
    { id: "premium" as Tab, icon: Coins, label: "Tokens" },
    { id: "messages" as Tab, icon: MessageCircle, label: "Messages", badge: 7 },
    { id: "profile" as Tab, icon: User, label: "Profile" },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card/95 border-t border-border backdrop-blur-md z-30 safe-area-inset-bottom">
      <div className="container mx-auto px-2 max-w-2xl">
        <div className="flex items-center justify-around">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = activeTab === item.id

            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={cn(
                  "flex flex-col items-center gap-1 py-3 px-3 rounded-lg transition-all touch-manipulation relative",
                  isActive ? "text-primary" : "text-muted-foreground active:text-foreground",
                )}
                aria-label={item.label}
                aria-current={isActive ? "page" : undefined}
              >
                {item.badge && item.badge > 0 && (
                  <Badge className="absolute top-2 right-2 h-4 min-w-4 px-1 text-xs bg-destructive text-destructive-foreground">
                    {item.badge > 9 ? "9+" : item.badge}
                  </Badge>
                )}
                <Icon className={cn("w-6 h-6 transition-all", isActive && "fill-primary scale-110")} />
                <span className={cn("text-xs font-medium transition-all", isActive && "font-semibold")}>
                  {item.label}
                </span>
              </button>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
=======
import { useRouter } from "next/navigation"

import {
  House,
  Compass,
  Bell,
  User
} from "lucide-react"

export default function BottomNav() {

  const router =
    useRouter()

  return (

    <div
      className="
        fixed
        bottom-4
        left-1/2
        -translate-x-1/2
        w-[95%]
        max-w-[520px]
        h-[74px]
        rounded-[28px]
        bg-[#0B1020]/90
        backdrop-blur-2xl
        border
        border-white/10
        flex
        items-center
        justify-around
        z-[9999]
        shadow-2xl
      "
    >

      {/* HOME */}
      <button

        onClick={() =>
          router.push("/")
        }

        className="
          flex
          flex-col
          items-center
          gap-1
          text-pink-500
        "
      >

        <House size={22} />

        <span
          className="
            text-[11px]
            font-medium
          "
        >
          Home
        </span>

      </button>

      {/* EXPLORE */}
      <button

        onClick={() =>
          router.push("/explore")
        }

        className="
          flex
          flex-col
          items-center
          gap-1
          text-gray-300
          hover:text-white
          transition
        "
      >

        <Compass size={22} />

        <span
          className="
            text-[11px]
          "
        >
          Explore
        </span>

      </button>

      {/* NOTIFICATION */}
      <button

        onClick={() =>
          router.push("/notifications")
        }

        className="
          flex
          flex-col
          items-center
          gap-1
          text-gray-300
          hover:text-white
          transition
        "
      >

        <Bell size={22} />

        <span
          className="
            text-[11px]
          "
        >
          Alerts
        </span>

      </button>

      {/* PROFILE */}
      <button

        onClick={() =>
          router.push("/profile")
        }

        className="
          flex
          flex-col
          items-center
          gap-1
          text-gray-300
          hover:text-white
          transition
        "
      >

        <User size={22} />

        <span
          className="
            text-[11px]
          "
        >
          Profile
        </span>

      </button>

    </div>

  )

}
>>>>>>> c07617a5128ffd992b542a41c1dea574864a3046
