"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { ArrowLeft, Phone, Video, MoreVertical, Send, Smile, Paperclip, Mic, Check, CheckCheck, X } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import type { Conversation, Message } from "@/lib/types"
import { mockMessages } from "@/lib/mock-data/messages"
import { useToast } from "@/hooks/use-toast"

interface ChatInterfaceProps {
  conversation: Conversation
  onBack: () => void
}

export function ChatInterface({ conversation, onBack }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>(mockMessages[conversation.id] || [])
  const [messageText, setMessageText] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [selectedMedia, setSelectedMedia] = useState<File | null>(null)
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  useEffect(() => {
    // Scroll to bottom when messages change
    if (scrollAreaRef.current) {
      const scrollElement = scrollAreaRef.current.querySelector("[data-radix-scroll-area-viewport]")
      if (scrollElement) {
        scrollElement.scrollTop = scrollElement.scrollHeight
      }
    }
  }, [messages])

  const getConversationDisplay = () => {
    if (conversation.type === "group") {
      return {
        name: conversation.groupName || "Group",
        avatar: conversation.groupAvatar || "G",
        subtitle: `${conversation.participants.length} members`,
        isOnline: false,
      }
    }
    const participant = conversation.participants[0]
    return {
      name: participant.username,
      avatar: participant.avatar,
      subtitle: participant.isOnline ? "Active now" : `Last seen ${getLastSeenText(participant.lastSeen)}`,
      isOnline: participant.isOnline,
    }
  }

  const getLastSeenText = (lastSeen?: string): string => {
    if (!lastSeen) return "recently"
    const diff = Date.now() - new Date(lastSeen).getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)

    if (minutes < 1) return "just now"
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    return "recently"
  }

  const handleSendMessage = () => {
    if (!messageText.trim() && !selectedMedia) return

    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      conversationId: conversation.id,
      senderId: "current-user",
      senderUsername: "You",
      senderAvatar: "Y",
      content: messageText,
      timestamp: new Date().toISOString(),
      status: "sending",
      type: selectedMedia ? "image" : "text",
      mediaUrl: selectedMedia ? URL.createObjectURL(selectedMedia) : undefined,
    }

    setMessages([...messages, newMessage])
    setMessageText("")
    setSelectedMedia(null)

    // Simulate message being sent
    setTimeout(() => {
      setMessages((prev) => prev.map((msg) => (msg.id === newMessage.id ? { ...msg, status: "sent" } : msg)))
    }, 500)

    // Simulate delivery
    setTimeout(() => {
      setMessages((prev) => prev.map((msg) => (msg.id === newMessage.id ? { ...msg, status: "delivered" } : msg)))
    }, 1000)

    // Simulate read receipt for direct messages
    if (conversation.type === "direct") {
      setTimeout(() => {
        setMessages((prev) => prev.map((msg) => (msg.id === newMessage.id ? { ...msg, status: "read" } : msg)))
      }, 2000)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleMediaSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please select a file smaller than 10MB",
          variant: "destructive",
        })
        return
      }
      setSelectedMedia(file)
    }
  }

  const display = getConversationDisplay()

  const formatMessageTime = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })
  }

  const getMessageStatusIcon = (status: Message["status"]) => {
    switch (status) {
      case "sending":
        return (
          <div className="w-3 h-3 border-2 border-muted-foreground/50 border-t-transparent rounded-full animate-spin" />
        )
      case "sent":
        return <Check className="w-4 h-4 text-muted-foreground" />
      case "delivered":
        return <CheckCheck className="w-4 h-4 text-muted-foreground" />
      case "read":
        return <CheckCheck className="w-4 h-4 text-primary" />
    }
  }

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="p-4 border-b border-border bg-card flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <Button variant="ghost" size="icon" onClick={onBack} className="shrink-0">
            <ArrowLeft className="w-5 h-5" />
          </Button>

          <div className="relative shrink-0">
            <Avatar className="w-10 h-10">
              <AvatarFallback className="bg-primary/10 text-primary font-semibold">{display.avatar}</AvatarFallback>
            </Avatar>
            {display.isOnline && (
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-card rounded-full" />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground truncate">{display.name}</h3>
            <p className="text-xs text-muted-foreground truncate">{display.subtitle}</p>
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <Button variant="ghost" size="icon" className="w-9 h-9">
            <Phone className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon" className="w-9 h-9">
            <Video className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon" className="w-9 h-9">
            <MoreVertical className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea ref={scrollAreaRef} className="flex-1 p-4">
        <div className="space-y-4 max-w-2xl mx-auto">
          {messages.map((message, index) => {
            const isOwnMessage = message.senderId === "current-user"
            const showAvatar =
              conversation.type === "group" &&
              !isOwnMessage &&
              (index === messages.length - 1 || messages[index + 1].senderId !== message.senderId)

            return (
              <div
                key={message.id}
                className={cn("flex gap-2 items-end", isOwnMessage ? "justify-end" : "justify-start")}
              >
                {!isOwnMessage && conversation.type === "group" && (
                  <Avatar className={cn("w-7 h-7 shrink-0", !showAvatar && "invisible")}>
                    <AvatarFallback className="bg-primary/10 text-primary text-xs">
                      {message.senderAvatar}
                    </AvatarFallback>
                  </Avatar>
                )}

                <div className={cn("flex flex-col gap-1", isOwnMessage ? "items-end" : "items-start")}>
                  {conversation.type === "group" && !isOwnMessage && showAvatar && (
                    <span className="text-xs text-muted-foreground px-3">{message.senderUsername}</span>
                  )}

                  <div
                    className={cn(
                      "rounded-2xl px-4 py-2 max-w-xs break-words",
                      isOwnMessage
                        ? "bg-primary text-primary-foreground rounded-br-sm"
                        : "bg-muted text-foreground rounded-bl-sm",
                    )}
                  >
                    {message.type === "image" && message.mediaUrl && (
                      <img
                        src={message.mediaUrl || "/placeholder.svg"}
                        alt="Shared media"
                        className="rounded-lg mb-2 max-w-full h-auto"
                      />
                    )}
                    <p className="text-sm leading-relaxed">{message.content}</p>
                  </div>

                  <div className="flex items-center gap-1 px-1">
                    <span className="text-xs text-muted-foreground">{formatMessageTime(message.timestamp)}</span>
                    {isOwnMessage && <span className="shrink-0">{getMessageStatusIcon(message.status)}</span>}
                  </div>
                </div>
              </div>
            )
          })}

          {isTyping && (
            <div className="flex gap-2 items-end">
              <Avatar className="w-7 h-7">
                <AvatarFallback className="bg-primary/10 text-primary text-xs">{display.avatar}</AvatarFallback>
              </Avatar>
              <div className="bg-muted rounded-2xl rounded-bl-sm px-4 py-3">
                <div className="flex gap-1">
                  <div
                    className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce"
                    style={{ animationDelay: "0ms" }}
                  />
                  <div
                    className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce"
                    style={{ animationDelay: "150ms" }}
                  />
                  <div
                    className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce"
                    style={{ animationDelay: "300ms" }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Media preview */}
      {selectedMedia && (
        <div className="px-4 py-2 border-t border-border bg-muted/50">
          <div className="relative inline-block">
            <img
              src={URL.createObjectURL(selectedMedia) || "/placeholder.svg"}
              alt="Preview"
              className="h-20 rounded-lg"
            />
            <Button
              variant="destructive"
              size="icon"
              className="absolute -top-2 -right-2 w-6 h-6 rounded-full"
              onClick={() => setSelectedMedia(null)}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Input */}
      <div className="p-4 border-t border-border bg-card">
        <div className="flex items-end gap-2 max-w-2xl mx-auto">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,video/*"
            className="hidden"
            onChange={handleMediaSelect}
          />

          <Button variant="ghost" size="icon" className="shrink-0" onClick={() => fileInputRef.current?.click()}>
            <Paperclip className="w-5 h-5" />
          </Button>

          <div className="flex-1 relative">
            <Input
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              className="pr-10 min-h-10 resize-none"
            />
            <Button variant="ghost" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 w-8 h-8">
              <Smile className="w-5 h-5" />
            </Button>
          </div>

          {messageText.trim() || selectedMedia ? (
            <Button size="icon" onClick={handleSendMessage} className="shrink-0">
              <Send className="w-5 h-5" />
            </Button>
          ) : (
            <Button variant="ghost" size="icon" className="shrink-0">
              <Mic className="w-5 h-5" />
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
