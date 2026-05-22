"use client"

import type React from "react"
import { useState, useRef, useEffect, useCallback } from "react"
import {
  ArrowLeft, Phone, Video, MoreVertical, Send, Smile,
  Paperclip, Mic, Check, CheckCheck, X, Reply, Forward,
  Pencil, Trash2, Image as ImageIcon, FileIcon, StopCircle,
  ChevronDown, Globe, Lock, Copy, Users,
} from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { Conversation, Message, MessageType } from "@/lib/types"
import { useChatContext } from "@/contexts/chat-context"
import { useToast } from "@/hooks/use-toast"

// ---- constants -------------------------------------------------------------

const REACTION_EMOJIS = ["👍", "❤️", "🔥", "😂", "😮", "😢"]

// ---- helpers ---------------------------------------------------------------

function formatTime(ts: string) {
  return new Date(ts).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })
}

function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function getLastSeenText(lastSeen?: string): string {
  if (!lastSeen) return "recently"
  const diff = Date.now() - new Date(lastSeen).getTime()
  const m = Math.floor(diff / 60000)
  const h = Math.floor(diff / 3600000)
  if (m < 1) return "just now"
  if (m < 60) return `${m}m ago`
  if (h < 24) return `${h}h ago`
  return "recently"
}

// ---- sub-components --------------------------------------------------------

function StatusIcon({ status }: { status: Message["status"] }) {
  if (status === "sending")
    return <div className="w-3 h-3 border-2 border-muted-foreground/50 border-t-transparent rounded-full animate-spin" />
  if (status === "sent") return <Check className="w-3.5 h-3.5 text-muted-foreground" />
  if (status === "delivered") return <CheckCheck className="w-3.5 h-3.5 text-muted-foreground" />
  return <CheckCheck className="w-3.5 h-3.5 text-primary" />
}

function EmojiPicker({ onPick }: { onPick: (e: string) => void }) {
  const COMMON = ["😊", "😂", "❤️", "🔥", "👍", "👎", "🙏", "🎉", "😍", "😢", "😮", "🤔", "✅", "💯", "🚀"]
  return (
    <div className="flex flex-wrap gap-1 p-2 max-w-[220px]">
      {COMMON.map((e) => (
        <button key={e} className="text-lg hover:scale-125 transition-transform" onClick={() => onPick(e)}>
          {e}
        </button>
      ))}
    </div>
  )
}

// ---- Message bubble --------------------------------------------------------

interface MessageBubbleProps {
  message: Message
  isOwn: boolean
  isGroup: boolean
  showAvatar: boolean
  conversations: Conversation[]
  onReply: (msg: Message) => void
  onEdit: (msg: Message) => void
  onDelete: (id: string) => void
  onForward: (msg: Message) => void
  onReact: (id: string, emoji: string) => void
}

