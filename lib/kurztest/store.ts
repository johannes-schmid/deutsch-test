import "server-only"
import fs from "node:fs"
import path from "node:path"
import { get, list as blobList, put as blobPut } from "@vercel/blob"

// Vercel Blob (private store) when credentials exist; plain files under .data/ in local dev.
// One record per file, so concurrent writes never race.

const useBlob = () => !!(process.env.BLOB_READ_WRITE_TOKEN || process.env.BLOB_STORE_ID)
const LOCAL = path.join(process.cwd(), ".data")

function assertWritable() {
  if (!useBlob() && process.env.VERCEL) throw new Error("Blob store is not connected (BLOB_READ_WRITE_TOKEN missing)")
}

export async function putJson(pathname: string, data: unknown) {
  assertWritable()
  const body = JSON.stringify(data)
  if (useBlob()) {
    await blobPut(pathname, body, { access: "private", contentType: "application/json", allowOverwrite: true, addRandomSuffix: false })
    return
  }
  const file = path.join(LOCAL, pathname)
  fs.mkdirSync(path.dirname(file), { recursive: true })
  fs.writeFileSync(file, body)
}

export async function getJson<T>(pathname: string): Promise<T | null> {
  if (useBlob()) {
    const res = await get(pathname, { access: "private", useCache: false })
    if (!res || res.statusCode !== 200 || !res.stream) return null
    return JSON.parse(await new Response(res.stream).text()) as T
  }
  const file = path.join(LOCAL, pathname)
  return fs.existsSync(file) ? (JSON.parse(fs.readFileSync(file, "utf8")) as T) : null
}

/** Every entry under a prefix, paginated (a single page caps at 1,000). */
export async function listEntries(prefix: string): Promise<{ pathname: string; uploadedAt: Date }[]> {
  if (useBlob()) {
    const out: { pathname: string; uploadedAt: Date }[] = []
    let cursor: string | undefined
    do {
      const page = await blobList({ prefix, cursor, limit: 1000 })
      out.push(...page.blobs.map((b) => ({ pathname: b.pathname, uploadedAt: b.uploadedAt })))
      cursor = page.hasMore ? page.cursor : undefined
    } while (cursor)
    return out
  }
  const root = path.join(LOCAL, prefix)
  if (!fs.existsSync(root)) return []
  return (fs.readdirSync(root, { recursive: true }) as string[])
    .map((f) => path.join(prefix, f))
    .map((p) => ({ p, stat: fs.statSync(path.join(LOCAL, p)) }))
    .filter(({ stat }) => stat.isFile())
    .map(({ p, stat }) => ({ pathname: p, uploadedAt: stat.mtime }))
}

export const listPaths = async (prefix: string) => (await listEntries(prefix)).map((e) => e.pathname)
