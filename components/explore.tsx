"use client"

import { Button } from "@/components/ui/button"
import { TrendingUp, Hash } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { TrendingTopic, User } from "@/lib/types"

const TRENDING_TOPICS: TrendingTopic[] = [
  { tag: "PiNetwork", posts: "2.5K posts" },
  { tag: "Cryptocurrency", posts: "1.8K posts" },
  { tag: "Blockchain", posts: "1.2K posts" },
  { tag: "Web3", posts: "980 posts" },
  { tag: "DeFi", posts: "750 posts" },
]

const SUGGESTED_USERS: User[] = [
<<<<<<< HEAD
  { id: "1", username: "pi_official", piUid: "pi-official", avatar: "P", bio: "Official Pi Network account", followers: 125000 },
  { id: "2", username: "crypto_news", piUid: "crypto-news", avatar: "C", bio: "Daily crypto updates", followers: 89000 },
  { id: "3", username: "blockchain_edu", piUid: "blockchain-edu", avatar: "B", bio: "Learning blockchain together", followers: 54000 },
=======
  { id: "1", username: "pi_official", avatar: "P", bio: "Official Pi Network account", followers: "125K" },
  { id: "2", username: "crypto_news", avatar: "C", bio: "Daily crypto updates", followers: "89K" },
  { id: "3", username: "blockchain_edu", avatar: "B", bio: "Learning blockchain together", followers: "54K" },
>>>>>>> c07617a5128ffd992b542a41c1dea574864a3046
]

export function Explore() {
  return (
    <div className="p-4 space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-primary" />
            Trending Topics
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {TRENDING_TOPICS.map((topic) => (
            <button
              key={topic.tag}
              className="w-full flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 active:bg-muted transition-colors text-left touch-manipulation"
              aria-label={`View posts about ${topic.tag}`}
            >
              <Hash className="w-4 h-4 text-primary mt-0.5 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm">#{topic.tag}</p>
                <p className="text-xs text-muted-foreground">{topic.posts}</p>
              </div>
            </button>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Suggested Users</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {SUGGESTED_USERS.map((user) => (
            <div key={user.id} className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shrink-0">
                  <span className="text-primary-foreground font-bold text-sm">{user.avatar}</span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-sm truncate">{user.username}</p>
                  <p className="text-xs text-muted-foreground truncate">{user.bio}</p>
                  <p className="text-xs text-muted-foreground">{user.followers} followers</p>
                </div>
              </div>
              <Button size="sm" variant="outline" className="shrink-0 touch-manipulation bg-transparent">
                Follow
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