function MessageBubble({
  message, isOwn, isGroup, showAvatar,
  conversations, onReply, onEdit, onDelete, onForward, onReact,
}: MessageBubbleProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [emojiPickerOpen, setEmojiPickerOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  // close menu on outside click
  useEffect(() => {
    if (!menuOpen && !emojiPickerOpen) return
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
        setEmojiPickerOpen(false)
      }
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [menuOpen, emojiPickerOpen])

  const reactionEntries = Object.values(message.reactions ?? {}).filter((r) => r.count > 0)

  const renderContent = () => {
    if (message.isDeleted)
      return <p className="text-sm italic text-muted-foreground">This message was deleted</p>

    return (
      <>
        {/* Forward banner */}
        {message.forwardedFrom && (
          <div className={cn(
            "flex items-center gap-1 text-[10px] font-medium mb-1 border-l-2 pl-2",
            isOwn ? "border-primary-foreground/40 text-primary-foreground/70" : "border-primary text-primary",
          )}>
            <Forward className="w-3 h-3" />
            Forwarded from {message.forwardedFrom.senderUsername}
          </div>
        )}

        {/* Reply quote */}
        {message.replyTo && (
          <div className={cn(
            "text-[11px] mb-1.5 border-l-2 pl-2 rounded",
            isOwn
              ? "border-primary-foreground/50 text-primary-foreground/70"
              : "border-primary text-muted-foreground",
          )}>
            <span className="font-semibold block">{message.replyTo.senderUsername}</span>
            <span className="truncate block max-w-[200px]">{message.replyTo.content}</span>
          </div>
        )}

        {/* Image */}
        {message.type === "image" && message.mediaUrl && (
          <img
            src={message.mediaUrl}
            alt="Shared media"
            className="rounded-lg mb-1.5 max-w-full h-auto max-h-52 object-cover"
          />
        )}

        {/* Video */}
        {message.type === "video" && message.mediaUrl && (
          <video
            src={message.mediaUrl}
            className="rounded-lg mb-1.5 max-w-full max-h-52"
            controls
            playsInline
          />
        )}

        {/* Voice / audio */}
        {(message.type === "voice" || message.type === "audio") && message.mediaUrl && (
          <div className={cn(
            "flex items-center gap-2 mb-1",
            isOwn ? "text-primary-foreground" : "text-foreground",
          )}>
            <Mic className="w-4 h-4 shrink-0" />
            <audio src={message.mediaUrl} controls className="h-8 max-w-[180px]" />
            {message.duration && (
              <span className="text-[10px] opacity-70">{message.duration}s</span>
            )}
          </div>
        )}

        {/* File */}
        {message.type === "file" && (
          <div className={cn(
            "flex items-center gap-2 bg-black/10 rounded-lg p-2 mb-1",
          )}>
            <FileIcon className="w-4 h-4 shrink-0" />
            <div className="min-w-0">
              <p className="text-xs font-medium truncate max-w-[160px]">{message.fileName || "File"}</p>
              {message.fileSize && (
                <p className="text-[10px] opacity-70">{formatFileSize(message.fileSize)}</p>
              )}
            </div>
          </div>
        )}

        {/* Text */}
        {message.content && !message.isDeleted && (
          <p className="text-sm leading-relaxed break-words">{message.content}</p>
        )}

        {/* Edited indicator */}
        {message.isEdited && (
          <span className="text-[10px] opacity-60 ml-1">edited</span>
        )}
      </>
    )
  }

  return (
    <div className={cn("flex gap-2 items-end group", isOwn ? "justify-end" : "justify-start")}>
      {/* Left avatar for incoming group messages */}
      {!isOwn && isGroup && (
        <Avatar className={cn("w-7 h-7 shrink-0 mb-1", !showAvatar && "invisible")}>
          <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
            {message.senderAvatar}
          </AvatarFallback>
        </Avatar>
      )}

      <div className={cn("flex flex-col max-w-[72%]", isOwn ? "items-end" : "items-start")}>
        {/* Sender name for group messages */}
        {isGroup && !isOwn && showAvatar && (
          <span className="text-[11px] text-primary font-semibold px-1 mb-0.5">
            {message.senderUsername}
          </span>
        )}

        <div ref={menuRef} className="relative">
          {/* Context menu trigger (long-press simulation via right-click / hover button) */}
          <div
            className={cn(
              "rounded-2xl px-3.5 py-2 relative",
              isOwn
                ? "bg-primary text-primary-foreground rounded-br-sm"
                : "bg-muted text-foreground rounded-bl-sm",
              message.isDeleted && "opacity-60",
            )}
            onContextMenu={(e) => { e.preventDefault(); setMenuOpen(true) }}
          >
            {renderContent()}
          </div>

          {/* Hover quick action strip */}
          {!message.isDeleted && (
            <div className={cn(
              "absolute top-1/2 -translate-y-1/2 flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity",
              isOwn ? "-left-20" : "-right-20",
            )}>
              <button
                onClick={() => onReply(message)}
                className="p-1 rounded-full hover:bg-muted text-muted-foreground"
                title="Reply"
              >
                <Reply className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setEmojiPickerOpen((p) => !p)}
                className="p-1 rounded-full hover:bg-muted text-muted-foreground"
                title="React"
              >
                <Smile className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setMenuOpen((p) => !p)}
                className="p-1 rounded-full hover:bg-muted text-muted-foreground"
                title="More"
              >
                <MoreVertical className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Reaction quick picker */}
          {emojiPickerOpen && (
            <div className={cn(
              "absolute bottom-full mb-1 z-30 bg-card border border-border rounded-2xl shadow-lg p-1.5 flex gap-1",
              isOwn ? "right-0" : "left-0",
            )}>
              {REACTION_EMOJIS.map((e) => (
                <button
                  key={e}
                  className="text-lg hover:scale-125 transition-transform"
                  onClick={() => { onReact(message.id, e); setEmojiPickerOpen(false) }}
                >
                  {e}
                </button>
              ))}
            </div>
          )}

          {/* Context menu */}
          {menuOpen && (
            <div className={cn(
              "absolute bottom-full mb-1 z-30 bg-card border border-border rounded-xl shadow-xl py-1 min-w-[150px]",
              isOwn ? "right-0" : "left-0",
            )}>
              <button
                className="w-full px-3 py-2 text-sm text-left hover:bg-accent flex items-center gap-2"
                onClick={() => { onReply(message); setMenuOpen(false) }}
              >
                <Reply className="w-4 h-4" /> Reply
              </button>
              <button
                className="w-full px-3 py-2 text-sm text-left hover:bg-accent flex items-center gap-2"
                onClick={() => { onForward(message); setMenuOpen(false) }}
              >
                <Forward className="w-4 h-4" /> Forward
              </button>
              {isOwn && !message.isDeleted && (
                <button
                  className="w-full px-3 py-2 text-sm text-left hover:bg-accent flex items-center gap-2"
                  onClick={() => { onEdit(message); setMenuOpen(false) }}
                >
                  <Pencil className="w-4 h-4" /> Edit
                </button>
              )}
              {isOwn && (
                <button
                  className="w-full px-3 py-2 text-sm text-left hover:bg-accent text-destructive flex items-center gap-2"
                  onClick={() => { onDelete(message.id); setMenuOpen(false) }}
                >
                  <Trash2 className="w-4 h-4" /> Delete
                </button>
              )}
            </div>
          )}
        </div>

        {/* Reactions */}
        {reactionEntries.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1 px-1">
            {reactionEntries.map((r) => (
              <button
                key={r.emoji}
                onClick={() => onReact(message.id, r.emoji)}
                className={cn(
                  "flex items-center gap-0.5 text-xs px-1.5 py-0.5 rounded-full border transition-colors",
                  r.reactedByMe
                    ? "bg-primary/10 border-primary/30 text-primary"
                    : "bg-muted border-border text-foreground hover:bg-accent",
                )}
                title={r.users.join(", ")}
              >
                <span>{r.emoji}</span>
                <span className="font-medium">{r.count}</span>
              </button>
            ))}
          </div>
        )}

        {/* Timestamp + status */}
        <div className="flex items-center gap-1 px-1 mt-0.5">
          <span className="text-[10px] text-muted-foreground">{formatTime(message.timestamp)}</span>
          {isOwn && <StatusIcon status={message.status} />}
        </div>
      </div>
    </div>
  )
}

