"use client"

import { useState, useRef } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Camera, X, Check, Globe, Lock, Copy, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { useChatContext } from "@/contexts/chat-context"
import { mockParticipants } from "@/lib/mock-data/messages"
import { useToast } from "@/hooks/use-toast"
import type { Conversation } from "@/lib/types"

interface CreateGroupModalProps {
  open: boolean
  onClose: () => void
  onCreated: (conv: Conversation) => void
}

type Step = "info" | "members" | "invite"

export function CreateGroupModal({ open, onClose, onCreated }: CreateGroupModalProps) {
  const { createGroup } = useChatContext()
  const { toast } = useToast()
  const avatarInputRef = useRef<HTMLInputElement>(null)

  const [step, setStep] = useState<Step>("info")
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [avatarPreview, setAvatarPreview] = useState<string>("")
  const [isPublic, setIsPublic] = useState(false)
  const [selectedMembers, setSelectedMembers] = useState<string[]>([])
  const [createdConv, setCreatedConv] = useState<Conversation | null>(null)
  const [memberSearch, setMemberSearch] = useState("")

  const allCandidates = mockParticipants // in production, search users via API

  const filtered = allCandidates.filter((p) =>
    p.username.toLowerCase().includes(memberSearch.toLowerCase()),
  )

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setAvatarPreview(URL.createObjectURL(file))
    }
  }

  const toggleMember = (piUid: string) => {
    setSelectedMembers((prev) =>
      prev.includes(piUid) ? prev.filter((id) => id !== piUid) : [...prev, piUid],
    )
  }

  const handleCreate = () => {
    if (!name.trim()) {
      toast({ title: "Group name required", variant: "destructive" })
      return
    }
    const conv = createGroup({
      name: name.trim(),
      description: description.trim(),
      avatar: name.trim().slice(0, 2).toUpperCase(),
      isPublic,
      memberPiUids: selectedMembers,
    })
    setCreatedConv(conv)
    setStep("invite")
  }

  const handleCopyLink = () => {
    if (createdConv?.inviteLink) {
      navigator.clipboard.writeText(createdConv.inviteLink).catch(() => {})
      toast({ title: "Invite link copied!" })
    }
  }

  const handleDone = () => {
    if (createdConv) onCreated(createdConv)
    handleReset()
  }

  const handleReset = () => {
    setStep("info")
    setName("")
    setDescription("")
    setAvatarPreview("")
    setIsPublic(false)
    setSelectedMembers([])
    setCreatedConv(null)
    setMemberSearch("")
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && handleReset()}>
      <DialogContent className="max-w-md mx-auto p-0 overflow-hidden rounded-2xl">
        {/* ---------------------------------------------------------------- */}
        {/* Step 1: Group info                                                */}
        {/* ---------------------------------------------------------------- */}
        {step === "info" && (
          <>
            <DialogHeader className="px-5 pt-5 pb-3 border-b border-border">
              <DialogTitle className="text-lg font-semibold">New Group</DialogTitle>
            </DialogHeader>

            <div className="px-5 py-4 space-y-5">
              {/* Avatar */}
              <div className="flex justify-center">
                <button
                  onClick={() => avatarInputRef.current?.click()}
                  className="relative w-20 h-20 rounded-full overflow-hidden bg-muted border-2 border-dashed border-border hover:border-primary transition-colors group"
                >
                  {avatarPreview ? (
                    <img src={avatarPreview} alt="Group avatar" className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex flex-col items-center justify-center w-full h-full gap-1">
                      <Camera className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" />
                      <span className="text-[10px] text-muted-foreground">Photo</span>
                    </div>
                  )}
                </button>
                <input
                  ref={avatarInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarChange}
                />
              </div>

              {/* Name */}
              <div className="space-y-1.5">
                <Label className="text-sm font-medium">Group Name</Label>
                <Input
                  placeholder="Enter group name..."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  maxLength={60}
                />
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <Label className="text-sm font-medium">Description</Label>
                <Textarea
                  placeholder="What is this group about?"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  maxLength={200}
                  className="resize-none"
                />
              </div>

              {/* Public / Private toggle */}
              <div className="flex items-center justify-between bg-muted/50 rounded-xl px-4 py-3">
                <div className="flex items-center gap-3">
                  {isPublic ? (
                    <Globe className="w-4 h-4 text-primary" />
                  ) : (
                    <Lock className="w-4 h-4 text-muted-foreground" />
                  )}
                  <div>
                    <p className="text-sm font-medium">{isPublic ? "Public Group" : "Private Group"}</p>
                    <p className="text-xs text-muted-foreground">
                      {isPublic ? "Anyone can find and join" : "Invite only via link"}
                    </p>
                  </div>
                </div>
                <Switch checked={isPublic} onCheckedChange={setIsPublic} />
              </div>
            </div>

            <div className="px-5 pb-5 flex gap-2">
              <Button variant="outline" className="flex-1" onClick={handleReset}>
                Cancel
              </Button>
              <Button
                className="flex-1"
                onClick={() => setStep("members")}
                disabled={!name.trim()}
              >
                Next
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </>
        )}

        {/* ---------------------------------------------------------------- */}
        {/* Step 2: Add members                                               */}
        {/* ---------------------------------------------------------------- */}
        {step === "members" && (
          <>
            <DialogHeader className="px-5 pt-5 pb-3 border-b border-border">
              <div className="flex items-center gap-2">
                <button onClick={() => setStep("info")} className="p-1 rounded-full hover:bg-muted">
                  <X className="w-4 h-4" />
                </button>
                <DialogTitle className="text-lg font-semibold">Add Members</DialogTitle>
              </div>
            </DialogHeader>

            {/* Selected chips */}
            {selectedMembers.length > 0 && (
              <div className="px-4 py-2 border-b border-border flex flex-wrap gap-1.5">
                {selectedMembers.map((uid) => {
                  const p = allCandidates.find((c) => c.piUid === uid)
                  if (!p) return null
                  return (
                    <Badge
                      key={uid}
                      variant="secondary"
                      className="gap-1 cursor-pointer"
                      onClick={() => toggleMember(uid)}
                    >
                      {p.username}
                      <X className="w-3 h-3" />
                    </Badge>
                  )
                })}
              </div>
            )}

            {/* Search */}
            <div className="px-4 pt-3">
              <Input
                placeholder="Search contacts..."
                value={memberSearch}
                onChange={(e) => setMemberSearch(e.target.value)}
                className="bg-muted/50"
              />
            </div>

            <ScrollArea className="h-60 px-2 py-2">
              {filtered.map((p) => {
                const selected = selectedMembers.includes(p.piUid)
                return (
                  <button
                    key={p.piUid}
                    onClick={() => toggleMember(p.piUid)}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-accent/50 transition-colors"
                  >
                    <div className="relative shrink-0">
                      <Avatar className="w-9 h-9">
                        <AvatarFallback className="bg-primary/10 text-primary text-sm font-semibold">
                          {p.avatar}
                        </AvatarFallback>
                      </Avatar>
                      {p.isOnline && (
                        <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-card rounded-full" />
                      )}
                    </div>
                    <div className="flex-1 text-left">
                      <p className="text-sm font-medium">{p.username}</p>
                      <p className="text-xs text-muted-foreground">{p.isOnline ? "Online" : "Offline"}</p>
                    </div>
                    <div
                      className={cn(
                        "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors",
                        selected
                          ? "bg-primary border-primary"
                          : "border-muted-foreground/30",
                      )}
                    >
                      {selected && <Check className="w-3 h-3 text-primary-foreground" />}
                    </div>
                  </button>
                )
              })}
            </ScrollArea>

            <div className="px-5 pb-5 flex gap-2">
              <Button variant="outline" className="flex-1" onClick={() => setStep("info")}>
                Back
              </Button>
              <Button className="flex-1" onClick={handleCreate}>
                Create Group
              </Button>
            </div>
          </>
        )}

        {/* ---------------------------------------------------------------- */}
        {/* Step 3: Invite link                                               */}
        {/* ---------------------------------------------------------------- */}
        {step === "invite" && createdConv && (
          <>
            <DialogHeader className="px-5 pt-5 pb-3 border-b border-border">
              <DialogTitle className="text-lg font-semibold">Group Created</DialogTitle>
            </DialogHeader>

            <div className="px-5 py-6 space-y-5 text-center">
              <div className="flex justify-center">
                <Avatar className="w-16 h-16">
                  <AvatarFallback className="bg-primary/10 text-primary text-xl font-bold">
                    {createdConv.groupAvatar}
                  </AvatarFallback>
                </Avatar>
              </div>
              <div>
                <h3 className="font-semibold text-lg">{createdConv.groupName}</h3>
                {createdConv.groupDescription && (
                  <p className="text-sm text-muted-foreground mt-0.5">{createdConv.groupDescription}</p>
                )}
                <div className="flex items-center justify-center gap-1.5 mt-1">
                  {createdConv.isPublic ? (
                    <>
                      <Globe className="w-3.5 h-3.5 text-primary" />
                      <span className="text-xs text-primary font-medium">Public</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-3.5 h-3.5 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">Private</span>
                    </>
                  )}
                </div>
              </div>

              {/* Invite link */}
              <div className="bg-muted/60 rounded-xl px-4 py-3 space-y-2">
                <p className="text-xs text-muted-foreground font-medium">Invite Link</p>
                <p className="text-xs text-foreground break-all font-mono">{createdConv.inviteLink}</p>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full gap-1.5"
                  onClick={handleCopyLink}
                >
                  <Copy className="w-3.5 h-3.5" />
                  Copy Link
                </Button>
              </div>
            </div>

            <div className="px-5 pb-5">
              <Button className="w-full" onClick={handleDone}>
                Open Group Chat
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
