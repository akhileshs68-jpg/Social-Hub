"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { PI_NETWORK_CONFIG, BACKEND_URLS } from "@/lib/system-config"
import { api, setApiAuthToken } from "@/lib/api"
import type { User } from "@/lib/types"

export type LoginDTO = {
  id: string
  username: string
  credits_balance: number
  terms_accepted: boolean
}

interface PiAuthResult {
  accessToken: string
  user: {
    uid: string
    username: string
  }
}

declare global {
  interface Window {
    Pi: {
      init: (config: { version: string; sandbox?: boolean }) => Promise<void>
      authenticate: (scopes: string[]) => Promise<PiAuthResult>
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

interface PiAuthContextType {
  isAuthenticated: boolean
  authMessage: string
  piAccessToken: string | null
  userData: LoginDTO | null
  userProfile: User | null
  logout: () => void
  reinitialize: () => Promise<void>
}

const PiAuthContext = createContext<PiAuthContextType | undefined>(undefined)

const SESSION_KEYS = {
  ACCESS_TOKEN: "pi_access_token",
  USER_DATA: "pi_user_data",
  USER_PROFILE: "pi_user_profile",
  LOGIN_TIMESTAMP: "pi_login_timestamp",
}

const loadPiSDK = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    const script = document.createElement("script")
    if (!PI_NETWORK_CONFIG.SDK_URL) {
      throw new Error("SDK URL is not set")
    }
    script.src = PI_NETWORK_CONFIG.SDK_URL
    script.async = true

    script.onload = () => {
      console.log("✅ Pi SDK script loaded successfully")
      resolve()
    }

    script.onerror = () => {
      console.error("❌ Failed to load Pi SDK script")
      reject(new Error("Failed to load Pi SDK script"))
    }

    document.head.appendChild(script)
  })
}

