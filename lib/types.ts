export interface Post {
  id: string
<<<<<<< HEAD
  userId?: string
  username: string
  avatar: string
  authorPhotoURL?: string
  timeAgo: string
  caption?: string
  content: string
  likes: number
  comments: number
  commentsCount?: number
  shares: number
  isLiked: boolean
  isSaved?: boolean
  mediaUrl?: string
  imageUrl?: string
  mediaType?: "image" | "video"
  cloudinaryPublicId?: string
=======
  username: string
  avatar: string
  timeAgo: string
  content: string
  likes: number
  comments: number
  shares: number
  isLiked: boolean
  imageUrl?: string
>>>>>>> c07617a5128ffd992b542a41c1dea574864a3046
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
<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> c07617a5128ffd992b542a41c1dea574864a3046
  // Monetization fields
  tipsReceived?: number
  creatorEarnings?: number
  isPinned?: boolean
}

<<<<<<< HEAD
export interface PostComment {
  id: string
  postId: string
  piUid: string
  username: string
  avatar: string
  authorPhotoURL?: string
  text: string
  createdAt: string
}

=======
>>>>>>> c07617a5128ffd992b542a41c1dea574864a3046
export interface Badge {
  id: string
  name: string
  icon: string
  description: string
  unlockedAt?: string
}

export interface UserAchievement {
  id: string
  type: "streak" | "engagement" | "milestone" | "special"
  title: string
  description: string
  points: number
  unlockedAt: string
}

export interface Streak {
  type: "daily" | "weekly"
  currentCount: number
  maxCount: number
  lastActivityDate: string
  rewardAmount: number
<<<<<<< HEAD
=======
=======
>>>>>>> 82bc3ca8b44839ba49ec0fc525fcb6c408caf7eb
>>>>>>> c07617a5128ffd992b542a41c1dea574864a3046
}

export interface User {
  id: string
  username: string
<<<<<<< HEAD
  displayName?: string
  piUid: string
  avatar: string
  photoURL?: string
  photoCloudinaryPublicId?: string
=======
  piUid: string
  avatar: string
>>>>>>> c07617a5128ffd992b542a41c1dea574864a3046
  bio?: string
  followers?: number
  following?: number
  joinedDate?: string
  loginTimestamp?: string
  location?: string
  website?: string
<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> c07617a5128ffd992b542a41c1dea574864a3046
  // SHUB Token system fields
  shub_tokens?: number
  first_login_reward?: boolean
  last_daily_reward?: string | null
  weekly_login_count?: number
  weekly_login_days?: string[] // ISO date strings for each unique login day this week
  invite_count?: number
  // Social verification
  isVerified?: boolean
  isPremium?: boolean
  // Presence status
  isOnline?: boolean
  lastSeenAt?: string
  // Monetization fields
  piCoins?: number
  creatorEarnings?: number
  isCreator?: boolean
  // Engagement fields
  badges?: Badge[]
  achievements?: UserAchievement[]
  currentStreak?: Streak
  totalPoints?: number
  leaderboardRank?: number
  // Security fields
  blockedUsers?: string[]
  reportedUsers?: string[]
}

export interface SHUBTokenTransaction {
  id: string
  type: "first_login_reward" | "daily_reward" | "weekly_reward" | "invite_reward" | "earned" | "spent"
  amount: number
  description: string
  timestamp: string
}

/** @deprecated Use SHUBTokenTransaction */
export type SHPTokenTransaction = SHUBTokenTransaction

export interface Notification {
  id: string
  type: "like" | "comment" | "follow" | "message" | "premium" | "mention"
<<<<<<< HEAD
=======
=======
}

