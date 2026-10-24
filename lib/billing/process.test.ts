import { beforeEach, describe, expect, it } from "vitest"
import { processPayment, type BillingApi, type BillingStore, type MolliePayment, type PaymentRow } from "./process"
import { RENEWAL } from "@/lib/pricing"

type Row = PaymentRow & { start?: Date; end?: Date; country?: string | null; revoked?: boolean }

function fakes() {
  const rows = new Map<string, Row>()
  const customerSubs = new Map<string, string>()
  const live = new Map<string, string[]>()
  const created: Parameters<BillingApi["createSubscription"]>[0][] = []
  const cancelled: string[] = []
  const store: BillingStore = {
    async findPayment(id) {
      return rows.get(id) ?? null
    },
    async insertPayment(r) {
      if (!rows.has(r.molliePaymentId)) rows.set(r.molliePaymentId, { ...r, subscriptionId: null })
    },
    async setStatus(id, status) {
      const r = rows.get(id)
      if (r && r.status !== "paid") r.status = status
    },
    async latestPeriodEnd(userId, excluding) {
      const ends = [...rows.values()].filter((r) => r.userId === userId && r.molliePaymentId !== excluding && r.status === "paid" && !r.revoked && r.end).map((r) => r.end!.getTime())
      return ends.length ? new Date(Math.max(...ends)) : null
    },
    async claimPaid(id, p) {
      const r = rows.get(id)!
      if (r.status === "paid") return false
      Object.assign(r, { status: "paid", start: p.start, end: p.end, country: p.country })
      return true
    },
    async revoke(id) {
      rows.get(id)!.revoked = true
    },
    async setSubscription(id, userId, subId) {
      rows.get(id)!.subscriptionId = subId
      customerSubs.set(userId, subId)
    },
  }
  const api: BillingApi = {
    async liveSubscriptionIds(customerId) {
      return live.get(customerId) ?? []
    },
    async createSubscription(p) {
      created.push(p)
      const id = `sub_${created.length}`
      live.set(p.customerId, [...(live.get(p.customerId) ?? []), id])
      return id
    },
    async cancelSubscriptions(customerId) {
      cancelled.push(customerId)
      live.set(customerId, [])
    },
  }
  return { rows, customerSubs, live, created, cancelled, store, api }
}

const NOW = new Date("2026-10-24T10:00:00Z")
const meta = { kind: "pass", userId: "u1", planId: "3m" }

const first = (over: Partial<MolliePayment> = {}): MolliePayment => ({
  id: "tr_1",
  status: "paid",
  sequenceType: "first",
  customerId: "cst_1",
  paidAt: NOW.toISOString(),
  countryCode: "AT",
  amount: { value: "44.95" },
  metadata: meta,
  ...over,
})

const renewal = (id: string, paidAt: string, over: Partial<MolliePayment> = {}): MolliePayment => ({
  id,
  status: "paid",
  sequenceType: "recurring",
  customerId: "cst_1",
  subscriptionId: "sub_1",
  paidAt,
  countryCode: "AT",
  amount: { value: "19.95" },
  metadata: { kind: "pass", userId: "u1", planId: RENEWAL.id },
  ...over,
})

let f: ReturnType<typeof fakes>
const run = (p: MolliePayment) => processPayment(p, { store: f.store, api: f.api, webhookUrl: "https://x.test/api/mollie/webhook", now: NOW })

beforeEach(() => {
  f = fakes()
  f.rows.set("tr_1", { molliePaymentId: "tr_1", userId: "u1", planId: "3m", kind: "first", amountCents: 4495, status: "open", subscriptionId: null })
})

