export interface Post {
  id: string
  username: string
  avatar: string
  timeAgo: string
  content: string
  likes: number
  comments: number
  shares: number
  isLiked: boolean
  imageUrl?: string
  // New fields for enhanced post system
  videoUrl?: string
  media?: {
    type: "image" | "video"
    url: string
    thumbnail?: string
  }[]
  hashtags?: string[]
  piUid?: string // Link post to Pi user
  createdAt?: string
  moderationFlag?: "pending" | "approved" | "flagged"
  isEdited?: boolean
}

export interface User {
  id: string
  username: string
  piUid: string
  avatar: string
  bio?: string
  followers?: number
  following?: number
  joinedDate?: string
  loginTimestamp?: string
  location?: string
  website?: string
}

export interface Notification {
  id: string
  type: "like" | "comment" | "follow" | "mention" | "message" | "premium"
  user: string
  avatar: string
  content: string
  time: string
  read: boolean
}

export interface TrendingTopic {
  tag: string
  posts: string
}

export interface Reel {
  id: string
  videoUrl: string
  thumbnail: string
  creator: {
    username: string
    avatar: string
    piUid: string
    isFollowing: boolean
  }
  caption: string
  hashtags: string[]
  likes: number
  comments: number
  shares: number
  views: number
  isLiked: boolean
  isSaved?: boolean
  createdAt: string
  duration: number // in seconds
  moderationFlag?: "pending" | "approved" | "flagged"
}

export interface FeedItem {
  id: string
  type: "post" | "reel"
  data: Post | Reel
  createdAt: string
}

export interface Status {
  id: string
  piUid: string
  username: string
  avatar: string
  media: {
    type: "image" | "video"
    url: string
    thumbnail?: string
  }
  caption?: string
  createdAt: string
  expiresAt: string // Auto-expires after 24 hours
  seenBy: string[] // Array of Pi UIDs who viewed
  moderationFlag?: "pending" | "approved" | "flagged"
}

export interface StatusReply {
  id: string
  statusId: string
  fromPiUid: string
  fromUsername: string
  message: string
  createdAt: string
}

export interface StatusGroup {
  piUid: string
  username: string
  avatar: string
  statuses: Status[]
  hasUnseen: boolean
}

export interface Message {
  id: string
  conversationId: string
  senderId: string
  senderUsername: string
  senderAvatar: string
  content: string
  timestamp: string
  status: "sending" | "sent" | "delivered" | "read"
  type: "text" | "image" | "video" | "audio"
  mediaUrl?: string
  mediaThumb?: string
  replyTo?: {
    id: string
    content: string
    senderUsername: string
  }
  isEdited?: boolean
  editedAt?: string
}

export interface Conversation {
  id: string
  type: "direct" | "group"
  participants: ConversationParticipant[]
  lastMessage?: Message
  unreadCount: number
  createdAt: string
  updatedAt: string
  // Group-specific fields
  groupName?: string
  groupAvatar?: string
  groupDescription?: string
  adminIds?: string[]
  muteUntil?: string
  isPinned?: boolean
}

export interface ConversationParticipant {
  piUid: string
  username: string
  avatar: string
  isOnline: boolean
  lastSeen?: string
  role?: "admin" | "member" // For groups
  joinedAt?: string
}

export interface TypingIndicator {
  conversationId: string
  userId: string
  username: string
  timestamp: string
}

export interface MessageReaction {
  messageId: string
  userId: string
  username: string
  emoji: string
  timestamp: string
}

export interface PiPayment {
  id: string
  amount: number
  memo: string
  metadata: {
    userId: string
    productId: string
    type: "one-time" | "subscription"
  }
  fromAddress: string
  toAddress: string
  direction: "user_to_app" | "app_to_user"
  createdAt: string
  network: "Pi Network" | "Pi Testnet"
}

export interface PaymentDTO {
  identifier: string
  user_uid: string
  amount: number
  memo: string
  metadata: {
    userId: string
    productId: string
    type: "one-time" | "subscription"
  }
  status: {
    developer_approved: boolean
    transaction_verified: boolean
    developer_completed: boolean
    cancelled: boolean
    user_cancelled: boolean
  }
  transaction?: {
    txid: string
    verified: boolean
    _link: string
  }
}

export interface PremiumFeature {
  id: string
  name: string
  description: string
  icon: string
  enabled: boolean
}

export interface PremiumPlan {
  id: string
  name: string
  description: string
  price: number
  type: "one-time" | "monthly" | "yearly"
  features: PremiumFeature[]
  popular?: boolean
  savings?: string
}

export interface UserSubscription {
  userId: string
  planId: string
  status: "active" | "cancelled" | "expired" | "pending"
  startDate: string
  expiryDate?: string
  paymentId?: string
  autoRenew: boolean
}

export type PaymentState = "idle" | "pending" | "processing" | "success" | "failed" | "cancelled"