export interface Notification {
  id: string
  type: "like" | "comment" | "follow" | "mention" | "message" | "premium"
>>>>>>> 82bc3ca8b44839ba49ec0fc525fcb6c408caf7eb
>>>>>>> c07617a5128ffd992b542a41c1dea574864a3046
  user: string
  avatar: string
  content: string
  time: string
  read: boolean
<<<<<<< HEAD
  actionUrl?: string
  actionLabel?: string
=======
<<<<<<< HEAD
  actionUrl?: string
  actionLabel?: string
=======
>>>>>>> 82bc3ca8b44839ba49ec0fc525fcb6c408caf7eb
>>>>>>> c07617a5128ffd992b542a41c1dea574864a3046
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
<<<<<<< HEAD
  authorPhotoURL?: string
  media: {
    type: "image" | "video"
    url: string
    cloudinaryPublicId?: string
=======
  media: {
    type: "image" | "video"
    url: string
>>>>>>> c07617a5128ffd992b542a41c1dea574864a3046
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

<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> c07617a5128ffd992b542a41c1dea574864a3046
export type MessageType = "text" | "image" | "video" | "audio" | "file" | "voice" | "link"

export interface MessageReactionEntry {
  emoji: string
  count: number
  reactedByMe: boolean
  users: string[] // usernames
}

<<<<<<< HEAD
=======
=======
>>>>>>> 82bc3ca8b44839ba49ec0fc525fcb6c408caf7eb
>>>>>>> c07617a5128ffd992b542a41c1dea574864a3046
export interface Message {
  id: string
  conversationId: string
  senderId: string
  senderUsername: string
  senderAvatar: string
  content: string
  timestamp: string
  status: "sending" | "sent" | "delivered" | "read"
<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> c07617a5128ffd992b542a41c1dea574864a3046
  type: MessageType
  mediaUrl?: string
  mediaThumb?: string
  fileName?: string
  fileSize?: number // bytes
  duration?: number // seconds for audio/voice/video
<<<<<<< HEAD
=======
=======
  type: "text" | "image" | "video" | "audio"
  mediaUrl?: string
  mediaThumb?: string
>>>>>>> 82bc3ca8b44839ba49ec0fc525fcb6c408caf7eb
>>>>>>> c07617a5128ffd992b542a41c1dea574864a3046
  replyTo?: {
    id: string
    content: string
    senderUsername: string
<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> c07617a5128ffd992b542a41c1dea574864a3046
    type?: MessageType
  }
  forwardedFrom?: {
    conversationName: string
    senderUsername: string
  }
  reactions?: Record<string, MessageReactionEntry> // emoji -> entry
  isEdited?: boolean
  editedAt?: string
  isDeleted?: boolean
<<<<<<< HEAD
=======
=======
  }
  isEdited?: boolean
  editedAt?: string
>>>>>>> 82bc3ca8b44839ba49ec0fc525fcb6c408caf7eb
>>>>>>> c07617a5128ffd992b542a41c1dea574864a3046
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
<<<<<<< HEAD
  moderatorIds?: string[]
  isPublic?: boolean
  inviteLink?: string
=======
<<<<<<< HEAD
  moderatorIds?: string[]
  isPublic?: boolean
  inviteLink?: string
=======
>>>>>>> 82bc3ca8b44839ba49ec0fc525fcb6c408caf7eb
>>>>>>> c07617a5128ffd992b542a41c1dea574864a3046
  muteUntil?: string
  isPinned?: boolean
}

export interface ConversationParticipant {
  piUid: string
  username: string
  avatar: string
  isOnline: boolean
  lastSeen?: string
<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> c07617a5128ffd992b542a41c1dea574864a3046
  role?: "admin" | "moderator" | "member"
  joinedAt?: string
}

export interface GroupSettings {
  name: string
  description: string
  avatar: string
  isPublic: boolean
  inviteLink: string
}

<<<<<<< HEAD
=======
=======
  role?: "admin" | "member" // For groups
  joinedAt?: string
}

>>>>>>> 82bc3ca8b44839ba49ec0fc525fcb6c408caf7eb
>>>>>>> c07617a5128ffd992b542a41c1dea574864a3046
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
