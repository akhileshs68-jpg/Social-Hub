"use client"

import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { useNotifications } from "@/contexts/notification-context"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Heart, MessageCircle, UserPlus, Mail, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"
import { ScrollArea } from "@/components/ui/scroll-area"

export function NotificationBell() {
  const { notifications, unreadCount, markAsRead, markAllAsRead, isLoading, error } = useNotifications()

  if (error) {
    return null // Hide bell if there's an error
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "like":
        return <Heart className="w-3 h-3 text-primary fill-primary" />
      case "comment":
        return <MessageCircle className="w-3 h-3 text-primary" />
      case "follow":
        return <UserPlus className="w-3 h-3 text-primary" />
      case "message":
        return <Mail className="w-3 h-3 text-primary" />
      case "premium":
        return <Sparkles className="w-3 h-3 text-primary" />
      default:
        return <Bell className="w-3 h-3 text-primary" />
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative" aria-label="Notifications">
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-xs font-bold rounded-full flex items-center justify-center">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 sm:w-96">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>Notifications</span>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" onClick={markAllAsRead} className="h-auto py-1 px-2 text-xs">
              Mark all read
            </Button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <ScrollArea className="h-[400px]">
          {isLoading ? (
            <div className="p-4 text-center text-sm text-muted-foreground">Loading notifications...</div>
          ) : notifications.length === 0 ? (
            <div className="p-8 text-center text-sm text-muted-foreground">
              <Bell className="w-12 h-12 mx-auto mb-2 opacity-20" />
              <p>No notifications yet</p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {notifications.map((notification) => (
                <button
                  key={notification.id}
                  onClick={() => markAsRead(notification.id)}
                  className={cn(
                    "w-full p-3 flex gap-3 hover:bg-muted/30 active:bg-muted/40 transition-colors text-left touch-manipulation",
                    !notification.read && "bg-primary/5",
                  )}
                  aria-label={`Notification from ${notification.user}: ${notification.content}`}
                >
                  <div className="relative shrink-0">
                    <Avatar className="w-10 h-10">
                      <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                        {notification.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-card rounded-full flex items-center justify-center border-2 border-background">
                      {getNotificationIcon(notification.type)}
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm leading-relaxed">
                      <span className="font-semibold">{notification.user}</span>{" "}
                      <span className="text-muted-foreground">{notification.content}</span>
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">{notification.time}</p>
                  </div>

                  {!notification.read && (
                    <div className="w-2 h-2 rounded-full bg-primary shrink-0 mt-2" aria-label="Unread notification" />
                  )}
                </button>
              ))}
            </div>
          )}
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
