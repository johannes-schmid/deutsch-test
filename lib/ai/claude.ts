import "server-only"
import Anthropic from "@anthropic-ai/sdk"

// Live site calls (grading, Sprechen partner) go through Vercel AI Gateway for spend control. Content
// generation in scripts/ stays on the direct Anthropic API (Batches discount).
export const claude = new Anthropic({
  apiKey: process.env.AI_GATEWAY_API_KEY,
  baseURL: "https://ai-gateway.vercel.sh",
})

export const OPUS = "anthropic/claude-opus-5.5"
export const HAIKU = "anthropic/claude-haiku-5.5"
