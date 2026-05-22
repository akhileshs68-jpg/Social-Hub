"use client"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  // Prevent hydration mismatch by only rendering after mount
  useEffect(() => {
    setMounted(true)
  }, [])

  // Fail-safe: render placeholder if theme provider fails
  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" className="w-9 h-9 rounded-full" aria-label="Toggle theme" disabled>
        <Sun className="w-4 h-4" />
      </Button>
    )
  }

  const isDark = theme === "dark"

  const toggleTheme = () => {
    try {
      setTheme(isDark ? "light" : "dark")
    } catch (error) {
      console.error("[v0] Theme toggle failed:", error)
      // UI continues to function even if theme toggle fails
    }
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className={cn("w-9 h-9 rounded-full transition-all", "hover:bg-accent hover:text-accent-foreground")}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDark ? <Sun className="w-4 h-4 transition-transform" /> : <Moon className="w-4 h-4 transition-transform" />}
    </Button>
  )
}
