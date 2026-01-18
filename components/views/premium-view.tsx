"use client"

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
    </div>
  )
}
