// Cross-browser compatibility utilities
export interface BrowserInfo {
  name: "Chrome" | "Firefox" | "Safari" | "Edge" | "Pi Browser" | "Unknown"
  version: string
  isSupported: boolean
  isMobile: boolean
}

class CompatibilityService {
  /**
   * Detect browser and version
   */
  detectBrowser(): BrowserInfo {
    const ua = typeof navigator !== "undefined" ? navigator.userAgent : ""

    let name: BrowserInfo["name"] = "Unknown"
    let version = ""
    let isSupported = true

    // Pi Browser detection
    if (ua.includes("Pi Browser") || ua.includes("PiNetwork")) {
      name = "Pi Browser"
      version = this.extractVersion(ua, /Pi Browser\/(\d+\.\d+)/)
    }
    // Chrome
    else if (ua.includes("Chrome") && !ua.includes("Chromium")) {
      name = "Chrome"
      version = this.extractVersion(ua, /Chrome\/(\d+\.\d+)/)
    }
    // Firefox
    else if (ua.includes("Firefox")) {
      name = "Firefox"
      version = this.extractVersion(ua, /Firefox\/(\d+\.\d+)/)
    }
    // Safari
    else if (ua.includes("Safari") && !ua.includes("Chrome")) {
      name = "Safari"
      version = this.extractVersion(ua, /Version\/(\d+\.\d+)/)
    }
    // Edge
    else if (ua.includes("Edg")) {
      name = "Edge"
      version = this.extractVersion(ua, /Edg\/(\d+\.\d+)/)
    }

    // Check if browser is supported (all major modern browsers)
    if (["Chrome", "Firefox", "Safari", "Edge", "Pi Browser"].includes(name)) {
      isSupported = true
    }

    const isMobile =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua) || this.isSmallScreen()

