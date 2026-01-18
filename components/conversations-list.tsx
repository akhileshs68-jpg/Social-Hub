"use client"

import { useState } from "react"
import { Search, Plus, Pin } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import type { Conversation } from "@/lib/types"
import { mockConversations, getFormatTime } from "@/lib/mock-data/messages"

interface ConversationsListProps {
  onSelectConversation: (conversation: Conversation) => void
  selectedConversationId?: string
}

export function ConversationsList({ onSelectConversation, selectedConversationId }: ConversationsListProps) {
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
  }

  const getLastMessagePreview = (conv: Conversation): string => {
    if (!conv.lastMessage) return "No messages yet"
    const prefix =
      conv.type === "group" && conv.lastMessage.senderId !== "current-user"
        ? `${conv.lastMessage.senderUsername}: `
        : ""
    return prefix + (conv.lastMessage.content || "Media")
  }

  return (
    <div className="flex flex-col h-full bg-card">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xl font-bold text-foreground">Messages</h2>
          <Button size="icon" variant="ghost" className="w-9 h-9">
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
    </div>
  )
}
