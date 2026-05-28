"use client"

import {
  addDoc,
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  increment,
  limit,
  onSnapshot,
  orderBy,
  query,
  runTransaction,
  serverTimestamp,
  setDoc,
  Timestamp,
  updateDoc,
  type DocumentData,
  type QueryDocumentSnapshot,
  type Unsubscribe,
} from "firebase/firestore"
import { getFirebaseDb } from "@/lib/firebase"
import type { Post, PostComment, Status, StatusGroup, User } from "@/lib/types"

type ListenerResult<T> = {
  unsubscribe: Unsubscribe
}

const POSTS_COLLECTION = "posts"
const USERS_COLLECTION = "users"
const STATUS_COLLECTION = "statuses"

const toIsoDate = (value: unknown): string => {
  if (value instanceof Timestamp) return value.toDate().toISOString()
  if (typeof value === "string") return value
  if (value instanceof Date) return value.toISOString()
  return new Date().toISOString()
}

const timeAgo = (isoDate: string): string => {
  const diff = Date.now() - new Date(isoDate).getTime()
  const minute = 60 * 1000
  const hour = 60 * minute
  const day = 24 * hour

  if (diff < minute) return "Just now"
  if (diff < hour) return `${Math.floor(diff / minute)}m ago`
  if (diff < day) return `${Math.floor(diff / hour)}h ago`
  return `${Math.floor(diff / day)}d ago`
}

const mapPost = (snapshot: QueryDocumentSnapshot<DocumentData>, viewerPiUid?: string): Post => {
  const data = snapshot.data()
  const createdAt = toIsoDate(data.createdAt)
  const likedBy = Array.isArray(data.likedBy) ? (data.likedBy as string[]) : []
  const caption = String(data.caption || data.content || "")
  const mediaUrl = data.mediaUrl || data.imageUrl || undefined
  const commentsCount = Number(data.commentsCount ?? data.comments ?? 0)

  return {
    id: snapshot.id,
    userId: String(data.userId || data.piUid || ""),
    username: String(data.username || "Pioneer"),
    avatar: String(data.avatar || "P"),
    authorPhotoURL: data.authorPhotoURL || undefined,
    timeAgo: timeAgo(createdAt),
    caption,
    content: caption,
    likes: Number(data.likes || 0),
    comments: commentsCount,
    commentsCount,
    shares: Number(data.shares || 0),
    isLiked: viewerPiUid ? likedBy.includes(viewerPiUid) : false,
    isSaved: false,
    mediaUrl,
    imageUrl: mediaUrl,
    mediaType: data.mediaType || undefined,
    cloudinaryPublicId: data.cloudinaryPublicId || undefined,
    media: Array.isArray(data.media) ? data.media : undefined,
    hashtags: Array.isArray(data.hashtags) ? data.hashtags : undefined,
    piUid: data.piUid || undefined,
    createdAt,
    moderationFlag: data.moderationFlag || "approved",
    isEdited: Boolean(data.isEdited),
  }
}

const mapComment = (snapshot: QueryDocumentSnapshot<DocumentData>): PostComment => {
  const data = snapshot.data()

  return {
    id: snapshot.id,
    postId: String(data.postId || ""),
    piUid: String(data.piUid || ""),
    username: String(data.username || "Pioneer"),
    avatar: String(data.avatar || "P"),
    authorPhotoURL: data.authorPhotoURL || undefined,
    text: String(data.text || ""),
    createdAt: toIsoDate(data.createdAt),
  }
}

const mapStatus = (snapshot: QueryDocumentSnapshot<DocumentData>): Status => {
  const data = snapshot.data()

  return {
    id: snapshot.id,
    piUid: String(data.piUid || ""),
    username: String(data.username || "Pioneer"),
    avatar: String(data.avatar || "P"),
    authorPhotoURL: data.authorPhotoURL || undefined,
    media: {
      type: data.media?.type === "video" ? "video" : "image",
      url: String(data.media?.url || ""),
      cloudinaryPublicId: data.media?.cloudinaryPublicId || undefined,
      thumbnail: data.media?.thumbnail || undefined,
    },
    caption: data.caption || undefined,
    createdAt: toIsoDate(data.createdAt),
    expiresAt: toIsoDate(data.expiresAt),
    seenBy: Array.isArray(data.seenBy) ? data.seenBy : [],
    moderationFlag: data.moderationFlag || "approved",
  }
}

