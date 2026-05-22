import type { Conversation, Message, ConversationParticipant } from "@/lib/types"

// Mock online users (in production, this would come from a real-time service)
export const onlineUsers = new Set(["user1", "user2", "user5"])

export const mockParticipants: ConversationParticipant[] = [
  {
    piUid: "user1",
    username: "alexchen",
    avatar: "A",
    isOnline: true,
    lastSeen: new Date().toISOString(),
  },
  {
    piUid: "user2",
    username: "sarahkim",
    avatar: "S",
    isOnline: true,
    lastSeen: new Date().toISOString(),
  },
  {
    piUid: "user3",
    username: "mikejones",
    avatar: "M",
    isOnline: false,
    lastSeen: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    piUid: "user4",
    username: "emilypark",
    avatar: "E",
    isOnline: false,
    lastSeen: new Date(Date.now() - 7200000).toISOString(),
  },
  {
    piUid: "user5",
    username: "davidlee",
    avatar: "D",
    isOnline: true,
    lastSeen: new Date().toISOString(),
  },
]

export const mockConversations: Conversation[] = [
  {
    id: "conv1",
    type: "direct",
    participants: [mockParticipants[0]],
    lastMessage: {
      id: "msg1",
      conversationId: "conv1",
      senderId: "user1",
      senderUsername: "alexchen",
      senderAvatar: "A",
      content: "Hey! Did you see the latest Pi announcement?",
      timestamp: new Date(Date.now() - 300000).toISOString(),
      status: "read",
      type: "text",
    },
    unreadCount: 2,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 300000).toISOString(),
    isPinned: true,
  },
  {
    id: "conv2",
    type: "direct",
    participants: [mockParticipants[1]],
    lastMessage: {
      id: "msg2",
      conversationId: "conv2",
      senderId: "user2",
      senderUsername: "sarahkim",
      senderAvatar: "S",
      content: "Thanks for sharing that!",
      timestamp: new Date(Date.now() - 900000).toISOString(),
      status: "delivered",
      type: "text",
    },
    unreadCount: 0,
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    updatedAt: new Date(Date.now() - 900000).toISOString(),
  },
  {
    id: "conv3",
    type: "group",
    participants: [mockParticipants[0], mockParticipants[2], mockParticipants[4]],
    groupName: "Pi Pioneers",
    groupAvatar: "PP",
    groupDescription: "Discussing all things Pi Network",
    adminIds: ["user1"],
    lastMessage: {
      id: "msg3",
      conversationId: "conv3",
      senderId: "user5",
      senderUsername: "davidlee",
      senderAvatar: "D",
      content: "Anyone going to the Pi meetup next week?",
      timestamp: new Date(Date.now() - 1800000).toISOString(),
      status: "read",
      type: "text",
    },
    unreadCount: 5,
    createdAt: new Date(Date.now() - 604800000).toISOString(),
    updatedAt: new Date(Date.now() - 1800000).toISOString(),
    isPinned: true,
  },
  {
    id: "conv4",
    type: "direct",
    participants: [mockParticipants[3]],
    lastMessage: {
      id: "msg4",
      conversationId: "conv4",
      senderId: "user4",
      senderUsername: "emilypark",
      senderAvatar: "E",
      content: "Check out this cool project!",
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      status: "sent",
      type: "text",
    },
    unreadCount: 0,
    createdAt: new Date(Date.now() - 259200000).toISOString(),
    updatedAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: "conv5",
    type: "group",
    participants: [mockParticipants[1], mockParticipants[2], mockParticipants[3]],
    groupName: "Social Hub Beta Testers",
    groupAvatar: "SH",
    groupDescription: "Testing the new Social Hub Pi features",
    adminIds: ["user2", "user3"],
    lastMessage: {
      id: "msg5",
      conversationId: "conv5",
      senderId: "user3",
      senderUsername: "mikejones",
      senderAvatar: "M",
      content: "The new messaging feature looks great!",
      timestamp: new Date(Date.now() - 7200000).toISOString(),
      status: "read",
      type: "text",
    },
    unreadCount: 0,
    createdAt: new Date(Date.now() - 432000000).toISOString(),
    updatedAt: new Date(Date.now() - 7200000).toISOString(),
  },
]

