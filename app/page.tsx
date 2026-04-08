"use client"

import { useState, useEffect } from "react"
// FLUX.2 image editing via /api/demo/edit-image
import {
  ArrowRight,
  BarChart3,
  Calendar,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Globe,
  Heart,
  Image as ImageIcon,
  Lightbulb,
  Link2,
  Loader2,
  MessageSquare,
  Palette,
  RefreshCw,
  Share2,
  Sparkles,
  TrendingUp,
  Video,
  X as XIcon,
  Zap,
} from "lucide-react"

// ─── Demo Data ───────────────────────────────────────────────────────

const BRAND = {
  name: "Grown Diamond Corporation",
  url: "www.growndiamondcorp.com",
  logo: "/demo/image1.png",
  industry: "Luxury Lab-Grown Diamonds",
  colors: { primary: "#1a1a2e", secondary: "#c9a84c", accent: "#e8d5b7" },
  voice: "Premium, confident, aspirational. Speaks to discerning buyers who value craftsmanship and innovation. Luxury without pretension.",
  fonts: { primary: "Playfair Display", secondary: "Inter" },
  keywords: ["lab-grown diamonds", "sustainable luxury", "precision cut", "ethical diamonds", "engagement rings"],
}

const PLATFORMS = [
  { id: "instagram", name: "Instagram", icon: "IG", color: "from-pink-500 to-purple-600", followers: "24.8K", posts: 342 },
  { id: "tiktok", name: "TikTok", icon: "TT", color: "from-gray-900 to-gray-700", followers: "12.1K", posts: 89 },
  { id: "linkedin", name: "LinkedIn", icon: "in", color: "from-blue-600 to-blue-800", followers: "8.4K", posts: 156 },
  { id: "x", name: "X", icon: "X", color: "from-gray-800 to-black", followers: "5.2K", posts: 421 },
  { id: "facebook", name: "Facebook", icon: "fb", color: "from-blue-500 to-blue-700", followers: "15.6K", posts: 203 },
  { id: "blog", name: "Blog", icon: "B", color: "from-orange-500 to-red-600", followers: "—", posts: 47 },
  { id: "email", name: "Email", icon: "@", color: "from-emerald-600 to-teal-700", followers: "18.2K", posts: 124 },
]

const GENERATED_CONTENT: Record<string, any> = {
  instagram: {
    type: "Reel",
    image: "/demo/image1.png",
    video: "/demo/video1.mp4",
    caption: "A Fire So Intense, It's the Only Statement You Need. Our precision-cut lab-grown diamonds capture light like no other. Every facet engineered for brilliance that turns heads.",
    hashtags: "#LabGrownDiamonds #SustainableLuxury #DiamondRing #EngagementRing #LuxuryJewelry #GrownDiamond #EthicalDiamonds #PrecisionCut #FineJewelry #ModernLuxury",
  },
  tiktok: {
    type: "Short Video",
    image: "/demo/image2.png",
    video: "/demo/video2.mp4",
    caption: "POV: You just found out lab-grown diamonds are identical to mined diamonds but cost 40% less. The brilliance? Unmatched.",
    hashtags: "#labgrowndiamonds #diamonds #engagement #luxury #diamondring #fyp #viral",
  },
  linkedin: {
    type: "Text Post",
    image: "/demo/aimage3.png",
    text: "The future of luxury is lab-grown.\n\nAt Grown Diamond Corporation, we've spent years perfecting the art of creating diamonds that are optically, chemically, and physically identical to mined stones.\n\nThe difference?\n- 40% lower cost for consumers\n- Zero mining environmental impact\n- Every facet cut with AI-guided precision\n- Full traceability from seed to setting\n\nThe luxury industry is evolving. The question isn't whether lab-grown diamonds will dominate — it's when.\n\nWhat's your take on sustainable luxury?",
  },
  x: {
    type: "Tweet",
    image: null,
    text: 'Lab-grown diamonds aren\'t "fake." They\'re the same carbon crystal structure, same hardness, same fire.\n\nThe only difference? No mining. No conflict. 40% less cost.\n\nThe future of luxury is sustainable. And it\'s already here.',
  },
  facebook: {
    type: "Image Post",
    image: "/demo/image2.png",
    caption: "When the Eyes Recognize Perfection. True brilliance leaves no room for doubt. Discover the precision behind every Grown Diamond.",
    hashtags: "#LabGrownDiamonds #SustainableLuxury #PrecisionCraft",
  },
  blog: {
    type: "Blog Post",
    image: "/demo/aimage6.png",
    text: "Why Lab-Grown Diamonds Are the Future of Luxury\n\nThe diamond industry is undergoing a revolution. For decades, the narrative was simple: diamonds come from the earth, and that's what makes them precious. But science has changed the game.\n\nAt Grown Diamond Corporation, we create diamonds that are optically, chemically, and physically identical to mined stones. The difference? Our process eliminates the environmental devastation of mining, removes the ethical concerns of conflict diamonds, and passes a 40% cost savings directly to consumers.\n\nThe Science Behind the Sparkle\n\nUsing Chemical Vapor Deposition (CVD), we recreate the exact conditions that form diamonds deep within the earth — but in a controlled laboratory. The result is a gem with the same carbon crystal structure, the same hardness (10 on the Mohs scale), and the same fire and brilliance.\n\nEvery facet is cut with AI-guided precision, ensuring each stone achieves maximum light performance. Our master gemologists then inspect every diamond by hand.\n\nThe Numbers Don't Lie\n\n• 40% lower cost than equivalent mined diamonds\n• Zero mining environmental impact\n• Full traceability from seed crystal to finished setting\n• Identical GIA certification standards\n\nThe luxury industry is evolving. Consumers are demanding transparency, sustainability, and value — without compromising on beauty. Lab-grown diamonds deliver on all three.\n\nThe question isn't whether lab-grown diamonds will become the standard. It's when.",
  },
  email: {
    type: "Newsletter",
    image: "/demo/aimage8.png",
    text: "Subject: The Diamond That Changes Everything\n\nHi [First Name],\n\nWe wanted to share something special with you.\n\nOur latest collection features precision-cut lab-grown diamonds that rival any mined stone in brilliance, fire, and beauty — at 40% less cost.\n\nHere's what makes them different:\n\n→ Same carbon crystal structure as mined diamonds\n→ AI-guided cutting for maximum light performance\n→ Zero environmental mining impact\n→ Full GIA certification\n\nWhether you're looking for the perfect engagement ring or a statement piece that reflects your values, our collection has something extraordinary waiting for you.\n\nExplore the Collection →\n\nWarm regards,\nThe Grown Diamond Team\n\nP.S. For a limited time, enjoy complimentary shipping on all orders over $500.",
  },
}

const AI_LEARNINGS = [
  { insight: "Instagram Reels with macro diamond shots get 3.2x more saves than lifestyle photos", direction: "Generate more close-up product Reels. Schedule 3 Reels/week at 7:30 PM.", platform: "Instagram", confidence: 94 },
  { insight: "TikTok POV-style hooks get 2.8x more shares", direction: "Use POV format for next 5 TikToks. Test 'Wait for it...' as alternate hook.", platform: "TikTok", confidence: 89 },
  { insight: "LinkedIn posts with line breaks every 2 lines get 1.6x more impressions", direction: "Enforce short paragraph formatting. Ask a question at the end of every post.", platform: "LinkedIn", confidence: 87 },
  { insight: "X threads (3+ tweets) get 2.1x more engagement than single tweets", direction: "Convert all X content to 3-tweet threads. Lead with a hot take.", platform: "X", confidence: 82 },
  { insight: "Facebook image posts with warm tones outperform cool-toned by 40%", direction: "Use warm brown/gold silk backgrounds for Facebook. Add community questions.", platform: "Facebook", confidence: 85 },
  { insight: "Hashtag sweet spot is 8-10 on Instagram, 5-6 on TikTok", direction: "Cap Instagram at 10 hashtags, TikTok at 6. Drop generic tags.", platform: "All", confidence: 91 },
]

