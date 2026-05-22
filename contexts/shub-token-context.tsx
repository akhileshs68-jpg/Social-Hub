"use client"

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react"
import type { SHUBTokenTransaction } from "@/lib/types"

// ─── Reward constants ────────────────────────────────────────────────────────
const FIRST_LOGIN_REWARD_AMOUNT = 5
const DAILY_REWARD_AMOUNT = 0.15
const WEEKLY_REWARD_AMOUNT = 0.5
const WEEKLY_LOGIN_GOAL = 7

// ─── Storage keys ────────────────────────────────────────────────────────────
const SK = {
  TOKENS: "shub_tokens",
  FIRST_LOGIN_REWARD: "shub_first_login_reward",
  LAST_DAILY_REWARD: "shub_last_daily_reward",
  WEEKLY_LOGIN_DAYS: "shub_weekly_login_days",
  TRANSACTIONS: "shub_transactions",
  INVITE_COUNT: "shub_invite_count",
} as const

// ─── Context type ────────────────────────────────────────────────────────────
interface SHUBTokenContextType {
  tokens: number
  firstLoginReward: boolean
  lastDailyReward: string | null
  weeklyLoginDays: string[]
  weeklyLoginCount: number
  inviteCount: number
  transactions: SHUBTokenTransaction[]
  canClaimDaily: boolean
  dailyRewardClaimed: boolean
  weeklyProgress: number
  claimDailyReward: () => void
  isReady: boolean
}

const SHUBTokenContext = createContext<SHUBTokenContextType | undefined>(undefined)

// ─── Helpers ─────────────────────────────────────────────────────────────────
function getTodayKey(): string {
  return new Date().toISOString().split("T")[0]
}

function getWeekStart(): string {
  const now = new Date()
  const diff = now.getDate() - now.getDay()
  const weekStart = new Date(now.setDate(diff))
  return weekStart.toISOString().split("T")[0]
}

function safeGet(key: string): string | null {
  try {
    return localStorage.getItem(key)
  } catch {
    return null
  }
}

function safeSet(key: string, value: string): void {
  try {
    localStorage.setItem(key, value)
  } catch {
    /* storage unavailable — fail silently, UI continues */
  }
}