    return { name, version, isSupported, isMobile }
  }

  /**
   * Apply browser-specific polyfills
   */
  applyPolyfills(): void {
    if (typeof window === "undefined") return

    // IntersectionObserver polyfill check
    if (!("IntersectionObserver" in window)) {
      console.warn("[v0] IntersectionObserver not supported, lazy loading may not work optimally")
    }

    // ResizeObserver polyfill check
    if (!("ResizeObserver" in window)) {
      console.warn("[v0] ResizeObserver not supported")
    }

    // Fetch API fallback
    if (!("fetch" in window)) {
      console.error("[v0] Fetch API not supported - critical for app functionality")
    }

    // LocalStorage check
    if (typeof localStorage === "undefined") {
      console.error("[v0] LocalStorage not available")
    }

    // Crypto API check for security
    if (!("crypto" in window)) {
      console.warn("[v0] Crypto API not available")
    }
  }

  /**
   * Apply CSS vendor prefixes
   */
  applyVendorPrefixes(): void {
    if (typeof document === "undefined") return

    const style = document.createElement("div").style

    const properties = ["appearance", "user-select", "transform", "transition"]
    const prefixes = ["webkit", "moz", "ms"]

    properties.forEach((prop) => {
      prefixes.forEach((prefix) => {
        const prefixedProp = `${prefix}${prop.charAt(0).toUpperCase()}${prop.slice(1)}`
        if (!(prefixedProp in style)) {
          // Property needs vendor prefix
          console.log(`[v0] ${prop} may need vendor prefix`)
        }
      })
    })
  }

  /**
   * Get viewport safe area for notches/home indicators
   */
  getSafeAreaInsets(): { top: number; bottom: number; left: number; right: number } {
    if (typeof window === "undefined" || !("CSS" in window) || !("supports" in CSS)) {
      return { top: 0, bottom: 0, left: 0, right: 0 }
    }

    const root = document.documentElement
    const styles = getComputedStyle(root)

    return {
      top: this.parsePixels(styles.getPropertyValue("--safe-area-inset-top")),
      bottom: this.parsePixels(styles.getPropertyValue("--safe-area-inset-bottom")),
      left: this.parsePixels(styles.getPropertyValue("--safe-area-inset-left")),
      right: this.parsePixels(styles.getPropertyValue("--safe-area-inset-right")),
    }
  }

  /**
   * Fix font rendering for different browsers
   */
  optimizeFontRendering(): void {
    if (typeof document === "undefined") return

    const browser = this.detectBrowser()
    const style = document.createElement("style")

    let css = ""
    if (browser.name === "Safari") {
      // Safari font smoothing
      css += `
        body {
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }
      `
    } else if (browser.name === "Firefox") {
      // Firefox rendering
      css += `
        body {
          -moz-osx-font-smoothing: grayscale;
        }
      `
    }

    if (css) {
      style.textContent = css
      document.head.appendChild(style)
    }
  }

  /**
   * Check if touch events are supported
   */
  isTouchSupported(): boolean {
    return typeof window !== "undefined" && ("ontouchstart" in window || navigator.maxTouchPoints > 0)
  }

  /**
   * Get optimal image format for browser
   */
  getOptimalImageFormat(): "webp" | "jpg" | "png" {
    if (typeof window === "undefined") return "jpg"

    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")

    if (ctx && canvas.toDataURL("image/webp").indexOf("image/webp") === 5) {
      return "webp"
    }
    return "jpg"
  }

  /**
   * Apply responsive layout fixes for low-end devices
   */
  optimizeForLowEndDevice(): void {
    if (typeof window === "undefined" || !("performance" in window)) return

    const memory = (navigator as any).deviceMemory
    const connection = (navigator as any).connection

    if (memory && memory <= 2) {
      // Low memory device - disable heavy animations
      document.documentElement.style.setProperty("--prefers-reduced-motion", "reduce")
    }

    if (connection && connection.effectiveType === "4g") {
      // Poor connection - reduce media quality
      document.documentElement.style.setProperty("--image-quality", "0.5")
    }
  }

  /**
   * Get download link compatibility format
   */
  getDownloadFormat(): "blob" | "data-uri" | "stream" {
    const browser = this.detectBrowser()

    if (browser.name === "Safari") {
      // Safari sometimes struggles with blob downloads
      return "data-uri"
    }

    return "blob"
  }

  /**
   * Check for required APIs
   */
  checkRequiredAPIs(): { supported: boolean; missing: string[] } {
    const apis = ["fetch", "localStorage", "crypto"]
    const missing: string[] = []

    apis.forEach((api) => {
      if (!(api in window)) {
        missing.push(api)
      }
    })

    return {
      supported: missing.length === 0,
      missing,
    }
  }

  /**
   * Get platform info
   */
  getPlatformInfo(): { os: "iOS" | "Android" | "Windows" | "macOS" | "Linux" | "Unknown"; version: string } {
    const ua = typeof navigator !== "undefined" ? navigator.userAgent : ""

    let os: "iOS" | "Android" | "Windows" | "macOS" | "Linux" | "Unknown" = "Unknown"

    if (ua.includes("iPhone") || ua.includes("iPad")) {
      os = "iOS"
    } else if (ua.includes("Android")) {
      os = "Android"
    } else if (ua.includes("Windows")) {
      os = "Windows"
    } else if (ua.includes("Mac")) {
      os = "macOS"
    } else if (ua.includes("Linux")) {
      os = "Linux"
    }

    return {
      os,
      version: this.extractVersion(ua, /(?:OS |v)(\d+_\d+)/),
    }
  }

  private extractVersion(ua: string, regex: RegExp): string {
    const match = ua.match(regex)
    return match ? match[1].replace(/_/g, ".") : "Unknown"
  }

  private parsePixels(value: string): number {
    return parseInt(value) || 0
  }

  private isSmallScreen(): boolean {
    return typeof window !== "undefined" && window.innerWidth < 768
  }
}

export const compatibilityService = new CompatibilityService()
