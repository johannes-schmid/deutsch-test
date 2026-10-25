// Local page for filling picture slots by hand: lists every photo slot without a photo (plus the ones picked here),
// searches Pexels through this server (the key stays here), and on a pick writes the same 800 px WebP, credit and lock
// entry that images-options.ts writes after its fit check. Seed the changed sets afterwards.
//
// npx tsx --env-file=.env.local scripts/modelltest/photo-picker.ts   → http://localhost:3010

import { execFileSync } from "node:child_process"
import fs from "node:fs"
import http from "node:http"
import path from "node:path"
import type { MtBlock, MtSet } from "@/lib/modelltest/types"

const KEY = process.env.PEXELS_API_KEY
if (!KEY) throw new Error("PEXELS_API_KEY missing (run with --env-file=.env.local)")
const PORT = 3010
const DATA = "data/modelltest"
const LOCK = `${DATA}/photos.lock.json`
const PICKED = ".unit-cache/photo-picker.json"

type Lock = Record<string, { pexelsId: number; query: string; skipped: number[]; fitted?: boolean; picked?: boolean }>
type Slot = { slot: string; file: string; where: string; label: string; plan: string; query: string; others: string[]; src?: string; pexelsId?: number }

const readJson = <T,>(f: string, fallback: T): T => (fs.existsSync(f) ? JSON.parse(fs.readFileSync(f, "utf8")) : fallback)

function targets(b: MtBlock) {
  const out: { n: number; key: string; label: string; set: (src: string) => void }[] = []
  for (const it of b.display.items) {
    if (it.type === "picture") for (const o of it.item.options) out.push({ n: it.item.n, key: o.key, label: o.label, set: (src) => (o.image = src) })
    if (it.type === "match") for (const a of it.data.ads) out.push({ n: 0, key: a.key, label: a.text || a.title, set: (src) => (a.image = src) })
  }
  for (const sc of b.display.speaking?.data.scenes ?? []) out.push({ n: 0, key: sc.key, label: sc.label, set: (src) => (sc.image = src) })
  return out
}

function slots(): Slot[] {
  const picked = new Set(readJson<string[]>(PICKED, []))
  const out: Slot[] = []
  for (const exam of fs.readdirSync(DATA).filter((d) => fs.statSync(`${DATA}/${d}`).isDirectory()).sort()) {
    for (const f of fs.readdirSync(`${DATA}/${exam}`).filter((f) => f.endsWith(".json")).sort()) {
      const set = readJson<MtSet>(`${DATA}/${exam}/${f}`, {} as MtSet)
      for (const b of set.blocks ?? []) {
        const ts = targets(b)
        for (const t of ts) {
          const ph = b.photos?.[t.n]?.[t.key]
          if (!ph || ph.draw) continue
          const slot = `${b.id}/${t.n}/${t.key}`
          if (ph.src && !picked.has(slot)) continue
          out.push({
            slot,
            file: `${exam}/${f}`,
            where: `${exam} · ${f.replace(".json", "")} · Teil ${b.teil}${t.n ? ` · item ${t.n}` : ""} · ${t.key}`,
            label: t.label,
            plan: ph.alt,
            query: ph.query,
            others: ts.filter((o) => o.n === t.n && o.key !== t.key).map((o) => `${o.key}: ${o.label}`),
            src: ph.src,
            pexelsId: ph.credit?.pexelsId,
          })
        }
      }
    }
  }
  return out
}

