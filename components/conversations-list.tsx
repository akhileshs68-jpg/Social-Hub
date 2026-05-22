"use client"

import { useState } from "react"
<<<<<<< HEAD
import { Search, Plus, Pin, Users, MessageSquare } from "lucide-react"
=======
import { Search, Plus, Pin } from "lucide-react"
>>>>>>> 82bc3ca8b44839ba49ec0fc525fcb6c408caf7eb
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import type { Conversation } from "@/lib/types"
<<<<<<< HEAD
import { getFormatTime } from "@/lib/mock-data/messages"
import { useChatContext } from "@/contexts/chat-context"
import { CreateGroupModal } from "@/components/chat-create-group-modal"
=======
import { mockConversations, getFormatTime } from "@/lib/mock-data/messages"
>>>>>>> 82bc3ca8b44839ba49ec0fc525fcb6c408caf7eb

interface ConversationsListProps {
  onSelectConversation: (conversation: Conversation) => void
  selectedConversationId?: string
}

export function ConversationsList({ onSelectConversation, selectedConversationId }: ConversationsListProps) {
<<<<<<< HEAD
  const { conversations, markAsRead, onlineUsers } = useChatContext()
  const [searchQuery, setSearchQuery] = useState("")
  const [showCreateGroup, setShowCreateGroup] = useState(false)
  const [activeFilter, setActiveFilter] = useState<"all" | "direct" | "groups">("all")

  const filtered = conversations
    .filter((conv) => {
      // type filter
      if (activeFilter === "direct" && conv.type !== "direct") return false
      if (activeFilter === "groups" && conv.type !== "group") return false
      // search filter
      const q = searchQuery.toLowerCase()
      if (!q) return true
      if (conv.type === "group") return conv.groupName?.toLowerCase().includes(q)
      return conv.participants.some((p) => p.username.toLowerCase().includes(q))
    })
    .sort((a, b) => {
      // pinned first, then by updatedAt
      if (a.isPinned && !b.isPinned) return -1
      if (!a.isPinned && b.isPinned) return 1
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    })

  const getConversationDisplay = (conv: Conversation) => {
    if (conv.type === "group") {
      return { name: conv.groupName || "Group", avatar: conv.groupAvatar || "G", isOnline: false }
    }
    const participant = conv.participants[0]
    const isOnline = onlineUsers.has(participant.username)
    return { name: participant.username, avatar: participant.avatar, isOnline }
=======
  const [searchQuery, setSearchQuery] = useState("")
  const [conversations] = useState<Conversation[]>(mockConversations)

  const filteredConversations = conversations.filter((conv) => {
    const searchLower = searchQuery.toLowerCase()
    if (conv.type === "group") {
      return conv.groupName?.toLowerCase().includes(searchLower)
    }
    return conv.participants.some((p) => p.username.toLowerCase().includes(searchLower))
  })

  const getConversationDisplay = (conv: Conversation) => {
    if (conv.type === "group") {
      return {
        name: conv.groupName || "Group",
        avatar: conv.groupAvatar || "G",
        isOnline: false,
      }
    }
    const participant = conv.participants[0]
    return {
      name: participant.username,
      avatar: participant.avatar,
      isOnline: participant.isOnline,
    }
>>>>>>> 82bc3ca8b44839ba49ec0fc525fcb6c408caf7eb
  }

  const getLastMessagePreview = (conv: Conversation): string => {
    if (!conv.lastMessage) return "No messages yet"
<<<<<<< HEAD
    if (conv.lastMessage.isDeleted) return "Message deleted"
    const isOwn = conv.lastMessage.senderId === "current-user"
    const prefix =
      conv.type === "group" && !isOwn ? `${conv.lastMessage.senderUsername}: ` : isOwn ? "You: " : ""
    if (conv.lastMessage.type === "image") return `${prefix}Photo`
    if (conv.lastMessage.type === "video") return `${prefix}Video`
    if (conv.lastMessage.type === "voice") return `${prefix}Voice message`
    if (conv.lastMessage.type === "file") return `${prefix}${conv.lastMessage.fileName || "File"}`
    if (conv.lastMessage.type === "audio") return `${prefix}Audio`
    return prefix + (conv.lastMessage.content || "")
  }

  const handleSelect = (conv: Conversation) => {
    markAsRead(conv.id)
    onSelectConversation(conv)
=======
    const prefix =
      conv.type === "group" && conv.lastMessage.senderId !== "current-user"
        ? `${conv.lastMessage.senderUsername}: `
        : ""
    return prefix + (conv.lastMessage.content || "Media")
>>>>>>> 82bc3ca8b44839ba49ec0fc525fcb6c408caf7eb
  }

  return (
    <div className="flex flex-col h-full bg-card">
      {/* Header */}
<<<<<<< HEAD
      <div className="px-4 pt-4 pb-3 border-b border-border space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-foreground">Messages</h2>
          <Button
            size="icon"
            variant="ghost"
            className="w-9 h-9"
            onClick={() => setShowCreateGroup(true)}
            title="New Group"
          >
=======
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xl font-bold text-foreground">Messages</h2>
          <Button size="icon" variant="ghost" className="w-9 h-9">
>>>>>>> 82bc3ca8b44839ba49ec0fc525fcb6c408caf7eb
            <Plus className="w-5 h-5" />
          </Button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-muted/50"
          />
        </div>
<<<<<<< HEAD

        {/* Filter tabs */}
        <div className="flex gap-1">
          {(["all", "direct", "groups"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={cn(
                "flex-1 text-xs font-medium py-1.5 rounded-lg transition-colors capitalize",
                activeFilter === f
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted/50 text-muted-foreground hover:bg-muted",
              )}
            >
              {f === "direct" ? "Direct" : f === "groups" ? "Groups" : "All"}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      <ScrollArea className="flex-1">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3 text-muted-foreground">
            <MessageSquare className="w-10 h-10 opacity-30" />
            <p className="text-sm">No conversations found</p>
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={() => setShowCreateGroup(true)}
            >
              <Users className="w-3.5 h-3.5" />
              Create a group
            </Button>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {filtered.map((conv) => {
              const display = getConversationDisplay(conv)
              const isSelected = selectedConversationId === conv.id

              return (
                <button
                  key={conv.id}
                  onClick={() => handleSelect(conv)}
                  className={cn(
                    "w-full px-4 py-3.5 flex items-start gap-3 hover:bg-accent/50 transition-colors text-left relative",
                    isSelected && "bg-accent",
                  )}
                >
                  {conv.isPinned && (
                    <Pin className="absolute top-2.5 right-3 w-3 h-3 text-primary fill-primary" />
                  )}

                  {/* Avatar */}
                  <div className="relative shrink-0">
                    <Avatar className="w-12 h-12">
                      <AvatarFallback className="bg-primary/10 text-primary font-semibold text-sm">
                        {display.avatar}
                      </AvatarFallback>
                    </Avatar>
                    {display.isOnline && (
                      <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-card rounded-full" />
                    )}
                    {conv.type === "group" && (
                      <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-muted border border-border rounded-full flex items-center justify-center">
                        <Users className="w-2.5 h-2.5 text-muted-foreground" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-0.5">
                      <span className="font-semibold text-foreground truncate text-sm">{display.name}</span>
                      {conv.lastMessage && (
                        <span className="text-xs text-muted-foreground shrink-0">
                          {getFormatTime(conv.lastMessage.timestamp)}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-xs text-muted-foreground truncate flex-1">
                        {getLastMessagePreview(conv)}
                      </p>
                      {conv.unreadCount > 0 && (
                        <Badge className="bg-primary text-primary-foreground shrink-0 h-4.5 min-w-5 px-1.5 text-[10px]">
                          {conv.unreadCount > 99 ? "99+" : conv.unreadCount}
                        </Badge>
                      )}
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        )}
      </ScrollArea>

      <CreateGroupModal
        open={showCreateGroup}
        onClose={() => setShowCreateGroup(false)}
        onCreated={(conv) => {
          setShowCreateGroup(false)
          handleSelect(conv)
        }}
      />
=======
      </div>

      {/* Conversations List */}
      <ScrollArea className="flex-1">
        <div className="divide-y divide-border">
          {filteredConversations.map((conv) => {
            const display = getConversationDisplay(conv)
            const isSelected = selectedConversationId === conv.id

            return (
              <button
                key={conv.id}
                onClick={() => onSelectConversation(conv)}
                className={cn(
                  "w-full p-4 flex items-start gap-3 hover:bg-accent/50 transition-colors text-left relative",
                  isSelected && "bg-accent",
                )}
              >
                {/* Pin indicator */}
                {conv.isPinned && <Pin className="absolute top-2 right-2 w-3 h-3 text-primary fill-primary" />}

                {/* Avatar with online indicator */}
                <div className="relative shrink-0">
                  <Avatar className="w-12 h-12">
                    <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                      {display.avatar}
                    </AvatarFallback>
                  </Avatar>
                  {display.isOnline && (
                    <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-card rounded-full" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="font-semibold text-foreground truncate">{display.name}</span>
                    {conv.lastMessage && (
                      <span className="text-xs text-muted-foreground shrink-0">
                        {getFormatTime(conv.lastMessage.timestamp)}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm text-muted-foreground truncate flex-1">{getLastMessagePreview(conv)}</p>
                    {conv.unreadCount > 0 && (
                      <Badge className="bg-primary text-primary-foreground shrink-0 h-5 min-w-5 px-1.5">
                        {conv.unreadCount > 99 ? "99+" : conv.unreadCount}
                      </Badge>
                    )}
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </ScrollArea>
>>>>>>> 82bc3ca8b44839ba49ec0fc525fcb6c408caf7eb
    </div>
  )
}
