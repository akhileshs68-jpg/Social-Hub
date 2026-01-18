"use client"

import type { ReactNode } from "react"
import { PiAuthProvider, usePiAuth } from "@/contexts/pi-auth-context"
import { NotificationProvider } from "@/contexts/notification-context"
import { FeedProvider } from "@/contexts/feed-context"
import { StatusProvider } from "@/contexts/status-context"
import { AuthLoadingScreen } from "./auth-loading-screen"

function AppContent({ children }: { children: ReactNode }) {
  const { isAuthenticated } = usePiAuth()
  if (!isAuthenticated) return <AuthLoadingScreen />

  return (
    <StatusProvider>
      <FeedProvider>
        <NotificationProvider>{children}</NotificationProvider>
      </FeedProvider>
    </StatusProvider>
  )
}

export function AppWrapper({ children }: { children: ReactNode }) {
  return (
    <PiAuthProvider>
      <AppContent>{children}</AppContent>
    </PiAuthProvider>
  )
}