async function pick(slot: string, pexelsId: number) {
  const s = slots().find((x) => x.slot === slot)
  if (!s) throw new Error(`unknown slot ${slot}`)
  const lock = readJson<Lock>(LOCK, {})
  const owner = Object.entries(lock).find(([k, v]) => k !== slot && v.pexelsId === pexelsId)
  if (owner) throw new Error(`Pexels ${pexelsId} is already used for ${owner[0]}`)
  const res = await fetch(`https://api.pexels.com/v1/photos/${pexelsId}`, { headers: { Authorization: KEY! } })
  if (!res.ok) throw new Error(`Pexels ${res.status}`)
  const photo = (await res.json()) as { id: number; url: string; photographer: string; src: { large2x: string } }

  const file = `${DATA}/${s.file}`
  const set = readJson<MtSet>(file, {} as MtSet)
  const [blockId, n, key] = slot.split("/")
  const b = set.blocks.find((x) => x.id === blockId)!
  const t = targets(b).find((x) => x.n === Number(n) && x.key === key)!
  const dir = s.file.replace(".json", "")
  const name = `${blockId}-${n}-${key}.webp`
  const out = path.join(".unit-cache/images", dir, name)
  fs.mkdirSync(path.dirname(out), { recursive: true })
  const raw = `${out}.jpg`
  fs.writeFileSync(raw, Buffer.from(await (await fetch(photo.src.large2x)).arrayBuffer()))
  execFileSync("ffmpeg", ["-hide_banner", "-loglevel", "error", "-y", "-i", raw, "-vf", "scale=800:800:force_original_aspect_ratio=increase,crop=800:800", "-c:v", "libwebp", "-quality", "72", out])
  fs.rmSync(raw)

  const ph = b.photos![Number(n)][key]
  b.photos![Number(n)][key] = { ...ph, src: `${dir}/${name}`, credit: { name: photo.photographer, url: photo.url, pexelsId: photo.id } }
  t.set(`${dir}/${name}`)
  fs.writeFileSync(file, JSON.stringify(set, null, 2) + "\n")

  const prev = lock[slot]
  lock[slot] = { pexelsId: photo.id, query: ph.query, skipped: prev?.query === ph.query ? prev.skipped : [], fitted: true, picked: true }
  fs.writeFileSync(LOCK, JSON.stringify(Object.fromEntries(Object.entries(lock).sort()), null, 2) + "\n")
  const picked = new Set(readJson<string[]>(PICKED, []))
  picked.add(slot)
  fs.mkdirSync(path.dirname(PICKED), { recursive: true })
  fs.writeFileSync(PICKED, JSON.stringify([...picked].sort(), null, 2) + "\n")
  console.log(`✓ ${slot}: ${photo.url}`)
}

const send = (res: http.ServerResponse, status: number, body: unknown, type = "application/json") => {
  res.writeHead(status, { "content-type": type, "cache-control": "no-store" })
  res.end(type === "application/json" ? JSON.stringify(body) : (body as string | Buffer))
}

http
  .createServer(async (req, res) => {
    const url = new URL(req.url ?? "/", `http://localhost:${PORT}`)
    try {
      if (url.pathname === "/") return send(res, 200, PAGE, "text/html; charset=utf-8")
      if (url.pathname === "/api/slots") return send(res, 200, slots())
      if (url.pathname === "/api/search") {
        const params = new URLSearchParams({ query: url.searchParams.get("q") ?? "", per_page: "30", page: url.searchParams.get("page") ?? "1" })
        const orientation = url.searchParams.get("orientation")
        if (orientation) params.set("orientation", orientation)
        const r = await fetch(`https://api.pexels.com/v1/search?${params}`, { headers: { Authorization: KEY! } })
        if (!r.ok) return send(res, r.status, { error: `Pexels ${r.status}` })
        const j = (await r.json()) as { total_results: number; next_page?: string; photos: { id: number; url: string; photographer: string; alt: string; width: number; height: number; src: { medium: string; large: string } }[] }
        const used = new Map(Object.entries(readJson<Lock>(LOCK, {})).map(([k, v]) => [v.pexelsId, k]))
        return send(res, 200, {
          total: j.total_results,
          more: !!j.next_page,
          photos: j.photos.map((p) => ({ id: p.id, url: p.url, by: p.photographer, alt: p.alt, w: p.width, h: p.height, thumb: p.src.large, usedBy: used.get(p.id) })),
        })
      }
      if (url.pathname === "/api/pick" && req.method === "POST") {
        let body = ""
        for await (const c of req) body += c
        const { slot, pexelsId } = JSON.parse(body) as { slot: string; pexelsId: number }
        await pick(slot, Number(pexelsId))
        return send(res, 200, { ok: true })
      }
      if (url.pathname.startsWith("/img/")) {
        const f = path.resolve(".unit-cache/images", decodeURIComponent(url.pathname.slice(5)))
        if (!f.startsWith(path.resolve(".unit-cache/images")) || !fs.existsSync(f)) return send(res, 404, { error: "not found" })
        return send(res, 200, fs.readFileSync(f), "image/webp")
      }
      send(res, 404, { error: "not found" })
    } catch (e) {
      send(res, 500, { error: e instanceof Error ? e.message : String(e) })
    }
  })
  .listen(PORT, "127.0.0.1", () => console.log(`Photo picker: http://localhost:${PORT}`))

