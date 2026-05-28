"use client"

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react"
import type { Status, StatusGroup } from "@/lib/types"
import { createStatus, markStatusSeen, subscribeToStatuses } from "@/lib/firebase-social-service"
import { usePiAuth } from "@/contexts/pi-auth-context"

interface StatusContextType {
  statusGroups: StatusGroup[]
  isLoading: boolean
  error: string | null
  addStatus: (status: Omit<Status, "id" | "createdAt" | "expiresAt" | "seenBy">) => Promise<void>
  markStatusAsSeen: (statusId: string, viewerPiUid: string) => Promise<void>
  refreshStatuses: () => void
}

const StatusContext = createContext<StatusContextType | undefined>(undefined)

export function StatusProvider({ children }: { children: ReactNode }) {
  const { user } = usePiAuth()
  const [statusGroups, setStatusGroups] = useState<StatusGroup[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    setIsLoading(true)
    setError(null)

    try {
      const { unsubscribe } = subscribeToStatuses(
        user?.piUid,
        (groups) => {
          setStatusGroups(groups)
          setIsLoading(false)
        },
        (statusError) => {
          console.error("[socialhub] Failed to subscribe to statuses:", statusError)
          setError("Could not load stories. Please try again.")
          setIsLoading(false)
        },
      )

      return unsubscribe
    } catch (statusError) {
      console.error("[socialhub] Failed to start status subscription:", statusError)
      setError(statusError instanceof Error ? statusError.message : "Could not load stories.")
      setIsLoading(false)
    }
  }, [user?.piUid, refreshKey])

  const addStatus = useCallback(
    async (status: Omit<Status, "id" | "createdAt" | "expiresAt" | "seenBy">) => {
      await createStatus(status)
    },
    [],
  )

  const markStatusAsSeen = useCallback(async (statusId: string, viewerPiUid: string) => {
    await markStatusSeen(statusId, viewerPiUid)
  }, [])

  const refreshStatuses = useCallback(() => {
    setRefreshKey((key) => key + 1)
  }, [])

  const value = useMemo(
    () => ({
      statusGroups,
      isLoading,
      error,
      addStatus,
      markStatusAsSeen,
      refreshStatuses,
    }),
    [statusGroups, isLoading, error, addStatus, markStatusAsSeen, refreshStatuses],
  )

  return <StatusContext.Provider value={value}>{children}</StatusContext.Provider>
}

export function useStatus() {
  const context = useContext(StatusContext)
  if (context === undefined) {
    return {
      statusGroups: [],
      isLoading: false,
      error: "StatusContext not available",
      addStatus: async () => console.warn("[socialhub] StatusContext not available"),
      markStatusAsSeen: async () => console.warn("[socialhub] StatusContext not available"),
      refreshStatuses: () => console.warn("[socialhub] StatusContext not available"),
    }
  }
  return context
}
