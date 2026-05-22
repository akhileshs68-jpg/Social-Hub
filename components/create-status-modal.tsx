"use client"

import type React from "react"

import { useState } from "react"
import { X, ImageIcon, Video, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { usePiAuth } from "@/contexts/pi-auth-context"
import { useStatus } from "@/contexts/status-context"
import { validateImageFile, validateVideoFile, compressImage, MAX_IMAGE_SIZE, MAX_VIDEO_SIZE } from "@/lib/media-utils"
import { useToast } from "@/hooks/use-toast"

interface CreateStatusModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateStatusModal({ open, onOpenChange }: CreateStatusModalProps) {
  const { user } = usePiAuth()
  const { addStatus } = useStatus()
  const { toast } = useToast()
  const [caption, setCaption] = useState("")
  const [mediaFile, setMediaFile] = useState<File | null>(null)
  const [mediaPreview, setMediaPreview] = useState<string>("")
  const [mediaType, setMediaType] = useState<"image" | "video" | null>(null)
  const [uploading, setUploading] = useState(false)

  const handleMediaSelect = async (e: React.ChangeEvent<HTMLInputElement>, type: "image" | "video") => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file
    const validation = type === "image" ? validateImageFile(file) : validateVideoFile(file)

    if (!validation.valid) {
      toast({
        title: "Invalid file",
        description: validation.error,
        variant: "destructive",
      })
      return
    }

    setMediaFile(file)
    setMediaType(type)

    // Create preview
    if (type === "image") {
      const compressed = await compressImage(file)
      setMediaPreview(compressed)
    } else {
      setMediaPreview(URL.createObjectURL(file))
    }
  }

  const handleUpload = async () => {
    // Validation
    if (!mediaFile || !mediaType || !user) {
      toast({
        title: "Missing required fields",
        description: "Please select a photo or video to share.",
        variant: "destructive",
      })
      return
    }

    setUploading(true)

    try {
      // Simulate upload delay
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Add status to context (using preview URL as the media URL)
      addStatus({
        piUid: user.piUid,
        username: user.username,
        avatar: user.avatar,
        media: {
          type: mediaType,
          url: mediaPreview,
          thumbnail: mediaType === "video" ? mediaPreview : undefined,
        },
        caption: caption || undefined,
      })

      toast({
        title: "Status uploaded!",
        description: "Your status will expire in 24 hours.",
      })

      // Reset form
      setCaption("")
      setMediaFile(null)
      setMediaPreview("")
      setMediaType(null)
      onOpenChange(false)
    } catch (error) {
      console.error("[v0] Status upload failed:", error)
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "Failed to upload status. Please try again.",
        variant: "destructive",
      })
    } finally {
      setUploading(false)
    }
  }

  const clearMedia = () => {
    setMediaFile(null)
    setMediaPreview("")
    setMediaType(null)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create Status</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Media Preview */}
          {mediaPreview ? (
            <div className="relative aspect-[3/4] bg-muted rounded-lg overflow-hidden">
              {mediaType === "image" ? (
                <img src={mediaPreview || "/placeholder.svg"} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <video src={mediaPreview} className="w-full h-full object-cover" controls />
              )}
              <Button size="icon" variant="destructive" className="absolute top-2 right-2" onClick={clearMedia}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {/* Image Upload */}
              <label className="flex flex-col items-center justify-center h-40 border-2 border-dashed border-border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors touch-manipulation">
                <ImageIcon className="h-8 w-8 text-muted-foreground mb-2" />
                <span className="text-sm text-muted-foreground">Add Photo</span>
                <span className="text-xs text-muted-foreground mt-1">Max {MAX_IMAGE_SIZE / 1024 / 1024}MB</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleMediaSelect(e, "image")}
                />
              </label>

              {/* Video Upload */}
              <label className="flex flex-col items-center justify-center h-40 border-2 border-dashed border-border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors touch-manipulation">
                <Video className="h-8 w-8 text-muted-foreground mb-2" />
                <span className="text-sm text-muted-foreground">Add Video</span>
                <span className="text-xs text-muted-foreground mt-1">Max {MAX_VIDEO_SIZE / 1024 / 1024}MB</span>
                <input
                  type="file"
                  accept="video/*"
                  className="hidden"
                  onChange={(e) => handleMediaSelect(e, "video")}
                />
              </label>
            </div>
          )}

          {/* Caption */}
          {mediaPreview && (
            <Textarea
              placeholder="Add a caption... (optional)"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="resize-none"
              rows={3}
            />
          )}

          {/* Upload Button */}
          <Button className="w-full" onClick={handleUpload} disabled={!mediaFile || uploading}>
            {uploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              "Share Status"
            )}
          </Button>

          <p className="text-xs text-center text-muted-foreground">Your status will be visible for 24 hours</p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
