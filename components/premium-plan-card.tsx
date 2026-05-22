"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check } from "lucide-react"
import type { PremiumPlan } from "@/lib/types"

interface PremiumPlanCardProps {
  plan: PremiumPlan
  onSelectPlan: (plan: PremiumPlan) => void
  isPremiumActive: boolean
  currentPlanId?: string
  disabled?: boolean
}

export function PremiumPlanCard({
  plan,
  onSelectPlan,
  isPremiumActive,
  currentPlanId,
  disabled,
}: PremiumPlanCardProps) {
  const isCurrentPlan = currentPlanId === plan.id

  return (
    <Card className={`relative ${plan.popular ? "border-primary shadow-lg" : ""}`}>
      {plan.popular && <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">Most Popular</Badge>}
      {plan.savings && (
        <Badge variant="secondary" className="absolute -top-3 right-4">
          {plan.savings}
        </Badge>
      )}

      <CardHeader className="pb-4">
        <CardTitle className="text-2xl">{plan.name}</CardTitle>
        <CardDescription>{plan.description}</CardDescription>
        <div className="pt-4">
          <span className="text-4xl font-bold">{plan.price}</span>
          <span className="text-xl font-semibold text-muted-foreground"> π</span>
          {plan.type !== "one-time" && (
            <span className="text-sm text-muted-foreground">/{plan.type === "monthly" ? "month" : "year"}</span>
          )}
        </div>
      </CardHeader>

      <CardContent>
        <ul className="space-y-3">
          {plan.features.map((feature) => (
            <li key={feature.id} className="flex items-start gap-3">
              <Check className="h-5 w-5 shrink-0 text-primary mt-0.5" />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{feature.icon}</span>
                  <span className="font-medium">{feature.name}</span>
                </div>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>

      <CardFooter>
        <Button
          className="w-full"
          size="lg"
          onClick={() => onSelectPlan(plan)}
          disabled={disabled || isCurrentPlan}
          variant={plan.popular ? "default" : "outline"}
        >
          {isCurrentPlan ? "Current Plan" : isPremiumActive ? "Switch Plan" : "Get Started"}
        </Button>
      </CardFooter>
    </Card>
  )
}
