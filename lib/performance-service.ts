// Performance optimization utilities for lazy loading, image compression, and caching
export interface CacheEntry<T> {
  data: T
  timestamp: number
  expiresIn?: number
}

interface NavigatorWithDeviceMemory extends Navigator {
  deviceMemory?: number
}

interface LargestContentfulPaintEntry extends PerformanceEntry {
  renderTime?: number
  loadTime?: number
}

interface FirstInputPerformanceEntry extends PerformanceEntry {
  processingDuration?: number
}

interface LayoutShiftPerformanceEntry extends PerformanceEntry {
  hadRecentInput?: boolean
  value?: number
}

class PerformanceService {
  private readonly SK = {
    CACHE: "perf_cache",
    IMAGE_CACHE: "perf_image_cache",
  } as const

  private readonly CACHE_DURATIONS = {
    SHORT: 5 * 60 * 1000, // 5 minutes
    MEDIUM: 30 * 60 * 1000, // 30 minutes
    LONG: 24 * 60 * 60 * 1000, // 24 hours
  } as const

  /**
   * Lazy load images with intersection observer
   */
  lazyLoadImages(containerSelector?: string): void {
    if (typeof window === "undefined") return

    const selector = containerSelector || "img[data-lazy]"
    const images = document.querySelectorAll(selector) as NodeListOf<HTMLImageElement>

    if ("IntersectionObserver" in window) {
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement
            const lazySrc = img.dataset.lazy
            if (lazySrc) {
              img.src = lazySrc
              img.removeAttribute("data-lazy")
              imageObserver.unobserve(img)
            }
          }
        })
      })

      images.forEach((img) => imageObserver.observe(img))
    } else {
      // Fallback for older browsers
      images.forEach((img) => {
        const lazySrc = img.dataset.lazy
        if (lazySrc) {
          img.src = lazySrc
        }
      })
    }
  }

  /**
   * Compress image before upload
   */
  async compressImage(file: File, maxWidth: number = 1200, quality: number = 0.7): Promise<Blob> {
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.onload = (event) => {
        const img = new Image()
        img.onload = () => {
          const canvas = document.createElement("canvas")
          let width = img.width
          let height = img.height

          // Resize if needed
          if (width > maxWidth) {
            height = Math.floor((height * maxWidth) / width)
            width = maxWidth
          }

          canvas.width = width
          canvas.height = height
          const ctx = canvas.getContext("2d")
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height)
          }

          canvas.toBlob(
            (blob) => {
              resolve(blob || file)
            },
            file.type,
            quality,
          )
        }
        img.src = event.target?.result as string
      }
      reader.readAsDataURL(file)
    })
  }

  /**
   * Generate thumbnail from image
   */
  async generateThumbnail(file: File, size: number = 300): Promise<Blob> {
    return this.compressImage(file, size, 0.5)
  }

  /**
   * Cache data with TTL
   */
  cacheData<T>(key: string, data: T, duration: "SHORT" | "MEDIUM" | "LONG" = "MEDIUM"): void {
    try {
      const cache = this.getCache()
      cache[key] = {
        data,
        timestamp: Date.now(),
        expiresIn: this.CACHE_DURATIONS[duration],
      }
      localStorage.setItem(this.SK.CACHE, JSON.stringify(cache))
    } catch {
      console.error("[v0] Failed to cache data")
    }
  }

  /**
   * Retrieve cached data if not expired
   */
  getCachedData<T>(key: string): T | null {
    try {
      const cache = this.getCache()
      const entry = cache[key] as CacheEntry<T> | undefined

      if (!entry) return null

      // Check if expired
      if (entry.expiresIn && Date.now() - entry.timestamp > entry.expiresIn) {
        delete cache[key]
        localStorage.setItem(this.SK.CACHE, JSON.stringify(cache))
        return null
      }

      return entry.data
    } catch {
      return null
    }
  }

  /**
   * Clear expired cache entries
   */
  clearExpiredCache(): void {
    try {
      const cache = this.getCache()
      const now = Date.now()
      let cleaned = false

      Object.keys(cache).forEach((key) => {
        const entry = cache[key] as CacheEntry<unknown>
        if (entry.expiresIn && now - entry.timestamp > entry.expiresIn) {
          delete cache[key]
          cleaned = true
        }
      })

      if (cleaned) {
        localStorage.setItem(this.SK.CACHE, JSON.stringify(cache))
      }
    } catch {
      console.error("[v0] Failed to clear cache")
    }
  }

  /**
   * Optimize CSS for low-end devices
   */
  optimizeForLowEndDevice(): void {
    if (typeof window === "undefined") return

    // Check available memory
    const memory = (navigator as NavigatorWithDeviceMemory).deviceMemory
    if (memory && memory <= 2) {
      // Reduce animations, disable transitions
      document.documentElement.style.setProperty("--transition-speed", "0s")
      document.querySelectorAll("[class*='animate']").forEach((el) => {
        ;(el as HTMLElement).style.animation = "none"
      })
    }
  }

  /**
   * Defer non-critical JavaScript
   */
  deferScript(src: string, delay: number = 2000): void {
    if (typeof window === "undefined") return

    setTimeout(() => {
      const script = document.createElement("script")
      script.src = src
      script.async = true
      document.body.appendChild(script)
    }, delay)
  }

  /**
   * Enable resource hints for better performance
   */
  addResourceHints(): void {
    if (typeof document === "undefined") return

    const hints = [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com" },
      { rel: "dns-prefetch", href: "https://cdn.example.com" },
    ]

    hints.forEach((hint) => {
      const link = document.createElement("link")
      link.rel = hint.rel
      link.href = hint.href
      if (hint.rel === "preconnect") {
        link.crossOrigin = "anonymous"
      }
      document.head.appendChild(link)
    })
  }

  /**
   * Measure Core Web Vitals
   */
  measureWebVitals(): void {
    if (typeof window === "undefined" || !("PerformanceObserver" in window)) return

    try {
      // Largest Contentful Paint
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        const lastEntry = entries[entries.length - 1] as LargestContentfulPaintEntry
        console.log("[v0] LCP:", lastEntry.renderTime || lastEntry.loadTime)
      })
      lcpObserver.observe({ entryTypes: ["largest-contentful-paint"] })

      // First Input Delay
      const fidObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          console.log("[v0] FID:", (entry as FirstInputPerformanceEntry).processingDuration)
        })
      })
      fidObserver.observe({ entryTypes: ["first-input"] })

      // Cumulative Layout Shift
      let cls = 0
      const clsObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          const layoutEntry = entry as LayoutShiftPerformanceEntry
          if (!layoutEntry.hadRecentInput) {
            cls += layoutEntry.value || 0
            console.log("[v0] CLS:", cls)
          }
        })
      })
      clsObserver.observe({ entryTypes: ["layout-shift"] })
    } catch {
      console.error("[v0] Failed to measure Web Vitals")
    }
  }

  private getCache(): Record<string, CacheEntry<unknown>> {
    try {
      return JSON.parse(localStorage.getItem(this.SK.CACHE) || "{}")
    } catch {
      return {}
    }
  }
}

export const performanceService = new PerformanceService()
