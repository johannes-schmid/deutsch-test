/**
 * One microphone for a whole Sprechen run: the stream for MediaRecorder (the graded upload), a real input level for the
 * meter and the pause detection, and 16 kHz PCM for the live transcript. Opened once in the mic check, where the
 * learner's click also unlocks audio playback.
 */

// Level: RMS in dB, -60 dB → 0, -10 dB → 1. Speech on a laptop or phone mic sits around 0.4–0.7, a dead input near 0.
export const SPEECH_LEVEL = 0.3

const PCM_RATE = 16000

// Averages each block of input samples down to 16 kHz Int16 and posts ~100 ms chunks.
const WORKLET = `
class Pcm16k extends AudioWorkletProcessor {
  constructor() {
    super()
    this.ratio = sampleRate / ${PCM_RATE}
    this.pos = 0; this.acc = 0; this.cnt = 0; this.n = 0
    this.buf = new Int16Array(${PCM_RATE / 10})
    this.port.onmessage = () => this.flush()
  }
  flush() {
    if (!this.n) return
    const out = this.buf.slice(0, this.n)
    this.port.postMessage(out.buffer, [out.buffer])
    this.n = 0
  }
  process(inputs) {
    const ch = inputs[0] && inputs[0][0]
    if (!ch) return true
    for (let i = 0; i < ch.length; i++) {
      this.acc += ch[i]; this.cnt++; this.pos += 1
      if (this.pos >= this.ratio) {
        this.pos -= this.ratio
        const s = Math.max(-1, Math.min(1, this.acc / this.cnt))
        this.buf[this.n++] = s < 0 ? s * 0x8000 : s * 0x7fff
        this.acc = 0; this.cnt = 0
        if (this.n === this.buf.length) this.flush()
      }
    }
    return true
  }
}
registerProcessor("pcm16k", Pcm16k)
`

export type MicError = "unsupported" | "denied" | "failed"

export class MicSession {
  private worklet: Promise<void> | null = null
  private samples: Float32Array<ArrayBuffer>

  private constructor(
    readonly stream: MediaStream,
    private ctx: AudioContext,
    private source: MediaStreamAudioSourceNode,
    private analyser: AnalyserNode,
  ) {
    this.samples = new Float32Array(analyser.fftSize)
  }

  static async open(deviceId?: string): Promise<MicSession> {
    if (!navigator.mediaDevices?.getUserMedia || typeof AudioContext === "undefined") throw new Error("unsupported" satisfies MicError)
    let stream: MediaStream
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: { ...(deviceId ? { deviceId: { exact: deviceId } } : {}), echoCancellation: true, noiseSuppression: true, autoGainControl: true } })
    } catch (e) {
      throw new Error((e instanceof DOMException && (e.name === "NotAllowedError" || e.name === "SecurityError") ? "denied" : "failed") satisfies MicError)
    }
    const ctx = new AudioContext()
    const source = ctx.createMediaStreamSource(stream)
    const analyser = ctx.createAnalyser()
    analyser.fftSize = 1024
    source.connect(analyser)
    return new MicSession(stream, ctx, source, analyser)
  }

  /** Browsers start an AudioContext suspended until the page had a click; call from a click handler. */
  resume() {
    return this.ctx.state === "running" ? Promise.resolve() : this.ctx.resume()
  }

  get running() {
    return this.ctx.state === "running"
  }

  /** The input device stopped (unplugged headset, permission revoked): reopen before the next answer. */
  get ended() {
    return this.stream.getAudioTracks().every((t) => t.readyState === "ended")
  }

  get deviceId() {
    return this.stream.getAudioTracks()[0]?.getSettings().deviceId
  }

  level() {
    this.analyser.getFloatTimeDomainData(this.samples)
    let sum = 0
    for (const s of this.samples) sum += s * s
    const db = 20 * Math.log10(Math.sqrt(sum / this.samples.length) || 1e-8)
    return Math.min(1, Math.max(0, (db + 60) / 50))
  }

  /** Raw 16 kHz mono PCM16 from now on, for the live transcript; `stop()` ends the stream. */
  async pcm(): Promise<{ audio: ReadableStream<Uint8Array>; stop: () => void }> {
    this.worklet ??= this.ctx.audioWorklet.addModule(URL.createObjectURL(new Blob([WORKLET], { type: "text/javascript" })))
    await this.worklet
    const node = new AudioWorkletNode(this.ctx, "pcm16k")
    const sink = this.ctx.createGain()
    sink.gain.value = 0
    let open = true
    let ctl!: ReadableStreamDefaultController<Uint8Array>
    const audio = new ReadableStream<Uint8Array>({ start: (c) => void (ctl = c) })
    node.port.onmessage = (e: MessageEvent<ArrayBuffer>) => open && ctl.enqueue(new Uint8Array(e.data))
    this.source.connect(node)
    node.connect(sink).connect(this.ctx.destination)
    const stop = () => {
      if (!open) return
      node.port.postMessage("flush")
      setTimeout(() => {
        open = false
        node.disconnect()
        sink.disconnect()
        try {
          ctl.close()
        } catch {}
      }, 150)
    }
    return { audio, stop }
  }

  close() {
    this.stream.getTracks().forEach((t) => t.stop())
    void this.ctx.close().catch(() => {})
  }
}

export async function audioInputs() {
  const all = await navigator.mediaDevices?.enumerateDevices?.().catch(() => [])
  return (all ?? []).filter((d) => d.kind === "audioinput" && d.deviceId && d.deviceId !== "default" && d.deviceId !== "communications")
}