const PAGE = /* html */ `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Photo Picker</title>
<style>
:root { --bg:#f3f4f7; --surface:#fff; --ink:#161a24; --muted:#5d6475; --line:#dde0e8; --accent:#2f4fd8; --accent-soft:#e6eafc; --ok:#1d7a4a; --ok-soft:#e1f3e8; --warn:#9a5a00; --warn-soft:#fbefd9; }
@media (prefers-color-scheme: dark) { :root { --bg:#0f121a; --surface:#171b26; --ink:#e8eaf1; --muted:#9aa1b4; --line:#2a3040; --accent:#8fa6ff; --accent-soft:#232c4d; --ok:#6fd39c; --ok-soft:#17332a; --warn:#f0b860; --warn-soft:#3a2c14; color-scheme: dark; } }
* { box-sizing: border-box; }
body { margin:0; background:var(--bg); color:var(--ink); font:14px/1.5 ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif; }
.app { display:grid; grid-template-columns: 300px minmax(0,1fr); min-height:100vh; }
aside { background:var(--surface); border-right:1px solid var(--line); padding:16px 12px; position:sticky; top:0; height:100vh; overflow:auto; }
aside h1 { font-size:16px; margin:0 4px 4px; }
.count { color:var(--muted); margin:0 4px 12px; font-variant-numeric: tabular-nums; }
.slotbtn { display:block; width:100%; text-align:left; border:1px solid transparent; background:none; color:inherit; font:inherit; border-radius:8px; padding:8px 10px; cursor:pointer; }
.slotbtn:hover { background:var(--bg); }
.slotbtn[aria-current="true"] { background:var(--accent-soft); border-color:var(--accent); }
.slotbtn .w { font:11px/1.3 ui-monospace, Menlo, monospace; color:var(--muted); }
.slotbtn .l { display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; }
.dot { display:inline-block; width:8px; height:8px; border-radius:50%; background:var(--warn); margin-right:6px; vertical-align:middle; }
.done .dot { background:var(--ok); }
main { padding:20px 24px 60px; display:grid; gap:16px; align-content:start; min-width:0; }
.brief { background:var(--surface); border:1px solid var(--line); border-radius:12px; padding:16px 18px; display:grid; gap:8px; }
.brief .w { font:12px ui-monospace, Menlo, monospace; color:var(--muted); }
.brief h2 { margin:0; font-size:20px; line-height:1.3; text-wrap:balance; }
.brief .meta { color:var(--muted); }
.brief .meta b { color:var(--ink); font-weight:600; }
.brief ul { margin:2px 0 0; padding-left:18px; }
.current { display:flex; gap:12px; align-items:center; padding:10px; border-radius:8px; background:var(--ok-soft); color:var(--ok); }
.current img { width:72px; height:72px; border-radius:6px; object-fit:cover; }
form { display:flex; gap:8px; flex-wrap:wrap; }
input[type=search] { flex:1 1 280px; min-width:0; font:inherit; padding:10px 12px; border:1px solid var(--line); border-radius:8px; background:var(--surface); color:var(--ink); }
select, button { font:inherit; padding:9px 13px; border-radius:8px; border:1px solid var(--line); background:var(--surface); color:var(--ink); cursor:pointer; }
button.primary { background:var(--accent); border-color:var(--accent); color:#fff; }
button:active { transform:scale(0.97); }
button:disabled { opacity:.5; cursor:default; }
:focus-visible { outline:2px solid var(--accent); outline-offset:2px; }
.status { color:var(--muted); min-height:1.4em; }
.status.err { color:var(--warn); }
.grid { display:grid; grid-template-columns:repeat(auto-fill, minmax(220px, 1fr)); gap:12px; }
.card { background:var(--surface); border:1px solid var(--line); border-radius:10px; overflow:hidden; display:grid; }
.card .sq { position:relative; aspect-ratio:1; background:var(--line); cursor:zoom-in; }
.card .sq img { width:100%; height:100%; object-fit:cover; display:block; }
.card .used { position:absolute; inset:auto 8px 8px 8px; background:var(--warn-soft); color:var(--warn); font-size:12px; padding:4px 8px; border-radius:6px; }
.card .row { display:flex; gap:8px; align-items:center; justify-content:space-between; padding:8px 10px; }
.card .by { color:var(--muted); font-size:12px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; min-width:0; }
.card .by a { color:inherit; }
.card button { padding:6px 10px; font-size:13px; flex:none; }
.hint { color:var(--muted); font-size:13px; }
dialog { border:0; padding:0; background:transparent; max-width:96vw; max-height:96vh; }
dialog img { max-width:96vw; max-height:90vh; display:block; border-radius:8px; }
dialog::backdrop { background:rgba(0,0,0,.75); }
@media (max-width: 760px) { .app { grid-template-columns:1fr; } aside { position:static; height:auto; max-height:40vh; } }
</style></head>
<body><div class="app">
<aside><h1>Photo picker</h1><p class="count" id="count">Loading…</p><nav id="list"></nav></aside>
<main>
  <section class="brief" id="brief"><p class="hint">Pick a slot on the left.</p></section>
  <form id="form"><input type="search" id="q" placeholder="Search Pexels (English works best)" aria-label="Search Pexels">
    <select id="orient" aria-label="Orientation"><option value="">Any shape</option><option value="square">Square</option><option value="landscape">Landscape</option><option value="portrait">Portrait</option></select>
    <button class="primary" type="submit">Search</button></form>
  <p class="hint">Tiles show the square centre crop the exam uses. Click a tile to see the full photo.</p>
  <p class="status" id="status"></p>
  <div class="grid" id="grid"></div>
  <div><button type="button" id="more" hidden>Load more</button></div>
</main></div>
<dialog id="zoom"><img alt=""></dialog>
<script>
let SLOTS = [], cur = null, page = 1, lastQ = "";
const $ = (id) => document.getElementById(id);
const status = (t, err) => { $("status").textContent = t; $("status").className = "status" + (err ? " err" : ""); };
const el = (tag, props = {}, ...kids) => { const e = Object.assign(document.createElement(tag), props); e.append(...kids); return e; };

async function loadSlots(keep) {
  SLOTS = await (await fetch("/api/slots")).json();
  const open = SLOTS.filter((s) => !s.src).length;
  $("count").textContent = open + " open · " + (SLOTS.length - open) + " picked here";
  $("list").replaceChildren(...SLOTS.map((s) => {
    const b = el("button", { type: "button", className: "slotbtn" + (s.src ? " done" : "") },
      el("div", { className: "w" }, el("span", { className: "dot" }), s.where), el("div", { className: "l", textContent: s.label }));
    b.dataset.slot = s.slot;
    b.setAttribute("aria-current", String(cur?.slot === s.slot));
    b.onclick = () => select(s.slot);
    return b;
  }));
  if (keep && cur) cur = SLOTS.find((s) => s.slot === cur.slot) || null;
  if (cur) brief();
}

function brief() {
  const s = cur;
  const others = el("ul"); for (const o of s.others) others.append(el("li", { textContent: o }));
  const kids = [el("div", { className: "w", textContent: s.slot }), el("h2", { textContent: s.label }),
    el("div", { className: "meta" }, el("b", { textContent: "Planned: " }), s.plan),
    el("div", { className: "meta" }, el("b", { textContent: "Must look different from:" }), others)];
  if (s.src) kids.push(el("div", { className: "current" }, el("img", { src: "/img/" + s.src + "?t=" + Date.now(), alt: "" }), "Picked: Pexels " + s.pexelsId + ". Pick another to replace it."));
  $("brief").replaceChildren(...kids);
}

function select(slot) {
  cur = SLOTS.find((s) => s.slot === slot);
  for (const b of $("list").children) b.setAttribute("aria-current", String(b.dataset.slot === slot));
  brief();
  $("q").value = cur.query;
  search(true);
}

async function search(fresh) {
  const q = $("q").value.trim(); if (!q) return;
  if (fresh) { page = 1; lastQ = q; $("grid").replaceChildren(); }
  status("Searching…");
  const r = await fetch("/api/search?" + new URLSearchParams({ q: lastQ, page, orientation: $("orient").value }));
  const j = await r.json();
  if (!r.ok) return status(j.error || "Search failed.", true);
  status(j.total + " results for “" + lastQ + "”.");
  for (const p of j.photos) {
    const img = el("img", { src: p.thumb, alt: p.alt || "", loading: "lazy" });
    const sq = el("div", { className: "sq" }, img);
    if (p.usedBy) sq.append(el("span", { className: "used", textContent: "In use: " + p.usedBy }));
    sq.onclick = () => { $("zoom").querySelector("img").src = p.thumb; $("zoom").showModal(); };
    const btn = el("button", { type: "button", className: "primary", textContent: "Use", disabled: !!p.usedBy && p.usedBy !== cur?.slot });
    btn.onclick = () => use(p, btn);
    $("grid").append(el("div", { className: "card" }, sq, el("div", { className: "row" },
      el("span", { className: "by" }, el("a", { href: p.url, target: "_blank", rel: "noopener", textContent: p.by })), btn)));
  }
  $("more").hidden = !j.more;
}

async function use(p, btn) {
  if (!cur) return status("Pick a slot first.", true);
  btn.disabled = true; status("Saving Pexels " + p.id + " to " + cur.slot + "…");
  const r = await fetch("/api/pick", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ slot: cur.slot, pexelsId: p.id }) });
  const j = await r.json();
  if (!r.ok) { btn.disabled = false; return status(j.error || "Saving failed.", true); }
  status("Saved. " + cur.slot + " now uses Pexels " + p.id + ".");
  await loadSlots(true);
  const next = SLOTS.find((s) => !s.src);
  if (next) status($("status").textContent + " Next open slot: " + next.where + ".");
}

$("form").onsubmit = (e) => { e.preventDefault(); search(true); };
$("orient").onchange = () => search(true);
$("more").onclick = () => { page++; search(false); };
$("zoom").onclick = () => $("zoom").close();
loadSlots().then(() => { const first = SLOTS.find((s) => !s.src); if (first) select(first.slot); });
</script></body></html>`