export const mockMessages: Record<string, Message[]> = {
  conv1: [
    {
      id: "msg1-1",
      conversationId: "conv1",
      senderId: "current-user",
      senderUsername: "You",
      senderAvatar: "Y",
      content: "Hi Alex! How are you?",
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      status: "read",
      type: "text",
    },
    {
      id: "msg1-2",
      conversationId: "conv1",
      senderId: "user1",
      senderUsername: "alexchen",
      senderAvatar: "A",
<<<<<<< HEAD
      content: "I'm doing great! Just mining some Pi",
      timestamp: new Date(Date.now() - 3300000).toISOString(),
      status: "read",
      type: "text",
      reactions: {
        "👍": { emoji: "👍", count: 1, reactedByMe: true, users: ["You"] },
      },
=======
      content: "I'm doing great! Just mining some Pi 😊",
      timestamp: new Date(Date.now() - 3300000).toISOString(),
      status: "read",
      type: "text",
>>>>>>> 82bc3ca8b44839ba49ec0fc525fcb6c408caf7eb
    },
    {
      id: "msg1-3",
      conversationId: "conv1",
      senderId: "user1",
      senderUsername: "alexchen",
      senderAvatar: "A",
      content: "Hey! Did you see the latest Pi announcement?",
      timestamp: new Date(Date.now() - 300000).toISOString(),
      status: "read",
      type: "text",
<<<<<<< HEAD
      reactions: {
        "❤️": { emoji: "❤️", count: 2, reactedByMe: false, users: ["sarahkim", "mikejones"] },
        "🔥": { emoji: "🔥", count: 1, reactedByMe: true, users: ["You"] },
      },
=======
>>>>>>> 82bc3ca8b44839ba49ec0fc525fcb6c408caf7eb
    },
    {
      id: "msg1-4",
      conversationId: "conv1",
      senderId: "current-user",
      senderUsername: "You",
      senderAvatar: "Y",
      content: "Not yet! What's new?",
      timestamp: new Date(Date.now() - 60000).toISOString(),
      status: "delivered",
      type: "text",
    },
  ],
  conv2: [
    {
      id: "msg2-1",
      conversationId: "conv2",
      senderId: "current-user",
      senderUsername: "You",
      senderAvatar: "Y",
      content: "Here's that guide I mentioned",
      timestamp: new Date(Date.now() - 1800000).toISOString(),
      status: "read",
      type: "text",
    },
    {
      id: "msg2-2",
      conversationId: "conv2",
      senderId: "user2",
      senderUsername: "sarahkim",
      senderAvatar: "S",
      content: "Thanks for sharing that!",
      timestamp: new Date(Date.now() - 900000).toISOString(),
      status: "read",
      type: "text",
    },
  ],
  conv3: [
    {
      id: "msg3-1",
      conversationId: "conv3",
      senderId: "user1",
      senderUsername: "alexchen",
      senderAvatar: "A",
      content: "Welcome everyone to Pi Pioneers!",
      timestamp: new Date(Date.now() - 604800000).toISOString(),
      status: "read",
      type: "text",
    },
    {
      id: "msg3-2",
      conversationId: "conv3",
      senderId: "user5",
      senderUsername: "davidlee",
      senderAvatar: "D",
      content: "Thanks for adding me!",
      timestamp: new Date(Date.now() - 604700000).toISOString(),
      status: "read",
      type: "text",
    },
    {
      id: "msg3-3",
      conversationId: "conv3",
      senderId: "user2",
      senderUsername: "mikejones",
      senderAvatar: "M",
      content: "Excited to be part of this group!",
      timestamp: new Date(Date.now() - 604600000).toISOString(),
      status: "read",
      type: "text",
    },
    {
      id: "msg3-4",
      conversationId: "conv3",
      senderId: "user5",
      senderUsername: "davidlee",
      senderAvatar: "D",
      content: "Anyone going to the Pi meetup next week?",
      timestamp: new Date(Date.now() - 1800000).toISOString(),
      status: "read",
      type: "text",
    },
    {
      id: "msg3-5",
      conversationId: "conv3",
      senderId: "current-user",
      senderUsername: "You",
      senderAvatar: "Y",
      content: "I'm planning to go!",
      timestamp: new Date(Date.now() - 1500000).toISOString(),
      status: "read",
      type: "text",
    },
  ],
}

export function getFormatTime(timestamp: string): string {
  const date = new Date(timestamp)
  const now = new Date()
  const diff = now.getTime() - date.getTime()

  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 1) return "Just now"
  if (minutes < 60) return `${minutes}m`
  if (hours < 24) return `${hours}h`
  if (days < 7) return `${days}d`

  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
}
