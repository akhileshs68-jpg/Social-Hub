"use client"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Heart, MessageCircle, UserPlus, Mail, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"
import { useNotifications } from "@/contexts/notification-context"

export function Notifications() {
  const { notifications, markAsRead, isLoading, error } = useNotifications()

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
        return null
    }
  }

  if (error) {
    return (
      <div className="p-8 text-center text-sm text-muted-foreground">
        <p>Unable to load notifications</p>
        <p className="text-xs mt-2">Please refresh the page</p>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="p-8 text-center text-sm text-muted-foreground">
        <p>Loading notifications...</p>
      </div>
    )
  }

  if (notifications.length === 0) {
    return (
      <div className="p-8 text-center text-sm text-muted-foreground">
        <p>No notifications yet</p>
      </div>
    )
  }

  return (
    <div className="divide-y divide-border">
      {notifications.map((notification) => (
        <button
          key={notification.id}
          onClick={() => markAsRead(notification.id)}
          className={cn(
            "w-full p-4 flex gap-3 hover:bg-muted/30 active:bg-muted/40 transition-colors text-left touch-manipulation",
            !notification.read && "bg-primary/5",
          )}
          aria-label={`Notification from ${notification.user}: ${notification.content}`}
        >
          <div className="relative shrink-0">
            <Avatar className="w-10 h-10">
              <AvatarFallback className="bg-primary text-primary-foreground">{notification.avatar}</AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-card rounded-full flex items-center justify-center border-2 border-background">
              {getNotificationIcon(notification.type)}
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-sm">
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
  )
}
