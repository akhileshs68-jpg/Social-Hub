import { BACKEND_CONFIG } from "./system-config"
import type { PaymentDTO, PremiumPlan, UserSubscription } from "./types"

declare global {
  interface Window {
    Pi: {
      init: (config: { version: string; sandbox?: boolean }) => Promise<void>
      authenticate: (scopes: string[]) => Promise<{
        accessToken: string
        user: { uid: string; username: string }
      }>
      createPayment: (
        paymentData: {
          amount: number
          memo: string
          metadata: Record<string, unknown>
        },
        callbacks: {
          onReadyForServerApproval: (paymentId: string) => void
          onReadyForServerCompletion: (paymentId: string, txid: string) => void
          onCancel: (paymentId: string) => void
          onError: (error: Error, payment?: { identifier: string }) => void
        },
      ) => void
    }
  }
}

export const PREMIUM_PLANS: PremiumPlan[] = [
  {
    id: "basic",
    name: "Basic",
    description: "Essential premium features",
    price: 10,
    type: "one-time",
    features: [
      {
        id: "no-ads",
        name: "Ad-Free Experience",
        description: "Browse without advertisements",
        icon: "✨",
        enabled: true,
      },
      {
        id: "custom-theme",
        name: "Custom Themes",
        description: "Personalize your app appearance",
        icon: "🎨",
        enabled: true,
      },
      {
        id: "priority-support",
        name: "Priority Support",
        description: "Get faster customer support",
        icon: "⚡",
        enabled: true,
      },
    ],
  },
  {
    id: "pro-monthly",
    name: "Pro Monthly",
    description: "Full access to all features",
    price: 5,
    type: "monthly",
    popular: true,
    features: [
      {
        id: "no-ads",
        name: "Ad-Free Experience",
        description: "Browse without advertisements",
        icon: "✨",
        enabled: true,
      },
      {
        id: "custom-theme",
        name: "Custom Themes",
        description: "Personalize your app appearance",
        icon: "🎨",
        enabled: true,
      },
      {
        id: "priority-support",
        name: "Priority Support",
        description: "Get faster customer support",
        icon: "⚡",
        enabled: true,
      },
      {
        id: "advanced-analytics",
        name: "Advanced Analytics",
        description: "Deep insights into your activity",
        icon: "📊",
        enabled: true,
      },
      {
        id: "unlimited-storage",
        name: "Unlimited Storage",
        description: "Store unlimited media content",
        icon: "💾",
        enabled: true,
      },
      {
        id: "exclusive-badge",
        name: "Premium Badge",
        description: "Show your premium status",
        icon: "💎",
        enabled: true,
      },
    ],
  },
  {
    id: "pro-yearly",
    name: "Pro Yearly",
    description: "Best value - Save 50%",
    price: 30,
    type: "yearly",
    savings: "Save 50%",
    features: [
      {
        id: "no-ads",
        name: "Ad-Free Experience",
        description: "Browse without advertisements",
        icon: "✨",
        enabled: true,
      },
      {
        id: "custom-theme",
        name: "Custom Themes",
        description: "Personalize your app appearance",
        icon: "🎨",
        enabled: true,
      },
      {
        id: "priority-support",
        name: "Priority Support",
        description: "Get faster customer support",
        icon: "⚡",
        enabled: true,
      },
      {
        id: "advanced-analytics",
        name: "Advanced Analytics",
        description: "Deep insights into your activity",
        icon: "📊",
        enabled: true,
      },
      {
        id: "unlimited-storage",
        name: "Unlimited Storage",
        description: "Store unlimited media content",
        icon: "💾",
        enabled: true,
      },
      {
        id: "exclusive-badge",
        name: "Premium Badge",
        description: "Show your premium status",
        icon: "💎",
        enabled: true,
      },
      {
        id: "early-access",
        name: "Early Access",
        description: "Try new features first",
        icon: "🚀",
        enabled: true,
      },
    ],
  },
]

class PiPaymentService {
  private baseUrl = BACKEND_CONFIG.BASE_URL
  private accessToken: string | null = null

  setAccessToken(token: string) {
    this.accessToken = token
  }