describe("first payment", () => {
  it("grants the plan's months and starts a monthly subscription after them", async () => {
    const r = await run(first())
    expect(r).toMatchObject({ outcome: "paid", activated: true, userId: "u1" })
    expect(f.rows.get("tr_1")!.end!.toISOString()).toBe("2027-01-24T10:00:00.000Z")
    expect(f.rows.get("tr_1")!.country).toBe("AT")
    expect(f.created).toHaveLength(1)
    expect(f.created[0]).toMatchObject({
      customerId: "cst_1",
      amountCents: RENEWAL.cents,
      interval: "1 month",
      startDate: "2027-01-24",
      idempotencyKey: "pass-sub-tr_1",
      metadata: { kind: "pass", userId: "u1", planId: RENEWAL.id },
    })
    expect(f.customerSubs.get("u1")).toBe("sub_1")
  })

  it("is idempotent across webhook, return poll and cron", async () => {
    await run(first())
    const again = await run(first())
    const third = await run(first())
    expect(again).toMatchObject({ outcome: "already", activated: false })
    expect(third.activated).toBe(false)
    expect(f.created).toHaveLength(1)
  })

  it("retries a subscription that failed to create, without granting twice", async () => {
    const create = f.api.createSubscription
    f.api.createSubscription = async () => {
      throw new Error("mollie down")
    }
    await expect(run(first())).rejects.toThrow("mollie down")
    expect(f.rows.get("tr_1")!.status).toBe("paid")
    f.api.createSubscription = create
    const r = await run(first())
    expect(r.activated).toBe(false)
    expect(f.created).toHaveLength(1)
  })

  it("does not start a second subscription when one is already live", async () => {
    f.live.set("cst_1", ["sub_old"])
    await run(first())
    expect(f.created).toHaveLength(0)
    expect(f.customerSubs.get("u1")).toBe("sub_old")
  })

  it("does not restart a subscription the learner cancelled", async () => {
    await run(first())
    f.live.set("cst_1", [])
    await run(first())
    expect(f.created).toHaveLength(1)
  })

  it("stacks a repurchase on a pass that is still running", async () => {
    f.rows.set("tr_0", { molliePaymentId: "tr_0", userId: "u1", planId: "1m", kind: "first", amountCents: 1995, status: "paid", subscriptionId: "sub_0", end: new Date("2026-11-01T00:00:00Z") })
    await run(first())
    expect(f.rows.get("tr_1")!.start!.toISOString()).toBe("2026-11-01T00:00:00.000Z")
    expect(f.rows.get("tr_1")!.end!.toISOString()).toBe("2027-02-01T00:00:00.000Z")
  })

  it("records a payment whose checkout row is missing", async () => {
    f.rows.delete("tr_1")
    const r = await run(first())
    expect(r.outcome).toBe("paid")
    expect(f.rows.get("tr_1")).toMatchObject({ userId: "u1", planId: "3m", kind: "first", amountCents: 4495 })
  })

  it("stores failed, expired and canceled statuses without granting", async () => {
    for (const status of ["failed", "expired", "canceled"] as const) {
      f.rows.get("tr_1")!.status = "open"
      const r = await run(first({ status, paidAt: undefined }))
      expect(r).toMatchObject({ outcome: "status", activated: false })
      expect(f.rows.get("tr_1")!.status).toBe(status)
    }
    expect(f.created).toHaveLength(0)
  })
})

describe("renewals", () => {
  beforeEach(async () => {
    await run(first())
  })

  it("adds one month from the old end, even when SEPA settles days later", async () => {
    const r = await run(renewal("tr_2", "2027-01-27T06:00:00Z"))
    expect(r).toMatchObject({ outcome: "paid", activated: false })
    expect(f.rows.get("tr_2")).toMatchObject({ kind: "renewal", planId: RENEWAL.id, amountCents: 1995 })
    expect(f.rows.get("tr_2")!.end!.toISOString()).toBe("2027-02-24T10:00:00.000Z")
    expect(f.created).toHaveLength(1)
  })

  it("never creates a subscription from a subscription payment", async () => {
    await run(renewal("tr_2", "2027-01-24T06:00:00Z"))
    await run(renewal("tr_3", "2027-02-24T06:00:00Z"))
    expect(f.created).toHaveLength(1)
    expect(f.rows.get("tr_3")!.end!.toISOString()).toBe("2027-03-24T10:00:00.000Z")
  })
})

describe("chargebacks and refunds", () => {
  it("revokes the period and stops further debits on a chargeback", async () => {
    await run(first())
    const r = await run(first({ amountChargedBack: { value: "44.95" } }))
    expect(r.outcome).toBe("revoked")
    expect(f.rows.get("tr_1")!.revoked).toBe(true)
    expect(f.cancelled).toEqual(["cst_1"])
  })

  it("revokes on a full refund but keeps access on a partial one", async () => {
    await run(first())
    expect((await run(first({ amountRefunded: { value: "10.00" } }))).outcome).toBe("already")
    expect(f.rows.get("tr_1")!.revoked).toBeUndefined()
    expect((await run(first({ amountRefunded: { value: "44.95" } }))).outcome).toBe("revoked")
  })
})

describe("foreign payments", () => {
  it("ignores payments that are not a Prüfungspass", async () => {
    const r = await run(first({ id: "tr_x", metadata: { kind: "modules", userId: "u1" } }))
    expect(r.outcome).toBe("ignored")
    expect(f.rows.has("tr_x")).toBe(false)
  })
})
