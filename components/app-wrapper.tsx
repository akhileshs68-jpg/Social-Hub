"use client"

import type { ReactNode } from "react"

import { PiAuthProvider, usePiAuth } from "@/contexts/pi-auth-context"
import { NotificationProvider } from "@/contexts/notification-context"
import { FeedProvider } from "@/contexts/feed-context"
import { StatusProvider } from "@/contexts/status-context"
import { SHUBTokenProvider } from "@/contexts/shub-token-context"

import { AuthLoadingScreen } from "./auth-loading-screen"

function AppContent({ children }: { children: ReactNode }) {
  const { isAuthenticated } = usePiAuth()

  if (!isAuthenticated) {
    return <AuthLoadingScreen />
  }

  return (
    <div className="min-h-screen bg-black text-white flex justify-center">
      <div
        className="
          w-full
          max-w-[430px]
          min-h-screen
          bg-black
          border-x
          border-white/5
          shadow-[0_0_60px_rgba(0,0,0,0.85)]
          relative
          overflow-hidden
        "
      >
        <SHUBTokenProvider>
          <StatusProvider>
            <FeedProvider>
              <NotificationProvider>
                {children}
              </NotificationProvider>
            </FeedProvider>
          </StatusProvider>
        </SHUBTokenProvider>
      </div>
    </div>
  )
}

export function AppWrapper({ children }: { children: ReactNode }) {
  return (
    <PiAuthProvider>
      <AppContent>{children}</AppContent>
    </PiAuthProvider>
  )
}