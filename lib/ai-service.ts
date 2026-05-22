// AI features service for caption generation, auto-reply, and smart recommendations
import type { Post } from "@/lib/types"

export interface AICaption {
  caption: string
  hashtags: string[]
  sentiment: "positive" | "neutral" | "negative"
}

export interface AutoReplyTemplate {
  id: string
  name: string
  template: string
  triggers: string[]
}

export interface ContentRecommendation {
  postId: string
  score: number
  reason: string
}

class AIService {
  private readonly SK = {
    CAPTION_HISTORY: "ai_caption_history",
    AUTO_REPLIES: "ai_auto_replies",
    RECOMMENDATIONS: "ai_recommendations",
  } as const

  // Default auto-reply templates
  private readonly DEFAULT_TEMPLATES: AutoReplyTemplate[] = [
    {
      id: "thank-you",
      name: "Thank You",
      template: "Thanks for reaching out! I appreciate it.",
      triggers: ["thanks", "ty", "thank"],
    },
    {
      id: "busy",
      name: "Busy Now",
      template: "I'm currently busy but will get back to you soon!",
      triggers: ["busy", "later", "when"],
    },
    {
      id: "availability",
      name: "Availability",
      template: "Feel free to message me anytime. Usually reply within 24h.",
      triggers: ["available", "time", "chat"],
    },
  ]

  /**
   * Generate AI caption with hashtags based on image/content
   */
  generateCaption(contentDescription: string, contentType: "image" | "video" = "image"): AICaption {
    // Simulate AI caption generation
    const captions: Record<string, AICaption> = {
      selfie:
        {
          caption:
            "Feeling good and ready to take on the day! Life is precious, enjoy every moment.",
          hashtags: ["#selflove", "#motivation", "#dayvibes", "#positivity"],
          sentiment: "positive",
        } ||
        selfie,
      nature: {
        caption: "Nature's beauty never gets old. Taking time to appreciate the simple things.",
        hashtags: ["#nature", "#outdoors", "#beautiful", "#peace"],
        sentiment: "positive",
      },
      food: {
        caption: "Can't resist this delicious moment. Sharing good food and better company.",
        hashtags: ["#foodie", "#yummy", "#foodporn", "#instafood"],
        sentiment: "positive",
      },
      travel: {
        caption: "Exploring new horizons and making unforgettable memories. Adventure awaits!",
        hashtags: ["#travel", "#wanderlust", "#adventure", "#explore"],
        sentiment: "positive",
      },
      achievement: {
        caption: "Proud of this milestone! Hard work and dedication always pay off.",
        hashtags: ["#achievement", "#success", "#motivated", "#blessed"],
        sentiment: "positive",
      },
    }

    const lowerDesc = contentDescription.toLowerCase()
    let caption = captions.achievement // default

    if (lowerDesc.includes("self") || lowerDesc.includes("me") || lowerDesc.includes("photo")) {
      caption = captions.selfie
    } else if (lowerDesc.includes("nature") || lowerDesc.includes("outdoor") || lowerDesc.includes("tree")) {
      caption = captions.nature
    } else if (lowerDesc.includes("food") || lowerDesc.includes("eat") || lowerDesc.includes("lunch")) {
      caption = captions.food
    } else if (lowerDesc.includes("travel") || lowerDesc.includes("trip") || lowerDesc.includes("place")) {
      caption = captions.travel
    }

    // Save to history
    this.saveCaptionHistory(caption)

    return caption
  }

  /**
   * Get AI-suggested replies to comments
   */
  getAutoReplyOptions(comment: string, userContext?: string): string[] {
    const suggestions = [
      "Thanks for the comment! Really appreciate it.",
      "Love this perspective, thanks for sharing!",
      "Couldn't agree more! Great point.",
      "Thanks! Feel free to follow for more content like this.",
      "Totally agree! What's your take on...?",
    ]

    return suggestions.slice(0, 3)
  }

  /**
   * Get saved auto-reply templates
   */
  getAutoReplyTemplates(): AutoReplyTemplate[] {
    try {
      const saved = JSON.parse(localStorage.getItem(this.SK.AUTO_REPLIES) || "[]")
      return saved.length > 0 ? saved : this.DEFAULT_TEMPLATES
    } catch {
      return this.DEFAULT_TEMPLATES
    }
  }

  /**
   * Save custom auto-reply template
   */
  saveAutoReplyTemplate(template: AutoReplyTemplate): void {
    try {
      const templates = this.getAutoReplyTemplates()
      const existing = templates.findIndex((t) => t.id === template.id)
      if (existing >= 0) {
        templates[existing] = template
      } else {
        templates.push(template)
      }
      localStorage.setItem(this.SK.AUTO_REPLIES, JSON.stringify(templates))
    } catch {
      console.error("[v0] Failed to save auto-reply template")
    }
  }

  /**
   * Get smart content recommendations based on user engagement
   */
  getSmartRecommendations(userEngagementHistory: string[], allPosts: Post[]): ContentRecommendation[] {
    // Score posts based on user interest patterns
    const recommendations: ContentRecommendation[] = []

    allPosts.forEach((post) => {
      let score = 0
      let reason = ""

      // Check hashtag relevance
      if (post.hashtags) {
        const matches = post.hashtags.filter((tag) =>
          userEngagementHistory.some((interest) => tag.includes(interest)),
        )
        score += matches.length * 2
      }

      // Check creator - recent follows get boost
      if (userEngagementHistory.includes(post.username)) {
        score += 3
        reason = "From creators you follow"
      }

      // Trending content boost
      if (post.likes > 100) {
        score += 2
        reason = reason || "Trending in your community"
      }

      // Recent content boost
      if (post.createdAt) {
        const daysSinceCreation = Math.floor(
          (Date.now() - new Date(post.createdAt).getTime()) / (1000 * 60 * 60 * 24),
        )
        if (daysSinceCreation < 1) score += 2
      }

      if (score > 0) {
        recommendations.push({
          postId: post.id,
          score,
          reason: reason || "Based on your interests",
        })
      }
    })

    return recommendations.sort((a, b) => b.score - a.score).slice(0, 10)
  }

  /**
   * Analyze content sentiment
   */
  analyzeSentiment(text: string): "positive" | "neutral" | "negative" {
    const positive = /great|awesome|amazing|love|wonderful|excellent|fantastic|best/i
    const negative = /bad|hate|terrible|awful|worst|horrible|disgusting/i

    if (negative.test(text)) return "negative"
    if (positive.test(text)) return "positive"
    return "neutral"
  }

  /**
   * Get caption generation history
   */
  getCaptionHistory(): AICaption[] {
    try {
      return JSON.parse(localStorage.getItem(this.SK.CAPTION_HISTORY) || "[]")
    } catch {
      return []
    }
  }

  private saveCaptionHistory(caption: AICaption): void {
    try {
      const history = this.getCaptionHistory()
      history.unshift({ ...caption, createdAt: new Date().toISOString() } as any)
      history.splice(50) // Keep only last 50
      localStorage.setItem(this.SK.CAPTION_HISTORY, JSON.stringify(history))
    } catch {
      console.error("[v0] Failed to save caption history")
    }
  }
}

export const aiService = new AIService()
