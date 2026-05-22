"use client"

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react"
import type { Notification } from "@/lib/types"

interface NotificationContextType {
  notifications: Notification[]
  unreadCount: number
  markAsRead: (id: string) => void
  markAllAsRead: () => void
  addNotification: (notification: Omit<Notification, "id" | "time">) => void
  isLoading: boolean
  error: string | null
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

// Mock notification generator for demonstration
const generateMockNotifications = (): Notification[] => {
  return [
    {
      id: "1",
      type: "like",
      user: "cryptopinoneer",
      avatar: "C",
      content: "liked your post",
      time: "5m ago",
      read: false,
      actionLabel: "View Post",
      actionUrl: "/post/1",
    },
    {
      id: "2",
      type: "comment",
      user: "blockchain_dev",
      avatar: "B",
      content: "commented on your post: 'Great idea!'",
      time: "1h ago",
      read: false,
      actionLabel: "Reply",
      actionUrl: "/post/1",
    },
    {
      id: "3",
      type: "follow",
      user: "pi_enthusiast",
      avatar: "P",
      content: "started following you",
      time: "3h ago",
      read: true,
      actionLabel: "Follow Back",
      actionUrl: "/user/pi_enthusiast",
    },
    {
      id: "4",
      type: "mention",
      user: "alexchen",
      avatar: "A",
      content: "mentioned you in a comment",
      time: "2h ago",
      read: false,
      actionLabel: "View",
      actionUrl: "/post/2",
    },
  ]
}

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Use setTimeout to defer loading until after initial render
    const timeoutId = setTimeout(() => {
      try {
        // Simulate async loading - replace with actual API call
        const mockData = generateMockNotifications()
        setNotifications(mockData)
        setIsLoading(false)
      } catch (err) {
        console.error("[v0] Failed to load notifications:", err)
        setError("Failed to load notifications")
        setIsLoading(false)
        // Fail gracefully - app continues to work without notifications
      }
    }, 100) // Small delay ensures UI renders first

    return () => clearTimeout(timeoutId)
  }, [])

  const unreadCount = notifications.filter((n) => !n.read).length

  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((notification) => (notification.id === id ? { ...notification, read: true } : notification)),
    )
  }, [])

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((notification) => ({ ...notification, read: true })))
  }, [])

  const addNotification = useCallback((notification: Omit<Notification, "id" | "time">) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      time: "Just now",
      read: false,
    }
    setNotifications((prev) => [newNotification, ...prev])
  }, [])

  const value: NotificationContextType = {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    addNotification,
    isLoading,
    error,
  }

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>
}

export function useNotifications() {
  const context = useContext(NotificationContext)
  if (context === undefined) {
    throw new Error("useNotifications must be used within a NotificationProvider")
  }
  return context
}
