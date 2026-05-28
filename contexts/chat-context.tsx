"use client"

import { createContext, useContext, useState, useCallback, type ReactNode } from "react"
import type { Conversation, Message, MessageType, MessageReactionEntry, ConversationParticipant } from "@/lib/types"
import { mockConversations, mockMessages, mockParticipants } from "@/lib/mock-data/messages"

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface SendMessageOptions {
  conversationId: string
  content: string
  type?: MessageType
  mediaUrl?: string
  fileName?: string
  fileSize?: number
  duration?: number
  replyTo?: Message | null
}

interface ChatContextValue {
  conversations: Conversation[]
  messages: Record<string, Message[]>
  typingUsers: Record<string, string[]> // conversationId -> array of usernames
  onlineUsers: Set<string> // set of usernames currently online
  // Message actions
  sendMessage: (opts: SendMessageOptions) => void
  editMessage: (conversationId: string, messageId: string, newContent: string) => void
  deleteMessage: (conversationId: string, messageId: string) => void
  forwardMessage: (messageId: string, fromConversationId: string, toConversationId: string) => void
  reactToMessage: (conversationId: string, messageId: string, emoji: string) => void
  // Presence actions
  setTyping: (conversationId: string, username: string, isTyping: boolean) => void
  setUserOnline: (username: string, isOnline: boolean) => void
  // Group actions
  createGroup: (opts: {
    name: string
    description: string
    avatar: string
    isPublic: boolean
    memberPiUids: string[]
  }) => Conversation
  updateGroupSettings: (
    conversationId: string,
    settings: { name?: string; description?: string; avatar?: string; isPublic?: boolean },
  ) => void
  // Conversation actions
  pinConversation: (conversationId: string, pinned: boolean) => void
  markAsRead: (conversationId: string) => void
}

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

const ChatContext = createContext<ChatContextValue | null>(null)

