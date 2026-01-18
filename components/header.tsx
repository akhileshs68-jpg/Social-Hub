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
        </div>
      </div>
    </header>
  )
}
