"use client"

import { useEffect, useState } from "react"
import { Plus } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { usePiAuth } from "@/contexts/pi-auth-context"
import { useStatus } from "@/contexts/status-context"
import { CreateStatusModal } from "@/components/create-status-modal"
import { StatusViewerModal } from "@/components/status-viewer-modal"
import type { StatusGroup } from "@/lib/types"

export function StoriesBar() {
  const { user } = usePiAuth()
  const { statusGroups, isLoading, error } = useStatus()
  const [createModalOpen, setCreateModalOpen] = useState(false)
  const [viewerModalOpen, setViewerModalOpen] = useState(false)
  const [selectedGroup, setSelectedGroup] = useState<StatusGroup | null>(null)
  const [hasOwnStatus, setHasOwnStatus] = useState(false)

  useEffect(() => {
    if (user) {
      setHasOwnStatus(statusGroups.some((group) => group.piUid === user.piUid))
    }
  }, [statusGroups, user])

  const handleViewStatus = (group: StatusGroup) => {
    setSelectedGroup(group)
    setViewerModalOpen(true)
  }

  return (
    <>
      <div className="bg-card border-b border-border overflow-x-auto">
        <div className="flex gap-4 overflow-x-auto py-4 px-2">
          <button
            onClick={() => setCreateModalOpen(true)}
            className="flex flex-col items-center gap-2 min-w-[72px] shrink-0"
            aria-label="Add status"
          >
            <div className="relative">
              <Avatar
                className={`h-16 w-16 ${hasOwnStatus ? "border-2 border-primary" : "border-2 border-dashed border-primary"}`}
              >
                {user?.photoURL && <AvatarImage src={user.photoURL} alt={user.username} />}
                <AvatarFallback
                  className={`${hasOwnStatus ? "bg-primary/20" : "bg-primary/10"} text-xl font-semibold text-primary`}
                >
                  {user?.username?.[0]?.toUpperCase() || "Y"}
                </AvatarFallback>
              </Avatar>
              <div className="absolute bottom-0 right-0 h-5 w-5 rounded-full bg-primary flex items-center justify-center border-2 border-card">
                <Plus className="h-3 w-3 text-primary-foreground" />
              </div>
            </div>
            <span className="text-xs text-center leading-tight">Your Status</span>
          </button>

          {isLoading &&
            Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="flex flex-col items-center gap-2 min-w-[80px]">
                <Skeleton className="h-16 w-16 rounded-full" />
                <Skeleton className="h-3 w-14" />
              </div>
            ))}

          {!isLoading && error && <p className="self-center text-xs text-muted-foreground">{error}</p>}

          {!isLoading &&
            !error &&
            statusGroups.map((group) => (
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
                      {group.statuses[0]?.authorPhotoURL && (
                        <AvatarImage src={group.statuses[0].authorPhotoURL} alt={group.username} />
                      )}
                      <AvatarFallback className="bg-muted text-xl font-semibold">{group.avatar}</AvatarFallback>
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