export function PiAuthProvider({ children }: { children: ReactNode }) {
  return <>{children}</>
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [authMessage, setAuthMessage] = useState("Initializing Pi Network...")
  const [piAccessToken, setPiAccessToken] = useState<string | null>(null)
  const [userData, setUserData] = useState<LoginDTO | null>(null)
  const [userProfile, setUserProfile] = useState<User | null>(null)

  useEffect(() => {
    const savedToken = sessionStorage.getItem(SESSION_KEYS.ACCESS_TOKEN)
    const savedUserData = sessionStorage.getItem(SESSION_KEYS.USER_DATA)
    const savedProfile = sessionStorage.getItem(SESSION_KEYS.USER_PROFILE)

    if (savedToken && savedUserData && savedProfile) {
      setPiAccessToken(savedToken)
      setApiAuthToken(savedToken)
      setUserData(JSON.parse(savedUserData))
      setUserProfile(JSON.parse(savedProfile))
      setIsAuthenticated(true)
      setAuthMessage("Session restored")
    }
  }, [])

  const createUserProfile = (piAuthResult: PiAuthResult, loginData: LoginDTO): User => {
    const loginTimestamp = new Date().toISOString()
    sessionStorage.setItem(SESSION_KEYS.LOGIN_TIMESTAMP, loginTimestamp)

    const profile: User = {
      id: loginData.id,
      username: piAuthResult.user.username,
      piUid: piAuthResult.user.uid,
      avatar: piAuthResult.user.username[0]?.toUpperCase() || "P",
      bio: `Pi Network Pioneer | Joined ${new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })}`,
      followers: 0,
      following: 0,
      joinedDate: loginTimestamp,
      loginTimestamp,
      location: "Pi Network",
      website: "pi-network.com",
    }

    sessionStorage.setItem(SESSION_KEYS.USER_PROFILE, JSON.stringify(profile))
    setUserProfile(profile)

    return profile
  }

  const authenticateAndLogin = async (): Promise<void> => {
<<<<<<< HEAD
    const isLocalhost =
  typeof window !== "undefined" &&
  window.location.hostname === "localhost"

if (isLocalhost) {
  const mockUser = {
    id: "demo-user",
    username: "demo_user",
    piUid: "demo_pi_uid",
    avatar: "D",
    bio: "Demo Local User",
    followers: 0,
    following: 0,
    joinedDate: new Date().toISOString(),
    loginTimestamp: new Date().toISOString(),
    location: "Localhost",
    website: "localhost"
  }

  setUserProfile(mockUser)
  setAuthMessage("Local development mode")
  setIsAuthenticated(true)
 

  return
}
=======
>>>>>>> 82bc3ca8b44839ba49ec0fc525fcb6c408caf7eb
    setAuthMessage("Authenticating with Pi Network...")
    const piAuthResult = await window.Pi.authenticate(["username", "payments"])

    console.log("[v0] Pi authentication successful:", {
      uid: piAuthResult.user.uid,
      username: piAuthResult.user.username,
    })

    setAuthMessage("Logging in to backend...")
    const loginRes = await api.post<LoginDTO>(BACKEND_URLS.LOGIN, {
      pi_auth_token: piAuthResult.accessToken,
    })

    console.log("[v0] Backend login successful:", loginRes.data)

    if (piAuthResult?.accessToken) {
      setPiAccessToken(piAuthResult.accessToken)
      setApiAuthToken(piAuthResult.accessToken)
      sessionStorage.setItem(SESSION_KEYS.ACCESS_TOKEN, piAuthResult.accessToken)
    }

    setUserData(loginRes.data)
    sessionStorage.setItem(SESSION_KEYS.USER_DATA, JSON.stringify(loginRes.data))

    setAuthMessage("Creating user profile...")
    createUserProfile(piAuthResult, loginRes.data)
  }

  const initializePiAndAuthenticate = async () => {
    try {
      setAuthMessage("Loading Pi Network SDK...")

      // Only load if not already loaded
      if (typeof window.Pi === "undefined") {
        await loadPiSDK()
      }

      if (typeof window.Pi === "undefined") {
        throw new Error("Pi object not available after script load")
      }

      setAuthMessage("Initializing Pi Network...")
      await window.Pi.init({
        version: "2.0",
        sandbox: PI_NETWORK_CONFIG.SANDBOX,
      })

      await authenticateAndLogin()

      setIsAuthenticated(true)
      setAuthMessage("Authentication complete")
    } catch (err) {
      console.error("❌ Pi Network initialization failed:", err)
      setAuthMessage("Failed to authenticate or login. Please refresh and try again.")
    }
  }

  const logout = () => {
    console.log("[v0] Logging out user")

    // Clear all session data
    sessionStorage.removeItem(SESSION_KEYS.ACCESS_TOKEN)
    sessionStorage.removeItem(SESSION_KEYS.USER_DATA)
    sessionStorage.removeItem(SESSION_KEYS.USER_PROFILE)
    sessionStorage.removeItem(SESSION_KEYS.LOGIN_TIMESTAMP)

    // Reset state
    setPiAccessToken(null)
    setUserData(null)
    setUserProfile(null)
    setIsAuthenticated(false)
    setApiAuthToken("")
    setAuthMessage("Logged out")

    // Reinitialize
    setTimeout(() => {
      initializePiAndAuthenticate()
    }, 500)
  }

  useEffect(() => {
    // Only initialize if no session exists
    if (!sessionStorage.getItem(SESSION_KEYS.ACCESS_TOKEN)) {
      initializePiAndAuthenticate()
    }
  }, [])

  const value: PiAuthContextType = {
    isAuthenticated,
    authMessage,
    piAccessToken,
    userData,
    userProfile,
    logout,
    reinitialize: initializePiAndAuthenticate,
  }

  return <PiAuthContext.Provider value={value}>{children}</PiAuthContext.Provider>
}

/**
 * Hook to access Pi Network authentication state and user data
 *
 * Must be used within a component wrapped by PiAuthProvider.
 * Provides read-only access to authentication state and user data.
 *
 * @returns {PiAuthContextType} Authentication state and methods
 * @throws {Error} If used outside of PiAuthProvider
 *
 * @example
 * const { piAccessToken, userData, userProfile, isAuthenticated, logout, reinitialize } = usePiAuth();
 */
export function usePiAuth() {
  const context = useContext(PiAuthContext)
  if (context === undefined) {
    throw new Error("usePiAuth must be used within a PiAuthProvider")
  }
  return context
}
