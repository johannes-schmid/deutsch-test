import "server-only"

/**
 * The few Apify REST calls the weekly scan needs (https://docs.apify.com/api/v2). A run is started and left alone;
 * two hours later the second cron reads its dataset. Nothing here blocks on a run, so the function never waits
 * out Apify's 300 s synchronous cap.
 */

const API = "https://api.apify.com/v2"

export const apifyConfigured = () => Boolean(process.env.APIFY_API_KEY)

async function call<T>(path: string, init?: RequestInit): Promise<T> {
  const token = process.env.APIFY_API_KEY
  if (!token) throw new Error("APIFY_API_KEY missing")
  const res = await fetch(`${API}${path}`, { ...init, headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json", ...(init?.headers ?? {}) } })
  if (!res.ok) throw new Error(`Apify ${init?.method ?? "GET"} ${path}: ${res.status} ${(await res.text()).slice(0, 200)}`)
  return (await res.json()) as T
}

export type ApifyRun = { id: string; status: string; defaultDatasetId: string; statusMessage?: string }

/** Starts an Actor run (`username~name`) and returns at once. */
export async function startRun(actor: string, input: unknown): Promise<ApifyRun> {
  const { data } = await call<{ data: ApifyRun }>(`/acts/${actor}/runs`, { method: "POST", body: JSON.stringify(input) })
  return data
}

export async function runStatus(runId: string): Promise<ApifyRun> {
  const { data } = await call<{ data: ApifyRun }>(`/actor-runs/${runId}`)
  return data
}

/** Terminal states per the Apify docs; everything else is still going. */
export const runFinished = (status: string) => ["SUCCEEDED", "FAILED", "ABORTED", "TIMED-OUT"].includes(status)

export async function datasetItems(datasetId: string, limit = 1000): Promise<unknown[]> {
  return call<unknown[]>(`/datasets/${datasetId}/items?clean=true&format=json&limit=${limit}`)
}
