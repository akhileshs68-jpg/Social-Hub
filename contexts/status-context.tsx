"use client"

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react"
import type { Status, StatusGroup } from "@/lib/types"

interface StatusContextType {
  statusGroups: StatusGroup[]
  addStatus: (status: Omit<Status, "id" | "createdAt" | "expiresAt" | "seenBy">) => void
  markStatusAsSeen: (statusId: string, viewerPiUid: string) => void
  refreshStatuses: () => void
}

const StatusContext = createContext<StatusContextType | undefined>(undefined)

export function StatusProvider({ children }: { children: ReactNode }) {
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
}

export function useStatus() {
  const context = useContext(StatusContext)
  if (context === undefined) {
    // Return dummy functions if context is not available (non-blocking)
    return {
      statusGroups: [],
      addStatus: () => console.warn("[v0] StatusContext not available"),
      markStatusAsSeen: () => console.warn("[v0] StatusContext not available"),
      refreshStatuses: () => console.warn("[v0] StatusContext not available"),
    }
  }
  return context
}

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