export const saveUserProfile = async (profile: User) => {
  const db = getFirebaseDb()

  await setDoc(
    doc(db, USERS_COLLECTION, profile.piUid),
    {
      ...profile,
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  )
}

export const subscribeToPosts = (
  viewerPiUid: string | undefined,
  onNext: (posts: Post[]) => void,
  onError: (error: Error) => void,
): ListenerResult<Post[]> => {
  const db = getFirebaseDb()
  const postsQuery = query(collection(db, POSTS_COLLECTION), orderBy("createdAt", "desc"), limit(75))
  const unsubscribe = onSnapshot(
    postsQuery,
    (snapshot) => onNext(snapshot.docs.map((postDoc) => mapPost(postDoc, viewerPiUid))),
    onError,
  )

  return { unsubscribe }
}

export const createPost = async (
  post: Omit<Post, "id" | "timeAgo" | "likes" | "comments" | "shares" | "isLiked">,
) => {
  const db = getFirebaseDb()

  await addDoc(collection(db, POSTS_COLLECTION), {
    userId: post.userId || post.piUid,
    username: post.username,
    caption: post.caption || post.content,
    hashtags: post.hashtags || [],
    mediaUrl: post.mediaUrl || post.imageUrl || "",
    mediaType: post.mediaType || "image",
    cloudinaryPublicId: post.cloudinaryPublicId || "",
    authorPhotoURL: post.authorPhotoURL || "",
    avatar: post.avatar,
    piUid: post.piUid,
    likes: 0,
    commentsCount: 0,
    shares: 0,
    likedBy: [],
    createdAt: serverTimestamp(),
  })
}

export const togglePostLike = async (postId: string, piUid: string, shouldLike: boolean) => {
  const db = getFirebaseDb()

  await updateDoc(doc(db, POSTS_COLLECTION, postId), {
    likes: increment(shouldLike ? 1 : -1),
    likedBy: shouldLike ? arrayUnion(piUid) : arrayRemove(piUid),
  })
}

export const sharePost = async (postId: string) => {
  const db = getFirebaseDb()

  await updateDoc(doc(db, POSTS_COLLECTION, postId), {
    shares: increment(1),
  })
}

export const subscribeToPostComments = (
  postId: string,
  onNext: (comments: PostComment[]) => void,
  onError: (error: Error) => void,
): ListenerResult<PostComment[]> => {
  const db = getFirebaseDb()
  const commentsQuery = query(
    collection(db, POSTS_COLLECTION, postId, "comments"),
    orderBy("createdAt", "asc"),
    limit(100),
  )
  const unsubscribe = onSnapshot(
    commentsQuery,
    (snapshot) => onNext(snapshot.docs.map(mapComment)),
    onError,
  )

  return { unsubscribe }
}

export const createComment = async (
  postId: string,
  comment: Omit<PostComment, "id" | "postId" | "createdAt">,
) => {
  const db = getFirebaseDb()
  const postRef = doc(db, POSTS_COLLECTION, postId)
  const commentRef = doc(collection(postRef, "comments"))

  await runTransaction(db, async (transaction) => {
    transaction.set(commentRef, {
      ...comment,
      postId,
      createdAt: serverTimestamp(),
    })
    transaction.update(postRef, {
      commentsCount: increment(1),
    })
  })
}

export const subscribeToStatuses = (
  viewerPiUid: string | undefined,
  onNext: (groups: StatusGroup[]) => void,
  onError: (error: Error) => void,
): ListenerResult<StatusGroup[]> => {
  const db = getFirebaseDb()
  const statusQuery = query(collection(db, STATUS_COLLECTION), orderBy("createdAt", "desc"), limit(100))
  const unsubscribe = onSnapshot(
    statusQuery,
    (snapshot) => {
      const now = Date.now()
      const activeStatuses = snapshot.docs.map(mapStatus).filter((status) => new Date(status.expiresAt).getTime() > now)
      onNext(groupStatusesByUser(activeStatuses, viewerPiUid))
    },
    onError,
  )

  return { unsubscribe }
}

export const createStatus = async (
  status: Omit<Status, "id" | "createdAt" | "expiresAt" | "seenBy">,
) => {
  const db = getFirebaseDb()
  const now = new Date()
  const expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000)

  await addDoc(collection(db, STATUS_COLLECTION), {
    ...status,
    createdAt: serverTimestamp(),
    expiresAt: Timestamp.fromDate(expiresAt),
    seenBy: [],
  })
}

export const markStatusSeen = async (statusId: string, viewerPiUid: string) => {
  const db = getFirebaseDb()

  await updateDoc(doc(db, STATUS_COLLECTION, statusId), {
    seenBy: arrayUnion(viewerPiUid),
  })
}

export const groupStatusesByUser = (statuses: Status[], viewerPiUid?: string): StatusGroup[] => {
  const grouped = new Map<string, StatusGroup>()

  for (const status of statuses) {
    const existing = grouped.get(status.piUid)
    if (existing) {
      existing.statuses.push(status)
      existing.hasUnseen = existing.hasUnseen || (!!viewerPiUid && !status.seenBy.includes(viewerPiUid))
    } else {
      grouped.set(status.piUid, {
        piUid: status.piUid,
        username: status.username,
        avatar: status.avatar,
        statuses: [status],
        hasUnseen: !!viewerPiUid && !status.seenBy.includes(viewerPiUid),
      })
    }
  }

  return Array.from(grouped.values()).map((group) => ({
    ...group,
    statuses: group.statuses.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()),
  }))
}
