/**
 * Backlinks: every external page Bing sees linking to deutschtest-ueben.de, with anchor text and target page.
 * Search Console has no API for links; Bing Webmaster does (`GetLinkCounts` lists our pages with inbound links,
 * `GetUrlLinks` the sources per page).
 *
 *   node scripts/seo-agent/collect.mjs --only backlinks
 *
 * Bing doesn't see every link: an empty list means "Bing knows none", not "there are none".
 */
import { skipped } from './lib/io.mjs';

const BASE = 'https://ssl.bing.com/webmaster/api.svc/json';
const MAX_TARGETS = 60;

async function get(method, params, key) {
  const qs = Object.entries({ ...params, apikey: key }).map(([k, v]) => `${k}=${encodeURIComponent(v)}`).join('&');
  const res = await fetch(`${BASE}/${method}?${qs}`);
  const json = await res.json().catch(() => null);
  if (!res.ok || json?.ErrorCode) throw new Error(`bing ${method}: ${json?.Message ?? res.status}`);
  return json?.d ?? json;
}

/** The JSON flavour of GetUrlLinks wants `link` as a JSON string; fall back to the bare URL. */
async function urlLinks(siteUrl, link, page, key) {
  try {
    return await get('GetUrlLinks', { siteUrl, link: JSON.stringify(link), page }, key);
  } catch {
    return await get('GetUrlLinks', { siteUrl, link, page }, key);
  }
}

export async function fetchBacklinks(siteUrl, key) {
  const targets = [];
  for (let page = 0; page < 10; page++) {
    const d = await get('GetLinkCounts', { siteUrl, page }, key);
    targets.push(...(d?.Links ?? []).map(l => ({ url: l.Url, count: l.Count })));
    if (page + 1 >= (d?.TotalPages ?? 1)) break;
  }
  targets.sort((a, b) => b.count - a.count);

  const links = [];
  const errors = [];
  for (const t of targets.slice(0, MAX_TARGETS)) {
    try {
      for (let page = 0; page < 5; page++) {
        const d = await urlLinks(siteUrl, t.url, page, key);
        links.push(...(d?.Details ?? []).map(x => ({ source: x.Url, anchor: x.AnchorText ?? '', target: t.url })));
        if (page + 1 >= (d?.TotalPages ?? 1)) break;
      }
    } catch (err) {
      errors.push(`${t.url}: ${err.message}`);
    }
  }
  return { targets, links, errors: errors.slice(0, 20) };
}

export async function collectBacklinks(config) {
  const key = process.env.BING_API_KEY;
  if (!key) return skipped('BING_API_KEY missing');
  const siteUrl = config.sites.deutschtest.bing_site_url;
  return { site_url: siteUrl, ...(await fetchBacklinks(siteUrl, key)) };
}
