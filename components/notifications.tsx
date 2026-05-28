"use client"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Heart, MessageCircle, UserPlus, Mail, Sparkles, AtSign } from "lucide-react"
import { cn } from "@/lib/utils"
import { useNotifications } from "@/contexts/notification-context"

export function Notifications() {
  const { notifications, markAsRead, isLoading, error } = useNotifications()

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "like":
        return <Heart className="w-3 h-3 text-rose-500 fill-rose-500" />
      case "comment":
        return <MessageCircle className="w-3 h-3 text-blue-500" />
      case "follow":
        return <UserPlus className="w-3 h-3 text-green-500" />
      case "message":
        return <Mail className="w-3 h-3 text-purple-500" />
      case "premium":
        return <Sparkles className="w-3 h-3 text-amber-500" />
      case "mention":
        return <AtSign className="w-3 h-3 text-cyan-500" />
      default:
        return null
    }
  }

  const getNotificationBg = (type: string) => {
    switch (type) {
      case "like":
        return "bg-rose-50 dark:bg-rose-950/20"
      case "comment":
        return "bg-blue-50 dark:bg-blue-950/20"
      case "follow":
        return "bg-green-50 dark:bg-green-950/20"
      case "message":
        return "bg-purple-50 dark:bg-purple-950/20"
      case "mention":
        return "bg-cyan-50 dark:bg-cyan-950/20"
      default:
        return ""
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
        <div
          key={notification.id}
          className={cn(
            "p-4 hover:bg-muted/50 active:bg-muted/60 transition-colors text-left",
            !notification.read && getNotificationBg(notification.type),
          )}
        >
          <button
            onClick={() => markAsRead(notification.id)}
            className="w-full flex gap-3 items-start touch-manipulation text-left"
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

            {!notification.read && <div className="w-2 h-2 rounded-full bg-primary shrink-0 mt-1.5" />}
          </button>

          {notification.actionLabel && notification.actionUrl && (
            <div className="mt-2 flex gap-2">
              <Button size="sm" variant="default" className="flex-1 text-xs h-7">
                {notification.actionLabel}
              </Button>
              {notification.type === "follow" && (
                <Button size="sm" variant="outline" className="flex-1 text-xs h-7">
                  View
                </Button>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
