"use client"

import { useState } from "react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Settings, MapPin, Calendar, LinkIcon, LogOut, Coins, CheckCircle2, Crown } from "lucide-react"
import { PostCard } from "@/components/post-card"
import type { Post } from "@/lib/types"
import { usePiAuth } from "@/contexts/pi-auth-context"
import { useSHUBToken } from "@/contexts/shub-token-context"

interface ProfileProps {
  username: string
  userId: string
}

const USER_POSTS: Post[] = [
  {
    id: "5",
    username: "You",
    avatar: "Y",
    timeAgo: "1d ago",
    content: "Excited to be part of the Pi Network community! Looking forward to connecting with fellow Pioneers.",
    likes: 24,
    comments: 5,
    shares: 2,
    isLiked: false,
  },
]

export function Profile({ username, userId }: ProfileProps) {
  const { userProfile, logout } = usePiAuth()
  const { tokens, isReady: tokensReady } = useSHUBToken()

  const displayUsername = userProfile?.username || username
  const displayBio =
    userProfile?.bio || "Pi Network Pioneer | Blockchain enthusiast | Building the future of social media"
  const displayFollowers = userProfile?.followers || 0
  const displayFollowing = userProfile?.following || 0
  const displayLocation = userProfile?.location || "Worldwide"
  const displayWebsite = userProfile?.website || "pi-network.com"
  const displayJoinedDate = userProfile?.joinedDate
    ? new Date(userProfile.joinedDate).toLocaleDateString("en-US", { month: "long", year: "numeric" })
    : "January 2024"

  return (
    <div>
      <div className="relative">
        <div className="h-32 bg-gradient-to-r from-primary/20 to-primary/10" />

        <div className="px-4 pb-4">
          <div className="flex items-end justify-between -mt-12 gap-3">
            <Avatar className="w-24 h-24 border-4 border-background shrink-0">
              <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                {displayUsername[0]?.toUpperCase() || "P"}
              </AvatarFallback>
            </Avatar>

            <div className="flex gap-2 mb-2">
              <Button
                size="sm"
                variant="outline"
                className="shrink-0 touch-manipulation bg-transparent"
                onClick={logout}
                aria-label="Logout"
              >
                <LogOut className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
              <Button size="sm" variant="outline" className="shrink-0 touch-manipulation bg-transparent">
                <Settings className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline">Edit</span>
              </Button>
            </div>
          </div>

          <div className="mt-3">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-xl font-bold flex items-center gap-1">
                {displayUsername}
                {userProfile?.isVerified && (
                  <CheckCircle2 className="w-5 h-5 text-blue-500 fill-blue-500" title="Verified account" />
                )}
              </h2>
              {userProfile?.isPremium && (
                <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0 gap-1">
                  <Crown className="w-3 h-3" />
                  Premium
                </Badge>
              )}
              {tokensReady && (
                <Badge variant="outline" className="border-primary/40 text-primary text-xs gap-1">
                  <Coins className="w-3 h-3" />
                  {tokens.toFixed(3)} SHUB
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground">@{displayUsername}</p>
            {userProfile?.piUid && (
              <p className="text-xs text-muted-foreground/70 mt-1">Pi UID: {userProfile.piUid.slice(0, 8)}...</p>
            )}
          </div>

          <p className="mt-3 text-sm leading-relaxed text-balance">{displayBio}</p>

          <div className="mt-3 flex flex-wrap gap-3 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <MapPin className="w-3 h-3 shrink-0" />
              <span>{displayLocation}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3 shrink-0" />
              <span>Joined {displayJoinedDate}</span>
            </div>
            <div className="flex items-center gap-1">
              <LinkIcon className="w-3 h-3 shrink-0" />
              <span className="truncate">{displayWebsite}</span>
            </div>
          </div>

          <div className="mt-4 flex gap-4 text-sm">
            <button className="hover:underline touch-manipulation">
              <span className="font-bold">{displayFollowing}</span>{" "}
              <span className="text-muted-foreground">Following</span>
            </button>
            <button className="hover:underline touch-manipulation">
              <span className="font-bold">{displayFollowers}</span>{" "}
              <span className="text-muted-foreground">Followers</span>
            </button>
          </div>
        </div>
      </div>

      <div className="mt-4">
        <div className="border-b border-border px-4 flex gap-1 overflow-x-auto">
          <Button variant="ghost" className="relative h-12 rounded-none border-b-2 border-primary shrink-0">
            Posts
          </Button>
          <Button variant="ghost" className="h-12 rounded-none text-muted-foreground shrink-0">
            Media
          </Button>
          <Button variant="ghost" className="h-12 rounded-none text-muted-foreground shrink-0">
            Likes
          </Button>
        </div>

        <div className="divide-y divide-border">
          {USER_POSTS.map((post) => (
            <PostCard key={post.id} {...post} />
          ))}
        </div>
      </div>
    </div>
  )
}
