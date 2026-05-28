"use client"

import { useEffect, useState } from "react"
import { usePiAuth } from "@/contexts/pi-auth-context"
import { Button } from "@/components/ui/button"

export function AuthLoadingScreen() {
  const [mounted, setMounted] = useState(false)

useEffect(() => {
  setMounted(true)
}, [])

if (!mounted) return null
  const { authMessage, reinitialize } = usePiAuth()
  const isError = authMessage.toLowerCase().includes("failed")

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="flex justify-center">
          <div className="relative">
            <div className="w-24 h-24 rounded-full border-4 border-primary/20 flex items-center justify-center">
              <span className="text-4xl font-bold text-primary">π</span>
            </div>
            {!isError && (
              <div className="absolute inset-0 w-24 h-24 rounded-full border-4 border-primary border-t-transparent animate-spin" />
            )}
          </div>
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-bold">Social Hub Pi</h2>
          <p className={`text-sm ${isError ? "text-destructive font-medium" : "text-muted-foreground"}`}>
            {authMessage}
          </p>
        </div>

        {isError && (
          <Button onClick={reinitialize} className="w-full sm:w-auto">
            Try Again
          </Button>
        )}
      </div>
    </div>
  )
}
