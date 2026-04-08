import { NextResponse } from "next/server"
import OpenAI from "openai"

export const dynamic = "force-dynamic"

const PROMPT = `You are a social media content expert. Given a brand and topic, generate platform-specific content.

BRAND: Grown Diamond Corporation
INDUSTRY: Luxury Lab-Grown Diamonds
VOICE: Premium, confident, aspirational. Speaks to discerning buyers who value craftsmanship and innovation.
WEBSITE: growndiamondcorp.com

Generate content for these platforms. Return JSON only, no markdown:
{
  "x": {
    "text": "A punchy tweet (max 280 chars). Provocative, educational, or hot-take style. No hashtags in main text.",
    "thread": ["optional 2-3 follow-up tweets for a thread, each max 280 chars"]
  },
  "facebook": {
    "caption": "A warm, community-focused Facebook post (2-3 sentences). Conversational tone, question at the end to drive comments.",
    "hashtags": "#relevant #hashtags"
  },
  "linkedin": {
    "text": "A thought-leadership LinkedIn post. Use line breaks for readability. 150-200 words. End with a question."
  }
}`

export async function POST() {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) return NextResponse.json({ error: "No API key" }, { status: 500 })

  try {
    const openai = new OpenAI({ apiKey })
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: PROMPT }],
      temperature: 0.9,
      max_tokens: 1500,
      response_format: { type: "json_object" },
    })

    const text = response.choices[0]?.message?.content || "{}"
    const parsed = JSON.parse(text)
    return NextResponse.json(parsed)
  } catch (err: any) {
    console.error("[demo] Caption generation failed:", err.message)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
