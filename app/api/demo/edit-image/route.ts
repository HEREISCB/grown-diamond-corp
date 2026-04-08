import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"
export const maxDuration = 60

const CLAID_API_KEY = process.env.CLAID_API_KEY || ""
const CLAID_SUBMIT = "https://api.claid.ai/v1/image/ai-edit"

/**
 * POST /api/demo/edit-image
 * Image → R2 (public URL) → Claid AI Edit → poll → return result URL
 */
export async function POST(req: Request) {
  const body = await req.json().catch(() => null)
  if (!body) return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })

  const { imageUrl, prompt } = body
  if (!imageUrl || !prompt) return NextResponse.json({ error: "imageUrl and prompt required" }, { status: 400 })

  if (!CLAID_API_KEY) return NextResponse.json({ error: "CLAID_API_KEY not set" }, { status: 500 })

  try {
    // Build a public URL for the image
    let publicUrl = imageUrl
    if (imageUrl.startsWith("/")) {
      const host = process.env.NEXT_PUBLIC_SITE_URL || req.headers.get("origin") || "http://localhost:3000"
      publicUrl = `${host}${imageUrl}`
    }

    const editPrompt = `Keep the overall composition, layout, branding, text overlays, and style exactly the same. Only apply this change: ${prompt}`

    // Submit
    const submitRes = await fetch(CLAID_SUBMIT, {
      method: "POST",
      headers: { Authorization: `Bearer ${CLAID_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        input: publicUrl,
        options: { model: "v2", prompt: editPrompt },
      }),
    })
    const submitData = await submitRes.json()
    if (!submitRes.ok) {
      console.error("[demo] Claid submit failed:", submitData)
      return NextResponse.json({ error: submitData?.error_message || "Submit failed" }, { status: 500 })
    }

    const taskId = submitData?.data?.id
    if (!taskId) return NextResponse.json({ error: "No task ID" }, { status: 500 })

    // Poll (max 60s)
    for (let i = 0; i < 30; i++) {
      await new Promise((r) => setTimeout(r, 2000))
      const pollRes = await fetch(`${CLAID_SUBMIT}/${taskId}`, {
        headers: { Authorization: `Bearer ${CLAID_API_KEY}` },
      })
      const pollData = await pollRes.json()
      const status = pollData?.data?.status

      if (status === "DONE") {
        const outUrl = pollData?.data?.result?.output_objects?.[0]?.tmp_url
        if (outUrl) return NextResponse.json({ imageUrl: outUrl })
        return NextResponse.json({ error: "Done but no output URL" }, { status: 500 })
      }
      if (status === "FAILED" || status === "ERROR") {
        return NextResponse.json({ error: "Image edit failed" }, { status: 500 })
      }
    }

    return NextResponse.json({ error: "Timed out" }, { status: 504 })
  } catch (err: any) {
    console.error("[demo] Edit image error:", err.message)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