// ─── Provider ────────────────────────────────────────────────────────────────
export function SHUBTokenProvider({ children }: { children: ReactNode }) {
  const [tokens, setTokens] = useState(0)
  const [firstLoginReward, setFirstLoginReward] = useState(false)
  const [lastDailyReward, setLastDailyReward] = useState<string | null>(null)
  const [weeklyLoginDays, setWeeklyLoginDays] = useState<string[]>([])
  const [inviteCount, setInviteCount] = useState(0)
  const [transactions, setTransactions] = useState<SHUBTokenTransaction[]>([])
  const [isReady, setIsReady] = useState(false)

  // ── Load persisted state after first paint so UI renders immediately ───────
  useEffect(() => {
    const id = setTimeout(() => {
      try {
        const storedTokens = safeGet(SK.TOKENS)
        const storedFirstLogin = safeGet(SK.FIRST_LOGIN_REWARD)
        const storedLastDaily = safeGet(SK.LAST_DAILY_REWARD)
        const storedWeeklyDays = safeGet(SK.WEEKLY_LOGIN_DAYS)
        const storedTransactions = safeGet(SK.TRANSACTIONS)
        const storedInvites = safeGet(SK.INVITE_COUNT)

        const parsedTokens = storedTokens ? parseFloat(storedTokens) : 0
        const parsedFirstLogin = storedFirstLogin === "true"

        setTokens(parsedTokens)
        setFirstLoginReward(parsedFirstLogin)
        if (storedLastDaily) setLastDailyReward(storedLastDaily)
        if (storedInvites) setInviteCount(parseInt(storedInvites, 10))

        if (storedWeeklyDays) {
          const weekStart = getWeekStart()
          const allDays: string[] = JSON.parse(storedWeeklyDays)
          const thisWeekDays = allDays.filter((d) => d >= weekStart)
          setWeeklyLoginDays(thisWeekDays)
          safeSet(SK.WEEKLY_LOGIN_DAYS, JSON.stringify(thisWeekDays))
        }

        if (storedTransactions) {
          setTransactions(JSON.parse(storedTransactions))
        }

        // ── First-login reward: grant 5 SHUB on very first load ─────────────
        if (!parsedFirstLogin) {
          const newTokens = Math.round((parsedTokens + FIRST_LOGIN_REWARD_AMOUNT) * 1000) / 1000
          setTokens(newTokens)
          setFirstLoginReward(true)
          safeSet(SK.TOKENS, newTokens.toString())
          safeSet(SK.FIRST_LOGIN_REWARD, "true")

          const firstTx: SHUBTokenTransaction = {
            id: `${Date.now()}-first`,
            type: "first_login_reward",
            amount: FIRST_LOGIN_REWARD_AMOUNT,
            description: "Welcome bonus — first login reward!",
            timestamp: new Date().toISOString(),
          }
          const existing = storedTransactions ? (JSON.parse(storedTransactions) as SHUBTokenTransaction[]) : []
          const withFirst = [firstTx, ...existing].slice(0, 50)
          setTransactions(withFirst)
          safeSet(SK.TRANSACTIONS, JSON.stringify(withFirst))
        }
      } catch {
        /* Token system failure must never block UI */
      } finally {
        setIsReady(true)
      }
    }, 150)

    return () => clearTimeout(id)
  }, [])

  // ── Transaction helper ────────────────────────────────────────────────────
  const addTransaction = useCallback(
    (tx: Omit<SHUBTokenTransaction, "id" | "timestamp">) => {
      const newTx: SHUBTokenTransaction = {
        ...tx,
        id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        timestamp: new Date().toISOString(),
      }
      setTransactions((prev) => {
        const updated = [newTx, ...prev].slice(0, 50)
        safeSet(SK.TRANSACTIONS, JSON.stringify(updated))
        return updated
      })
    },
    [],
  )

  const today = getTodayKey()
  const canClaimDaily = lastDailyReward !== today
  const dailyRewardClaimed = !canClaimDaily
  const weeklyProgress = weeklyLoginDays.length

  // ── Claim daily reward ────────────────────────────────────────────────────
  const claimDailyReward = useCallback(() => {
    if (!canClaimDaily) return

    try {
      setTokens((prev) => {
        const updated = Math.round((prev + DAILY_REWARD_AMOUNT) * 1000) / 1000
        safeSet(SK.TOKENS, updated.toString())
        return updated
      })

      setLastDailyReward(today)
      safeSet(SK.LAST_DAILY_REWARD, today)

      addTransaction({
        type: "daily_reward",
        amount: DAILY_REWARD_AMOUNT,
        description: "Daily login reward",
      })

      // Track unique login day for weekly streak
      setWeeklyLoginDays((prev) => {
        if (prev.includes(today)) return prev
        const updated = [...prev, today]
        safeSet(SK.WEEKLY_LOGIN_DAYS, JSON.stringify(updated))

        // Weekly bonus when 7 unique days reached
        if (updated.length === WEEKLY_LOGIN_GOAL) {
          setTokens((t) => {
            const bonus = Math.round((t + WEEKLY_REWARD_AMOUNT) * 1000) / 1000
            safeSet(SK.TOKENS, bonus.toString())
            return bonus
          })
          addTransaction({
            type: "weekly_reward",
            amount: WEEKLY_REWARD_AMOUNT,
            description: "7-day weekly login bonus!",
          })
        }

        return updated
      })
    } catch {
      /* Token claim failure must never affect UI */
    }
  }, [canClaimDaily, today, addTransaction])

  const value: SHUBTokenContextType = {
    tokens,
    firstLoginReward,
    lastDailyReward,
    weeklyLoginDays,
    weeklyLoginCount: weeklyLoginDays.length,
    inviteCount,
    transactions,
    canClaimDaily,
    dailyRewardClaimed,
    weeklyProgress,
    claimDailyReward,
    isReady,
  }

  return (
    <SHUBTokenContext.Provider value={value}>{children}</SHUBTokenContext.Provider>
  )
}

export function useSHUBToken() {
  const context = useContext(SHUBTokenContext)
  if (context === undefined) {
    throw new Error("useSHUBToken must be used within a SHUBTokenProvider")
  }
  return context
}
