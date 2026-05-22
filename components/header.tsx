"use client"

<<<<<<< HEAD
import { Bell, Search, Send } from "lucide-react"

interface HeaderProps {
  onNotificationClick?: () => void
  onMessagesClick?: () => void
}

export default function Header({
  onNotificationClick,
  onMessagesClick,
}: HeaderProps) {
  return (
    <header
      className="
        sticky
        top-0
        z-50
        w-full
        pt-safe-top
        border-b
        border-b border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.45)]
        bg-black/75
        backdrop-blur-xl
        supports-[backdrop-filter]:bg-black/60
      "
    >
      <div className="px-4 h-16 flex items-center justify-between gap-3">

        {/* LEFT BRAND */}
        <div className="flex items-center gap-2 shrink-0">

          <div
            className="
              w-10
              h-10
              rounded-2xl
              flex
              items-center
              justy-center
              bg-gradient-to-br
              from-pink-500
              to-orange-400
              shadow-[0_0_25px_rgba(244,184,20,0.25)]
            "
          >
            <span className="text-black text-lg font-black">π</span>
          </div>

          <div className="flex flex-col leading-none">
            <span
              className="
                text-[17px]
                font-extrabold
                tracking-tight
                text-white
              "
            >
              
            </span>

            <div className="flex flex-col leading-none">
  <span
    className="
      text-[17px]
      font-extrabold
      tracking-tight
      text-white
    "
  >
    Social Hub
  </span>

  <span
    className="
      text-[11px]
      bg-gradient-to-r
      from-pink-400
      to-orange-300
      bg-clip-text
      text-transparent
      font-bold
      tracking-[0.25em]
      uppercase
    "
  >
    PI NETWORK
  </span>
</div>
          </div>
        </div>

        {/* CENTER SEARCH */}
        <div className="flex-1 max-w-[180px]">
          <button
            className="
              w-full
              h-11
              rounded-2xl
              bg-white/[0.04]
              border
              border-white/5
              flex
              items-center
              gap-2
              px-3
              text-neutral-400
              text-sm
              transition-all
              active:scale-[0.98]
            "
          >
            <Search className="w-4 h-4" />
            <span>Search</span>
          </button>
        </div>

        {/* RIGHT ACTIONS */}
        <div className="flex items-center gap-2 shrink-0">

          <button
            onClick={onNotificationClick}
            className="
              relative
              w-11
              h-11
              rounded-2xl
              bg-white/[0.04]
              border
              border-white/5
              flex
              items-center
              justify-center
              text-neutral-300
              transition-all
              active:scale-95
            "
          >
            <Bell className="w-5 h-5 stroke-[2]" />

            <span
              className="
                absolute
                top-2
                right-2
                w-2
                h-2
                rounded-full
                bg-brand-pi
                animate-pulse
              "
            />
          </button>

          <button
            onClick={onMessagesClick}
            className="
              relative
              w-11
              h-11
              rounded-2xl
              premium-gradient
              flex
              items-center
              justify-center
              text-black
              shadow-glow
              transition-all
              active:scale-95
            "
          >
            <Send className="w-5 h-5 stroke-[2]" />
          </button>
=======
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { usePiAuth } from "@/contexts/pi-auth-context"
import { NotificationBell } from "@/components/notification-bell"
import { ThemeToggle } from "@/components/theme-toggle"

export function Header() {
  const { userProfile, isAuthenticated } = usePiAuth()

  return (
    <header className="fixed top-0 left-0 right-0 z-30 bg-card/95 border-b border-border backdrop-blur-md">
      <div className="container mx-auto px-4 py-3 max-w-2xl">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center shadow-sm">
              <span className="text-primary-foreground font-bold text-base">π</span>
            </div>
            <h1 className="text-lg font-bold text-foreground">Social Hub Pi</h1>
          </div>

          <div className="flex-1 max-w-xs hidden sm:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search..." className="pl-9 h-9 bg-muted/50 border-border" />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            {isAuthenticated && <NotificationBell />}
            {isAuthenticated && userProfile && (
              <Avatar className="w-9 h-9 shrink-0 ring-2 ring-primary/20">
                <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                  {userProfile.username[0]?.toUpperCase() || "P"}
                </AvatarFallback>
              </Avatar>
            )}
          </div>
>>>>>>> 82bc3ca8b44839ba49ec0fc525fcb6c408caf7eb
        </div>
      </div>
    </header>
  )
<<<<<<< HEAD
}
=======
}
>>>>>>> 82bc3ca8b44839ba49ec0fc525fcb6c408caf7eb
