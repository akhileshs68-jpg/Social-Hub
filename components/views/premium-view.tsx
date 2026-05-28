"use client"

<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> c07617a5128ffd992b542a41c1dea574864a3046
import { useSHUBToken } from "@/contexts/shub-token-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
  CheckCircle,
  Circle,
  Coins,
  CalendarDays,
  Gift,
  UserPlus,
  History,
  PartyPopper,
} from "lucide-react"
import { cn } from "@/lib/utils"

const WEEK_DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
const WEEKLY_GOAL = 7

function getWeekDayKeys(): string[] {
  const now = new Date()
  const day = now.getDay()
  const days: string[] = []
  for (let i = 0; i < 7; i++) {
    const d = new Date(now)
    d.setDate(now.getDate() - day + i)
    days.push(d.toISOString().split("T")[0])
  }
  return days
}

function TxTypeLabel({ type }: { type: string }) {
  const map: Record<string, string> = {
    first_login_reward: "Welcome Bonus",
    daily_reward: "Daily Reward",
    weekly_reward: "Weekly Bonus",
    invite_reward: "Invite Reward",
    earned: "Earned",
    spent: "Spent",
  }
  return <>{map[type] ?? type}</>
}

export function PremiumView() {
  const {
    tokens,
    firstLoginReward,
    canClaimDaily,
    dailyRewardClaimed,
    weeklyLoginDays,
    weeklyProgress,
    inviteCount,
    transactions,
    claimDailyReward,
    isReady,
  } = useSHUBToken()

  const weekDayKeys = getWeekDayKeys()

  return (
    <div className="pb-24 pt-2">

      {/* ── Token Balance Hero ─────────────────────────────────────────────── */}
      <div className="px-4 py-6">
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="pt-6 pb-6">
            <div className="flex flex-col items-center gap-2 text-center">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-1">
                <Coins className="w-8 h-8 text-primary" />
              </div>

              {!isReady ? (
                <Skeleton className="h-10 w-32" />
              ) : (
                <p className="text-4xl font-bold text-foreground tracking-tight">
                  {tokens.toFixed(3)}
                </p>
              )}

              <p className="text-sm text-muted-foreground font-medium">SHUB Tokens</p>
              <Badge variant="outline" className="mt-1 text-xs border-primary/30 text-primary">
                Social Hub Token
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ── First Login Welcome Banner (shown once) ───────────────────────── */}
      {isReady && firstLoginReward && transactions.some((t) => t.type === "first_login_reward") && (
        <div className="px-4 pb-4">
          <div className="flex items-center gap-3 p-4 rounded-xl bg-primary/10 border border-primary/20">
            <PartyPopper className="w-5 h-5 text-primary shrink-0" />
            <div>
              <p className="text-sm font-semibold text-foreground">Welcome to Social Hub Pi!</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                You received a one-time welcome bonus of{" "}
                <span className="font-bold text-primary">+5 SHUB</span> for joining.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ── Daily Reward ──────────────────────────────────────────────────── */}
      <div className="px-4 pb-4">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Gift className="w-5 h-5 text-primary shrink-0" />
              <CardTitle className="text-base">Daily Login Reward</CardTitle>
            </div>
            <CardDescription>Claim 0.15 SHUB once every 24 hours</CardDescription>
          </CardHeader>
          <CardContent>
            {!isReady ? (
              <Skeleton className="h-10 w-full" />
            ) : canClaimDaily ? (
              <Button className="w-full" onClick={claimDailyReward}>
                <Gift className="w-4 h-4 mr-2" />
                Claim 0.15 SHUB
              </Button>
            ) : (
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted">
                <CheckCircle className="w-5 h-5 text-primary shrink-0" />
                <div>
                  <p className="text-sm font-medium">Reward claimed today</p>
                  <p className="text-xs text-muted-foreground">
                    Come back tomorrow for your next reward
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* ── Weekly Streak ─────────────────────────────────────────────────── */}
      <div className="px-4 pb-4">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <CalendarDays className="w-5 h-5 text-primary shrink-0" />
              <CardTitle className="text-base">Weekly Login Streak</CardTitle>
            </div>
            <CardDescription>
              Log in 7 days this week to earn a bonus 0.5 SHUB
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Day grid */}
            <div className="grid grid-cols-7 gap-1">
              {weekDayKeys.map((dayKey, idx) => {
                const claimed = weeklyLoginDays.includes(dayKey)
                return (
                  <div key={dayKey} className="flex flex-col items-center gap-1">
                    <span className="text-[10px] text-muted-foreground">{WEEK_DAYS[idx]}</span>
                    <div
                      className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center transition-colors",
                        claimed
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground",
                      )}
                    >
                      {claimed ? (
                        <CheckCircle className="w-4 h-4" />
                      ) : (
                        <Circle className="w-4 h-4" />
                      )}
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Progress bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{weeklyProgress} / {WEEKLY_GOAL} days</span>
                {weeklyProgress === WEEKLY_GOAL && (
                  <span className="text-primary font-medium">Bonus earned!</span>
                )}
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-500"
                  style={{ width: `${(weeklyProgress / WEEKLY_GOAL) * 100}%` }}
                />
              </div>
            </div>

            {weeklyProgress === WEEKLY_GOAL && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-primary/10 text-primary">
                <CheckCircle className="w-4 h-4 shrink-0" />
                <p className="text-xs font-medium">
                  You earned the 7-day bonus of 0.5 SHUB this week!
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* ── Invite Friends ────────────────────────────────────────────────── */}
      <div className="px-4 pb-4">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-primary shrink-0" />
              <CardTitle className="text-base">Invite Friends</CardTitle>
            </div>
            <CardDescription>
              Earn SHUB tokens when friends join via your invite
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted mb-3">
              <span className="text-sm text-muted-foreground">Friends invited</span>
              <span className="font-bold text-foreground">{inviteCount}</span>
            </div>
            <Button variant="outline" className="w-full bg-transparent" disabled>
              <UserPlus className="w-4 h-4 mr-2" />
              Share Invite Link (Coming Soon)
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* ── Transaction History ───────────────────────────────────────────── */}
      <div className="px-4 pb-4">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <History className="w-5 h-5 text-primary shrink-0" />
              <CardTitle className="text-base">Token History</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            {!isReady ? (
              <div className="space-y-2">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            ) : transactions.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                No transactions yet. Claim your first daily reward!
              </p>
            ) : (
              <div className="divide-y divide-border">
                {transactions.slice(0, 10).map((tx) => (
                  <div
                    key={tx.id}
                    className="flex items-center justify-between py-3 gap-3"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{tx.description}</p>
                      <p className="text-xs text-muted-foreground">
                        <TxTypeLabel type={tx.type} /> &middot;{" "}
                        {new Date(tx.timestamp).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                    <Badge
                      variant="outline"
                      className={cn(
                        "shrink-0 text-xs",
                        tx.amount > 0
                          ? "border-primary/40 text-primary"
                          : "border-destructive/40 text-destructive",
                      )}
                    >
                      {tx.amount > 0 ? "+" : ""}
                      {tx.amount.toFixed(3)} SHUB
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* ── How to Earn ───────────────────────────────────────────────────── */}
      <div className="px-4 pb-2">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">How to Earn SHUB Tokens</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex gap-3">
                <span className="text-primary font-bold shrink-0 w-10">+5.00</span>
                <span>One-time welcome bonus on your first login</span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary font-bold shrink-0 w-10">+0.15</span>
                <span>Log in once per day to claim your daily reward</span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary font-bold shrink-0 w-10">+0.50</span>
                <span>Log in 7 different days in the same week for a weekly bonus</span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary font-bold shrink-0 w-10">+SHUB</span>
                <span>Invite friends to Social Hub Pi (coming soon)</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

<<<<<<< HEAD
=======
=======
import { useState, useEffect } from "react"
import { PremiumPlanCard } from "@/components/premium-plan-card"
import { PaymentProcessingDialog } from "@/components/payment-processing-dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Sparkles, Shield, Zap, Crown } from "lucide-react"
import { usePiAuth } from "@/contexts/pi-auth-context"
import { piPaymentService, PREMIUM_PLANS } from "@/lib/pi-payment-service"
import type { PremiumPlan, PaymentState, UserSubscription } from "@/lib/types"

export function PremiumView() {
  const { userProfile, piAccessToken } = usePiAuth()
  const [paymentState, setPaymentState] = useState<PaymentState>("idle")
  const [showDialog, setShowDialog] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<PremiumPlan | null>(null)
  const [subscription, setSubscription] = useState<UserSubscription | null>(null)

  useEffect(() => {
    if (piAccessToken) {
      piPaymentService.setAccessToken(piAccessToken)
    }
  }, [piAccessToken])

  useEffect(() => {
    const loadSubscription = async () => {
      if (userProfile?.id) {
        const sub = await piPaymentService.getUserSubscription(userProfile.id)
        setSubscription(sub)
      }
    }
    loadSubscription()
  }, [userProfile])

  const isPremiumActive = piPaymentService.isPremiumActive(subscription)

  const handleSelectPlan = async (plan: PremiumPlan) => {
    if (!userProfile?.id) return

    setSelectedPlan(plan)
    setPaymentState("pending")
    setShowDialog(true)

    await new Promise((resolve) => setTimeout(resolve, 500))
    setPaymentState("processing")

    piPaymentService.initiatePayment(
      plan,
      userProfile.id,
      async (payment) => {
        console.log("[v0] Payment completed successfully:", payment)
        setPaymentState("success")

        const newSubscription: UserSubscription = {
          userId: userProfile.id,
          planId: plan.id,
          status: "active",
          startDate: new Date().toISOString(),
          expiryDate:
            plan.type === "monthly"
              ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
              : plan.type === "yearly"
                ? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
                : undefined,
          paymentId: payment.identifier,
          autoRenew: plan.type !== "one-time",
        }

        await piPaymentService.saveUserSubscription(newSubscription)
        setSubscription(newSubscription)
      },
      (error) => {
        console.error("[v0] Payment failed:", error)
        setPaymentState("failed")
      },
      () => {
        console.log("[v0] Payment cancelled by user")
        setPaymentState("cancelled")
      },
    )
  }

  const handleRetry = () => {
    setShowDialog(false)
    setPaymentState("idle")
    if (selectedPlan) {
      setTimeout(() => handleSelectPlan(selectedPlan), 300)
    }
  }

  const handleCancelSubscription = async () => {
    if (!userProfile?.id) return
    await piPaymentService.cancelSubscription(userProfile.id)
    const updatedSub = await piPaymentService.getUserSubscription(userProfile.id)
    setSubscription(updatedSub)
  }

  return (
    <div className="pb-20">
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-primary/10 to-background px-4 py-8 text-center">
        <div className="mx-auto max-w-2xl">
          <Crown className="mx-auto h-16 w-16 text-primary mb-4" />
          <h1 className="text-3xl font-bold mb-3">Upgrade to Premium</h1>
          <p className="text-muted-foreground text-lg">
            Unlock exclusive features and enhance your Social Hub Pi experience
          </p>
        </div>
      </div>

      {/* Current Status */}
      {subscription && (
        <div className="px-4 py-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Your Subscription</CardTitle>
                  <CardDescription>
                    {piPaymentService.getPlanById(subscription.planId)?.name || "Premium Plan"}
                  </CardDescription>
                </div>
                <Badge variant={isPremiumActive ? "default" : "secondary"}>
                  {subscription.status === "active" ? "Active" : subscription.status}
                </Badge>
              </div>
            </CardHeader>
            {isPremiumActive && (
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Started:</span>
                    <span>{new Date(subscription.startDate).toLocaleDateString()}</span>
                  </div>
                  {subscription.expiryDate && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Expires:</span>
                      <span>{new Date(subscription.expiryDate).toLocaleDateString()}</span>
                    </div>
                  )}
                  {subscription.autoRenew && (
                    <div className="pt-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleCancelSubscription}
                        className="w-full bg-transparent"
                      >
                        Cancel Auto-Renewal
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            )}
          </Card>
        </div>
      )}

      {/* Benefits Section */}
      <div className="px-4 py-6">
        <h2 className="text-xl font-semibold mb-4">Premium Benefits</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="pb-4">
              <Sparkles className="h-8 w-8 text-primary mb-2" />
              <CardTitle className="text-lg">Ad-Free Experience</CardTitle>
              <CardDescription>Browse without any interruptions</CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-4">
              <Shield className="h-8 w-8 text-primary mb-2" />
              <CardTitle className="text-lg">Priority Support</CardTitle>
              <CardDescription>Get help when you need it</CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-4">
              <Zap className="h-8 w-8 text-primary mb-2" />
              <CardTitle className="text-lg">Advanced Features</CardTitle>
              <CardDescription>Access exclusive tools</CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-4">
              <Crown className="h-8 w-8 text-primary mb-2" />
              <CardTitle className="text-lg">Premium Badge</CardTitle>
              <CardDescription>Stand out in the community</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>

      {/* Pricing Plans */}
      <div className="px-4 py-6">
        <h2 className="text-xl font-semibold mb-4">Choose Your Plan</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PREMIUM_PLANS.map((plan) => (
            <PremiumPlanCard
              key={plan.id}
              plan={plan}
              onSelectPlan={handleSelectPlan}
              isPremiumActive={isPremiumActive}
              currentPlanId={subscription?.planId}
              disabled={paymentState === "pending" || paymentState === "processing"}
            />
          ))}
        </div>
      </div>

      {/* FAQ Section */}
      <div className="px-4 py-6">
        <h2 className="text-xl font-semibold mb-4">Frequently Asked Questions</h2>
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">How do I pay with Pi?</CardTitle>
              <CardDescription>
                Click on a plan and you'll be prompted to complete the payment through your Pi Wallet. The process is
                secure and handled by the Pi Network.
              </CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Can I cancel anytime?</CardTitle>
              <CardDescription>
                Yes! You can cancel your subscription at any time. You'll continue to have access until the end of your
                billing period.
              </CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">What payment methods are supported?</CardTitle>
              <CardDescription>
                We accept Pi cryptocurrency through the Pi Network. Both Testnet and Mainnet payments are supported.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>

      <PaymentProcessingDialog
        open={showDialog}
        onOpenChange={setShowDialog}
        state={paymentState}
        onRetry={handleRetry}
      />
>>>>>>> 82bc3ca8b44839ba49ec0fc525fcb6c408caf7eb
>>>>>>> c07617a5128ffd992b542a41c1dea574864a3046
    </div>
  )
}
