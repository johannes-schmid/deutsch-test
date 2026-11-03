/** Streaming transcription through Vercel AI Gateway; the model id the token route mints for. */
export const LIVE_STT_MODEL = "elevenlabs/scribe-v2-realtime"

/**
 * Shows the learner what we hear while they speak. Display only: the graded transcript comes from the uploaded
 * recording on the server. Loaded on demand so the runner stays light; resolves when the audio stream ends.
 */
export async function liveTranscript(token: string, audio: ReadableStream<Uint8Array>, onText: (text: string) => void) {
  const [{ experimental_streamTranscribe: streamTranscribe }, { createGateway }] = await Promise.all([import("ai"), import("@ai-sdk/gateway")])
  const gateway = createGateway({ apiKey: token })
  const result = streamTranscribe({
    model: gateway.transcriptionModel(LIVE_STT_MODEL),
    audio,
    inputAudioFormat: { type: "audio/pcm", rate: 16000 },
    providerOptions: { elevenlabs: { languageCode: "de", streaming: { commitStrategy: "vad" } } },
  })
  let done = ""
  let part = ""
  for await (const p of result.fullStream) {
    if (p.type === "transcript-partial") part = p.text
    else if (p.type === "transcript-delta") part += p.delta
    else if (p.type === "transcript-final") {
      done = `${done} ${p.text}`.trim()
      part = ""
    } else if (p.type === "error") throw p.error
    else continue
    onText(`${done} ${part}`.replace(/\[[^\]]*\]/g, " ").replace(/\s+/g, " ").trim())
  }
}
