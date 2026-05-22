// Monetization service for Pi Coin tipping, creator earnings, and rewards
import type { Post, User } from "@/lib/types"

export interface TipTransaction {
  id: string
  fromUser: string
  toUser: string
  amount: number
  postId: string
  timestamp: string
  message?: string
}

export interface CreatorEarning {
  postId: string
  totalEarned: number
  tips: number
  adShare: number
  timestamp: string
}

class MonetizationService {
  // Storage keys
  private readonly SK = {
    TIPS: "monetization_tips",
    CREATOR_EARNINGS: "monetization_creator_earnings",
    PICOIN_BALANCE: "monetization_picoin_balance",
  } as const

  /**
   * Send a tip to a creator
   */
  sendTip(fromUser: string, toUser: string, postId: string, amount: number, message?: string): TipTransaction {
    const tips = this.getTips()
    const transaction: TipTransaction = {
      id: `tip_${Date.now()}_${Math.random()}`,
      fromUser,
      toUser,
      amount,
      postId,
      timestamp: new Date().toISOString(),
      message,
    }
    tips.push(transaction)
    try {
      localStorage.setItem(this.SK.TIPS, JSON.stringify(tips))
    } catch {
      console.error("[v0] Failed to save tip")
    }

    // Add to creator earnings
    this.addCreatorEarning(toUser, postId, amount, 0)
    return transaction
  }

  /**
   * Get all tips for a specific creator
   */
  getCreatorTips(creatorUser: string): TipTransaction[] {
    const tips = this.getTips()
    return tips.filter((t) => t.toUser === creatorUser)
  }

  /**
   * Get tips received for a specific post
   */
  getPostTips(postId: string): TipTransaction[] {
    const tips = this.getTips()
    return tips.filter((t) => t.postId === postId)
  }

  /**
   * Get total tips amount for a post
   */
  getPostTipsAmount(postId: string): number {
    return this.getPostTips(postId).reduce((sum, t) => sum + t.amount, 0)
  }

  /**
   * Add creator earnings from ads
   */
  addCreatorEarning(creator: string, postId: string, tips: number = 0, adShare: number = 0): void {
    const earnings = this.getCreatorEarnings()
    const existing = earnings.find((e) => e.postId === postId)

    if (existing) {
      existing.totalEarned = tips + adShare
      existing.tips = tips
      existing.adShare = adShare
    } else {
      earnings.push({
        postId,
        totalEarned: tips + adShare,
        tips,
        adShare,
        timestamp: new Date().toISOString(),
      })
    }

    try {
      localStorage.setItem(this.SK.CREATOR_EARNINGS, JSON.stringify(earnings))
    } catch {
      console.error("[v0] Failed to save creator earnings")
    }
  }

  /**
   * Get creator's total earnings
   */
  getCreatorTotalEarnings(creatorUser: string): number {
    const tips = this.getCreatorTips(creatorUser)
    return tips.reduce((sum, t) => sum + t.amount, 0)
  }

  /**
   * Get Pi Coin balance for a user
   */
  getPiCoinBalance(userId: string): number {
    try {
      const balances = JSON.parse(localStorage.getItem(this.SK.PICOIN_BALANCE) || "{}")
      return balances[userId] || 0
    } catch {
      return 0
    }
  }

  /**
   * Add Pi Coins to user (from tips, rewards, or ads)
   */
  addPiCoins(userId: string, amount: number, reason: "tip" | "reward" | "ad"): void {
    try {
      const balances = JSON.parse(localStorage.getItem(this.SK.PICOIN_BALANCE) || "{}")
      balances[userId] = (balances[userId] || 0) + amount
      localStorage.setItem(this.SK.PICOIN_BALANCE, JSON.stringify(balances))
    } catch {
      console.error("[v0] Failed to update Pi Coin balance")
    }
  }

  private getTips(): TipTransaction[] {
    try {
      return JSON.parse(localStorage.getItem(this.SK.TIPS) || "[]")
    } catch {
      return []
    }
  }

  private getCreatorEarnings(): CreatorEarning[] {
    try {
      return JSON.parse(localStorage.getItem(this.SK.CREATOR_EARNINGS) || "[]")
    } catch {
      return []
    }
  }
}

export const monetizationService = new MonetizationService()
