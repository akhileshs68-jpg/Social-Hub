"use client"

import type { ReactNode } from "react"
<<<<<<< HEAD
=======

>>>>>>> c07617a5128ffd992b542a41c1dea574864a3046
import { PiAuthProvider, usePiAuth } from "@/contexts/pi-auth-context"
import { NotificationProvider } from "@/contexts/notification-context"
import { FeedProvider } from "@/contexts/feed-context"
import { StatusProvider } from "@/contexts/status-context"
import { SHUBTokenProvider } from "@/contexts/shub-token-context"
<<<<<<< HEAD
=======

>>>>>>> c07617a5128ffd992b542a41c1dea574864a3046
import { AuthLoadingScreen } from "./auth-loading-screen"

function AppContent({ children }: { children: ReactNode }) {
  const { isAuthenticated } = usePiAuth()
<<<<<<< HEAD
  if (!isAuthenticated) return <AuthLoadingScreen />

  return (
    <SHUBTokenProvider>
      <StatusProvider>
        <FeedProvider>
          <NotificationProvider>{children}</NotificationProvider>
        </FeedProvider>
      </StatusProvider>
    </SHUBTokenProvider>
=======

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
>>>>>>> c07617a5128ffd992b542a41c1dea574864a3046
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
>>>>>>> c07617a5128ffd992b542a41c1dea574864a3046
