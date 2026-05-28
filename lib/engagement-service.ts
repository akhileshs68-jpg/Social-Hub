// Engagement service for leaderboard, badges, streaks, and achievements
import type { Badge, UserAchievement, Streak } from "@/lib/types"

<<<<<<< HEAD
interface StoredAchievement extends UserAchievement {
  userId: string
  badgeId: string
}

interface StoredStreak {
  userId: string
  currentStreak: number
  maxStreak: number
  lastDate: string
  rewardClaimed: boolean
}

interface DailyPointsEntry {
  points: number
  activities: {
    activity: string
    points: number
    timestamp: string
  }[]
}

=======
>>>>>>> c07617a5128ffd992b542a41c1dea574864a3046
export interface LeaderboardEntry {
  rank: number
  username: string
  avatar: string
  totalPoints: number
  streak: number
  achievements: number
}

class EngagementService {
  private readonly SK = {
    STREAKS: "engagement_streaks",
    BADGES: "engagement_badges",
    ACHIEVEMENTS: "engagement_achievements",
    LEADERBOARD: "engagement_leaderboard",
    DAILY_POINTS: "engagement_daily_points",
  } as const

  // Badge definitions
  private readonly BADGE_DEFINITIONS: Record<string, Badge> = {
    first_post: {
      id: "first_post",
      name: "Debut",
      icon: "🎬",
      description: "Posted your first content",
    },
    ten_likes: {
      id: "ten_likes",
      name: "Popular",
      icon: "❤️",
      description: "Got 10 likes on a post",
    },
    hundred_followers: {
      id: "hundred_followers",
      name: "Rising Star",
      icon: "⭐",
      description: "Reached 100 followers",
    },
    seven_day_streak: {
      id: "seven_day_streak",
      name: "Dedicated",
      icon: "🔥",
      description: "7-day login streak",
    },
    thirty_day_streak: {
      id: "thirty_day_streak",
      name: "Legendary",
      icon: "👑",
      description: "30-day login streak",
    },
    first_tip: {
      id: "first_tip",
      name: "Generous",
      icon: "💝",
      description: "Sent your first tip",
    },
    verified: {
      id: "verified",
      name: "Verified",
      icon: "✓",
      description: "Account verified",
    },
  }

  /**
   * Update daily login streak
   */
  updateDailyStreak(userId: string): { streakCount: number; newLevel: boolean } {
    const streaks = this.getStreaks()
    const today = new Date().toISOString().split("T")[0]

    let userStreak = streaks.find((s) => s.userId === userId)
    let newLevel = false

    if (!userStreak) {
      userStreak = { userId, currentStreak: 1, maxStreak: 1, lastDate: today, rewardClaimed: false }
      newLevel = true
    } else if (userStreak.lastDate !== today) {
      // Check if it's consecutive
      const lastDate = new Date(userStreak.lastDate)
      const today_date = new Date(today)
      const diff = Math.floor((today_date.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24))

      if (diff === 1) {
        userStreak.currentStreak++
        if (userStreak.currentStreak > userStreak.maxStreak) {
          userStreak.maxStreak = userStreak.currentStreak
          newLevel = true
        }
      } else {
        // Streak broken
        userStreak.currentStreak = 1
      }
      userStreak.lastDate = today
      userStreak.rewardClaimed = false
    }

    this.saveStreaks(streaks, userStreak)
    return { streakCount: userStreak.currentStreak, newLevel }
  }

  /**
   * Add points to user
   */
  addPoints(userId: string, points: number, activity: string): void {
    try {
      const dailyPoints = JSON.parse(localStorage.getItem(this.SK.DAILY_POINTS) || "{}")
      const today = new Date().toISOString().split("T")[0]
      const key = `${userId}_${today}`

      if (!dailyPoints[key]) {
        dailyPoints[key] = { points: 0, activities: [] }
      }
      dailyPoints[key].points += points
      dailyPoints[key].activities.push({ activity, points, timestamp: new Date().toISOString() })

      localStorage.setItem(this.SK.DAILY_POINTS, JSON.stringify(dailyPoints))
    } catch {
      console.error("[v0] Failed to update points")
    }
  }

  /**
   * Get user's total points this week
   */
  getUserWeeklyPoints(userId: string): number {
    try {
      const dailyPoints = JSON.parse(localStorage.getItem(this.SK.DAILY_POINTS) || "{}")
      const today = new Date()
      let total = 0

      for (let i = 0; i < 7; i++) {
        const date = new Date(today)
        date.setDate(today.getDate() - i)
        const dateStr = date.toISOString().split("T")[0]
        const key = `${userId}_${dateStr}`
        if (dailyPoints[key]) {
          total += dailyPoints[key].points
        }
      }
      return total
    } catch {
      return 0
    }
  }

