/**
 * Technical health of our own site: every URL in the sitemap is fetched and checked for status,
 * canonical, robots meta, title, description, H1 and JSON-LD. Plus robots.txt, llms.txt and, with
 * `CRUX_API_KEY`, the Core Web Vitals from the field.
 *
 * No headless browser: a statically rendered Next page carries all of this in the HTML, and that
 * is exactly what Google reads first.
 */
import { mapLimit, skipped } from './lib/io.mjs';

const UA = 'deutschtest-seo-agent/1.0 (+https://deutschtest-ueben.de)';

async function text(url) {
  const res = await fetch(url, { headers: { 'User-Agent': UA }, redirect: 'manual' });
  return { status: res.status, location: res.headers.get('location'), body: res.status === 200 ? await res.text() : '' };
}

function sitemapUrls(xml) {
  return [...xml.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g)].map(m => m[1]);
}

/** Cyrillic paths are decoded in the sitemap and encoded in href and canonical. */
function norm(u) {
  try { return decodeURI(u).replace(/\/$/, ''); } catch { return u.replace(/\/$/, ''); }
}

function pick(re, html) {
  const m = html.match(re);
  return m ? m[1].trim() : null;
}

function inspect(html) {
  const jsonld = [...html.matchAll(/<script[^>]+type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)].map(m => m[1]);
  const jsonldTypes = [];
  let jsonldInvalid = 0;
  for (const block of jsonld) {
    try {
      const parsed = JSON.parse(block);
      const nodes = parsed['@graph'] ?? (Array.isArray(parsed) ? parsed : [parsed]);
      for (const n of nodes) if (n?.['@type']) jsonldTypes.push(...[].concat(n['@type']));
    } catch { jsonldInvalid++; }
  }
  const description = pick(/<meta\s+name="description"\s+content="([^"]*)"/i, html) ?? pick(/<meta\s+content="([^"]*)"\s+name="description"/i, html);
  const title = pick(/<title[^>]*>([^<]*)<\/title>/i, html);
  return {
    title,
    title_length: (title ?? '').length,
    description,
    description_length: (description ?? '').length,
    canonical: pick(/<link\s+rel="canonical"\s+href="([^"]*)"/i, html),
    robots: pick(/<meta\s+name="robots"\s+content="([^"]*)"/i, html),
    h1: pick(/<h1[^>]*>([\s\S]*?)<\/h1>/i, html)?.replace(/<[^>]+>/g, '').trim() ?? null,
    h1_count: (html.match(/<h1[\s>]/gi) ?? []).length,
    hreflang_count: (html.match(/hreflang=/gi) ?? []).length,
    jsonld_types: jsonldTypes,
    jsonld_invalid: jsonldInvalid,
    internal_links: [...html.matchAll(/<a\s+[^>]*href="(\/[^"#?]*)/g)].map(m => m[1]),
  };
}

/** The wording is parsed by lib/admin/seo-score.mjs (LENGTH_ISSUE): keep "title N chars" / "description N chars". */
function problemsFor(url, page) {
  const p = [];
  if (page.status !== 200) p.push(`status ${page.status}`);
  if (page.status === 200) {
    if (!page.title) p.push('no title');
    else if (page.title_length > 60) p.push(`title ${page.title_length} chars`);
    if (!page.description) p.push('no meta description');
    else if (page.description_length < 140 || page.description_length > 160) p.push(`description ${page.description_length} chars`);
    if (page.h1_count !== 1) p.push(`${page.h1_count} H1s`);
    if (page.robots && /noindex/i.test(page.robots)) p.push('noindex in sitemap');
    if (page.canonical && norm(page.canonical) !== norm(url)) p.push(`canonical differs: ${page.canonical}`);
    if (page.jsonld_invalid) p.push(`${page.jsonld_invalid} invalid JSON-LD block`);
  }
  return p;
}

async function crux(origin) {
  const key = process.env.CRUX_API_KEY;
  if (!key) return skipped('CRUX_API_KEY missing');
  const out = {};
  for (const formFactor of ['PHONE', 'DESKTOP']) {
    const res = await fetch(`https://chromeuxreport.googleapis.com/v1/records:queryRecord?key=${key}`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ origin, formFactor, metrics: ['largest_contentful_paint', 'interaction_to_next_paint', 'cumulative_layout_shift'] }),
    });
    const json = await res.json();
    out[formFactor] = res.ok
      ? Object.fromEntries(Object.entries(json.record?.metrics ?? {}).map(([k, v]) => [k, v.percentiles?.p75]))
      : { error: json.error?.message ?? res.status, note: 'no CrUX data means too little traffic, not an error' };
  }
  return out;
}

export async function collectHealth(config) {
  const sites = {};
  for (const [name, site] of Object.entries(config.sites)) {
    const origin = `https://${site.domain}`;
    try {
      const sm = await text(site.sitemap);
      const urls = sm.status === 200 ? sitemapUrls(sm.body) : [];
      const pages = {};
      await mapLimit(urls, 5, async url => {
        try {
          const res = await text(url);
          pages[url] = { status: res.status, location: res.location, ...(res.status === 200 ? inspect(res.body) : {}) };
        } catch (err) {
          pages[url] = { status: 0, error: err.message };
        }
      });
      const linkedInternally = new Set();
      for (const p of Object.values(pages)) for (const l of p.internal_links ?? []) linkedInternally.add(norm(l));
      const problems = Object.fromEntries(Object.entries(pages).map(([u, p]) => [u, problemsFor(u, p)]).filter(([, p]) => p.length));
      const orphans = urls.filter(u => { const path = norm(new URL(u).pathname); return path && !linkedInternally.has(path); });
      const robots = await text(`${origin}/robots.txt`);
      const llms = await text(`${origin}/llms.txt`);
      // The full HTML stays out of the snapshot; the link list only as a count.
      for (const p of Object.values(pages)) if (p.internal_links) { p.internal_link_count = p.internal_links.length; delete p.internal_links; }
      sites[name] = {
        sitemap: { url: site.sitemap, status: sm.status, url_count: urls.length },
        robots: { status: robots.status, has_sitemap_line: /sitemap:/i.test(robots.body), ai_bots_mentioned: ['GPTBot', 'ClaudeBot', 'PerplexityBot', 'Google-Extended'].filter(b => robots.body.includes(b)) },
        llms_txt: { status: llms.status, length: llms.body.length },
        status_counts: Object.values(pages).reduce((acc, p) => { acc[p.status] = (acc[p.status] ?? 0) + 1; return acc; }, {}),
        problems,
        orphans,
        pages,
        crux: await crux(origin),
      };
    } catch (err) {
      sites[name] = { error: err.message };
    }
  }
  return { sites };
}