export function useChatContext() {
  const ctx = useContext(ChatContext)
  if (!ctx) throw new Error("useChatContext must be used inside ChatProvider")
  return ctx
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function generateId() {
  return `id-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

function generateInviteLink() {
  return `https://socialhubpi.app/invite/${Math.random().toString(36).slice(2, 10)}`
}

function simulateDelivery(
  setMessages: React.Dispatch<React.SetStateAction<Record<string, Message[]>>>,
  conversationId: string,
  messageId: string,
  type: "direct" | "group",
) {
  setTimeout(() => {
    setMessages((prev) => ({
      ...prev,
      [conversationId]: (prev[conversationId] || []).map((m) =>
        m.id === messageId ? { ...m, status: "sent" } : m,
      ),
    }))
  }, 400)

  setTimeout(() => {
    setMessages((prev) => ({
      ...prev,
      [conversationId]: (prev[conversationId] || []).map((m) =>
        m.id === messageId ? { ...m, status: "delivered" } : m,
      ),
    }))
  }, 900)

  if (type === "direct") {
    setTimeout(() => {
      setMessages((prev) => ({
        ...prev,
        [conversationId]: (prev[conversationId] || []).map((m) =>
          m.id === messageId ? { ...m, status: "read" } : m,
        ),
      }))
    }, 1800)
  }
}

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

export function ChatProvider({ children }: { children: ReactNode }) {
  const [conversations, setConversations] = useState<Conversation[]>(mockConversations)
  const [messages, setMessages] = useState<Record<string, Message[]>>(mockMessages)
  const [typingUsers, setTypingUsers] = useState<Record<string, string[]>>({})
  const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set(["alexchen", "sarahkim", "mikejones"]))

  // ---- send ----------------------------------------------------------------
  const sendMessage = useCallback(
    (opts: SendMessageOptions) => {
      const conv = conversations.find((c) => c.id === opts.conversationId)
      if (!conv) return

      const msgId = generateId()
      const newMsg: Message = {
        id: msgId,
        conversationId: opts.conversationId,
        senderId: "current-user",
        senderUsername: "You",
        senderAvatar: "Y",
        content: opts.content,
        timestamp: new Date().toISOString(),
        status: "sending",
        type: opts.type ?? "text",
        mediaUrl: opts.mediaUrl,
        fileName: opts.fileName,
        fileSize: opts.fileSize,
        duration: opts.duration,
        replyTo: opts.replyTo
          ? {
              id: opts.replyTo.id,
              content: opts.replyTo.content,
              senderUsername: opts.replyTo.senderUsername,
              type: opts.replyTo.type,
            }
          : undefined,
      }

      setMessages((prev) => ({
        ...prev,
        [opts.conversationId]: [...(prev[opts.conversationId] || []), newMsg],
      }))

      setConversations((prev) =>
        prev.map((c) =>
          c.id === opts.conversationId
            ? { ...c, lastMessage: newMsg, updatedAt: newMsg.timestamp }
            : c,
        ),
      )

      simulateDelivery(setMessages, opts.conversationId, msgId, conv.type)
    },
    [conversations],
  )

  // ---- edit ----------------------------------------------------------------
  const editMessage = useCallback((conversationId: string, messageId: string, newContent: string) => {
    const now = new Date().toISOString()
    setMessages((prev) => ({
      ...prev,
      [conversationId]: (prev[conversationId] || []).map((m) =>
        m.id === messageId ? { ...m, content: newContent, isEdited: true, editedAt: now } : m,
      ),
    }))
    setConversations((prev) =>
      prev.map((c) => {
        if (c.id !== conversationId) return c
        if (c.lastMessage?.id === messageId)
          return { ...c, lastMessage: { ...c.lastMessage, content: newContent, isEdited: true } }
        return c
      }),
    )
  }, [])

  // ---- delete --------------------------------------------------------------
  const deleteMessage = useCallback((conversationId: string, messageId: string) => {
    setMessages((prev) => ({
      ...prev,
      [conversationId]: (prev[conversationId] || []).map((m) =>
        m.id === messageId ? { ...m, isDeleted: true, content: "This message was deleted" } : m,
      ),
    }))
  }, [])

  // ---- forward -------------------------------------------------------------
  const forwardMessage = useCallback(
    (messageId: string, fromConversationId: string, toConversationId: string) => {
      const srcMsg = (messages[fromConversationId] || []).find((m) => m.id === messageId)
      if (!srcMsg) return
      const fromConv = conversations.find((c) => c.id === fromConversationId)
      const toConv = conversations.find((c) => c.id === toConversationId)
      if (!toConv) return

      const fromName =
        fromConv?.type === "group"
          ? fromConv.groupName || "Group"
          : fromConv?.participants[0]?.username || "Chat"

      const msgId = generateId()
      const fwdMsg: Message = {
        ...srcMsg,
        id: msgId,
        conversationId: toConversationId,
        senderId: "current-user",
        senderUsername: "You",
        senderAvatar: "Y",
        timestamp: new Date().toISOString(),
        status: "sending",
        replyTo: undefined,
        reactions: undefined,
        forwardedFrom: {
          conversationName: fromName,
          senderUsername: srcMsg.senderUsername,
        },
      }

      setMessages((prev) => ({
        ...prev,
        [toConversationId]: [...(prev[toConversationId] || []), fwdMsg],
      }))

      setConversations((prev) =>
        prev.map((c) =>
          c.id === toConversationId
            ? { ...c, lastMessage: fwdMsg, updatedAt: fwdMsg.timestamp }
            : c,
        ),
      )

      simulateDelivery(setMessages, toConversationId, msgId, toConv.type)
    },
    [messages, conversations],
  )

  // ---- react ---------------------------------------------------------------
  const reactToMessage = useCallback((conversationId: string, messageId: string, emoji: string) => {
    setMessages((prev) => ({
      ...prev,
      [conversationId]: (prev[conversationId] || []).map((m) => {
        if (m.id !== messageId) return m
        const existing = m.reactions?.[emoji]
        const myName = "You"
        let newEntry: MessageReactionEntry
        if (existing) {
          if (existing.reactedByMe) {
            // remove my reaction
            newEntry = {
              ...existing,
              count: existing.count - 1,
              reactedByMe: false,
              users: existing.users.filter((u) => u !== myName),
            }
          } else {
            newEntry = {
              ...existing,
              count: existing.count + 1,
              reactedByMe: true,
              users: [...existing.users, myName],
            }
          }
        } else {
          newEntry = { emoji, count: 1, reactedByMe: true, users: [myName] }
        }
        const updatedReactions = { ...(m.reactions || {}), [emoji]: newEntry }
        // prune zero-count entries
        if (newEntry.count <= 0) delete updatedReactions[emoji]
        return { ...m, reactions: updatedReactions }
      }),
    }))
  }, [])

  // ---- create group --------------------------------------------------------
  const createGroup = useCallback(
    (opts: {
      name: string
      description: string
      avatar: string
      isPublic: boolean
      memberPiUids: string[]
    }): Conversation => {
      const members: ConversationParticipant[] = opts.memberPiUids
        .map((uid) => mockParticipants.find((p) => p.piUid === uid))
        .filter(Boolean) as ConversationParticipant[]

      const newConv: Conversation = {
        id: generateId(),
        type: "group",
        participants: members,
        groupName: opts.name,
        groupAvatar: opts.avatar || opts.name.slice(0, 2).toUpperCase(),
        groupDescription: opts.description,
        adminIds: ["current-user"],
        moderatorIds: [],
        isPublic: opts.isPublic,
        inviteLink: generateInviteLink(),
        unreadCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      const systemMsg: Message = {
        id: generateId(),
        conversationId: newConv.id,
        senderId: "system",
        senderUsername: "System",
        senderAvatar: "S",
        content: `Group "${opts.name}" created`,
        timestamp: new Date().toISOString(),
        status: "read",
        type: "text",
      }

      setConversations((prev) => [newConv, ...prev])
      setMessages((prev) => ({ ...prev, [newConv.id]: [systemMsg] }))
      return newConv
    },
    [],
  )

  // ---- update group --------------------------------------------------------
  const updateGroupSettings = useCallback(
    (
      conversationId: string,
      settings: { name?: string; description?: string; avatar?: string; isPublic?: boolean },
    ) => {
      setConversations((prev) =>
        prev.map((c) =>
          c.id === conversationId
            ? {
                ...c,
                groupName: settings.name ?? c.groupName,
                groupAvatar: settings.avatar ?? c.groupAvatar,
                groupDescription: settings.description ?? c.groupDescription,
                isPublic: settings.isPublic ?? c.isPublic,
              }
            : c,
        ),
      )
    },
    [],
  )

  // ---- typing indicator ---------------------------------------------------
  const setTyping = useCallback((conversationId: string, username: string, isTyping: boolean) => {
    setTypingUsers((prev) => {
      const current = prev[conversationId] || []
      if (isTyping) {
        return {
          ...prev,
          [conversationId]: current.includes(username) ? current : [...current, username],
        }
      } else {
        return {
          ...prev,
          [conversationId]: current.filter((u) => u !== username),
        }
      }
    })
  }, [])

  // ---- online status ------------------------------------------------------
  const setUserOnline = useCallback((username: string, isOnline: boolean) => {
    setOnlineUsers((prev) => {
      const next = new Set(prev)
      if (isOnline) {
        next.add(username)
      } else {
        next.delete(username)
      }
      return next
    })
  }, [])

  // ---- pin -----------------------------------------------------------------
  const pinConversation = useCallback((conversationId: string, pinned: boolean) => {
    setConversations((prev) =>
      prev.map((c) => (c.id === conversationId ? { ...c, isPinned: pinned } : c)),
    )
  }, [])

  // ---- mark read -----------------------------------------------------------
  const markAsRead = useCallback((conversationId: string) => {
    setConversations((prev) =>
      prev.map((c) => (c.id === conversationId ? { ...c, unreadCount: 0 } : c)),
    )
  }, [])

  return (
    <ChatContext.Provider
      value={{
        conversations,
        messages,
        typingUsers,
        onlineUsers,
        sendMessage,
        editMessage,
        deleteMessage,
        forwardMessage,
        reactToMessage,
        setTyping,
        setUserOnline,
        createGroup,
        updateGroupSettings,
        pinConversation,
        markAsRead,
      }}
    >
      {children}
    </ChatContext.Provider>
  )
}
