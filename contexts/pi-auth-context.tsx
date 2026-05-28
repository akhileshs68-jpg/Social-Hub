"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { PI_NETWORK_CONFIG, BACKEND_URLS } from "@/lib/system-config"
import { api, setApiAuthToken } from "@/lib/api"
import { saveUserProfile } from "@/lib/firebase-social-service"
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
  user: User | null
  updateUserProfile: (updates: Partial<User>) => Promise<void>
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

type BackendLoginResponse = Partial<LoginDTO> & {
  token?: string
  accessToken?: string
  data?: LoginDTO
  user?: Partial<LoginDTO> & { uid?: string }
}

type LoginSource = Partial<LoginDTO> & { uid?: string }

const DEMO_AUTH_ENABLED = process.env.NEXT_PUBLIC_ENABLE_DEMO_AUTH !== "false"

const createDemoAuthResult = (): PiAuthResult => ({
  accessToken: "demo-pi-access-token",
  user: {
    uid: "demo-pioneer-uid",
    username: "demo_pioneer",
  },
})

const normalizeLoginData = (response: BackendLoginResponse, piAuthResult: PiAuthResult): LoginDTO => {
  const source: LoginSource =
    "data" in response && response.data ? response.data : "user" in response && response.user ? response.user : response

  return {
    id: String(source.id || piAuthResult.user.uid),
    username: String(source.username || piAuthResult.user.username),
    credits_balance: Number(source.credits_balance || 0),
    terms_accepted: Boolean(source.terms_accepted ?? true),
  }
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
      resolve()
    }

    script.onerror = () => {
      reject(new Error("Failed to load Pi SDK script"))
    }

    document.head.appendChild(script)
  })
}

export function PiAuthProvider({ children }: { children: ReactNode }) {
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
      displayName: piAuthResult.user.username,
      piUid: piAuthResult.user.uid,
      avatar: piAuthResult.user.username[0]?.toUpperCase() || "P",
      photoURL: "",
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
    saveUserProfile(profile).catch((error) => {
      console.error("[socialhub] Failed to save user profile:", error)
    })

    return profile
  }

  const authenticateAndLogin = async (): Promise<void> => {
    setAuthMessage("Authenticating with Pi Network...")
    const piAuthResult =
      typeof window.Pi !== "undefined" ? await window.Pi.authenticate(["username", "payments"]) : createDemoAuthResult()

    setAuthMessage("Logging in to backend...")
    let loginData: LoginDTO
    let backendToken: string | undefined

    try {
      const loginRes = await api.post<BackendLoginResponse>(BACKEND_URLS.LOGIN, {
        accessToken: piAuthResult.accessToken,
        uid: piAuthResult.user.uid,
        username: piAuthResult.user.username,
      })

      loginData = normalizeLoginData(loginRes.data, piAuthResult)
      backendToken =
        "token" in loginRes.data
          ? loginRes.data.token
          : "accessToken" in loginRes.data
            ? loginRes.data.accessToken
            : undefined
    } catch (error) {
      if (!DEMO_AUTH_ENABLED) {
        throw error
      }

      loginData = normalizeLoginData(
        {
          id: piAuthResult.user.uid,
          username: piAuthResult.user.username,
          credits_balance: 0,
          terms_accepted: true,
        },
        piAuthResult,
      )
    }

    const sessionToken = backendToken || piAuthResult.accessToken
    setPiAccessToken(sessionToken)
    setApiAuthToken(sessionToken)
    sessionStorage.setItem(SESSION_KEYS.ACCESS_TOKEN, sessionToken)

    setUserData(loginData)
    sessionStorage.setItem(SESSION_KEYS.USER_DATA, JSON.stringify(loginData))

    setAuthMessage("Creating user profile...")
    createUserProfile(piAuthResult, loginData)
  }

  const initializePiAndAuthenticate = async () => {
    try {
      setAuthMessage("Loading Pi Network SDK...")

      if (typeof window.Pi === "undefined" && !DEMO_AUTH_ENABLED) {
        await loadPiSDK()
      }

      if (typeof window.Pi === "undefined" && DEMO_AUTH_ENABLED) {
        setAuthMessage("Pi SDK unavailable. Starting secure demo session...")
      } else if (typeof window.Pi === "undefined") {
        throw new Error("Pi object not available after script load")
      }

      if (typeof window.Pi !== "undefined") {
        setAuthMessage("Initializing Pi Network...")
        await window.Pi.init({
          version: "2.0",
          sandbox: PI_NETWORK_CONFIG.SANDBOX,
        })
      }

      await authenticateAndLogin()

      setIsAuthenticated(true)
      setAuthMessage("Authentication complete")
    } catch (err) {
      setAuthMessage("Failed to authenticate or login. Please refresh and try again.")
    }
  }

  const logout = () => {
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

  const updateUserProfile = async (updates: Partial<User>) => {
    let nextProfile: User | null = null

    setUserProfile((currentProfile) => {
      if (!currentProfile) return currentProfile

      nextProfile = { ...currentProfile, ...updates }
      sessionStorage.setItem(SESSION_KEYS.USER_PROFILE, JSON.stringify(nextProfile))
      return nextProfile
    })

    if (nextProfile) {
      await saveUserProfile(nextProfile)
    }
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
    user: userProfile,
    updateUserProfile,
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
