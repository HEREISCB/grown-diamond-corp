import { NextResponse } from "next/server"
import OpenAI from "openai"

export const dynamic = "force-dynamic"

export async function POST() {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) return NextResponse.json({ error: "No API key" }, { status: 500 })

  try {
    const openai = new OpenAI({ apiKey })

    const now = new Date()
    const month = now.toLocaleString("en-US", { month: "long" })
    const year = now.getFullYear()

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{
        role: "user",
        content: `You are a social media trend researcher for a luxury lab-grown diamond brand (Grown Diamond Corporation).

Current month: ${month} ${year}

Research and list 8 trending topics/content ideas that are relevant RIGHT NOW for a lab-grown diamond brand to post about. Consider:
- Current events, seasons, holidays this month
- Trending social media formats and topics
- Diamond industry news and trends
- Consumer behavior trends in luxury/jewelry

Return JSON only:
{ "topics": ["topic 1", "topic 2", ...] }

Each topic should be a specific, actionable content idea (not generic). Example: "Valentine's Day engagement ring guide" not just "engagement rings".`
      }],
      temperature: 1.0,
      max_tokens: 500,
      response_format: { type: "json_object" },
    })

    const parsed = JSON.parse(response.choices[0]?.message?.content || "{}")
    return NextResponse.json({ topics: parsed.topics || [] })
  } catch (err: any) {
    console.error("[demo] Trending failed:", err.message)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
