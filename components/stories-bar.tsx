"use client"

import { useState, useEffect } from "react"
import { Plus } from "lucide-react"
import { Avatar } from "@/components/ui/avatar"
import { usePiAuth } from "@/contexts/pi-auth-context"
import { useStatus } from "@/contexts/status-context"
import { CreateStatusModal } from "@/components/create-status-modal"
import { StatusViewerModal } from "@/components/status-viewer-modal"
import type { StatusGroup } from "@/lib/types"

// Mock data - replace with API call
const MOCK_STATUS_GROUPS: StatusGroup[] = [
  {
    piUid: "user456",
    username: "blockchain_dev",
    avatar: "B",
    hasUnseen: true,
    statuses: [
      {
        id: "s1",
        piUid: "user456",
        username: "blockchain_dev",
        avatar: "B",
        media: {
          type: "image",
          url: "/placeholder.svg?height=800&width=600",
        },
        caption: "Late night coding session! 💻",
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        expiresAt: new Date(Date.now() + 22 * 60 * 60 * 1000).toISOString(),
        seenBy: [],
      },
    ],
  },
  {
    piUid: "user789",
    username: "pi_enthusiast",
    avatar: "P",
    hasUnseen: true,
    statuses: [
      {
        id: "s2",
        piUid: "user789",
        username: "pi_enthusiast",
        avatar: "P",
        media: {
          type: "video",
          url: "/placeholder.svg?height=800&width=600",
          thumbnail: "/placeholder.svg?height=400&width=300",
        },
        caption: "Pi Conference highlights!",
        createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
        expiresAt: new Date(Date.now() + 19 * 60 * 60 * 1000).toISOString(),
        seenBy: ["user123"],
      },
    ],
  },
  {
    piUid: "user101",
    username: "techsavvy",
    avatar: "T",
    hasUnseen: false,
    statuses: [
      {
        id: "s3",
        piUid: "user101",
        username: "techsavvy",
        avatar: "T",
        media: {
          type: "image",
          url: "/placeholder.svg?height=800&width=600",
        },
        createdAt: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString(),
        expiresAt: new Date(Date.now() + 14 * 60 * 60 * 1000).toISOString(),
        seenBy: ["user123", "user456"],
      },
    ],
  },
]

export function StoriesBar() {
  const { user } = usePiAuth()
  const { statusGroups } = useStatus()
  const [createModalOpen, setCreateModalOpen] = useState(false)
  const [viewerModalOpen, setViewerModalOpen] = useState(false)
  const [selectedGroup, setSelectedGroup] = useState<StatusGroup | null>(null)
  const [hasOwnStatus, setHasOwnStatus] = useState(false)

  useEffect(() => {
    if (user) {
      const ownStatus = statusGroups.find((g) => g.piUid === user.piUid)
      setHasOwnStatus(!!ownStatus)
    }
  }, [statusGroups, user])

  const handleViewStatus = (group: StatusGroup) => {
    setSelectedGroup(group)
    setViewerModalOpen(true)
  }

  const allStatusGroups = [
    ...statusGroups,
    ...MOCK_STATUS_GROUPS.filter((mock) => !statusGroups.some((s) => s.piUid === mock.piUid)),
  ]

  return (
    <>
      <div className="bg-card border-b border-border overflow-x-auto">
        <div className="flex gap-4 p-4 min-w-max">
          {/* Add Your Status */}
          <button
            onClick={() => setCreateModalOpen(true)}
            className="flex flex-col items-center gap-2 min-w-[80px] touch-manipulation"
            aria-label="Add status"
          >
            <div className="relative">
              <Avatar
                className={`h-16 w-16 ${hasOwnStatus ? "border-2 border-primary" : "border-2 border-dashed border-primary"}`}
              >
                <div
                  className={`flex h-full w-full items-center justify-center ${hasOwnStatus ? "bg-primary/20" : "bg-primary/10"} text-xl font-semibold text-primary`}
                >
                  {user?.username?.[0]?.toUpperCase() || "Y"}
                </div>
              </Avatar>
              <div className="absolute bottom-0 right-0 h-5 w-5 rounded-full bg-primary flex items-center justify-center border-2 border-card">
                <Plus className="h-3 w-3 text-primary-foreground" />
              </div>
            </div>
            <span className="text-xs text-center leading-tight">Your Status</span>
          </button>

          {/* Other Users' Statuses */}
          {allStatusGroups.map((group) => (
            <button
              key={group.piUid}
              onClick={() => handleViewStatus(group)}
              className="flex flex-col items-center gap-2 min-w-[80px] touch-manipulation"
              aria-label={`View ${group.username}'s status`}
            >
              <div className="relative">
                <div
                  className={`h-16 w-16 rounded-full p-[3px] ${
                    group.hasUnseen ? "bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-500" : "bg-muted"
                  }`}
                >
                  <Avatar className="h-full w-full border-2 border-card">
                    <div className="flex h-full w-full items-center justify-center bg-muted text-xl font-semibold">
                      {group.avatar}
                    </div>
                  </Avatar>
                </div>
              </div>
              <span className="text-xs text-center leading-tight max-w-[80px] truncate">{group.username}</span>
            </button>
          ))}
        </div>
      </div>

      <CreateStatusModal open={createModalOpen} onOpenChange={setCreateModalOpen} />
      <StatusViewerModal open={viewerModalOpen} onOpenChange={setViewerModalOpen} statusGroup={selectedGroup} />
    </>
  )
}