// ---- Forward modal --------------------------------------------------------

function ForwardModal({
  message,
  conversations,
  onForward,
  onClose,
}: {
  message: Message
  conversations: Conversation[]
  onForward: (toId: string) => void
  onClose: () => void
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50">
      <div className="bg-card rounded-t-2xl w-full max-w-md max-h-[60vh] flex flex-col">
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <h3 className="font-semibold">Forward to...</h3>
          <Button variant="ghost" size="icon" className="w-8 h-8" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>
        <ScrollArea className="flex-1">
          {conversations.map((conv) => {
            const name = conv.type === "group" ? conv.groupName : conv.participants[0]?.username
            const avatar = conv.type === "group" ? conv.groupAvatar : conv.participants[0]?.avatar
            return (
              <button
                key={conv.id}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-accent text-left"
                onClick={() => { onForward(conv.id); onClose() }}
              >
                <Avatar className="w-10 h-10 shrink-0">
                  <AvatarFallback className="bg-primary/10 text-primary font-semibold text-sm">
                    {avatar}
                  </AvatarFallback>
                </Avatar>
                <span className="font-medium text-sm">{name}</span>
              </button>
            )
          })}
        </ScrollArea>
      </div>
    </div>
  )
}

// ---- Group Info panel -----------------------------------------------------

