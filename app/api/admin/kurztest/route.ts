import { isAdmin } from "@/lib/admin-auth"
import { leads } from "@/lib/kurztest/stats"

const cell = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`

export async function GET(req: Request) {
  if (!isAdmin(req.headers.get("authorization"))) return new Response("Not found", { status: 404 })
  const rows = await leads()
  const csv = [["datum", "email", "pruefung", "teil", "ergebnis", "tipps", "id"], ...rows.map((l) => [l.at, l.email, l.exam ?? "dtz", l.skill, l.level, l.marketing ? "ja" : "nein", l.id])].map((r) => r.map(cell).join(",")).join("\n")
  return new Response(csv, { headers: { "Content-Type": "text/csv; charset=utf-8", "Content-Disposition": `attachment; filename="kurztest-leads-${new Date().toISOString().slice(0, 10)}.csv"`, "Cache-Control": "no-store" } })
}
