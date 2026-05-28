// Security service for blocking, reporting, and user safety
export interface BlockedUser {
  username: string
  blockedAt: string
  reason?: string
}

export interface Report {
  id: string
  reportedUser: string
  reporterUser: string
  reason: "spam" | "harassment" | "inappropriate" | "scam" | "other"
  description: string
  postId?: string
  timestamp: string
  status: "pending" | "reviewed" | "resolved"
}

class SecurityService {
  private readonly SK = {
    BLOCKED_USERS: "security_blocked_users",
    REPORTED_USERS: "security_reported_users",
    USER_WARNINGS: "security_user_warnings",
  } as const

  /**
   * Block a user
   */
  blockUser(userId: string, blockedUsername: string, reason?: string): void {
    try {
      const blocked = this.getBlockedUsers(userId)
      if (!blocked.some((b) => b.username === blockedUsername)) {
        blocked.push({
          username: blockedUsername,
          blockedAt: new Date().toISOString(),
          reason,
        })
        localStorage.setItem(`${this.SK.BLOCKED_USERS}_${userId}`, JSON.stringify(blocked))
      }
    } catch {
      console.error("[v0] Failed to block user")
    }
  }

  /**
   * Unblock a user
   */
  unblockUser(userId: string, blockedUsername: string): void {
    try {
      const blocked = this.getBlockedUsers(userId)
      const filtered = blocked.filter((b) => b.username !== blockedUsername)
      localStorage.setItem(`${this.SK.BLOCKED_USERS}_${userId}`, JSON.stringify(filtered))
    } catch {
      console.error("[v0] Failed to unblock user")
    }
  }

  /**
   * Get blocked users list
   */
  getBlockedUsers(userId: string): BlockedUser[] {
    try {
      return JSON.parse(localStorage.getItem(`${this.SK.BLOCKED_USERS}_${userId}`) || "[]")
    } catch {
      return []
    }
  }

  /**
   * Check if user is blocked
   */
  isUserBlocked(userId: string, targetUsername: string): boolean {
    const blocked = this.getBlockedUsers(userId)
    return blocked.some((b) => b.username === targetUsername)
  }

  /**
   * Report a user
   */
  reportUser(
    reporterUser: string,
    reportedUser: string,
    reason: "spam" | "harassment" | "inappropriate" | "scam" | "other",
    description: string,
    postId?: string,
  ): Report {
    try {
      const reports = this.getAllReports()
      const report: Report = {
        id: `report_${Date.now()}_${Math.random()}`,
        reportedUser,
        reporterUser,
        reason,
        description,
        postId,
        timestamp: new Date().toISOString(),
        status: "pending",
      }
      reports.push(report)
      localStorage.setItem(this.SK.REPORTED_USERS, JSON.stringify(reports))
      return report
    } catch {
      console.error("[v0] Failed to submit report")
      throw new Error("Failed to submit report")
    }
  }

  /**
   * Get reports for a specific user
   */
  getUserReports(username: string): Report[] {
    try {
      const reports = this.getAllReports()
      return reports.filter((r) => r.reportedUser === username)
    } catch {
      return []
    }
  }

  /**
   * Check if user has multiple reports (potential violation)
   */
  hasUserViolations(username: string): boolean {
    const reports = this.getUserReports(username)
    const recentReports = reports.filter((r) => {
      const daysSince = Math.floor((Date.now() - new Date(r.timestamp).getTime()) / (1000 * 60 * 60 * 24))
      return daysSince < 30
    })
    return recentReports.length >= 3
  }

  /**
   * Add warning to user
   */
  addUserWarning(username: string, reason: string, severity: "low" | "medium" | "high"): void {
    try {
      const warnings = this.getUserWarnings(username)
      warnings.push({
        reason,
        severity,
        addedAt: new Date().toISOString(),
      })

      // Check if too many warnings
      const recentWarnings = warnings.filter((w) => {
        const daysSince = Math.floor((Date.now() - new Date(w.addedAt).getTime()) / (1000 * 60 * 60 * 24))
        return daysSince < 30
      })

      if (recentWarnings.length >= 5) {
        console.log(`[v0] User ${username} flagged for potential suspension`)
      }

      localStorage.setItem(`${this.SK.USER_WARNINGS}_${username}`, JSON.stringify(warnings))
    } catch {
      console.error("[v0] Failed to add warning")
    }
  }

  /**
   * Get user warnings
   */
  getUserWarnings(username: string): any[] {
    try {
      return JSON.parse(localStorage.getItem(`${this.SK.USER_WARNINGS}_${username}`) || "[]")
    } catch {
      return []
    }
  }

  /**
   * Verify user account ownership (simulated)
   */
  verifyUserOwnership(userId: string, credentials: { password?: string; twoFactor?: string }): boolean {
    // In production, this would verify against backend
    // For now, just validate basic security requirements
    if (credentials.password && credentials.password.length < 8) {
      return false
    }
    return true
  }

  /**
   * Check content moderation flag
   */
  shouldFlagContent(content: string, mediaUrls?: string[]): boolean {
    const suspiciousKeywords = /illegal|violence|hate|exploit|abuse/i
    if (suspiciousKeywords.test(content)) {
      return true
    }

    // Could add image scanning here in production
    return false
  }

  private getAllReports(): Report[] {
    try {
      return JSON.parse(localStorage.getItem(this.SK.REPORTED_USERS) || "[]")
    } catch {
      return []
    }
  }
}

export const securityService = new SecurityService()
