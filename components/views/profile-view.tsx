"use client"

import { usePiAuth } from "@/contexts/pi-auth-context"
import { Profile } from "@/components/profile"

export function ProfileView() {
  const { userData } = usePiAuth()

  return (
    <div className="container mx-auto px-0 max-w-2xl">
      <Profile username={userData?.username || "Pioneer"} userId={userData?.id || "1"} />
    </div>
  )
}
