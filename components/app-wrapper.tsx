"use client"

import type { ReactNode } from "react"
<<<<<<< HEAD

=======
>>>>>>> 82bc3ca8b44839ba49ec0fc525fcb6c408caf7eb
import { PiAuthProvider, usePiAuth } from "@/contexts/pi-auth-context"
import { NotificationProvider } from "@/contexts/notification-context"
import { FeedProvider } from "@/contexts/feed-context"
import { StatusProvider } from "@/contexts/status-context"
<<<<<<< HEAD
import { SHUBTokenProvider } from "@/contexts/shub-token-context"

=======
>>>>>>> 82bc3ca8b44839ba49ec0fc525fcb6c408caf7eb
import { AuthLoadingScreen } from "./auth-loading-screen"

function AppContent({ children }: { children: ReactNode }) {
  const { isAuthenticated } = usePiAuth()
<<<<<<< HEAD

  if (!isAuthenticated) {
    return <AuthLoadingScreen />
  }

  return (
    <div className="min-h-screen bg-black text-white flex justify-center">
      <div
        className="
          w-full
          max-w-md
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
=======
  if (!isAuthenticated) return <AuthLoadingScreen />

  return (
    <StatusProvider>
      <FeedProvider>
        <NotificationProvider>{children}</NotificationProvider>
      </FeedProvider>
    </StatusProvider>
>>>>>>> 82bc3ca8b44839ba49ec0fc525fcb6c408caf7eb
  )
}

export function AppWrapper({ children }: { children: ReactNode }) {
  return (
    <PiAuthProvider>
      <AppContent>{children}</AppContent>
    </PiAuthProvider>
  )
<<<<<<< HEAD
}
=======
}
>>>>>>> 82bc3ca8b44839ba49ec0fc525fcb6c408caf7eb