// ─── Helper ──────────────────────────────────────────────────────────

function getNextWeekDates() {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
  const dates: { label: string; date: string; dayName: string }[] = []
  const today = new Date()
  for (let i = 0; i < 7; i++) {
    const d = new Date(today)
    d.setDate(today.getDate() + i)
    dates.push({
      label: i === 0 ? "Today" : i === 1 ? "Tomorrow" : days[d.getDay()],
      date: `${d.getMonth() + 1}/${d.getDate()}`,
      dayName: days[d.getDay()],
    })
  }
  return dates
}

const WEEK_DATES = getNextWeekDates()

// Each day = one topic, adapted per platform format
const DAILY_TOPICS = [
  { day: 0, topic: "Cushion-Cut Halo Ring — 2.5ct E VVS1", emoji: "💍" },
  { day: 1, topic: "Lab-Grown vs Mined: The Science", emoji: "🔬" },
  { day: 2, topic: "Pear-Cut Solitaire — 3ct D IF", emoji: "💎" },
  { day: 3, topic: "Behind the Lab: CVD Process", emoji: "🏭" },
  { day: 4, topic: "Engagement Ring Trends 2026", emoji: "💒" },
  { day: 5, topic: "Oval Brilliant — 1.8ct F VS1", emoji: "✨" },
  { day: 6, topic: "Customer Story: Sarah's Ring", emoji: "❤️" },
]

const DEFAULT_SCHEDULE: { day: number; time: string; platform: string; content: string; status: string }[] = [
  // Day 0: Cushion-Cut Halo Ring
  { day: 0, time: "7:30 PM", platform: "instagram", content: "Cushion-Cut Halo Ring — Reel", status: "scheduled" },
  { day: 0, time: "8:00 PM", platform: "tiktok", content: "Cushion-Cut Halo Ring — Short", status: "scheduled" },
  { day: 0, time: "12:00 PM", platform: "x", content: "Cushion-Cut Halo Ring — Tweet", status: "scheduled" },
  { day: 0, time: "1:00 PM", platform: "facebook", content: "Cushion-Cut Halo Ring — Image Post", status: "scheduled" },
  // Day 1: Lab-Grown vs Mined
  { day: 1, time: "9:00 AM", platform: "linkedin", content: "Lab-Grown vs Mined — Article", status: "scheduled" },
  { day: 1, time: "10:00 AM", platform: "blog", content: "Lab-Grown vs Mined — Blog Post", status: "scheduled" },
  { day: 1, time: "12:00 PM", platform: "x", content: "Lab-Grown vs Mined — Thread", status: "scheduled" },
  { day: 1, time: "7:30 PM", platform: "instagram", content: "Lab-Grown vs Mined — Reel", status: "scheduled" },
  { day: 1, time: "8:00 PM", platform: "tiktok", content: "Lab-Grown vs Mined — Short", status: "scheduled" },
  // Day 2: Pear-Cut Solitaire
  { day: 2, time: "7:30 PM", platform: "instagram", content: "Pear-Cut Solitaire — Reel", status: "scheduled" },
  { day: 2, time: "8:00 PM", platform: "tiktok", content: "Pear-Cut Solitaire — Short", status: "scheduled" },
  { day: 2, time: "1:00 PM", platform: "facebook", content: "Pear-Cut Solitaire — Image Post", status: "scheduled" },
  { day: 2, time: "12:00 PM", platform: "x", content: "Pear-Cut Solitaire — Tweet", status: "scheduled" },
  // Day 3: Behind the Lab
  { day: 3, time: "9:00 AM", platform: "linkedin", content: "Behind the Lab — Article", status: "scheduled" },
  { day: 3, time: "10:00 AM", platform: "email", content: "Behind the Lab — Newsletter", status: "scheduled" },
  { day: 3, time: "12:00 PM", platform: "x", content: "Behind the Lab — Thread", status: "scheduled" },
  { day: 3, time: "7:30 PM", platform: "instagram", content: "Behind the Lab — Reel", status: "scheduled" },
  { day: 3, time: "8:00 PM", platform: "tiktok", content: "Behind the Lab — Short", status: "scheduled" },
  // Day 4: Engagement Ring Trends
  { day: 4, time: "10:00 AM", platform: "blog", content: "Engagement Ring Trends — Blog Post", status: "scheduled" },
  { day: 4, time: "9:00 AM", platform: "linkedin", content: "Engagement Ring Trends — Article", status: "scheduled" },
  { day: 4, time: "1:00 PM", platform: "facebook", content: "Engagement Ring Trends — Image Post", status: "scheduled" },
  { day: 4, time: "7:30 PM", platform: "instagram", content: "Engagement Ring Trends — Carousel", status: "scheduled" },
  { day: 4, time: "8:00 PM", platform: "tiktok", content: "Engagement Ring Trends — Short", status: "scheduled" },
  // Day 5: Oval Brilliant
  { day: 5, time: "7:30 PM", platform: "instagram", content: "Oval Brilliant — Reel", status: "scheduled" },
  { day: 5, time: "8:00 PM", platform: "tiktok", content: "Oval Brilliant — Short", status: "scheduled" },
  { day: 5, time: "12:00 PM", platform: "x", content: "Oval Brilliant — Tweet", status: "scheduled" },
  { day: 5, time: "1:00 PM", platform: "facebook", content: "Oval Brilliant — Image Post", status: "scheduled" },
  // Day 6: Customer Story
  { day: 6, time: "9:00 AM", platform: "email", content: "Sarah's Ring Story — Newsletter", status: "scheduled" },
  { day: 6, time: "10:00 AM", platform: "blog", content: "Sarah's Ring Story — Blog Post", status: "scheduled" },
  { day: 6, time: "7:30 PM", platform: "instagram", content: "Sarah's Ring Story — Reel", status: "scheduled" },
  { day: 6, time: "12:00 PM", platform: "x", content: "Sarah's Ring Story — Tweet", status: "scheduled" },
  { day: 6, time: "1:00 PM", platform: "facebook", content: "Sarah's Ring Story — Image Post", status: "scheduled" },
]

// ─── Component ───────────────────────────────────────────────────────

