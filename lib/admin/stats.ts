import "server-only"
import { cache } from "react"
import { createAdminClient } from "@/lib/supabase/admin"
import { computeSales, type SaleCustomer, type SalePayment, type Sales } from "@/lib/admin/sales"

export type WeekSignups = { week: string; signups: number }

/** Account signups per week (Monday, Berlin time), newest first, empty weeks included. */
export const signupsPerWeek = cache(async (): Promise<WeekSignups[]> => {
  const { data, error } = await createAdminClient().rpc("admin_signups_per_week")
  if (error) throw error
  return (data as { week: string; signups: number }[]).map((r) => ({ week: r.week, signups: Number(r.signups) }))
})

/** Every row of a query, in 1,000-row pages (PostgREST caps a plain select there). */
async function pages<T>(page: (from: number, to: number) => PromiseLike<{ data: T[] | null; error: { message: string } | null }>) {
  const rows: T[] = []
  for (let from = 0; ; from += 1000) {
    const { data, error } = await page(from, from + 999)
    if (error) throw new Error(`[admin/stats] ${error.message}`)
    rows.push(...(data ?? []))
    if ((data?.length ?? 0) < 1000) return rows
  }
}

export type SalesView = Omit<Sales, "cancellations"> & { cancellations: (Sales["cancellations"][number] & { email: string | null })[] }

export const salesOverview = cache(async (): Promise<SalesView> => {
  const db = createAdminClient()
  const [payments, customers, signups] = await Promise.all([
    pages<SalePayment>((from, to) =>
      db.from("payments").select("user_id, plan_id, kind, amount_cents, paid_at, period_ends_at, revoked_at").eq("status", "paid").not("paid_at", "is", null).order("paid_at").range(from, to),
    ),
    pages<SaleCustomer>((from, to) => db.from("mollie_customers").select("user_id, subscription_id, canceled_at").order("user_id").range(from, to)),
    signupsPerWeek(),
  ])
  const sales = computeSales({ payments, customers, signups })
  const cancellations = await Promise.all(
    sales.cancellations.map(async (c) => ({ ...c, email: (await db.auth.admin.getUserById(c.userId)).data.user?.email ?? null })),
  )
  return { ...sales, cancellations }
})