function GroupInfoPanel({
  conversation,
  onClose,
  updateGroupSettings,
}: {
  conversation: Conversation
  onClose: () => void
  updateGroupSettings: (id: string, s: { name?: string; isPublic?: boolean }) => void
}) {
  const { toast } = useToast()

  const handleCopy = () => {
    if (conversation.inviteLink) {
      navigator.clipboard.writeText(conversation.inviteLink).catch(() => {})
      toast({ title: "Invite link copied!" })
    }
  }

  return (
    <div className="absolute inset-0 z-20 bg-card flex flex-col">
      <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
        <Button variant="ghost" size="icon" onClick={onClose}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h3 className="font-semibold">Group Info</h3>
      </div>
      <ScrollArea className="flex-1 p-4 space-y-4">
        <div className="flex flex-col items-center gap-3 py-4">
          <Avatar className="w-16 h-16">
            <AvatarFallback className="bg-primary/10 text-primary text-2xl font-bold">
              {conversation.groupAvatar}
            </AvatarFallback>
          </Avatar>
          <h2 className="text-lg font-bold">{conversation.groupName}</h2>
          {conversation.groupDescription && (
            <p className="text-sm text-muted-foreground text-center">{conversation.groupDescription}</p>
          )}
          <div className="flex items-center gap-1.5">
            {conversation.isPublic ? (
              <>
                <Globe className="w-3.5 h-3.5 text-primary" />
                <span className="text-xs text-primary font-medium">Public Group</span>
              </>
            ) : (
              <>
                <Lock className="w-3.5 h-3.5 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">Private Group</span>
              </>
            )}
          </div>
        </div>

        {/* Members */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-semibold text-muted-foreground">
              {conversation.participants.length} members
            </span>
          </div>
          {conversation.participants.map((p) => (
            <div key={p.piUid} className="flex items-center gap-3 py-2">
              <Avatar className="w-9 h-9 shrink-0">
                <AvatarFallback className="bg-primary/10 text-primary text-sm font-semibold">
                  {p.avatar}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="text-sm font-medium">{p.username}</p>
              </div>
              {conversation.adminIds?.includes(p.piUid) && (
                <Badge variant="outline" className="text-[10px] border-primary text-primary">Admin</Badge>
              )}
              {conversation.moderatorIds?.includes(p.piUid) && (
                <Badge variant="outline" className="text-[10px]">Mod</Badge>
              )}
            </div>
          ))}
        </div>

        {/* Invite link */}
        {conversation.inviteLink && (
          <div className="bg-muted/60 rounded-xl p-3 space-y-1.5">
            <p className="text-xs text-muted-foreground font-medium">Invite Link</p>
            <p className="text-xs font-mono break-all">{conversation.inviteLink}</p>
            <Button variant="outline" size="sm" className="w-full gap-1.5" onClick={handleCopy}>
              <Copy className="w-3.5 h-3.5" />
              Copy Link
            </Button>
          </div>
        )}
      </ScrollArea>
    </div>
  )
}

// ---- Main ChatInterface ---------------------------------------------------

interface ChatInterfaceProps {
  conversation: Conversation
  onBack: () => void
}

export function ChatInterface({ conversation, onBack }: ChatInterfaceProps) {
  const {
    messages: allMessages,
    sendMessage,
    editMessage,
    deleteMessage,
    forwardMessage,
    reactToMessage,
    conversations,
    updateGroupSettings,
    typingUsers,
    onlineUsers,
  } = useChatContext()

  const messages = allMessages[conversation.id] || []

  const [messageText, setMessageText] = useState("")
  const [replyingTo, setReplyingTo] = useState<Message | null>(null)
  const [editingMsg, setEditingMsg] = useState<Message | null>(null)
  const [forwardingMsg, setForwardingMsg] = useState<Message | null>(null)
  const [showGroupInfo, setShowGroupInfo] = useState(false)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [recordingSec, setRecordingSec] = useState(0)

  const scrollRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const recordingTimer = useRef<ReturnType<typeof setInterval> | null>(null)
  const { toast } = useToast()

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      const el = scrollRef.current.querySelector("[data-radix-scroll-area-viewport]")
      if (el) el.scrollTop = el.scrollHeight
    }
  }, [messages])

  // Pre-fill input when editing
  useEffect(() => {
    if (editingMsg) {
      setMessageText(editingMsg.content)
      inputRef.current?.focus()
    }
  }, [editingMsg])

  const getDisplay = () => {
    if (conversation.type === "group") {
      return {
        name: conversation.groupName || "Group",
        avatar: conversation.groupAvatar || "G",
        subtitle: `${conversation.participants.length} members`,
        isOnline: false,
      }
    }
    const p = conversation.participants[0]
    return {
      name: p.username,
      avatar: p.avatar,
      subtitle: p.isOnline ? "Active now" : `Last seen ${getLastSeenText(p.lastSeen)}`,
      isOnline: p.isOnline,
    }
  }

  const handleSend = () => {
    const trimmed = messageText.trim()

    if (editingMsg) {
      if (!trimmed) return
      editMessage(conversation.id, editingMsg.id, trimmed)
      setEditingMsg(null)
      setMessageText("")
      return
    }

    if (!trimmed) return

    sendMessage({
      conversationId: conversation.id,
      content: trimmed,
      type: "text",
      replyTo: replyingTo,
    })
    setMessageText("")
    setReplyingTo(null)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
    if (e.key === "Escape") {
      setReplyingTo(null)
      setEditingMsg(null)
      setMessageText("")
    }
  }

  const handleMediaSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 50 * 1024 * 1024) {
      toast({ title: "File too large", description: "Max 50 MB", variant: "destructive" })
      return
    }
    const isImage = file.type.startsWith("image/")
    const isVideo = file.type.startsWith("video/")
    const isAudio = file.type.startsWith("audio/")
    const type: MessageType = isImage ? "image" : isVideo ? "video" : isAudio ? "audio" : "file"
    const url = URL.createObjectURL(file)
    sendMessage({
      conversationId: conversation.id,
      content: isImage ? "Photo" : isVideo ? "Video" : isAudio ? "Audio" : file.name,
      type,
      mediaUrl: url,
      fileName: file.name,
      fileSize: file.size,
      replyTo: replyingTo,
    })
    setReplyingTo(null)
    e.target.value = ""
  }

  const handleStartRecording = () => {
    setIsRecording(true)
    setRecordingSec(0)
    recordingTimer.current = setInterval(() => setRecordingSec((s) => s + 1), 1000)
  }

  const handleStopRecording = () => {
    if (recordingTimer.current) clearInterval(recordingTimer.current)
    setIsRecording(false)
    // Simulate voice message
    sendMessage({
      conversationId: conversation.id,
      content: "Voice message",
      type: "voice",
      duration: recordingSec,
      replyTo: replyingTo,
    })
    setRecordingSec(0)
    setReplyingTo(null)
  }

  const handleEmojiPick = (emoji: string) => {
    setMessageText((prev) => prev + emoji)
    setShowEmojiPicker(false)
    inputRef.current?.focus()
  }

  const handleForward = (toConversationId: string) => {
    if (!forwardingMsg) return
    forwardMessage(forwardingMsg.id, conversation.id, toConversationId)
    toast({ title: "Message forwarded" })
  }

  const display = getDisplay()

  return (
    <div className="flex flex-col h-full bg-background relative">
      {/* Header */}
      <div className="px-3 py-2.5 border-b border-border bg-card flex items-center justify-between gap-2 shrink-0">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <Button variant="ghost" size="icon" onClick={onBack} className="w-8 h-8 shrink-0">
            <ArrowLeft className="w-5 h-5" />
          </Button>

          <button
            className="flex items-center gap-2 flex-1 min-w-0"
            onClick={() => conversation.type === "group" && setShowGroupInfo(true)}
          >
            <div className="relative shrink-0">
              <Avatar className="w-9 h-9">
                <AvatarFallback className="bg-primary/10 text-primary font-semibold text-sm">
                  {display.avatar}
                </AvatarFallback>
              </Avatar>
              {display.isOnline && (
                <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-card rounded-full" />
              )}
            </div>
            <div className="flex-1 min-w-0 text-left">
              <p className="font-semibold text-sm text-foreground truncate leading-tight">{display.name}</p>
              <p className="text-[11px] text-muted-foreground truncate leading-tight">
                {typingUsers[conversation.id]?.length > 0 ? (
                  <span className="text-cyan-600 dark:text-cyan-400">
                    {typingUsers[conversation.id].length === 1
                      ? `${typingUsers[conversation.id][0]} is typing...`
                      : `${typingUsers[conversation.id].join(", ")} are typing...`}
                  </span>
                ) : (
                  display.subtitle
                )}
              </p>
            </div>
          </button>
        </div>

        <div className="flex items-center gap-0.5 shrink-0">
          <Button variant="ghost" size="icon" className="w-8 h-8">
            <Phone className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" className="w-8 h-8">
            <Video className="w-4 h-4" />
          </Button>
          {conversation.type === "group" && (
            <Button
              variant="ghost"
              size="icon"
              className="w-8 h-8"
              onClick={() => setShowGroupInfo(true)}
            >
              <MoreVertical className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Messages */}
      <ScrollArea ref={scrollRef} className="flex-1 px-3 py-4">
        <div className="space-y-2 max-w-2xl mx-auto">
          {messages.map((msg, idx) => {
            const isOwn = msg.senderId === "current-user"
            const nextMsg = messages[idx + 1]
            const showAvatar = !isOwn && (!nextMsg || nextMsg.senderId !== msg.senderId)

            return (
              <MessageBubble
                key={msg.id}
                message={msg}
                isOwn={isOwn}
                isGroup={conversation.type === "group"}
                showAvatar={showAvatar}
                conversations={conversations}
                onReply={setReplyingTo}
                onEdit={setEditingMsg}
                onDelete={(id) => deleteMessage(conversation.id, id)}
                onForward={(m) => setForwardingMsg(m)}
                onReact={(id, emoji) => reactToMessage(conversation.id, id, emoji)}
              />
            )
          })}
        </div>
      </ScrollArea>

      {/* Reply / Edit banner */}
      {(replyingTo || editingMsg) && (
        <div className="px-4 py-2 border-t border-border bg-muted/50 flex items-start gap-2 shrink-0">
          <div className={cn(
            "flex-1 border-l-2 pl-2",
            editingMsg ? "border-amber-500" : "border-primary",
          )}>
            <p className="text-[11px] font-semibold text-primary">
              {editingMsg ? "Editing message" : `Replying to ${replyingTo?.senderUsername}`}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {editingMsg?.content || replyingTo?.content}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="w-7 h-7 shrink-0"
            onClick={() => { setReplyingTo(null); setEditingMsg(null); setMessageText("") }}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      )}

      {/* Voice recording banner */}
      {isRecording && (
        <div className="px-4 py-2 border-t border-border bg-destructive/10 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-destructive animate-pulse" />
            <span className="text-sm font-medium text-destructive">
              Recording... {recordingSec}s
            </span>
          </div>
          <Button size="sm" variant="destructive" onClick={handleStopRecording} className="gap-1.5 h-8">
            <StopCircle className="w-3.5 h-3.5" />
            Send
          </Button>
        </div>
      )}

      {/* Emoji picker popup */}
      {showEmojiPicker && (
        <div className="absolute bottom-16 left-3 z-20 bg-card border border-border rounded-2xl shadow-xl">
          <EmojiPicker onPick={handleEmojiPick} />
        </div>
      )}

      {/* Input bar */}
      <div className="px-3 py-2.5 border-t border-border bg-card shrink-0">
        <div className="flex items-center gap-1.5 max-w-2xl mx-auto">
          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt,.zip"
            className="hidden"
            onChange={handleMediaSelect}
          />

          <Button
            variant="ghost"
            size="icon"
            className="w-8 h-8 shrink-0"
            onClick={() => fileInputRef.current?.click()}
            title="Attach file"
          >
            <Paperclip className="w-4 h-4" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="w-8 h-8 shrink-0"
            onClick={() => {
              const input = document.createElement("input")
              input.type = "file"
              input.accept = "image/*"
              input.onchange = (e) => {
                const target = e.target as HTMLInputElement
                const file = target.files?.[0]
                if (!file) return
                const url = URL.createObjectURL(file)
                sendMessage({
                  conversationId: conversation.id,
                  content: "Photo",
                  type: "image",
                  mediaUrl: url,
                  replyTo: replyingTo,
                })
                setReplyingTo(null)
              }
              input.click()
            }}
            title="Send image"
          >
            <ImageIcon className="w-4 h-4" />
          </Button>

          <div className="flex-1 relative">
            <input
              ref={inputRef}
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={editingMsg ? "Edit message..." : "Message..."}
              className="w-full h-9 bg-muted rounded-full px-4 pr-10 text-sm outline-none focus:ring-1 focus:ring-primary transition-all"
            />
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 -translate-y-1/2 w-7 h-7"
              onClick={() => setShowEmojiPicker((p) => !p)}
            >
              <Smile className="w-4 h-4" />
            </Button>
          </div>

          {messageText.trim() ? (
            <Button
              size="icon"
              className="w-9 h-9 rounded-full shrink-0"
              onClick={handleSend}
            >
              <Send className="w-4 h-4" />
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              className={cn("w-9 h-9 shrink-0", isRecording && "text-destructive")}
              onMouseDown={handleStartRecording}
              onMouseUp={handleStopRecording}
              onTouchStart={handleStartRecording}
              onTouchEnd={handleStopRecording}
              title="Hold to record voice message"
            >
              <Mic className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Group info panel (slides over) */}
      {showGroupInfo && conversation.type === "group" && (
        <GroupInfoPanel
          conversation={conversation}
          onClose={() => setShowGroupInfo(false)}
          updateGroupSettings={updateGroupSettings}
        />
      )}

      {/* Forward modal */}
      {forwardingMsg && (
        <ForwardModal
          message={forwardingMsg}
          conversations={conversations.filter((c) => c.id !== conversation.id)}
          onForward={handleForward}
          onClose={() => setForwardingMsg(null)}
        />
      )}

      {/* Scroll-to-bottom button */}
      <button
        className="absolute bottom-20 right-4 w-8 h-8 bg-card border border-border rounded-full shadow-md flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
        onClick={() => {
          if (scrollRef.current) {
            const el = scrollRef.current.querySelector("[data-radix-scroll-area-viewport]")
            if (el) el.scrollTop = el.scrollHeight
          }
        }}
        title="Scroll to bottom"
      >
        <ChevronDown className="w-4 h-4" />
      </button>
    </div>
  )
}