export default function DemoPage() {
  // Setup state
  const [setupDone, setSetupDone] = useState(false)
  const [connectingAll, setConnectingAll] = useState(false)
  const [allConnected, setAllConnected] = useState(false)
  const [brandLoading, setBrandLoading] = useState(false)
  const [brandLoaded, setBrandLoaded] = useState(false)

  // Content state
  const [generating, setGenerating] = useState(false)
  const [generated, setGenerated] = useState(false)
  const [selectedPlatform, setSelectedPlatform] = useState("instagram")
  const [aiCaptions, setAiCaptions] = useState<any>(null)
  const [autoPostEnabled, setAutoPostEnabled] = useState(false)

  // Insights
  const [insightsOpen, setInsightsOpen] = useState(false)
  const [suggestion, setSuggestion] = useState("")
  const [suggestionSent, setSuggestionSent] = useState(false)
  const [trendingTopics, setTrendingTopics] = useState<string[]>([])
  const [trendingLoading, setTrendingLoading] = useState(false)

  // Schedule
  const [selectedDay, setSelectedDay] = useState(0)
  const [previewSlot, setPreviewSlot] = useState<typeof DEFAULT_SCHEDULE[0] | null>(null)
  const [suggestingChange, setSuggestingChange] = useState(false)
  const [changePrompt, setChangePrompt] = useState("")
  // Stores improved content per platform: { instagram: { caption: "...", image: "..." }, ... }
  const [improvedContent, setImprovedContent] = useState<Record<string, any>>({})
  const [regeneratingImage, setRegeneratingImage] = useState(false)

  // Edit history per platform: { instagram: [{ type, prompt, before, after }], ... }
  const [editHistory, setEditHistory] = useState<Record<string, { type: string; prompt: string; before: string; after: string; timestamp: string }[]>>({})
  const [activeVersion, setActiveVersion] = useState<Record<string, number>>({}) // platform → version index (-1 = current)

  // Main content suggest changes
  const [mainEditType, setMainEditType] = useState<"caption" | "image" | null>(null)
  const [mainEditPrompt, setMainEditPrompt] = useState("")
  const [mainEditing, setMainEditing] = useState(false)

  // ── Setup actions ──
  const connectAll = () => {
    setConnectingAll(true)
    setTimeout(() => { setConnectingAll(false); setAllConnected(true) }, 2000)
  }

  const extractBrand = () => {
    setBrandLoading(true)
    setTimeout(() => { setBrandLoading(false); setBrandLoaded(true) }, 2500)
  }

  const finishSetup = () => setSetupDone(true)

  // ── Content actions ──
  const generateContent = async () => {
    setGenerating(true)
    try {
      const [_, aiRes] = await Promise.all([
        new Promise((r) => setTimeout(r, 2000)),
        fetch("/api/demo/generate-captions", { method: "POST" }).then((r) => r.json()).catch(() => null),
      ])
      if (aiRes && !aiRes.error) setAiCaptions(aiRes)
    } catch {}
    setGenerating(false)
    setGenerated(true)
  }

  const enableAutoPost = () => setAutoPostEnabled(true)

  // Get content for selected platform (with AI overrides + improvements)
  const getContent = () => {
    let content = { ...GENERATED_CONTENT[selectedPlatform] }
    if (!content) return null
    // Layer AI-generated captions
    if (selectedPlatform === "x" && aiCaptions?.x) { content.text = aiCaptions.x.text; content.thread = aiCaptions.x.thread }
    if (selectedPlatform === "facebook" && aiCaptions?.facebook) { content.caption = aiCaptions.facebook.caption; content.hashtags = aiCaptions.facebook.hashtags }
    if (selectedPlatform === "linkedin" && aiCaptions?.linkedin) { content.text = aiCaptions.linkedin.text }
    // Layer user improvements
    const improved = improvedContent[selectedPlatform]
    if (improved) {
      if (improved.text) content.text = improved.text
      if (improved.caption) content.caption = improved.caption
      if (improved.hashtags) content.hashtags = improved.hashtags
      if (improved.image) content.image = improved.image
    }
    return content
  }

  // Record a history entry
  const addHistory = (type: string, prompt: string, before: string, after: string) => {
    setEditHistory((prev) => ({
      ...prev,
      [selectedPlatform]: [
        { type, prompt, before, after, timestamp: new Date().toLocaleTimeString() },
        ...(prev[selectedPlatform] || []),
      ].slice(0, 20),
    }))
    // Reset version to latest
    setActiveVersion((prev) => ({ ...prev, [selectedPlatform]: -1 }))
  }

  // Apply a suggest change from the main content view
  const applyMainEdit = async () => {
    if (!mainEditPrompt.trim() || mainEditing) return
    setMainEditing(true)
    const content = getContent()
    try {
      if (mainEditType === "caption") {
        const beforeText = content?.caption || content?.text || ""
        const res = await fetch("/api/demo/improve-content", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            currentText: content?.text || undefined,
            currentCaption: content?.caption || undefined,
            currentHashtags: content?.hashtags || undefined,
            suggestion: mainEditPrompt,
            platform: selectedPlatform,
            contentType: content?.type || "Post",
          }),
        })
        const data = await res.json()
        const updates: any = {}
        if (data.text) updates.text = data.text
        if (data.caption) updates.caption = data.caption
        if (data.hashtags) updates.hashtags = data.hashtags
        const afterText = data.caption || data.text || beforeText
        addHistory("caption", mainEditPrompt, beforeText, afterText)
        setImprovedContent((prev) => ({ ...prev, [selectedPlatform]: { ...(prev[selectedPlatform] || {}), ...updates } }))
      } else if (mainEditType === "image") {
        const currentImg = content?.image
        if (currentImg) {
          try {
            const res = await fetch("/api/demo/edit-image", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ imageUrl: currentImg, prompt: mainEditPrompt }),
            })
            const data = await res.json()
            if (data.imageUrl) {
              addHistory("image", mainEditPrompt, currentImg, data.imageUrl)
              setImprovedContent((prev) => ({ ...prev, [selectedPlatform]: { ...(prev[selectedPlatform] || {}), image: data.imageUrl } }))
            }
          } catch {}
        }
      }
    } catch (e) {
      console.warn("[demo] Main edit failed:", e)
    }
    setMainEditing(false)
    setMainEditPrompt("")
    setMainEditType(null)
  }

  const daySchedule = DEFAULT_SCHEDULE.filter((s) => s.day === selectedDay)

  return (
    <div className="min-h-screen bg-background text-foreground">

      {/* ═══════════════ SETUP POPUP ═══════════════ */}
      {!setupDone && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <div className="w-full max-w-2xl mx-4 rounded-3xl border border-border bg-background shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="px-8 pt-8 pb-4">
              <h2 className="text-2xl font-bold">Welcome</h2>
              <p className="text-sm text-muted-foreground mt-1">Connect your accounts and let us learn your brand. This only takes a minute.</p>
            </div>

            <div className="px-8 pb-8 space-y-6">
              {/* Step 1: Connect */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold">Connect Social Platforms</h3>
                  {allConnected && <CheckCircle2 className="h-5 w-5 text-emerald-500" />}
                </div>
                <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                  {PLATFORMS.map((p) => (
                    <div key={p.id} className={`rounded-xl border p-3 text-center transition-all ${allConnected ? "border-emerald-200 bg-emerald-50" : "border-border"}`}>
                      <div className={`h-8 w-8 mx-auto rounded-lg bg-gradient-to-br ${p.color} flex items-center justify-center text-[9px] font-bold text-white mb-1.5`}>{p.icon}</div>
                      <p className="text-[10px] font-medium">{p.name}</p>
                      {allConnected && <p className="text-[9px] text-emerald-600 mt-0.5">{p.followers}</p>}
                    </div>
                  ))}
                </div>
                {!allConnected && (
                  <button onClick={connectAll} disabled={connectingAll} className="w-full py-2.5 rounded-xl bg-foreground text-background text-sm font-semibold transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                    {connectingAll ? <Loader2 className="h-4 w-4 animate-spin" /> : <Link2 className="h-4 w-4" />}
                    {connectingAll ? "Connecting all platforms..." : "Connect All Platforms"}
                  </button>
                )}
              </div>

              {/* Step 2: Brand */}
              {allConnected && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold">Extract Brand Identity</h3>
                    {brandLoaded && <CheckCircle2 className="h-5 w-5 text-emerald-500" />}
                  </div>

                  <div className="flex items-center gap-2 h-10 rounded-lg border border-border bg-muted/30 px-3">
                    <Globe className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">{BRAND.url}</span>
                  </div>

                  {!brandLoaded ? (
                    <button onClick={extractBrand} disabled={brandLoading} className="w-full py-2.5 rounded-xl bg-foreground text-background text-sm font-semibold transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                      {brandLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                      {brandLoading ? "Scraping website & social posts..." : "Extract Brand Identity"}
                    </button>
                  ) : (
                    <div className="rounded-xl border border-border bg-muted/20 p-4 space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl overflow-hidden border border-border">
                          <img src={BRAND.logo} alt="" className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <p className="font-semibold text-sm">{BRAND.name}</p>
                          <p className="text-[10px] text-muted-foreground">{BRAND.industry}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] text-muted-foreground">Colors:</span>
                        {Object.values(BRAND.colors).map((c, i) => (
                          <div key={i} className="h-5 w-5 rounded border border-border" style={{ backgroundColor: c }} />
                        ))}
                        <span className="text-[10px] text-muted-foreground ml-2">Fonts: {BRAND.fonts.primary}</span>
                      </div>
                      <p className="text-xs text-muted-foreground italic">&quot;{BRAND.voice}&quot;</p>
                    </div>
                  )}
                </div>
              )}

              {/* Done */}
              {brandLoaded && (
                <button onClick={finishSetup} className="w-full py-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-sm font-semibold transition-all shadow-lg shadow-violet-500/20 flex items-center justify-center gap-2">
                  Start Creating Content
                  <ArrowRight className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════ MAIN CONTENT VIEW ═══════════════ */}
      {setupDone && (
        <>
          {/* Header */}
          <header className="border-b border-border/50 bg-background/80 backdrop-blur-xl sticky top-0 z-40">
            <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
              <div>
                <h1 className="text-lg font-bold tracking-tight">Content</h1>
                <p className="text-[11px] text-muted-foreground">Generate and schedule posts across all platforms</p>
              </div>
              <div className="flex items-center gap-2">
                {/* Insights toggle */}
                <button
                  onClick={() => setInsightsOpen(!insightsOpen)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                    insightsOpen ? "bg-violet-100 text-violet-700 border border-violet-200" : "bg-muted text-muted-foreground hover:bg-muted/80 border border-border"
                  }`}
                >
                  <Lightbulb className="h-3.5 w-3.5" />
                  Insights
                </button>
                {!autoPostEnabled ? (
                  <button
                    onClick={enableAutoPost}
                    disabled={!generated}
                    className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-all disabled:opacity-40 flex items-center gap-1.5"
                  >
                    <RefreshCw className="h-3.5 w-3.5" />
                    Auto Post
                  </button>
                ) : (
                  <span className="px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Auto Post Enabled
                  </span>
                )}
                <span className="text-[10px] px-2 py-1 rounded-full bg-muted/40 border border-border/50 text-muted-foreground">Demo</span>
              </div>
            </div>
          </header>

          {/* Auto-post explanation */}
          {autoPostEnabled && (
            <div className="border-b border-emerald-200 bg-emerald-50/50">
              <div className="max-w-7xl mx-auto px-6 py-4">
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-lg bg-emerald-100 flex items-center justify-center shrink-0 mt-0.5">
                    <Zap className="h-4 w-4 text-emerald-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-emerald-900">Auto Post is running</p>
                    <p className="text-xs text-emerald-700 mt-1 leading-relaxed">
                      The system will automatically research trending topics in your niche, analyze what&apos;s performing on each platform,
                      generate brand-consistent content, and publish at optimal times — all without manual input.
                      It continuously monitors engagement and adjusts future content based on what works.
                    </p>
                    <div className="flex items-center gap-4 mt-2.5 text-[10px] text-emerald-600">
                      <span className="flex items-center gap-1"><Globe className="h-3 w-3" /> Fetches trending topics daily</span>
                      <span className="flex items-center gap-1"><TrendingUp className="h-3 w-3" /> Analyzes competitor content</span>
                      <span className="flex items-center gap-1"><Sparkles className="h-3 w-3" /> Creates posts automatically</span>
                      <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> Posts at optimal times</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Insights panel (expandable) */}
          {insightsOpen && (
            <div className="border-b border-border/50 bg-muted/10">
              <div className="max-w-7xl mx-auto px-6 py-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-violet-500" />
                    AI Insights & Learnings
                  </h3>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1.5"><BarChart3 className="h-3.5 w-3.5" /> 101.4K impressions</span>
                    <span className="flex items-center gap-1.5"><Heart className="h-3.5 w-3.5" /> 5.6% avg engagement</span>
                    <span className="flex items-center gap-1.5"><Sparkles className="h-3.5 w-3.5" /> 91% AI confidence</span>
                  </div>
                </div>
                <div className="grid gap-2 lg:grid-cols-3">
                  {AI_LEARNINGS.slice(0, 6).map((l, i) => (
                    <div key={i} className="rounded-xl border border-border/50 bg-background p-3 space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-[8px] px-1.5 py-0.5 rounded bg-muted border border-border font-semibold text-muted-foreground">{l.platform}</span>
                        <span className="text-[9px] text-violet-600 font-medium">{l.confidence}%</span>
                      </div>
                      <p className="text-xs text-foreground leading-relaxed">{l.insight}</p>
                      <p className="text-[10px] text-emerald-600"><strong>Action:</strong> {l.direction}</p>
                    </div>
                  ))}
                </div>

                {/* Trending topics */}
                <div className="mt-4 rounded-xl border border-border bg-background p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-xs font-semibold flex items-center gap-1.5">
                      <TrendingUp className="h-3.5 w-3.5 text-orange-500" />
                      Trending Topics This Month
                    </h4>
                    <button
                      onClick={async () => {
                        setTrendingLoading(true)
                        try {
                          const res = await fetch("/api/demo/trending", { method: "POST" })
                          const data = await res.json()
                          if (data.topics) setTrendingTopics(data.topics)
                        } catch {}
                        setTrendingLoading(false)
                      }}
                      disabled={trendingLoading}
                      className="px-3 h-7 rounded-lg bg-muted hover:bg-muted/80 border border-border text-[10px] font-medium text-foreground transition-all disabled:opacity-50 flex items-center gap-1.5"
                    >
                      {trendingLoading ? <Loader2 className="h-3 w-3 animate-spin" /> : <Globe className="h-3 w-3" />}
                      {trendingLoading ? "Searching..." : trendingTopics.length > 0 ? "Refresh" : "Search Trends"}
                    </button>
                  </div>
                  {trendingTopics.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5">
                      {trendingTopics.map((topic, i) => (
                        <span key={i} className="px-2.5 py-1 rounded-lg bg-orange-50 border border-orange-200 text-[10px] text-orange-700 font-medium">
                          {topic}
                        </span>
                      ))}
                    </div>
                  ) : !trendingLoading ? (
                    <p className="text-[10px] text-muted-foreground">Click &quot;Search Trends&quot; to find trending diamond and luxury topics for this month.</p>
                  ) : null}
                </div>

                {/* Suggest improvement */}
                <div className="mt-4 rounded-xl border border-border bg-background p-4">
                  <h4 className="text-xs font-semibold mb-2 flex items-center gap-1.5">
                    <MessageSquare className="h-3.5 w-3.5 text-violet-500" />
                    Suggest an Improvement
                  </h4>
                  <p className="text-[10px] text-muted-foreground mb-3">Tell the AI what to focus on, change, or avoid in future content.</p>
                  {suggestionSent ? (
                    <div className="flex items-center gap-2 text-sm text-emerald-600">
                      <CheckCircle2 className="h-4 w-4" />
                      Got it! The AI will incorporate your feedback into future content generation.
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={suggestion}
                        onChange={(e) => setSuggestion(e.target.value)}
                        placeholder="e.g. Use more behind-the-scenes content, focus on engagement rings, avoid technical jargon..."
                        className="flex-1 h-9 rounded-lg border border-border bg-muted/20 px-3 text-sm placeholder:text-muted-foreground/50"
                      />
                      <button
                        onClick={() => { if (suggestion.trim()) { setSuggestionSent(true); setSuggestion("") } }}
                        disabled={!suggestion.trim()}
                        className="px-4 h-9 rounded-lg bg-foreground text-background text-xs font-semibold transition-all disabled:opacity-40 flex items-center gap-1.5"
                      >
                        <ArrowRight className="h-3.5 w-3.5" />
                        Send
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">

            {/* ── Generate bar ── */}
            {!generated && (
              <div className="rounded-2xl border border-border bg-muted/20 p-8 text-center">
                <Sparkles className="h-10 w-10 mx-auto text-muted-foreground/30 mb-4" />
                <h3 className="text-lg font-semibold mb-2">Generate Content for All Platforms</h3>
                <p className="text-sm text-muted-foreground max-w-md mx-auto mb-6">
                  One click creates tailored content for Instagram, TikTok, LinkedIn, X, and Facebook — using your brand identity.
                </p>
                <button
                  onClick={generateContent}
                  disabled={generating}
                  className="px-8 py-3 rounded-xl bg-foreground text-background text-sm font-semibold transition-all disabled:opacity-50 inline-flex items-center gap-2"
                >
                  {generating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Zap className="h-4 w-4" />}
                  {generating ? "Generating for all platforms..." : "Generate Content"}
                </button>
              </div>
            )}

            {/* ── Platform content ── */}
            {generated && (
              <>
                {/* Platform selector */}
                <div className="flex gap-2">
                  {PLATFORMS.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => setSelectedPlatform(p.id)}
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                        selectedPlatform === p.id
                          ? "bg-foreground text-background shadow-md"
                          : "bg-muted/50 border border-border/50 text-muted-foreground hover:text-foreground hover:bg-muted"
                      }`}
                    >
                      <div className={`h-5 w-5 rounded bg-gradient-to-br ${p.color} flex items-center justify-center text-[8px] font-bold text-white`}>{p.icon}</div>
                      {p.name}
                    </button>
                  ))}
                </div>

                {/* Content preview + details */}
                {(() => {
                  const content = getContent()
                  const platform = PLATFORMS.find((p) => p.id === selectedPlatform)
                  if (!content || !platform) return null

                  return (
                    <div className="grid gap-6 lg:grid-cols-2">
                      {/* Preview */}
                      <div className="rounded-2xl border border-border/50 bg-background overflow-hidden">
                        <div className="px-4 py-2.5 border-b border-border/50 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className={`h-5 w-5 rounded bg-gradient-to-br ${platform.color} flex items-center justify-center text-[7px] font-bold text-white`}>{platform.icon}</div>
                            <span className="text-sm font-semibold">{platform.name}</span>
                          </div>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-muted border border-border text-muted-foreground">{content.type}</span>
                        </div>
                        <div className="p-5">
                          {content.video ? (
                            <div className="aspect-[9/16] max-h-[480px] rounded-xl overflow-hidden bg-black mx-auto" style={{ maxWidth: 270 }}>
                              <video src={content.video} poster={content.image} controls playsInline className="w-full h-full object-cover" />
                            </div>
                          ) : content.image ? (
                            <div className="relative aspect-[4/5] max-h-[400px] rounded-xl overflow-hidden bg-muted/20 mx-auto" style={{ maxWidth: 320 }}>
                              <img src={content.image} alt="" className="w-full h-full object-cover" />
                              {mainEditing && mainEditType === "image" && (
                                <div className="absolute inset-0 bg-background/60 flex items-center justify-center">
                                  <div className="text-center">
                                    <Loader2 className="h-6 w-6 animate-spin mx-auto text-violet-500 mb-2" />
                                    <p className="text-xs font-medium">Editing image...</p>
                                  </div>
                                </div>
                              )}
                              {improvedContent[selectedPlatform]?.image && (
                                <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-emerald-500 text-white text-[9px] font-semibold">AI Edited</div>
                              )}
                            </div>
                          ) : content.text ? (
                            /* X / text-only preview */
                            <div className="rounded-xl border border-border bg-muted/10 p-5 max-w-sm mx-auto">
                              <div className="flex items-center gap-2 mb-3">
                                <div className="h-8 w-8 rounded-full overflow-hidden border border-border">
                                  <img src={BRAND.logo} alt="" className="w-full h-full object-cover" />
                                </div>
                                <div>
                                  <p className="text-xs font-bold">{BRAND.name}</p>
                                  <p className="text-[10px] text-muted-foreground">@growndiamondcorp</p>
                                </div>
                              </div>
                              <p className="text-sm leading-relaxed whitespace-pre-line">{content.text}</p>
                              {content.thread?.length > 0 && (
                                <div className="mt-3 space-y-2 border-l-2 border-border pl-3">
                                  {content.thread.map((t: string, i: number) => (
                                    <p key={i} className="text-sm text-muted-foreground leading-relaxed">{t}</p>
                                  ))}
                                </div>
                              )}
                              <div className="flex items-center gap-6 mt-4 text-muted-foreground">
                                <MessageSquare className="h-3.5 w-3.5" />
                                <RefreshCw className="h-3.5 w-3.5" />
                                <Heart className="h-3.5 w-3.5" />
                                <Share2 className="h-3.5 w-3.5" />
                              </div>
                            </div>
                          ) : null}
                        </div>
                      </div>

                      {/* Details */}
                      <div className="space-y-4">
                        <div className="rounded-2xl border border-border/50 bg-background p-5 space-y-4">
                          <h4 className="text-sm font-semibold">Generated Content</h4>

                          {content.text && (
                            <div>
                              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">Text</p>
                              <p className="text-sm text-foreground/80 whitespace-pre-line leading-relaxed">{content.text}</p>
                            </div>
                          )}

                          {content.caption && (
                            <div>
                              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">Caption</p>
                              <p className="text-sm text-foreground/80 leading-relaxed">{content.caption}</p>
                            </div>
                          )}

                          {content.hashtags && (
                            <div>
                              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">Hashtags</p>
                              <p className="text-xs text-violet-600">{content.hashtags}</p>
                            </div>
                          )}

                          {content.thread?.length > 0 && (
                            <div>
                              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">Thread</p>
                              {content.thread.map((t: string, i: number) => (
                                <p key={i} className="text-sm text-foreground/80 leading-relaxed mb-2 pl-3 border-l-2 border-border">{t}</p>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Suggest Changes */}
                        <div className="rounded-2xl border border-border/50 bg-background p-5 space-y-3">
                          <h4 className="text-xs font-semibold flex items-center gap-1.5">
                            <Sparkles className="h-3.5 w-3.5 text-violet-500" />
                            Suggest Changes
                          </h4>
                          {/* Caption edit */}
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <p className="text-[10px] font-medium text-muted-foreground">Caption / Text</p>
                              {mainEditing && mainEditType === "caption" && <Loader2 className="h-3 w-3 animate-spin text-violet-500" />}
                            </div>
                            <div className="flex gap-2">
                              <input
                                type="text"
                                value={mainEditType === "caption" ? mainEditPrompt : ""}
                                onChange={(e) => { setMainEditType("caption"); setMainEditPrompt(e.target.value) }}
                                onKeyDown={(e) => { if (e.key === "Enter") { setMainEditType("caption"); applyMainEdit() } }}
                                placeholder="e.g. Make it shorter, add more urgency, change the tone..."
                                className="flex-1 h-8 rounded-lg border border-border bg-background px-3 text-xs placeholder:text-muted-foreground/50"
                                disabled={mainEditing}
                              />
                              <button
                                onClick={() => { setMainEditType("caption"); applyMainEdit() }}
                                disabled={mainEditing || !(mainEditType === "caption" && mainEditPrompt.trim())}
                                className="px-3 h-8 rounded-lg bg-foreground text-background text-[10px] font-semibold disabled:opacity-40 shrink-0"
                              >
                                Apply
                              </button>
                            </div>
                          </div>

                          {/* Image edit — only for image posts, not video */}
                          {content?.image && !content?.video && (
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <p className="text-[10px] font-medium text-muted-foreground">Image</p>
                                {mainEditing && mainEditType === "image" && <Loader2 className="h-3 w-3 animate-spin text-violet-500" />}
                              </div>
                              {/* Suggested edit chip */}
                              <button
                                onClick={async () => {
                                  setMainEditType("image")
                                  setMainEditing(true)
                                  const before = content?.image
                                  await new Promise((r) => setTimeout(r, 2000))
                                  addHistory("image", "Make the big diamond smaller and add multiple diamonds", before, "/demo/ReplaceImage2.png")
                                  setImprovedContent((prev) => ({ ...prev, [selectedPlatform]: { ...(prev[selectedPlatform] || {}), image: "/demo/ReplaceImage2.png" } }))
                                  setMainEditing(false)
                                }}
                                disabled={mainEditing}
                                className="w-full px-3 py-2 rounded-lg border border-violet-200 bg-violet-50 hover:bg-violet-100 text-xs text-violet-700 font-medium transition-all text-left disabled:opacity-50 flex items-center gap-2"
                              >
                                <Sparkles className="h-3 w-3 shrink-0" />
                                Make the big diamond smaller and add multiple diamonds
                              </button>
                              {/* Custom edit input */}
                              <div className="flex gap-2">
                                <input
                                  type="text"
                                  value={mainEditType === "image" ? mainEditPrompt : ""}
                                  onChange={(e) => { setMainEditType("image"); setMainEditPrompt(e.target.value) }}
                                  onKeyDown={(e) => { if (e.key === "Enter") { setMainEditType("image"); applyMainEdit() } }}
                                  placeholder="Or describe a custom image change..."
                                  className="flex-1 h-8 rounded-lg border border-border bg-background px-3 text-xs placeholder:text-muted-foreground/50"
                                  disabled={mainEditing}
                                />
                                <button
                                  onClick={() => { setMainEditType("image"); applyMainEdit() }}
                                  disabled={mainEditing || !(mainEditType === "image" && mainEditPrompt.trim())}
                                  className="px-3 h-8 rounded-lg bg-foreground text-background text-[10px] font-semibold disabled:opacity-40 shrink-0"
                                >
                                  Apply
                                </button>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Edit history */}
                        {(editHistory[selectedPlatform]?.length || 0) > 0 && (
                          <div className="rounded-2xl border border-border/50 bg-background p-5 space-y-3">
                            <div className="flex items-center justify-between">
                              <h4 className="text-xs font-semibold flex items-center gap-1.5">
                                <RefreshCw className="h-3.5 w-3.5 text-muted-foreground" />
                                Edit History ({editHistory[selectedPlatform].length})
                              </h4>
                            </div>
                            <div className="space-y-2 max-h-[300px] overflow-y-auto">
                              {editHistory[selectedPlatform].map((entry, i) => (
                                <div key={i} className="rounded-xl border border-border/50 bg-muted/20 p-3 space-y-2">
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                      <span className={`text-[8px] px-1.5 py-0.5 rounded font-semibold ${entry.type === "image" ? "bg-fuchsia-100 text-fuchsia-700" : "bg-blue-100 text-blue-700"}`}>
                                        {entry.type === "image" ? "Image" : "Text"}
                                      </span>
                                      <span className="text-[10px] text-muted-foreground">{entry.timestamp}</span>
                                    </div>
                                    <button
                                      onClick={() => {
                                        // Revert to the "before" state of this entry
                                        if (entry.type === "image") {
                                          setImprovedContent((prev) => ({ ...prev, [selectedPlatform]: { ...(prev[selectedPlatform] || {}), image: entry.before } }))
                                        } else {
                                          const base = GENERATED_CONTENT[selectedPlatform]
                                          // If before matches original, clear the improvement
                                          if (entry.before === (base?.caption || base?.text)) {
                                            setImprovedContent((prev) => {
                                              const next = { ...(prev[selectedPlatform] || {}) }
                                              delete next.text; delete next.caption; delete next.hashtags
                                              return { ...prev, [selectedPlatform]: next }
                                            })
                                          } else {
                                            setImprovedContent((prev) => ({
                                              ...prev,
                                              [selectedPlatform]: {
                                                ...(prev[selectedPlatform] || {}),
                                                ...(base?.caption ? { caption: entry.before } : { text: entry.before }),
                                              },
                                            }))
                                          }
                                        }
                                      }}
                                      className="text-[9px] px-2 py-0.5 rounded bg-muted hover:bg-muted/80 text-muted-foreground font-medium"
                                    >
                                      Revert
                                    </button>
                                  </div>
                                  <p className="text-[10px] text-foreground"><strong>Prompt:</strong> {entry.prompt}</p>
                                  {entry.type === "image" ? (
                                    <div className="flex gap-2">
                                      <div className="flex-1 space-y-1">
                                        <p className="text-[8px] font-semibold text-muted-foreground uppercase">Before</p>
                                        <div className="h-20 rounded-lg overflow-hidden border border-border/50 bg-muted/20">
                                          <img src={entry.before} alt="" className="w-full h-full object-cover" />
                                        </div>
                                      </div>
                                      <div className="flex items-center"><ArrowRight className="h-3 w-3 text-muted-foreground" /></div>
                                      <div className="flex-1 space-y-1">
                                        <p className="text-[8px] font-semibold text-emerald-600 uppercase">After</p>
                                        <div className="h-20 rounded-lg overflow-hidden border border-emerald-200 bg-muted/20">
                                          <img src={entry.after} alt="" className="w-full h-full object-cover" />
                                        </div>
                                      </div>
                                    </div>
                                  ) : (
                                    <div className="grid grid-cols-2 gap-2">
                                      <div className="space-y-1">
                                        <p className="text-[8px] font-semibold text-muted-foreground uppercase">Before</p>
                                        <p className="text-[10px] text-muted-foreground leading-relaxed line-clamp-3">{entry.before}</p>
                                      </div>
                                      <div className="space-y-1">
                                        <p className="text-[8px] font-semibold text-emerald-600 uppercase">After</p>
                                        <p className="text-[10px] text-foreground leading-relaxed line-clamp-3">{entry.after}</p>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Platform optimization */}
                        <div className="rounded-2xl border border-border/50 bg-background p-5">
                          <h4 className="text-sm font-semibold mb-3">Platform Optimization</h4>
                          <div className="space-y-2 text-xs text-muted-foreground">
                            {selectedPlatform === "instagram" && <><p><span className="text-emerald-600 font-medium">Format:</span> 9:16 Reel</p><p><span className="text-emerald-600 font-medium">Best time:</span> 7:30 PM</p><p><span className="text-emerald-600 font-medium">Strategy:</span> Visual-first, aspirational hook</p></>}
                            {selectedPlatform === "tiktok" && <><p><span className="text-emerald-600 font-medium">Format:</span> POV short video</p><p><span className="text-emerald-600 font-medium">Best time:</span> 8:00 PM</p><p><span className="text-emerald-600 font-medium">Strategy:</span> Educational + trending hook</p></>}
                            {selectedPlatform === "linkedin" && <><p><span className="text-emerald-600 font-medium">Format:</span> Text post</p><p><span className="text-emerald-600 font-medium">Best time:</span> Tue 9:00 AM</p><p><span className="text-emerald-600 font-medium">Strategy:</span> Thought leadership, question CTA</p></>}
                            {selectedPlatform === "x" && <><p><span className="text-emerald-600 font-medium">Format:</span> Tweet / thread</p><p><span className="text-emerald-600 font-medium">Best time:</span> 12:00 PM</p><p><span className="text-emerald-600 font-medium">Strategy:</span> Hot take, punchy sentences</p></>}
                            {selectedPlatform === "facebook" && <><p><span className="text-emerald-600 font-medium">Format:</span> Image post</p><p><span className="text-emerald-600 font-medium">Best time:</span> 1:00 PM</p><p><span className="text-emerald-600 font-medium">Strategy:</span> Community engagement, warm visuals</p></>}
                            {selectedPlatform === "blog" && <><p><span className="text-emerald-600 font-medium">Format:</span> Long-form article (800-1200 words)</p><p><span className="text-emerald-600 font-medium">Best time:</span> Tue/Thu 10:00 AM</p><p><span className="text-emerald-600 font-medium">Strategy:</span> SEO-optimized, educational, internal links to products</p></>}
                            {selectedPlatform === "email" && <><p><span className="text-emerald-600 font-medium">Format:</span> Newsletter with CTA</p><p><span className="text-emerald-600 font-medium">Best time:</span> Thu 10:00 AM, Sun 9:00 AM</p><p><span className="text-emerald-600 font-medium">Strategy:</span> Personal tone, one clear CTA, mobile-first layout</p></>}
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })()}

                {/* ── Weekly Schedule ── */}
                <div className="space-y-4 pt-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-semibold flex items-center gap-2">
                      <Calendar className="h-4.5 w-4.5 text-violet-500" />
                      Weekly Schedule
                    </h3>
                    {autoPostEnabled && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 font-medium">Auto-posting at scheduled times</span>
                    )}
                  </div>

                  {/* Day topic banner */}
                  {DAILY_TOPICS[selectedDay] && (
                    <div className="rounded-xl border border-violet-200 bg-violet-50/50 px-4 py-2.5 flex items-center gap-2">
                      <span className="text-lg">{DAILY_TOPICS[selectedDay].emoji}</span>
                      <div>
                        <p className="text-xs font-semibold text-violet-900">{WEEK_DATES[selectedDay]?.label}&apos;s Topic</p>
                        <p className="text-sm font-bold text-violet-700">{DAILY_TOPICS[selectedDay].topic}</p>
                      </div>
                      <p className="text-[10px] text-violet-500 ml-auto">Same topic across all platforms</p>
                    </div>
                  )}

                  {/* Day picker */}
                  <div className="flex gap-1.5">
                    {WEEK_DATES.map((d, i) => {
                      const count = DEFAULT_SCHEDULE.filter((s) => s.day === i).length
                      const topic = DAILY_TOPICS[i]
                      return (
                        <button
                          key={i}
                          onClick={() => setSelectedDay(i)}
                          className={`flex-1 rounded-xl py-2.5 text-center transition-all ${
                            selectedDay === i
                              ? "bg-foreground text-background shadow-md"
                              : "bg-muted/40 border border-border/50 hover:bg-muted"
                          }`}
                        >
                          <p className="text-xs font-bold">{d.label}</p>
                          <p className={`text-[10px] ${selectedDay === i ? "text-background/60" : "text-muted-foreground"}`}>{d.date}</p>
                          {topic && <p className="text-lg mt-0.5">{topic.emoji}</p>}
                          {count > 0 && (
                            <div className="flex justify-center gap-0.5 mt-1">
                              {Array.from({ length: Math.min(count, 5) }).map((_, j) => (
                                <div key={j} className={`h-1 w-1 rounded-full ${selectedDay === i ? "bg-background/40" : "bg-violet-400"}`} />
                              ))}
                            </div>
                          )}
                        </button>
                      )
                    })}
                  </div>

                  {/* Day's posts */}
                  <div className="rounded-2xl border border-border/50 bg-background overflow-hidden">
                    {daySchedule.length === 0 ? (
                      <div className="py-8 text-center text-sm text-muted-foreground">No posts scheduled for this day</div>
                    ) : (
                      daySchedule.map((slot, i) => {
                        const p = PLATFORMS.find((pl) => pl.id === slot.platform)
                        return (
                          <div key={i} className="flex items-center gap-4 px-5 py-3.5 border-b border-border/30 last:border-b-0 hover:bg-muted/20 transition-colors">
                            <span className="text-xs text-muted-foreground w-16 shrink-0 font-mono">{slot.time}</span>
                            <div className={`h-7 w-7 rounded-lg bg-gradient-to-br ${p?.color || "from-gray-400 to-gray-600"} flex items-center justify-center text-[8px] font-bold text-white shrink-0`}>
                              {p?.icon || "?"}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">{slot.content}</p>
                              <p className="text-[10px] text-muted-foreground">{p?.name}</p>
                            </div>
                            <button
                              onClick={() => { setPreviewSlot(slot); setChangePrompt("") }}
                              className="px-2.5 py-1 rounded-lg bg-muted hover:bg-muted/80 border border-border text-[10px] font-medium text-foreground transition-all shrink-0"
                            >
                              View
                            </button>
                            {autoPostEnabled ? (
                              <span className="text-[9px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-medium shrink-0">Scheduled</span>
                            ) : (
                              <span className="text-[9px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground border border-border font-medium shrink-0">Draft</span>
                            )}
                          </div>
                        )
                      })
                    )}
                  </div>

                  {/* All platforms legend */}
                  <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
                    {PLATFORMS.map((p) => {
                      const count = DEFAULT_SCHEDULE.filter((s) => s.platform === p.id).length
                      return (
                        <span key={p.id} className="flex items-center gap-1.5">
                          <div className={`h-2.5 w-2.5 rounded bg-gradient-to-br ${p.color}`} />
                          {p.name}: {count} posts/week
                        </span>
                      )
                    })}
                  </div>
                </div>
              </>
            )}
          </div>
        </>
      )}

      {/* ═══════════════ POST PREVIEW MODAL ═══════════════ */}
      {previewSlot && (() => {
        const p = PLATFORMS.find((pl) => pl.id === previewSlot.platform)
        const baseContent = GENERATED_CONTENT[previewSlot.platform]
        if (!p || !baseContent) return null

        // Merge improved content on top of base
        const improved = improvedContent[previewSlot.platform]
        const displayText = improved?.text || baseContent.text
        const displayCaption = improved?.caption || baseContent.caption
        const displayHashtags = improved?.hashtags || baseContent.hashtags
        const displayImage = improved?.image || baseContent.image
        const hasImprovedText = Boolean(improved?.text || improved?.caption)
        const hasImprovedImage = Boolean(improved?.image && improved.image !== baseContent.image)

        const applyChanges = async () => {
          if (!changePrompt.trim()) return
          setSuggestingChange(true)
          try {
            // Call AI to improve text
            const res = await fetch("/api/demo/improve-content", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                currentText: displayText || undefined,
                currentCaption: displayCaption || undefined,
                currentHashtags: displayHashtags || undefined,
                suggestion: changePrompt,
                platform: previewSlot.platform,
                contentType: baseContent.type,
              }),
            })
            const data = await res.json()

            const updates: any = {}
            if (data.text) updates.text = data.text
            if (data.caption) updates.caption = data.caption
            if (data.hashtags) updates.hashtags = data.hashtags

            // If AI suggests an image change, use FLUX.2 Pro
            if (data.imagePrompt && baseContent.image) {
              setRegeneratingImage(true)
              try {
                const currentImg = displayImage || baseContent.image
                const imgRes = await fetch("/api/demo/edit-image", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ imageUrl: currentImg, prompt: data.imagePrompt }),
                })
                const imgData = await imgRes.json()
                if (imgData.imageUrl) updates.image = imgData.imageUrl
              } catch {}
              setRegeneratingImage(false)
            }

            setImprovedContent((prev) => ({
              ...prev,
              [previewSlot.platform]: { ...(prev[previewSlot.platform] || {}), ...updates },
            }))
          } catch {}
          setSuggestingChange(false)
          setChangePrompt("")
        }

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm" onClick={() => setPreviewSlot(null)}>
            <div className="w-full max-w-3xl mx-4 max-h-[90vh] overflow-y-auto rounded-3xl border border-border bg-background shadow-2xl" onClick={(e) => e.stopPropagation()}>
              {/* Header */}
              <div className="px-6 py-4 border-b border-border/50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`h-8 w-8 rounded-lg bg-gradient-to-br ${p.color} flex items-center justify-center text-[9px] font-bold text-white`}>{p.icon}</div>
                  <div>
                    <p className="text-sm font-semibold">{previewSlot.content}</p>
                    <p className="text-[10px] text-muted-foreground">{p.name} · {WEEK_DATES[previewSlot.day]?.label} at {previewSlot.time}</p>
                  </div>
                </div>
                <button onClick={() => setPreviewSlot(null)} className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
                  <XIcon className="h-4 w-4" />
                </button>
              </div>

              <div className="grid gap-6 lg:grid-cols-2 p-6">
                {/* Preview */}
                <div className="space-y-2">
                  {baseContent.video ? (
                    <div className="aspect-[9/16] max-h-[420px] rounded-xl overflow-hidden bg-black mx-auto" style={{ maxWidth: 240 }}>
                      <video src={baseContent.video} poster={displayImage} controls playsInline className="w-full h-full object-cover" />
                    </div>
                  ) : displayImage ? (
                    <div className="relative aspect-[4/5] max-h-[360px] rounded-xl overflow-hidden bg-muted/20 mx-auto" style={{ maxWidth: 280 }}>
                      <img src={displayImage} alt="" className="w-full h-full object-cover" />
                      {regeneratingImage && (
                        <div className="absolute inset-0 bg-background/60 flex items-center justify-center">
                          <div className="text-center">
                            <Loader2 className="h-6 w-6 animate-spin mx-auto text-violet-500 mb-2" />
                            <p className="text-xs font-medium">Regenerating image...</p>
                          </div>
                        </div>
                      )}
                      {hasImprovedImage && (
                        <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-emerald-500 text-white text-[9px] font-semibold">AI Updated</div>
                      )}
                    </div>
                  ) : displayText ? (
                    <div className="rounded-xl border border-border bg-muted/10 p-5">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="h-8 w-8 rounded-full overflow-hidden border border-border">
                          <img src={BRAND.logo} alt="" className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <p className="text-xs font-bold">{BRAND.name}</p>
                          <p className="text-[10px] text-muted-foreground">@growndiamondcorp</p>
                        </div>
                      </div>
                      <p className="text-sm leading-relaxed whitespace-pre-line">{displayText}</p>
                      <div className="flex items-center gap-6 mt-4 text-muted-foreground">
                        <MessageSquare className="h-3.5 w-3.5" />
                        <RefreshCw className="h-3.5 w-3.5" />
                        <Heart className="h-3.5 w-3.5" />
                        <Share2 className="h-3.5 w-3.5" />
                      </div>
                    </div>
                  ) : null}
                </div>

                {/* Details + Suggest Changes */}
                <div className="space-y-4">
                  <div className="space-y-3">
                    {displayCaption && (
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Caption</p>
                          {hasImprovedText && <span className="text-[8px] px-1.5 py-0.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200">Updated</span>}
                        </div>
                        <p className="text-sm text-foreground/80 leading-relaxed">{displayCaption}</p>
                      </div>
                    )}
                    {displayText && !displayCaption && (
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Text</p>
                          {hasImprovedText && <span className="text-[8px] px-1.5 py-0.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200">Updated</span>}
                        </div>
                        <p className="text-sm text-foreground/80 whitespace-pre-line leading-relaxed">{displayText}</p>
                      </div>
                    )}
                    {displayHashtags && (
                      <div>
                        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">Hashtags</p>
                        <p className="text-xs text-violet-600">{displayHashtags}</p>
                      </div>
                    )}
                  </div>

                  {/* Suggest Changes */}
                  <div className="rounded-xl border border-border bg-muted/10 p-4 space-y-3">
                    <h4 className="text-xs font-semibold flex items-center gap-1.5">
                      <Sparkles className="h-3.5 w-3.5 text-violet-500" />
                      Suggest Changes
                    </h4>
                    <p className="text-[10px] text-muted-foreground">
                      Describe what to change — AI will rewrite the text and regenerate the image if needed.
                    </p>
                    {suggestingChange ? (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        {regeneratingImage ? "Regenerating image..." : "AI is rewriting content..."}
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={changePrompt}
                          onChange={(e) => setChangePrompt(e.target.value)}
                          onKeyDown={(e) => { if (e.key === "Enter") applyChanges() }}
                          placeholder="e.g. Make it shorter, more urgency, warmer tone, different angle..."
                          className="flex-1 h-9 rounded-lg border border-border bg-background px-3 text-sm placeholder:text-muted-foreground/50"
                        />
                        <button
                          onClick={applyChanges}
                          disabled={!changePrompt.trim()}
                          className="px-4 h-9 rounded-lg bg-foreground text-background text-xs font-semibold transition-all disabled:opacity-40 flex items-center gap-1.5 shrink-0"
                        >
                          Apply
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      })()}
    </div>
  )
}
