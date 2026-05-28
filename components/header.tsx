"use client"

import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { usePiAuth } from "@/contexts/pi-auth-context"
import { NotificationBell } from "@/components/notification-bell"
import { ThemeToggle } from "@/components/theme-toggle"

export function Header() {
  const { userProfile, isAuthenticated } = usePiAuth()

  return (
  <header className="fixed top-0 left-0 right-0 z-30 backdrop-blur-xl bg-slate-950/70 border-b border-white/10">
    <div className="max-w-2xl mx-auto px-4 py-3">
      <div className="flex items-center justify-between gap-4">

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-cyan-400 to-purple-500 flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-lg">π</span>
          </div>

          <h1 className="text-2xl font-extrabold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
            Social Hub Pi
          </h1>
        </div>

        <div className="flex-1 max-w-sm hidden sm:block">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />

            <Input
              placeholder="Search..."
              className="pl-10 rounded-full bg-slate-900/80 border border-white/10 text-white"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          {isAuthenticated && <NotificationBell />}

          {isAuthenticated && userProfile && (
            <Avatar className="w-10 h-10 ring-2 ring-cyan-400/40">
              <AvatarFallback className="bg-gradient-to-r from-cyan-500 to-purple-500 text-white">
                {(userProfile.displayName || userProfile.username)?.charAt(0).toUpperCase() || "P"}
              </AvatarFallback>
            </Avatar>
          )}
        </div>

      </div>
    </div>
  </header>
  )
}
