"use client"

import { useState, useEffect } from "react"
import { X, Send, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Avatar } from "@/components/ui/avatar"
import { usePiAuth } from "@/contexts/pi-auth-context"
import type { StatusGroup } from "@/lib/types"
import { useToast } from "@/hooks/use-toast"

interface StatusViewerModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  statusGroup: StatusGroup | null
}

export function StatusViewerModal({ open, onOpenChange, statusGroup }: StatusViewerModalProps) {
  const { user } = usePiAuth()
  const { toast } = useToast()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [progress, setProgress] = useState(0)
  const [reply, setReply] = useState("")
  const [showSeenList, setShowSeenList] = useState(false)

  const currentStatus = statusGroup?.statuses[currentIndex]
  const isVideo = currentStatus?.media.type === "video"
  const duration = isVideo ? 15000 : 5000 // 15s for video, 5s for image

  // Auto-progress timer
  useEffect(() => {
    if (!open || !currentStatus) return

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          // Move to next status
          if (currentIndex < (statusGroup?.statuses.length || 0) - 1) {
            setCurrentIndex((prev) => prev + 1)
            return 0
          } else {
            // Close modal when all statuses viewed
            onOpenChange(false)
            return 0
          }
        }
        return prev + 100 / (duration / 100)
      })
    }, 100)

    return () => clearInterval(interval)
  }, [open, currentIndex, statusGroup, duration, onOpenChange, currentStatus])

  // Mark as seen
  useEffect(() => {
    if (open && currentStatus && user) {
      // Mark status as seen by current user
      // API call: markStatusAsSeen(currentStatus.id, user.piUid)
    }
  }, [open, currentStatus, user])

  // Reset on open
  useEffect(() => {
    if (open) {
      setCurrentIndex(0)
      setProgress(0)
      setReply("")
      setShowSeenList(false)
    }
  }, [open])

  const handleNext = () => {
    if (currentIndex < (statusGroup?.statuses.length || 0) - 1) {
      setCurrentIndex((prev) => prev + 1)
      setProgress(0)
    } else {
      onOpenChange(false)
    }
  }

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1)
      setProgress(0)
    }
  }

  const handleSendReply = async () => {
    if (!reply.trim() || !currentStatus || !user) return

    try {
      // Send private reply
      // API call: sendStatusReply(currentStatus.id, user.piUid, reply)

      toast({
        title: "Reply sent",
        description: `Your message was sent to ${statusGroup?.username}`,
      })

      setReply("")
    } catch (error) {
      toast({
        title: "Failed to send",
        description: "Please try again.",
        variant: "destructive",
      })
    }
  }

  const getTimeRemaining = (expiresAt: string) => {
    const now = new Date().getTime()
    const expires = new Date(expiresAt).getTime()
    const diff = expires - now
    const hours = Math.floor(diff / (1000 * 60 * 60))
    return `${hours}h left`
  }

  if (!statusGroup || !currentStatus) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-0 max-w-md h-[90vh] sm:h-[80vh] bg-black border-none">
        <div className="relative h-full flex flex-col">
          {/* Progress Bars */}
          <div className="absolute top-0 left-0 right-0 z-20 flex gap-1 p-2">
            {statusGroup.statuses.map((_, idx) => (
              <div key={idx} className="flex-1 h-0.5 bg-white/30 rounded-full overflow-hidden">
                <div
                  className="h-full bg-white transition-all duration-100"
                  style={{
                    width: idx === currentIndex ? `${progress}%` : idx < currentIndex ? "100%" : "0%",
                  }}
                />
              </div>
            ))}
          </div>

          {/* Header */}
          <div className="absolute top-0 left-0 right-0 z-10 p-4 pt-6 bg-gradient-to-b from-black/70 to-transparent">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10 border-2 border-white">
                  <div className="flex h-full w-full items-center justify-center bg-primary text-primary-foreground font-semibold">
                    {statusGroup.avatar}
                  </div>
                </Avatar>
                <div>
                  <p className="font-semibold text-white text-sm">{statusGroup.username}</p>
                  <p className="text-xs text-white/80">{getTimeRemaining(currentStatus.expiresAt)}</p>
                </div>
              </div>
              <Button
                size="icon"
                variant="ghost"
                className="text-white hover:bg-white/20"
                onClick={() => onOpenChange(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Navigation Areas */}
          <button
            className="absolute left-0 top-0 bottom-0 w-1/3 z-10"
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            aria-label="Previous status"
          />
          <button
            className="absolute right-0 top-0 bottom-0 w-1/3 z-10"
            onClick={handleNext}
            aria-label="Next status"
          />

          {/* Media Content */}
          <div className="flex-1 flex items-center justify-center bg-black">
            {isVideo ? (
              <video src={currentStatus.media.url} className="w-full h-full object-contain" autoPlay loop muted />
            ) : (
              <img
                src={currentStatus.media.url || "/placeholder.svg"}
                alt="Status"
                className="w-full h-full object-contain"
              />
            )}
          </div>

          {/* Caption */}
          {currentStatus.caption && (
            <div className="absolute bottom-20 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
              <p className="text-white text-sm">{currentStatus.caption}</p>
            </div>
          )}

          {/* Reply Input */}
          <div className="p-4 bg-black/90 border-t border-white/10">
            <div className="flex items-center gap-2">
              <Input
                placeholder="Reply privately..."
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-white/50"
                onKeyDown={(e) => e.key === "Enter" && handleSendReply()}
              />
              <Button
                size="icon"
                onClick={handleSendReply}
                disabled={!reply.trim()}
                className="bg-primary hover:bg-primary/90"
              >
                <Send className="h-4 w-4" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => setShowSeenList(!showSeenList)}
                className="text-white hover:bg-white/20"
              >
                <Eye className="h-4 w-4" />
                <span className="ml-1 text-xs">{currentStatus.seenBy.length}</span>
              </Button>
            </div>

            {/* Seen List */}
            {showSeenList && currentStatus.seenBy.length > 0 && (
              <div className="mt-2 p-2 bg-white/5 rounded-lg">
                <p className="text-xs text-white/70 mb-2">Seen by {currentStatus.seenBy.length}</p>
                {/* Show list of users who viewed */}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
