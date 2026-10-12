import "server-only"

/** ElevenLabs Speech to Text. Audio is transcribed and discarded; we never store recordings. */
export async function transcribe(file: Blob): Promise<string> {
  const form = new FormData()
  form.append("model_id", "scribe_v2")
  form.append("language_code", "de")
  form.append("file", file, "answer.webm")
  const res = await fetch("https://api.elevenlabs.io/v1/speech-to-text", {
    method: "POST",
    headers: { "xi-api-key": process.env.ELEVENLABS_API_KEY ?? "" },
    body: form,
  })
  if (!res.ok) throw new Error(`Speech to text failed (${res.status})`)
  const data = (await res.json()) as { text?: string }
  return (data.text ?? "").trim()
}