  private async fetchWithAuth(url: string, options: RequestInit = {}) {
    const headers = {
      "Content-Type": "application/json",
      ...(this.accessToken ? { Authorization: `Bearer ${this.accessToken}` } : {}),
      ...options.headers,
    }

    const response = await fetch(url, { ...options, headers })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return response.json()
  }

  async initiatePayment(
    plan: PremiumPlan,
    userId: string,
    onSuccess: (payment: PaymentDTO) => void,
    onError: (error: string) => void,
    onCancel: () => void,
  ): Promise<void> {
    try {
      if (typeof window.Pi === "undefined") {
        throw new Error("Pi SDK not loaded")
      }

      const paymentData = {
        amount: plan.price,
        memo: `${plan.name} - ${plan.description}`,
        metadata: {
          userId,
          productId: plan.id,
          type: plan.type,
        },
      }

      window.Pi.createPayment(paymentData, {
        onReadyForServerApproval: async (paymentId: string) => {
          console.log("[v0] Payment ready for approval:", paymentId)
          try {
            const approvedPayment = await this.approvePayment(paymentId)
            console.log("[v0] Payment approved:", approvedPayment)
          } catch (error) {
            console.error("[v0] Payment approval failed:", error)
            onError(error instanceof Error ? error.message : "Payment approval failed")
          }
        },
        onReadyForServerCompletion: async (paymentId: string, txid: string) => {
          console.log("[v0] Payment ready for completion:", { paymentId, txid })
          try {
            const completedPayment = await this.completePayment(paymentId, txid)
            console.log("[v0] Payment completed:", completedPayment)
            onSuccess(completedPayment)
          } catch (error) {
            console.error("[v0] Payment completion failed:", error)
            onError(error instanceof Error ? error.message : "Payment completion failed")
          }
        },
        onCancel: (paymentId: string) => {
          console.log("[v0] Payment cancelled:", paymentId)
          onCancel()
        },
        onError: (error: Error, payment?: { identifier: string }) => {
          console.error("[v0] Payment error:", error, payment)
          onError(error.message)
        },
      })
    } catch (error) {
      console.error("[v0] Payment initiation error:", error)
      onError(error instanceof Error ? error.message : "Failed to initiate payment")
    }
  }

  private async approvePayment(paymentId: string): Promise<PaymentDTO> {
    return this.fetchWithAuth(`${this.baseUrl}/v1/payments/${paymentId}/approve`, {
      method: "POST",
    })
  }

  private async completePayment(paymentId: string, txid: string): Promise<PaymentDTO> {
    return this.fetchWithAuth(`${this.baseUrl}/v1/payments/${paymentId}/complete`, {
      method: "POST",
      body: JSON.stringify({ txid }),
    })
  }

  async getPaymentStatus(paymentId: string): Promise<PaymentDTO> {
    return this.fetchWithAuth(`${this.baseUrl}/v1/payments/${paymentId}`)
  }

  async getUserSubscription(userId: string): Promise<UserSubscription | null> {
    try {
      // This would normally fetch from your backend
      const stored = sessionStorage.getItem(`subscription_${userId}`)
      return stored ? JSON.parse(stored) : null
    } catch (error) {
      console.error("[v0] Failed to get user subscription:", error)
      return null
    }
  }

  async saveUserSubscription(subscription: UserSubscription): Promise<void> {
    try {
      // Store locally for demo; in production, save to backend
      sessionStorage.setItem(`subscription_${subscription.userId}`, JSON.stringify(subscription))
    } catch (error) {
      console.error("[v0] Failed to save subscription:", error)
      throw error
    }
  }

  async cancelSubscription(userId: string): Promise<void> {
    const subscription = await this.getUserSubscription(userId)
    if (subscription) {
      subscription.status = "cancelled"
      subscription.autoRenew = false
      await this.saveUserSubscription(subscription)
    }
  }

  isPremiumActive(subscription: UserSubscription | null): boolean {
    if (!subscription) return false
    if (subscription.status !== "active") return false

    if (subscription.expiryDate) {
      const expiry = new Date(subscription.expiryDate)
      const now = new Date()
      return expiry > now
    }

    return true
  }

  getPlanById(planId: string): PremiumPlan | undefined {
    return PREMIUM_PLANS.find((plan) => plan.id === planId)
  }
}

export const piPaymentService = new PiPaymentService()