  /**
   * Unlock a badge for user
   */
  unlockBadge(userId: string, badgeId: string): Badge | null {
    const badge = this.BADGE_DEFINITIONS[badgeId]
    if (!badge) return null

    const achievements = this.getAchievements()
    const userAchievements = achievements.filter((a) => a.userId === userId)

    if (userAchievements.some((a) => a.badgeId === badgeId)) {
      return null // Already unlocked
    }

<<<<<<< HEAD
    const achievement: StoredAchievement = {
      id: `${userId}-${badgeId}`,
      type: "milestone",
=======
    const achievement: UserAchievement & { userId: string; badgeId: string } = {
>>>>>>> c07617a5128ffd992b542a41c1dea574864a3046
      userId,
      badgeId,
      title: badge.name,
      description: badge.description,
      points: 10,
      unlockedAt: new Date().toISOString(),
    }

    achievements.push(achievement)
    try {
      localStorage.setItem(this.SK.ACHIEVEMENTS, JSON.stringify(achievements))
    } catch {
      console.error("[v0] Failed to save achievement")
    }

    // Add points
    this.addPoints(userId, 10, `Badge: ${badge.name}`)

    return badge
  }

  /**
   * Get user's badges
   */
  getUserBadges(userId: string): Badge[] {
    const achievements = this.getAchievements()
    return achievements
<<<<<<< HEAD
      .filter((a) => a.userId === userId)
      .map((a) => a.badgeId)
=======
      .filter((a) => (a as any).userId === userId)
      .map((a) => (a as any).badgeId)
>>>>>>> c07617a5128ffd992b542a41c1dea574864a3046
      .map((id) => this.BADGE_DEFINITIONS[id])
      .filter(Boolean)
  }

  /**
   * Generate leaderboard
   */
  getLeaderboard(): LeaderboardEntry[] {
    try {
      const dailyPoints = JSON.parse(localStorage.getItem(this.SK.DAILY_POINTS) || "{}")
      const streaks = this.getStreaks()
      const achievements = this.getAchievements()

      const userScores: Record<string, LeaderboardEntry> = {}

      // Calculate points
<<<<<<< HEAD
      Object.entries(dailyPoints as Record<string, DailyPointsEntry>).forEach(([key, value]) => {
=======
      Object.entries(dailyPoints).forEach(([key, value]: any) => {
>>>>>>> c07617a5128ffd992b542a41c1dea574864a3046
        const [userId] = key.split("_")
        if (!userScores[userId]) {
          userScores[userId] = {
            rank: 0,
            username: userId,
            avatar: userId.charAt(0).toUpperCase(),
            totalPoints: 0,
            streak: 0,
            achievements: 0,
          }
        }
        userScores[userId].totalPoints += value.points
      })

      // Add streaks and achievements
<<<<<<< HEAD
      streaks.forEach((streak) => {
=======
      streaks.forEach((streak: any) => {
>>>>>>> c07617a5128ffd992b542a41c1dea574864a3046
        if (userScores[streak.userId]) {
          userScores[streak.userId].streak = streak.currentStreak
        }
      })

      Object.entries(userScores).forEach(([userId]) => {
<<<<<<< HEAD
        userScores[userId].achievements = achievements.filter((a) => a.userId === userId).length
=======
        userScores[userId].achievements = achievements.filter((a) => (a as any).userId === userId).length
>>>>>>> c07617a5128ffd992b542a41c1dea574864a3046
      })

      // Sort and rank
      const sorted = Object.values(userScores).sort((a, b) => b.totalPoints - a.totalPoints)
      sorted.forEach((entry, index) => {
        entry.rank = index + 1
      })

      return sorted.slice(0, 100)
    } catch {
      return []
    }
  }

  /**
   * Get user's rank
   */
  getUserRank(userId: string): number {
    const leaderboard = this.getLeaderboard()
    const entry = leaderboard.find((e) => e.username === userId)
    return entry?.rank || 0
  }

<<<<<<< HEAD
  private getStreaks(): StoredStreak[] {
=======
  private getStreaks(): any[] {
>>>>>>> c07617a5128ffd992b542a41c1dea574864a3046
    try {
      return JSON.parse(localStorage.getItem(this.SK.STREAKS) || "[]")
    } catch {
      return []
    }
  }

<<<<<<< HEAD
  private saveStreaks(allStreaks: StoredStreak[], updated: StoredStreak): void {
=======
  private saveStreaks(allStreaks: any[], updated: any): void {
>>>>>>> c07617a5128ffd992b542a41c1dea574864a3046
    try {
      const index = allStreaks.findIndex((s) => s.userId === updated.userId)
      if (index >= 0) {
        allStreaks[index] = updated
      } else {
        allStreaks.push(updated)
      }
      localStorage.setItem(this.SK.STREAKS, JSON.stringify(allStreaks))
    } catch {
      console.error("[v0] Failed to save streaks")
    }
  }

<<<<<<< HEAD
  private getAchievements(): StoredAchievement[] {
=======
  private getAchievements(): any[] {
>>>>>>> c07617a5128ffd992b542a41c1dea574864a3046
    try {
      return JSON.parse(localStorage.getItem(this.SK.ACHIEVEMENTS) || "[]")
    } catch {
      return []
    }
  }
}

export const engagementService = new EngagementService()
