import { NextResponse } from "next/server"
import OpenAI from "openai"

export const dynamic = "force-dynamic"

export async function POST(req: Request) {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) return NextResponse.json({ error: "No API key" }, { status: 500 })

  const body = await req.json().catch(() => null)
  if (!body) return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })

  const { currentText, currentCaption, currentHashtags, suggestion, platform, contentType } = body

  try {
    const openai = new OpenAI({ apiKey })

    const parts: string[] = [
      `You are improving social media content for Grown Diamond Corporation (luxury lab-grown diamonds).`,
      `Platform: ${platform}`,
      `Content type: ${contentType}`,
      `\nUser's change request: "${suggestion}"`,
    ]

    if (currentText) parts.push(`\nCurrent text:\n${currentText}`)
    if (currentCaption) parts.push(`\nCurrent caption:\n${currentCaption}`)
    if (currentHashtags) parts.push(`\nCurrent hashtags: ${currentHashtags}`)

    parts.push(`\nApply the user's requested changes. Keep the brand voice (premium, aspirational, confident). Return JSON only:`)
    parts.push(`{`)
    if (currentText) parts.push(`  "text": "improved text",`)
    if (currentCaption) parts.push(`  "caption": "improved caption",`)
    if (currentHashtags) parts.push(`  "hashtags": "improved hashtags",`)
    parts.push(`  "imagePrompt": "if the visual should change based on the suggestion, provide a detailed image generation prompt. Otherwise set to null"`)
    parts.push(`}`)

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: parts.join("\n") }],
      temperature: 0.7,
      max_tokens: 1000,
      response_format: { type: "json_object" },
    })

    const text = response.choices[0]?.message?.content || "{}"
    const parsed = JSON.parse(text)
    return NextResponse.json(parsed)
  } catch (err: any) {
    console.error("[demo] Improve content failed:", err.message)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
