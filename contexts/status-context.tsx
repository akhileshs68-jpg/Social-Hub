"use client"

<<<<<<< HEAD
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
=======
import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react"
import type { Status, StatusGroup } from "@/lib/types"

interface StatusContextType {
  statusGroups: StatusGroup[]
  addStatus: (status: Omit<Status, "id" | "createdAt" | "expiresAt" | "seenBy">) => void
  markStatusAsSeen: (statusId: string, viewerPiUid: string) => void
>>>>>>> c07617a5128ffd992b542a41c1dea574864a3046
  refreshStatuses: () => void
}

const StatusContext = createContext<StatusContextType | undefined>(undefined)

export function StatusProvider({ children }: { children: ReactNode }) {
<<<<<<< HEAD
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
=======
  const [statusGroups, setStatusGroups] = useState<StatusGroup[]>([])
  const [updateTrigger, setUpdateTrigger] = useState(0)

  // Load statuses from localStorage on mount
  useEffect(() => {
    try {
      const savedStatuses = localStorage.getItem("user_statuses")
      if (savedStatuses) {
        const statuses: Status[] = JSON.parse(savedStatuses)
        // Filter out expired statuses
        const activeStatuses = statuses.filter((s) => new Date(s.expiresAt) > new Date())

        // Group by user
        const grouped = groupStatusesByUser(activeStatuses)
        setStatusGroups(grouped)

        // Clean up expired statuses
        if (activeStatuses.length !== statuses.length) {
          localStorage.setItem("user_statuses", JSON.stringify(activeStatuses))
        }
      }
    } catch (error) {
      console.error("[v0] Failed to load statuses:", error)
    }
  }, [updateTrigger])

  const addStatus = useCallback((status: Omit<Status, "id" | "createdAt" | "expiresAt" | "seenBy">) => {
    try {
      const now = new Date()
      const expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000) // 24 hours

      const newStatus: Status = {
        ...status,
        id: `status-${Date.now()}-${Math.random().toString(36).substring(7)}`,
        createdAt: now.toISOString(),
        expiresAt: expiresAt.toISOString(),
        seenBy: [],
      }

      // Load existing statuses
      const savedStatuses = localStorage.getItem("user_statuses")
      const statuses: Status[] = savedStatuses ? JSON.parse(savedStatuses) : []

      // Filter out expired and add new
      const activeStatuses = statuses.filter((s) => new Date(s.expiresAt) > new Date())
      activeStatuses.unshift(newStatus)

      // Keep only last 100 statuses
      if (activeStatuses.length > 100) activeStatuses.pop()

      localStorage.setItem("user_statuses", JSON.stringify(activeStatuses))

      // Trigger refresh
      setUpdateTrigger((prev) => prev + 1)

      // Trigger custom event for cross-component updates
      window.dispatchEvent(new Event("statusUpdate"))
    } catch (error) {
      console.error("[v0] Failed to save status:", error)
      throw new Error("Failed to save status")
    }
  }, [])

  const markStatusAsSeen = useCallback((statusId: string, viewerPiUid: string) => {
    try {
      const savedStatuses = localStorage.getItem("user_statuses")
      if (!savedStatuses) return

      const statuses: Status[] = JSON.parse(savedStatuses)
      const status = statuses.find((s) => s.id === statusId)

      if (status && !status.seenBy.includes(viewerPiUid)) {
        status.seenBy.push(viewerPiUid)
        localStorage.setItem("user_statuses", JSON.stringify(statuses))
        setUpdateTrigger((prev) => prev + 1)
      }
    } catch (error) {
      console.error("[v0] Failed to mark status as seen:", error)
    }
  }, [])

  const refreshStatuses = useCallback(() => {
    setUpdateTrigger((prev) => prev + 1)
  }, [])

  return (
    <StatusContext.Provider value={{ statusGroups, addStatus, markStatusAsSeen, refreshStatuses }}>
      {children}
    </StatusContext.Provider>
  )
>>>>>>> c07617a5128ffd992b542a41c1dea574864a3046
}

export function useStatus() {
  const context = useContext(StatusContext)
  if (context === undefined) {
<<<<<<< HEAD
    return {
      statusGroups: [],
      isLoading: false,
      error: "StatusContext not available",
      addStatus: async () => console.warn("[socialhub] StatusContext not available"),
      markStatusAsSeen: async () => console.warn("[socialhub] StatusContext not available"),
      refreshStatuses: () => console.warn("[socialhub] StatusContext not available"),
=======
    // Return dummy functions if context is not available (non-blocking)
    return {
      statusGroups: [],
      addStatus: () => console.warn("[v0] StatusContext not available"),
      markStatusAsSeen: () => console.warn("[v0] StatusContext not available"),
      refreshStatuses: () => console.warn("[v0] StatusContext not available"),
>>>>>>> c07617a5128ffd992b542a41c1dea574864a3046
    }
  }
  return context
}
<<<<<<< HEAD
=======

// Helper function to group statuses by user
function groupStatusesByUser(statuses: Status[]): StatusGroup[] {
  const grouped = new Map<string, StatusGroup>()

  for (const status of statuses) {
    const existing = grouped.get(status.piUid)
    if (existing) {
      existing.statuses.push(status)
    } else {
      grouped.set(status.piUid, {
        piUid: status.piUid,
        username: status.username,
        avatar: status.avatar,
        statuses: [status],
        hasUnseen: status.seenBy.length === 0, // Simple unseen logic
      })
    }
  }

  return Array.from(grouped.values())
}
>>>>>>> c07617a5128ffd992b542a41c1dea574864a3046
